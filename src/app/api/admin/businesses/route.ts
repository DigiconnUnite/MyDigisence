import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { z } from 'zod'
import { getNoStoreHeaders, getInvalidationHeaders } from '@/lib/cache'
import { sendAccountCreationNotification } from '@/lib/email'
import { generateUniqueBusinessSlug } from '@/lib/slug-helpers'
import { hashPassword } from '@/lib/auth'

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

const businessSortFieldSchema = z.enum(['createdAt', 'name', 'email', 'isActive'])
const sortOrderSchema = z.enum(['asc', 'desc'])

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
    const sortBy = businessSortFieldSchema.safeParse(searchParams.get('sortBy') || 'createdAt').success
      ? (searchParams.get('sortBy') || 'createdAt') as z.infer<typeof businessSortFieldSchema>
      : 'createdAt'
    const sortOrder = sortOrderSchema.safeParse(searchParams.get('sortOrder') || 'desc').success
      ? (searchParams.get('sortOrder') || 'desc') as z.infer<typeof sortOrderSchema>
      : 'desc'
    
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

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        totalItems: total,
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
    const slug = await generateUniqueBusinessSlug(createData.name)

    // Hash password - import at module level to avoid N+1 issue
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

    // Send welcome email to the new business admin
    try {
      await sendAccountCreationNotification({
        name: createData.adminName,
        email: createData.email,
        password: createData.password,
        accountType: 'business',
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/login`,
      })
      } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    // Emit Socket.IO event for real-time update
    broadcast('business-created', {
      business: result.business,
      action: 'create',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

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

    // Check if business exists and get adminId
    const existingBusiness = await db.business.findUnique({
      where: { id },
      select: { id: true, adminId: true, isActive: true },
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

    // FIX: Also delete the associated admin user to prevent orphaned accounts
    if (existingBusiness.adminId) {
      await db.user.delete({
        where: { id: existingBusiness.adminId },
      }).catch(() => {
        // User might have been deleted already or doesn't exist
        console.warn('Failed to delete admin user:', existingBusiness.adminId)
      })
    }

    // Emit Socket.IO event for real-time update
    broadcast('business-deleted', {
      businessId: id,
      isActive: existingBusiness.isActive,
      action: 'delete',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

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

// Single status update schema
const bulkStatusSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
})

// PATCH /api/admin/businesses - Single status update only
// For bulk operations use /api/admin/businesses/bulk/status or /api/admin/businesses/bulk/delete
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Single status update only (for backward compatibility)
    const { id, isActive } = body
    if (!id) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    // Validate
    const parseResult = bulkStatusSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
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

    broadcast('business-status-updated', {
      business,
      action: 'status-update',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    })

    return NextResponse.json({ success: true, business })
  } catch (error) {
    console.error('Business status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
