import { NextRequest, NextResponse } from 'next/server'
import { 
  sendInquiryNotification, 
  sendAccountCreationNotification,
  sendProfessionalInquiryNotification,
  sendBusinessListingInquiryNotification,
  sendBulkImportNotification,
  sendStatusChangeNotification,
} from '@/lib/email'

interface NotificationData {
  type: 'inquiry' | 'professional_inquiry' | 'businessListingInquiry' | 'accountCreation' | 'bulkImport' | 'statusChange' | 'general'
  inquiryId?: string
  businessListingInquiryId?: string
  statusUpdate?: boolean
  message?: string
  // Account creation fields
  name?: string
  email?: string
  password?: string
  accountType?: 'business' | 'professional'
  loginUrl?: string
  // Professional inquiry fields
  professionalId?: string
  // Bulk import fields
  successCount?: number
  failedCount?: number
  failedRows?: Array<{ row: number; error: string }>
  importType?: 'business' | 'professional'
  // Status change fields
  entityType?: 'business' | 'professional'
  entityName?: string
  oldStatus?: string
  newStatus?: string
  adminName?: string
  reason?: string
  dashboardUrl?: string
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unread') === 'true'

    const where: any = { userId: user.userId }
    if (unreadOnly) where.read = false

    const notifications = await db.notification?.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) || []

    const unreadCount = await db.notification?.count({
      where: { userId: user.userId, read: false },
    }) || 0

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: NotificationData = await request.json()
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@digisence.com'

    // Handle different notification types
    if (data.type === 'inquiry' && data.inquiryId) {
      const { db } = await import('@/lib/db')
      const inquiry = await db.inquiry.findUnique({
        where: { id: data.inquiryId },
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
      })

      if (inquiry) {
        await sendInquiryNotification({
          businessName: inquiry.business.name,
          businessEmail: inquiry.business.email || '',
          customerName: inquiry.name,
          customerEmail: inquiry.email,
          customerPhone: inquiry.phone || undefined,
          message: inquiry.message,
          productName: inquiry.product?.name,
          inquiryUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/dashboard/inquiries`,
        })
      }
    } 
    else if (data.type === 'professional_inquiry' && data.inquiryId) {
      const { db } = await import('@/lib/db')
      const professionalInquiry = await (db as any).professionalInquiry.findUnique({
        where: { id: data.inquiryId },
        include: {
          professional: {
            select: {
              name: true,
              email: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
      })

      if (professionalInquiry) {
        await sendProfessionalInquiryNotification({
          professionalName: professionalInquiry.professional.name,
          professionalEmail: professionalInquiry.professional.email || '',
          customerName: professionalInquiry.name,
          customerEmail: professionalInquiry.email,
          customerPhone: professionalInquiry.phone || undefined,
          message: professionalInquiry.message,
          serviceName: professionalInquiry.service?.name,
          inquiryUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/dashboard/professional-inquiries`,
        })
      }
    }
    else if (data.type === 'businessListingInquiry' && data.businessListingInquiryId) {
      const { db } = await import('@/lib/db')
      const inquiry = await db.businessListingInquiry.findUnique({
        where: { id: data.businessListingInquiryId },
      })

      if (inquiry) {
        await sendBusinessListingInquiryNotification({
          adminEmail,
          businessName: inquiry.businessName,
          businessDescription: inquiry.businessDescription || undefined,
          contactName: inquiry.contactName,
          email: inquiry.email,
          phone: inquiry.phone || undefined,
          requirements: inquiry.requirements,
          inquiryUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/admin/business-listing-inquiries/${inquiry.id}`,
        })
      }
    }
    else if (data.type === 'accountCreation' && data.name && data.email && data.password && data.accountType && data.loginUrl) {
      await sendAccountCreationNotification({
        name: data.name,
        email: data.email,
        password: data.password,
        accountType: data.accountType,
        loginUrl: data.loginUrl,
      })
    }
    else if (data.type === 'bulkImport' && data.successCount !== undefined && data.importType) {
      await sendBulkImportNotification({
        adminEmail,
        successCount: data.successCount,
        failedCount: data.failedCount || 0,
        failedRows: data.failedRows,
        importType: data.importType,
        adminUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/admin/${data.importType === 'business' ? 'businesses' : 'professionals'}`,
      })
    }
    else if (data.type === 'statusChange' && data.name && data.email && data.entityType && data.entityName && data.oldStatus && data.newStatus) {
      await sendStatusChangeNotification({
        name: data.name,
        email: data.email,
        entityType: data.entityType,
        entityName: data.entityName,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
        adminName: data.adminName,
        reason: data.reason,
        dashboardUrl: data.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/dashboard`,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
