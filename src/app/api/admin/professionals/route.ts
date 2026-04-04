import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import type { UserRole } from '@/lib/auth'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { z } from 'zod'
import { getNoStoreHeaders, getInvalidationHeaders } from '@/lib/cache'
import { sendAccountCreationNotification } from '@/lib/email'

const createProfessionalSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  adminName: z.string().min(2),
  phone: z.string().optional(),
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

const professionalSortFieldSchema = z.enum(['createdAt', 'name', 'email', 'professionalHeadline', 'location', 'isActive'])
const sortOrderSchema = z.enum(['asc', 'desc'])

export async function GET(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const sortBy = professionalSortFieldSchema.safeParse(searchParams.get('sortBy') || 'createdAt').success
      ? (searchParams.get('sortBy') || 'createdAt') as z.infer<typeof professionalSortFieldSchema>
      : 'createdAt'
    const sortOrder = sortOrderSchema.safeParse(searchParams.get('sortOrder') || 'desc').success
      ? (searchParams.get('sortOrder') || 'desc') as z.infer<typeof sortOrderSchema>
      : 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { professionalHeadline: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (status === 'active') {
      whereClause.isActive = true
    } else if (status === 'inactive') {
      whereClause.isActive = false
    }

    // Get total count and professionals in parallel
    const [totalItems, professionals] = await Promise.all([
      db.professional.count({ where: whereClause }),
      db.professional.findMany({
        where: whereClause,
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          _count: {
            select: {
              inquiries: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      })
    ])
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      professionals,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    }, {
      headers: getNoStoreHeaders(),
    })
  } catch (error) {
    console.error('Professionals fetch error:', error)
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
    const createData = createProfessionalSchema.parse(body)
    const { name, email, password, adminName, phone } = createData

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate unique slug from name
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!baseSlug) baseSlug = 'professional'

    let slug = baseSlug
    let counter = 1
    while (await db.professional.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create user first
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: adminName,
        role: 'PROFESSIONAL_ADMIN' as UserRole,
      },
    })

    // Create professional
    const professional = await db.professional.create({
      data: {
        name,
        slug,
        phone: phone && phone !== '' ? phone : undefined,
        email: email, // Professional's contact email
        adminId: user.id,
        // All other profile fields are set to null - professionals will fill them in their dashboard
        professionalHeadline: null,
        aboutMe: null,
        profilePicture: null,
        banner: null,
        location: null,
        website: null,
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        workExperience: null,
        education: null,
        skills: null,
        servicesOffered: null,
        portfolio: null,
      },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // Send welcome email to the new professional admin
    try {
      await sendAccountCreationNotification({
        name: adminName,
        email: email,
        password: password,
        accountType: 'professional',
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/login`,
      })
      } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    // Emit Socket.IO event for real-time update
    broadcast('professional-created', {
      professional: professional,
      action: 'create',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      professional: {
        id: professional.id,
        name: professional.name,
        slug: professional.slug,
        phone: professional.phone,
        email: professional.email,
        isActive: professional.isActive,
        createdAt: professional.createdAt,
      },
    }, {
      status: 201,
      headers: {
        ...getNoStoreHeaders(),
        ...getInvalidationHeaders('create'),
      },
    })
  } catch (error) {
    console.error('Professional creation error:', error)
    console.error('Error stack:', (error as any).stack)

    // Return more specific error for debugging
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
