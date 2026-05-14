import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { getUserById } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value

    
    if (!token) {
      console.log('Auth me check failed: No token provided')
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      console.log('Auth me check failed: Invalid token')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }



    const user = await getUserById(payload.userId)

    if (!user) {
      console.log('Auth me check failed: User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Auth me check successful for user:', user.email)
    return NextResponse.json({ user })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}