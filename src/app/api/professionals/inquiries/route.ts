import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const professionalInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  professionalId: z.string(),
  serviceId: z.string().optional(),
})

async function getProfessionalAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'PROFESSIONAL_ADMIN') {
    return null
  }

  return payload
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getProfessionalAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the professional associated with this admin
    const professional = await db.professional.findFirst({
      where: { adminId: admin.userId },
    })

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
    }

    const inquiries = await (db as any).professionalInquiry.findMany({
      where: { professionalId: professional.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Professional inquiries fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Professional inquiry submission started')
    const body = await request.json()
    console.log('Professional inquiry request body received')

    const { name, email, phone, message, professionalId, serviceId } = professionalInquirySchema.parse(body)
    console.log(`Professional inquiry submission for professional: ${professionalId}, service: ${serviceId || 'none'}`)

    // Verify professional exists
    const professional = await db.professional.findUnique({
      where: { id: professionalId },
    })

    if (!professional) {
      console.log(`Professional inquiry failed: Professional not found - ${professionalId}`)
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
    }

    console.log(`Professional verified: ${professional.name}`)

    // Create inquiry
    const inquiry = await (db as any).professionalInquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        message,
        professionalId,
        serviceId: serviceId ?? null,
        status: 'NEW',
      },
      include: {
        professional: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    console.log(`Professional inquiry created with ID: ${inquiry.id}`)

    // Send email notification to professional (non-blocking - fire and forget)
    // Email failures should not block the response
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'professional_inquiry',
        inquiryId: inquiry.id,
      }),
    }).catch((error) => {
      console.error('Email notification error (non-blocking):', error)
    })

    console.log('Professional inquiry submission completed successfully')
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
        professional: inquiry.professional,
      },
    })
  } catch (error) {
    console.error('Professional inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}