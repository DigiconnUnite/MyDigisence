import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) ?? request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    
    if (!user || user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user's inquiries
    const inquiries = await db.inquiry.findMany({
      where: {
        userId: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get related business data
    const businessIds = [...new Set(inquiries.filter(i => i.businessId).map(i => i.businessId!))]

    const businesses = businessIds.length > 0 ? await db.business.findMany({
      where: { id: { in: businessIds } },
      select: { id: true, name: true, slug: true }
    }) : []

    const businessMap = new Map(businesses.map(b => [b.id, b]))

    // Format inquiries for frontend (only business inquiries are supported in this model)
    const formattedInquiries = inquiries.map(inquiry => {
      const business = inquiry.businessId ? businessMap.get(inquiry.businessId) : null
      
      return {
        id: inquiry.id,
        type: 'business', // All inquiries in this model are business inquiries
        targetName: business?.name || 'Unknown Business',
        targetSlug: business?.slug || '',
        message: inquiry.message,
        status: inquiry.status.toLowerCase(),
        createdAt: inquiry.createdAt.toISOString(),
        response: null, // Would come from a response table
        respondedAt: null
      }
    })

    return NextResponse.json(formattedInquiries)

  } catch (error) {
    console.error('User inquiries API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) ?? request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    
    if (!user || user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { businessId, message } = body

    if (!message || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId and message are required' },
        { status: 400 }
      )
    }

    // Create new inquiry
    const inquiry = await db.inquiry.create({
      data: {
        name: user.name || 'User',
        email: user.email,
        message,
        businessId: businessId,
        userId: user.userId,
        status: 'NEW'
      }
    })

    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        message: inquiry.message,
        status: inquiry.status.toLowerCase(),
        createdAt: inquiry.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Create inquiry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
