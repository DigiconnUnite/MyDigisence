import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { z } from 'zod'

const updateProfessionalSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  professionalHeadline: z.string().optional(),
  aboutMe: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional().or(z.literal('')),
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: professionalId } = await params

    if (!professionalId) {
      return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { isActive } = body

    // Direct update - Prisma handles non-existent records gracefully
    const professional = await db.professional.update({
      where: { id: professionalId },
      data: { isActive },
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
    }).catch(() => null)

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
    }

    // Emit Socket.IO event for real-time update
    broadcast('professional-status-updated', {
      professional: professional,
      action: 'status-update',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

    return NextResponse.json({
      success: true,
      professional,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Invalidate-Cache': 'true',
      }
    })
  } catch (error) {
    console.error('Professional toggle error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle professional status' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: professionalId } = await params

    if (!professionalId) {
      return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const updateData = updateProfessionalSchema.parse(body)

    // Direct update - Prisma handles non-existent records gracefully
    const professional = await db.professional.update({
      where: { id: professionalId },
      data: {
        ...updateData,
        phone: updateData.phone && updateData.phone !== '' ? updateData.phone : undefined,
        website: updateData.website && updateData.website !== '' ? updateData.website : undefined,
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
    }).catch(() => null)

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
    }

    // Emit Socket.IO event for real-time update
    broadcast('professional-updated', {
      professional: professional,
      action: 'update',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

    return NextResponse.json({
      success: true,
      professional,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Invalidate-Cache': 'true',
      }
    })
  } catch (error) {
    console.error('Professional update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: professionalId } = await params

    if (!professionalId) {
      return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 })
    }

    // Direct delete - Prisma handles non-existent records gracefully
    // First get adminId for cleanup
    const existingProfessional = await db.professional.findUnique({
      where: { id: professionalId },
      select: { adminId: true, isActive: true }
    })

    if (!existingProfessional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
    }

    // Use transaction to ensure all deletions succeed or fail together
    await db.$transaction(async (tx) => {
      // Delete related inquiries first
      await tx.professionalInquiry.deleteMany({
        where: { professionalId },
      })

      // Delete the professional
      await tx.professional.delete({
        where: { id: professionalId },
      })

      // Also delete the associated admin user
      await tx.user.delete({
        where: { id: existingProfessional.adminId },
      })
    })

    // Emit Socket.IO event for real-time update
    broadcast('professional-deleted', {
      professionalId: professionalId,
      isActive: existingProfessional.isActive,
      action: 'delete',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    });

    return NextResponse.json({
      success: true,
      message: 'Professional and associated user deleted successfully',
    })
  } catch (error) {
    console.error('Professional deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete professional and associated user' },
      { status: 500 }
    )
  }
}
