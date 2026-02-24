import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'
import { getNoStoreHeaders, getInvalidationHeaders } from '@/lib/cache'

const createBusinessSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  adminName: z.string().min(2),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional().transform((val) => {
    if (!val || val === '') return '';
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      return 'https://' + val;
    }
    return val;
  }).pipe(z.union([z.string().url(), z.literal('')])),
})

const updateBusinessSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  logo: z.union([z.string().url(), z.literal('')]).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().optional().transform((val) => {
    if (!val || val === '') return '';
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      return 'https://' + val;
    }
    return val;
  }).pipe(z.union([z.string().url(), z.literal('')])),
  categoryId: z.string().optional(),
  heroContent: z.any().optional(),
  brandContent: z.any().optional(),
  isActive: z.boolean().optional(),
})

async function getSuperAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return null
  }

  return payload
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (await db.business.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Search params
    const search = searchParams.get('search') || ''
    
    // Sort params
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Filter params
    const status = searchParams.get('status') || 'all'
    const categoryId = searchParams.get('categoryId') || ''

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { admin: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }
    
    if (status !== 'all') {
      where.isActive = status === 'active'
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get total count and businesses in parallel
    const [total, businesses] = await Promise.all([
      db.business.count({ where }),
      db.business.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
              inquiries: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      })
    ])

    console.log('Admin API returning businesses:', businesses.length, 'of', total)

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        search,
        sortBy,
        sortOrder,
        status,
        categoryId,
      }
    }, {
      headers: getNoStoreHeaders(),
    })
  } catch (error) {
    console.error('Businesses fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const createData = createBusinessSchema.parse(body)

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: createData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Generate base slug from name
    const baseSlug = createData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Generate unique slug
    const slug = await generateUniqueSlug(baseSlug)

    // Hash password
    const { hashPassword } = await import('@/lib/auth')
    const hashedPassword = await hashPassword(createData.password)

    // Create user and business in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: createData.email,
          password: hashedPassword,
          name: createData.adminName,
          role: 'BUSINESS_ADMIN',
        },
      })

      const business = await tx.business.create({
        data: {
          name: createData.name,
          slug,
          description: createData.description && createData.description !== '' ? createData.description : undefined,
          address: createData.address && createData.address !== '' ? createData.address : undefined,
          phone: createData.phone && createData.phone !== '' ? createData.phone : undefined,
          email: createData.email,
          website: createData.website && createData.website !== '' ? createData.website : undefined,
          categoryId: createData.categoryId && createData.categoryId !== '' ? createData.categoryId : undefined,
          adminId: user.id,
        },
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
              inquiries: true,
            },
          },
        },
      })

      return { user, business }
    })

    // Emit Socket.IO event for real-time update
    if (global.io) {
      global.io.emit('business-created', {
        business: result.business,
        action: 'create',
        timestamp: new Date().toISOString(),
        adminId: admin.userId
      });
    }

    return NextResponse.json({
      success: true,
      business: result.business,
      loginCredentials: {
        email: createData.email,
        password: createData.password,
      },
    }, {
      headers: {
        ...getNoStoreHeaders(),
        ...getInvalidationHeaders('create'),
      },
    })
  } catch (error) {
    console.error('Business creation error:', error)
    console.error('Error stack:', (error as any).stack)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    // Check if business exists
    const existingBusiness = await db.business.findUnique({
      where: { id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Delete related records (products, inquiries)
    await db.product.deleteMany({
      where: { businessId: id },
    })

    await db.inquiry.deleteMany({
      where: { businessId: id },
    })

    // Delete the business
    await db.business.delete({
      where: { id },
    })

    // Emit Socket.IO event for real-time update
    if (global.io) {
      global.io.emit('business-deleted', {
        businessId: id,
        action: 'delete',
        timestamp: new Date().toISOString(),
        adminId: admin.userId
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully',
    })
  } catch (error) {
    console.error('Business deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: businessId } = await params
    
    const body = await request.json()
    const { isActive } = body

    // Direct update - Prisma handles non-existent records gracefully
    const business = await db.business.update({
      where: { id: businessId },
      data: { isActive },
    }).catch(() => null)

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      business,
    })
  } catch (error) {
    console.error('Business toggle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Bulk actions endpoints
const bulkStatusSchema = z.object({
  businessIds: z.array(z.string()).min(1),
  isActive: z.boolean(),
})

const bulkDeleteSchema = z.object({
  businessIds: z.array(z.string()).min(1),
})

// PATCH /api/admin/businesses/bulk/status - Bulk update status
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Check if it's a bulk action or single status update
    if (body.businessIds && Array.isArray(body.businessIds)) {
      // Bulk operation
      const parseResult = bulkStatusSchema.safeParse(body)
      if (!parseResult.success) {
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
      }

      const { businessIds, isActive } = parseResult.data

      // Update all businesses
      await db.business.updateMany({
        where: { id: { in: businessIds } },
        data: { isActive },
      })

      // Emit Socket.IO event for real-time update
      if (global.io) {
        global.io.emit('business-status-updated', {
          businessIds,
          isActive,
          action: 'bulk-status-update',
          timestamp: new Date().toISOString(),
          adminId: admin.userId
        })
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${businessIds.length} businesses`,
        updatedCount: businessIds.length,
      })
    } else {
      // Single status update (backward compatible)
      const { id, isActive } = body
      if (!id) {
        return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
      }

      const business = await db.business.update({
        where: { id },
        data: { isActive },
        include: {
          admin: { select: { id: true, email: true, name: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { products: true, inquiries: true } },
        },
      })

      if (global.io) {
        global.io.emit('business-status-updated', {
          business,
          action: 'status-update',
          timestamp: new Date().toISOString(),
          adminId: admin.userId
        })
      }

      return NextResponse.json({ success: true, business })
    }
  } catch (error) {
    console.error('Bulk status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
