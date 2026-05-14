import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.notification.updateMany({
      where: { userId: user.userId, read: false },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
