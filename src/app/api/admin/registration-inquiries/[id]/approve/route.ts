import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSuperAdmin, unauthorized, notFound, badRequest } from '@/lib/auth-helpers'
import { hashPassword } from '@/lib/auth'
import { generateSecurePassword, generateUniqueBusinessSlug, generateUniqueProfessionalSlug } from '@/lib/slug-helpers'
import { sendAccountCreationNotification } from '@/lib/email'

/**
 * POST /api/admin/registration-inquiries/[id]/approve
 * 
 * NEW ENDPOINT: Previously missing — the frontend called this but got 404.
 * 
 * Approves a registration inquiry by:
 * 1. Creating the business/professional account
 * 2. Sending credentials email to the applicant
 * 3. Updating inquiry status to COMPLETED
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireSuperAdmin(request)
    if (!admin) return unauthorized()

    const { id: inquiryId } = await params

    const inquiry = await db.registrationInquiry.findUnique({
      where: { id: inquiryId },
    })

    if (!inquiry) return notFound('Registration inquiry not found')

    if (inquiry.status === 'COMPLETED') {
      return badRequest('This inquiry has already been approved')
    }

    if (inquiry.status === 'REJECTED') {
      return badRequest('This inquiry has been rejected and cannot be approved')
    }

    // Idempotency/recovery: if an account already exists for this email,
    // complete the inquiry status instead of failing permanently.
    const existingUser = await db.user.findUnique({ where: { email: inquiry.email } })
    if (existingUser) {
      const existingBusiness = inquiry.type === 'BUSINESS'
        ? await db.business.findUnique({ where: { adminId: existingUser.id } })
        : null
      const existingProfessional = inquiry.type === 'PROFESSIONAL'
        ? await db.professional.findUnique({ where: { adminId: existingUser.id } })
        : null

      if ((inquiry.type === 'BUSINESS' && existingBusiness) || (inquiry.type === 'PROFESSIONAL' && existingProfessional)) {
        const updatedInquiry = await db.registrationInquiry.update({
          where: { id: inquiryId },
          data: { status: 'COMPLETED', reviewedBy: admin.userId, reviewedAt: new Date() },
        })

        return NextResponse.json({
          success: true,
          recovered: true,
          message: `Account already existed for ${inquiry.email}; inquiry status repaired to COMPLETED`,
          account: {
            id: existingBusiness?.id || existingProfessional?.id,
            type: inquiry.type.toLowerCase(),
          },
          inquiry: updatedInquiry,
        })
      }

      return badRequest('An account with this email already exists')
    }

    const password = generateSecurePassword()
    const hashedPassword = await hashPassword(password)

    let createdAccount: { id: string; type: string } | null = null

    if (inquiry.type === 'BUSINESS') {
      const businessName = inquiry.businessName || inquiry.name
      const slug = await generateUniqueBusinessSlug(businessName)

      const result = await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: inquiry.email,
            name: inquiry.name,
            password: hashedPassword,
            role: 'BUSINESS_ADMIN',
          },
        })

        const business = await tx.business.create({
          data: {
            name: businessName,
            slug,
            description: inquiry.businessDescription || undefined,
            phone: inquiry.phone || undefined,
            address: inquiry.address || inquiry.location || undefined,
            website: inquiry.website || undefined,
            categoryId: inquiry.categoryId || undefined,
            adminId: user.id,
          },
        })

        await tx.registrationInquiry.update({
          where: { id: inquiryId },
          data: { status: 'COMPLETED', reviewedBy: admin.userId, reviewedAt: new Date() },
        })

        return { user, business }
      })

      createdAccount = { id: result.business.id, type: 'business' }
    } else {
      // PROFESSIONAL
      const slug = await generateUniqueProfessionalSlug(inquiry.name)

      const result = await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: inquiry.email,
            name: inquiry.name,
            password: hashedPassword,
            role: 'PROFESSIONAL_ADMIN',
          },
        })

        const professional = await tx.professional.create({
          data: {
            name: inquiry.name,
            slug,
            phone: inquiry.phone || undefined,
            location: inquiry.location || undefined,
            aboutMe: inquiry.aboutMe || undefined,
            professionName: inquiry.profession || undefined,
            professionalHeadline: inquiry.professionalHeadline || undefined,
            adminId: user.id,
          },
        })

        await tx.registrationInquiry.update({
          where: { id: inquiryId },
          data: { status: 'COMPLETED', reviewedBy: admin.userId, reviewedAt: new Date() },
        })

        return { user, professional }
      })

      createdAccount = { id: result.professional.id, type: 'professional' }
    }

    // Send welcome email with credentials
    try {
      await sendAccountCreationNotification({
        name: inquiry.name,
        email: inquiry.email,
        password,
        accountType: inquiry.type.toLowerCase() as 'business' | 'professional',
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/login`,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `${inquiry.type.toLowerCase()} account created and credentials sent to ${inquiry.email}`,
      account: createdAccount,
      credentials: {
        email: inquiry.email,
        // Only return in dev for debugging
        password: process.env.NODE_ENV === 'development' ? password : undefined,
      },
    })
  } catch (error) {
    console.error('Approve inquiry error:', error)
    return NextResponse.json({ error: 'Failed to approve registration' }, { status: 500 })
  }
}
