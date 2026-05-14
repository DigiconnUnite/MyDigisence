import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

type ViewPoint = { date: string; views: number };

function startOfDayUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildViewSeries(viewRows: Array<{ date: Date; views: number }>) {
  const viewsByDay = new Map(viewRows.map((row) => [toDayKey(row.date), row.views]));
  const today = startOfDayUtc(new Date());

  const week: ViewPoint[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (6 - index));
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const views = viewsByDay.get(toDayKey(date)) ?? 0;
    return { date: label, views };
  });

  const monthBuckets = [0, 0, 0, 0];
  for (let i = 0; i < 28; i += 1) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (27 - i));
    const weekIndex = Math.floor(i / 7);
    const views = viewsByDay.get(toDayKey(date)) ?? 0;
    monthBuckets[weekIndex] += views;
  }
  const month: ViewPoint[] = monthBuckets.map((views, index) => ({
    date: `Week ${index + 1}`,
    views,
  }));

  const monthTotals = new Map<string, number>();
  viewRows.forEach((row) => {
    const monthKey = `${row.date.getUTCFullYear()}-${row.date.getUTCMonth()}`;
    monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + row.views);
  });

  const year: ViewPoint[] = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (11 - index), 1));
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const label = date.toLocaleDateString('en-US', { month: 'short' });
    return { date: label, views: monthTotals.get(monthKey) ?? 0 };
  });

  return { week, month, year };
}

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
      businessSnapshot,
      viewRows,
    ] = await Promise.all([
      db.product.count({
        where: { businessId: admin.businessId }
      }),
      db.product.count({
        where: { businessId: admin.businessId, isActive: true }
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
      db.business.findUnique({
        where: { id: admin.businessId },
        select: { profileViews: true },
      }),
      db.businessViewDaily.findMany({
        where: {
          businessId: admin.businessId,
          date: {
            gte: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() - 364)),
          },
        },
        select: { date: true, views: true },
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
    const totalViews = businessSnapshot?.profileViews ?? 0
    const viewSeries = buildViewSeries(viewRows)

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
      viewSeries,
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