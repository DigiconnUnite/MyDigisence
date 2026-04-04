import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'
import { sendRegistrationConfirmation } from '@/lib/email'

const registrationInquirySchema = z.object({
  type: z.enum(['BUSINESS', 'PROFESSIONAL']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),

  // Business specific fields
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  categoryId: z.string().optional(),
  gstNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),

  // Professional specific fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profession: z.string().optional(),
  aboutMe: z.string().optional(),
  professionalHeadline: z.string().optional(),

  // Common fields
  location: z.string().optional(),
  address: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'Terms must be accepted'),
  termsAcceptedAt: z.string().optional(),
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

    let inquiries: Awaited<ReturnType<typeof db.registrationInquiry.findMany>> = []
    try {
      inquiries = await db.registrationInquiry.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch (dbError) {
      // If collection doesn't exist, return empty array
      inquiries = []
    }

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Registration inquiries fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = registrationInquirySchema.parse(body)

    // Check for duplicate email in existing users
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please try logging in instead.' },
        { status: 409 }
      )
    }

    // Check for duplicate email in pending inquiries
    const existingInquiry = await db.registrationInquiry.findFirst({
      where: {
        email: validatedData.email,
        status: { in: ['PENDING', 'UNDER_REVIEW'] }
      }
    })

    if (existingInquiry) {
      return NextResponse.json(
        { error: 'A registration request with this email is already pending review. Please wait for approval or contact support.' },
        { status: 409 }
      )
    }

    // Create inquiry with all fields (password will be generated during admin approval)
    const inquiry = await db.registrationInquiry.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,

        // Business specific fields
        businessName: validatedData.businessName || null,
        businessDescription: validatedData.businessDescription || null,
        categoryId: validatedData.categoryId || null,
        gstNumber: validatedData.gstNumber || null,
        website: validatedData.website || null,

        // Professional specific fields
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        profession: validatedData.profession || null,
        aboutMe: validatedData.aboutMe || null,
        professionalHeadline: validatedData.professionalHeadline || null,

        // Common fields
        location: validatedData.location || null,
        address: validatedData.address || null,
        termsAccepted: validatedData.termsAccepted,
        termsAcceptedAt: validatedData.termsAcceptedAt ? new Date(validatedData.termsAcceptedAt) : new Date(),
        status: 'PENDING',
      },
    })

    // Send confirmation email to user (registration pending review)
    try {
      await sendRegistrationConfirmation({
        name: validatedData.name,
        email: validatedData.email,
        accountType: validatedData.type.toLowerCase() as 'business' | 'professional',
      })
    } catch (emailError) {
      console.error('User confirmation email error:', emailError)
      // Don't fail the request if email fails
    }

    // Note: Admin notification for new registration inquiries can be added here
    // when a corresponding email notification function is implemented

    return NextResponse.json({
      success: true,
      message: 'Registration request submitted successfully. You will receive a confirmation email and our team will review your application within 24 hours.',
      inquiry: {
        id: inquiry.id,
        type: inquiry.type,
        name: inquiry.name,
        email: inquiry.email,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
    })
  } catch (error) {
    console.error('Registration inquiry submission error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
