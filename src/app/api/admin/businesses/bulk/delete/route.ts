import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { z } from 'zod'

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

const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
})

// POST /api/admin/businesses/bulk/delete - Bulk delete businesses
export async function POST(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const normalizedIds = Array.isArray(body?.ids)
      ? body.ids
      : Array.isArray(body?.businessIds)
        ? body.businessIds
        : null

    if (!normalizedIds) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 })
    }

    const parseResult = bulkDeleteSchema.safeParse({ ids: normalizedIds })
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const { ids } = parseResult.data

    // Get businesses to delete (for response and to collect admin IDs)
    const businessesToDelete = await db.business.findMany({
      where: { id: { in: ids } },
      select: { id: true, adminId: true, name: true },
    })

    if (businessesToDelete.length === 0) {
      return NextResponse.json({ error: 'No businesses found' }, { status: 404 })
    }

    // Collect all IDs for batch delete
    const adminIds = businessesToDelete
      .map(b => b.adminId)
      .filter(Boolean) as string[]

    // Use batch deletes instead of for-loop (much more efficient)
    await db.$transaction(async (tx) => {
      // Delete all related records in batch
      await tx.product.deleteMany({ where: { businessId: { in: ids } } })
      await tx.inquiry.deleteMany({ where: { businessId: { in: ids } } })
      // Delete businesses in batch
      await tx.business.deleteMany({ where: { id: { in: ids } } })
      // Delete associated admin users in batch
      if (adminIds.length > 0) {
        await tx.user.deleteMany({ where: { id: { in: adminIds } } })
      }
    })

    // Emit Socket.IO event
    broadcast('business-bulk-deleted', {
      businessIds: ids,
      deletedCount: businessesToDelete.length,
      action: 'bulk-delete',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${businessesToDelete.length} businesses`,
      deletedCount: businessesToDelete.length,
      deletedNames: businessesToDelete.map(b => b.name),
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
