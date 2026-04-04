import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { z } from 'zod'
import { getNoStoreHeaders, getInvalidationHeaders } from '@/lib/cache'

const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
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

export async function POST(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = bulkDeleteSchema.parse(body)

    // Get professionals to delete (to emit events before deletion)
    const professionalsToDelete = await db.professional.findMany({
      where: { id: { in: ids } },
      include: { admin: true },
    })

    // Delete all professionals in one transaction
    // This will cascade delete related records if configured in Prisma schema
    await db.professional.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    // Also delete the associated admin users
    const adminUserIds = professionalsToDelete.map((p) => p.adminId)
    await db.user.deleteMany({
      where: {
        id: { in: adminUserIds },
      },
    })

    // Emit Socket.IO events for real-time updates
    for (const professional of professionalsToDelete) {
      broadcast('professional-deleted', {
        professionalId: professional.id,
        isActive: professional.isActive,
        action: 'delete',
        timestamp: new Date().toISOString(),
        adminId: admin.userId
      })
    }

    return NextResponse.json({
      success: true,
      message: `${ids.length} professional(s) and associated user(s) deleted`,
      count: ids.length,
    }, {
      headers: {
        ...getNoStoreHeaders(),
        ...getInvalidationHeaders('delete'),
      },
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
