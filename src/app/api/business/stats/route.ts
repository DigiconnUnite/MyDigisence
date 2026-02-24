import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

async function getBusinessAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'BUSINESS_ADMIN') {
    return null
  }
  
  // Use businessId directly from JWT if available (avoiding DB lookup)
  if (payload.businessId) {
    return { ...payload, businessId: payload.businessId }
  }
  
  // Fallback: Get the business for this admin if not in JWT
  const business = await db.business.findUnique({
    where: { adminId: payload.userId },
    select: { id: true }
  })
  
  if (!business) {
    return null
  }
  
  return { ...payload, businessId: business.id }
}

async function getBusinessId(adminId: string) {
  const business = await db.business.findUnique({
    where: { adminId },
    select: { id: true }
  })
  return business?.id
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin || !admin.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get business statistics in parallel
    const [
      totalProducts,
      activeProducts,
      totalInquiries,
      newInquiries,
      readInquiries,
      repliedInquiries,
      closedInquiries,
    ] = await Promise.all([
      db.product.count({
        where: { businessId: admin.businessId, isActive: true }
      }),
      db.product.count({
        where: { businessId: admin.businessId }
      }),
      db.inquiry.count({
        where: { businessId: admin.businessId }
      }),
      db.inquiry.count({
        where: { businessId: admin.businessId, status: 'NEW' }
      }),
      db.inquiry.count({
        where: { businessId: admin.businessId, status: 'READ' }
      }),
      db.inquiry.count({
        where: { businessId: admin.businessId, status: 'REPLIED' }
      }),
      db.inquiry.count({
        where: { businessId: admin.businessId, status: 'CLOSED' }
      }),
    ])

    // Get recent inquiries (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentInquiries = await db.inquiry.findMany({
      where: {
        businessId: admin.businessId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get views count (mock data - in real implementation, this would track page views)
    const totalViews = Math.floor(Math.random() * 1000) + 500

    const stats = {
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        read: readInquiries,
        replied: repliedInquiries,
        closed: closedInquiries,
      },
      views: totalViews,
      recentInquiries: recentInquiries.map(inquiry => ({
        id: inquiry.id,
        customerName: inquiry.user?.name || inquiry.name,
        customerEmail: inquiry.user?.email || inquiry.email,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      })),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}