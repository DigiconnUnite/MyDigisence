import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const notification = await db.notification.updateMany({
      where: { id, userId: user.userId },
      data: { read: true },
    })

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.notification.deleteMany({
      where: { id, userId: user.userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
