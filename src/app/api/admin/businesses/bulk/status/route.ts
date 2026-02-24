import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const bulkStatusSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one business ID is required'),
  isActive: z.boolean(),
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

export async function POST(
  request: NextRequest
) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids, isActive } = bulkStatusSchema.parse(body)

    // Verify all businesses exist
    const existingBusinesses = await db.business.findMany({
      where: { id: { in: ids } },
      select: { id: true, isActive: true }
    })

    if (existingBusinesses.length !== ids.length) {
      const foundIds = existingBusinesses.map(b => b.id)
      const missingIds = ids.filter(id => !foundIds.includes(id))
      return NextResponse.json(
        { error: `Businesses not found: ${missingIds.join(', ')}` },
        { status: 404 }
      )
    }

    // Count businesses that will change status
    const businessesToActivate = existingBusinesses.filter(b => !b.isActive && isActive).length
    const businessesToDeactivate = existingBusinesses.filter(b => b.isActive && !isActive).length

    // Update all businesses in a single query
    await db.business.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    })

    // Fetch updated businesses for Socket.IO emission
    const updatedBusinesses = await db.business.findMany({
      where: { id: { in: ids } },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
            inquiries: true,
          },
        },
      },
    })

    // Emit single batched Socket.IO event
    if (global.io) {
      global.io.emit('businesses-bulk-status-updated', {
        businesses: updatedBusinesses,
        isActive,
        action: 'bulk_status_update',
        timestamp: new Date().toISOString(),
        adminId: admin.userId,
        count: ids.length
      })
    }

    const actionText = isActive ? 'activated' : 'suspended'
    
    return NextResponse.json({
      success: true,
      updatedCount: ids.length,
      businessesToActivate,
      businessesToDeactivate,
      message: `${ids.length} businesses ${actionText} successfully`,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Invalidate-Cache': 'true',
      }
    })
  } catch (error) {
    console.error('Bulk status update error:', error)
    
    if (error instanceof z.ZodError) {
      const zodError = error as unknown as { issues: Array<{ message: string }> };
      const firstIssue = zodError.issues[0];
      const message = firstIssue?.message || 'Validation error';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update business statuses' },
      { status: 500 }
    )
  }
}
