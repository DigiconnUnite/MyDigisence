import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  businessId: z.string(),
  productId: z.string().optional(),
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

export async function GET(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { business: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [total, inquiries] = await Promise.all([
      db.inquiry.count({ where }),
      db.inquiry.findMany({
        where,
        include: {
          business: {
            select: {
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      })
    ])

    return NextResponse.json({ 
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Inquiries fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Inquiry submission started')
    const body = await request.json()
    console.log('Inquiry request body received')

    const { name, email, phone, message, businessId, productId } = inquirySchema.parse(body)
    console.log(`Inquiry submission for business: ${businessId}, product: ${productId || 'none'}`)

    // Verify business exists
    const business = await db.business.findUnique({
      where: { id: businessId },
    })

    if (!business) {
      console.log(`Inquiry failed: Business not found - ${businessId}`)
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    console.log(`Business verified: ${business.name}`)

    // Create inquiry
    const inquiry = await db.inquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        message,
        businessId,
        productId: productId ?? null,
        status: 'NEW',
      },
      include: {
        business: {
          select: {
            name: true,
            email: true,
          },
        },
        product: productId
          ? {
              select: {
                name: true,
              },
            }
          : undefined,
      },
    })

    console.log(`Inquiry created with ID: ${inquiry.id}`)

    // Send email notification to business (non-blocking - fire and forget)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'inquiry', inquiryId: inquiry.id }),
    }).catch((error) => {
      console.error('Email notification error (non-blocking):', error)
    })

    console.log('Inquiry submission completed successfully')
    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        business: inquiry.business,
        product: inquiry.product,
      },
    })
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}