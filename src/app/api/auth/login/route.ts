import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { createSession, getUserActiveSessions, invalidateUserSessions } from '@/lib/session'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  force: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started')
    const body = await request.json()
    console.log('Login request body received')

    const { email: rawEmail, password, force = false } = loginSchema.parse(body)
    // Normalize email to lowercase for case-insensitive matching
    const email = rawEmail.toLowerCase()
    console.log(`Login attempt for email: ${email}, force: ${force}`)

    const user = await authenticateUser(email, password)

    if (!user) {
      console.log(`Login failed: Invalid credentials for ${email}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log(`User authenticated: ${user.email}, role: ${user.role}`)

    // If force logout is requested, invalidate all existing sessions
    if (force) {
      console.log(`Force login requested for ${user.email}`)
      const sessionsBefore = await getUserActiveSessions(user.id)
      console.log(`Sessions before invalidation: ${sessionsBefore.length}`)
      await invalidateUserSessions(user.id)
      console.log(`Force logout: Invalidated all sessions for user ${user.email}`)
      const sessionsAfter = await getUserActiveSessions(user.id)
      console.log(`Sessions after invalidation: ${sessionsAfter.length}`)
    } else {
      // Check for active sessions
      const activeSessions = await getUserActiveSessions(user.id)
      console.log(`Active sessions for user ${user.email}: ${activeSessions.length}`)
      if (activeSessions.length > 0) {
        console.log(`Login blocked: User ${user.email} already has an active session`)
        console.log(`Active session details:`, JSON.stringify(activeSessions.map(s => ({
          id: s.id,
          expiresAt: s.expiresAt,
          token: s.token.substring(0, 20) + '...'
        })), null, 2))
        return NextResponse.json(
          { error: 'This account is already logged in on another device.' },
          { status: 403 }
        )
      }
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`)
    const token = generateToken(user)
    console.log('JWT token generated')

    // Create session in database
    await createSession(user, token)
    console.log('Session created in database')

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
      },
      token,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log('Login response sent with token')
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}