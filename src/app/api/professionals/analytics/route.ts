import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    const professionalId = searchParams.get("professionalId");

    // Get professional data
    const professional = await prisma.professional.findFirst({
      where: {
        adminId: session.user.id,
        ...(professionalId && { id: professionalId }),
      },
    });

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;
    
    switch (timeRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get previous period data for comparison
    const previousPeriodViews = await prisma.profileView.count({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: previousPeriodStart,
          lt: previousPeriodEnd,
        },
      },
    });

    const previousPeriodInquiries = await prisma.inquiry.count({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: previousPeriodStart,
          lt: previousPeriodEnd,
        },
      },
    });

    // Get profile views data
    const profileViews = await prisma.profileView.findMany({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get inquiries data
    const inquiries = await prisma.inquiry.findMany({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get services data
    const services = await prisma.service.findMany({
      where: {
        professionalId: professional.id,
      },
      include: {
        inquiries: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Get reviews data
    const reviews = await prisma.review.findMany({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get appointments data
    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId: professional.id,
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Process daily data
    const dailyData = [];
    const dailyMap = new Map();

    // Initialize all days in the range
    for (let date = new Date(startDate); date <= now; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: 0,
        unique: 0,
        inquiries: 0,
        converted: 0,
      });
    }

    // Process profile views
    const uniqueViews = new Set();
    profileViews.forEach(view => {
      const dateStr = view.createdAt.toISOString().split('T')[0];
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.views += 1;
        uniqueViews.add(`${view.ipAddress}-${view.userAgent}-${dateStr}`);
      }
    });

    // Update unique views count
    uniqueViews.forEach(uniqueKey => {
      const [ip, userAgent, dateStr] = uniqueKey.split('-');
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.unique += 1;
      }
    });

    // Process inquiries
    inquiries.forEach(inquiry => {
      const dateStr = inquiry.createdAt.toISOString().split('T')[0];
      const dayData = dailyMap.get(dateStr);
      if (dayData) {
        dayData.inquiries += 1;
        if (inquiry.status === 'CONVERTED') {
          dayData.converted += 1;
        }
      }
    });

    dailyData.push(...dailyMap.values());

    // Calculate totals
    const totalViews = profileViews.length;
    const totalUniqueViews = uniqueViews.size;
    const totalInquiries = inquiries.length;
    const convertedInquiries = inquiries.filter(i => i.status === 'CONVERTED').length;
    const conversionRate = totalInquiries > 0 ? (convertedInquiries / totalInquiries) * 100 : 0;

    // Process services data
    const servicesData = services.map(service => ({
      name: service.name,
      views: service.viewCount || 0,
      inquiries: service.inquiries.length,
      revenue: service.inquiries
        .filter(i => i.status === 'CONVERTED')
        .reduce((sum, i) => sum + (i.budgetAmount || 0), 0),
      bookings: service.inquiries.filter(i => i.status === 'CONVERTED').length,
    }));

    // Calculate ratings
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Calculate percentage change from previous period
    const viewsPercentage = previousPeriodViews > 0 
      ? Math.round(((totalViews - previousPeriodViews) / previousPeriodViews) * 100 * 10) / 10
      : totalViews > 0 ? 100 : 0;
    
    const inquiriesPercentage = previousPeriodInquiries > 0
      ? Math.round(((totalInquiries - previousPeriodInquiries) / previousPeriodInquiries) * 100 * 10) / 10
      : totalInquiries > 0 ? 100 : 0;

    // Calculate average response time from inquiries (hours)
    let avgResponseTime = 0;
    const inquiriesWithResponse = inquiries.filter((inq: any) => inq.messages && inq.messages.length > 0);
    if (inquiriesWithResponse.length > 0) {
      const totalResponseHours = inquiriesWithResponse.reduce((sum: number, inq: any) => {
        const inquiryTime = new Date(inq.createdAt).getTime();
        const firstResponse = inq.messages.find((m: any) => m.senderType === 'PROFESSIONAL');
        if (firstResponse) {
          const responseTime = new Date(firstResponse.createdAt).getTime();
          const hours = (responseTime - inquiryTime) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      avgResponseTime = Math.round((totalResponseHours / inquiriesWithResponse.length) * 10) / 10;
    }

    // Audience data - requires analytics integration (Google Analytics, etc.)
    // For now, return empty arrays until real analytics tracking is implemented
    const audienceData = {
      demographics: [],
      locations: [],
      devices: []
    };

    const analyticsData = {
      profileViews: {
        daily: dailyData,
        total: totalViews,
        unique: totalUniqueViews,
        trend: viewsPercentage > 0 ? "up" : viewsPercentage < 0 ? "down" : "stable",
        percentage: Math.abs(viewsPercentage),
      },
      inquiries: {
        daily: dailyData.map(d => ({
          date: d.date,
          count: d.inquiries,
          converted: d.converted,
        })),
        total: totalInquiries,
        conversionRate: Math.round(conversionRate * 10) / 10,
        trend: inquiriesPercentage > 0 ? "up" : inquiriesPercentage < 0 ? "down" : "stable",
        percentage: Math.abs(inquiriesPercentage),
      },
      services: {
        views: servicesData,
        performance: servicesData,
      },
      audience: audienceData,
      engagement: {
        responseTime: avgResponseTime,
        rating: Math.round(averageRating * 10) / 10,
        reviews: reviews.length,
        appointments: appointments.length,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
