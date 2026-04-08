import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

type OAuthMode = 'login' | 'signup'
type OAuthRole = 'BUSINESS_ADMIN' | 'PROFESSIONAL_ADMIN'

function getAppBaseUrl(request: NextRequest): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (envBaseUrl) return envBaseUrl.replace(/\/$/, '')
  return request.nextUrl.origin
}

function isValidMode(value: string | null): value is OAuthMode {
  return value === 'login' || value === 'signup'
}

function isValidRole(value: string | null): value is OAuthRole {
  return value === 'BUSINESS_ADMIN' || value === 'PROFESSIONAL_ADMIN'
}

export async function GET(request: NextRequest) {
  try {
    const modeParam = request.nextUrl.searchParams.get('mode')
    const roleParam = request.nextUrl.searchParams.get('role')

    const mode: OAuthMode = isValidMode(modeParam) ? modeParam : 'login'
    const role: OAuthRole = isValidRole(roleParam) ? roleParam : 'BUSINESS_ADMIN'

    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getAppBaseUrl(request)}/api/auth/google/callback`

    if (!clientId) {
      const fallbackPath = role === 'BUSINESS_ADMIN'
        ? mode === 'signup' ? '/register/business' : '/login/business'
        : mode === 'signup' ? '/register/professional' : '/login/professional'

      const fallbackUrl = new URL(fallbackPath, getAppBaseUrl(request))
      fallbackUrl.searchParams.set('error', 'Google OAuth is not configured. Please contact support.')
      return NextResponse.redirect(fallbackUrl)
    }

    const state = crypto.randomUUID()
    const authUrl = new URL(GOOGLE_AUTH_URL)
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid email profile')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('prompt', 'select_account')

    const response = NextResponse.redirect(authUrl)

    response.cookies.set('google-oauth-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60,
    })

    response.cookies.set('google-oauth-meta', JSON.stringify({ mode, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60,
    })

    return response
  } catch (error) {
    console.error('Google OAuth start error:', error)
    const fallbackUrl = new URL('/login', getAppBaseUrl(request))
    fallbackUrl.searchParams.set('error', 'Failed to start Google login. Please try again.')
    return NextResponse.redirect(fallbackUrl)
  }
}
