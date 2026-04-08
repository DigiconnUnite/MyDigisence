import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { generateToken, hashPassword, type AuthUser, type UserRole } from '@/lib/auth'
import { createSession } from '@/lib/session'
import { generateUniqueBusinessSlug, generateUniqueProfessionalSlug } from '@/lib/slug-helpers'

type OAuthMode = 'login' | 'signup'
type OAuthRole = 'BUSINESS_ADMIN' | 'PROFESSIONAL_ADMIN'

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  id_token?: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

function getAppBaseUrl(request: NextRequest): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (envBaseUrl) return envBaseUrl.replace(/\/$/, '')
  return request.nextUrl.origin
}

function getEntryPath(role: OAuthRole, mode: OAuthMode): string {
  if (role === 'BUSINESS_ADMIN') {
    return mode === 'signup' ? '/register/business' : '/login/business'
  }
  return mode === 'signup' ? '/register/professional' : '/login/professional'
}

function errorRedirect(request: NextRequest, role: OAuthRole, mode: OAuthMode, message: string) {
  const target = new URL(getEntryPath(role, mode), getAppBaseUrl(request))
  target.searchParams.set('error', message)
  return NextResponse.redirect(target)
}

function parseOAuthMeta(metaRaw: string | undefined): { mode: OAuthMode; role: OAuthRole } {
  if (!metaRaw) {
    return { mode: 'login', role: 'BUSINESS_ADMIN' }
  }

  try {
    const parsed = JSON.parse(metaRaw) as { mode?: OAuthMode; role?: OAuthRole }
    const mode = parsed.mode === 'signup' ? 'signup' : 'login'
    const role = parsed.role === 'PROFESSIONAL_ADMIN' ? 'PROFESSIONAL_ADMIN' : 'BUSINESS_ADMIN'
    return { mode, role }
  } catch {
    return { mode: 'login', role: 'BUSINESS_ADMIN' }
  }
}

async function exchangeCodeForToken(code: string, request: NextRequest): Promise<GoogleTokenResponse | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getAppBaseUrl(request)}/api/auth/google/callback`

  if (!clientId || !clientSecret) return null

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text().catch(() => '')
    console.error('Google token exchange failed:', errorBody)
    return null
  }

  return tokenResponse.json() as Promise<GoogleTokenResponse>
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userInfoResponse.ok) {
    const errorBody = await userInfoResponse.text().catch(() => '')
    console.error('Google userinfo fetch failed:', errorBody)
    return null
  }

  return userInfoResponse.json() as Promise<GoogleUserInfo>
}

async function ensureRoleEntity(userId: string, role: OAuthRole, displayName: string, email: string) {
  if (role === 'BUSINESS_ADMIN') {
    const existingBusiness = await db.business.findUnique({ where: { adminId: userId } })
    if (existingBusiness) return existingBusiness

    const businessName = displayName ? `${displayName} Business` : 'My Business'
    const slug = await generateUniqueBusinessSlug(businessName)

    return db.business.create({
      data: {
        name: businessName,
        slug,
        email,
        adminId: userId,
      },
    })
  }

  const existingProfessional = await db.professional.findUnique({ where: { adminId: userId } })
  if (existingProfessional) return existingProfessional

  const professionalName = displayName || 'Professional User'
  const slug = await generateUniqueProfessionalSlug(professionalName)

  return db.professional.create({
    data: {
      name: professionalName,
      slug,
      email,
      adminId: userId,
      professionName: 'Professional',
    },
  })
}

export async function GET(request: NextRequest) {
  const stateParam = request.nextUrl.searchParams.get('state')
  const code = request.nextUrl.searchParams.get('code')

  const stateCookie = request.cookies.get('google-oauth-state')?.value
  const metaCookie = request.cookies.get('google-oauth-meta')?.value
  const { role, mode } = parseOAuthMeta(metaCookie)

  const cleanupCookies = (response: NextResponse) => {
    response.cookies.set('google-oauth-state', '', {
      path: '/',
      maxAge: 0,
    })
    response.cookies.set('google-oauth-meta', '', {
      path: '/',
      maxAge: 0,
    })
    return response
  }

  try {
    if (!code || !stateParam || !stateCookie || stateParam !== stateCookie) {
      return cleanupCookies(errorRedirect(request, role, mode, 'Google authentication failed. Please try again.'))
    }

    const tokenData = await exchangeCodeForToken(code, request)
    if (!tokenData?.access_token) {
      return cleanupCookies(errorRedirect(request, role, mode, 'Unable to verify Google account.'))
    }

    const googleProfile = await fetchGoogleUserInfo(tokenData.access_token)
    if (!googleProfile?.email || !googleProfile.email_verified) {
      return cleanupCookies(errorRedirect(request, role, mode, 'Google email is not verified.'))
    }

    const normalizedEmail = googleProfile.email.trim().toLowerCase()
    let user = await db.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
      include: {
        business: true,
      },
    })

    if (!user && mode === 'login') {
      return cleanupCookies(errorRedirect(request, role, mode, 'No account found. Please sign up with Google first.'))
    }

    if (user && user.role !== role) {
      return cleanupCookies(errorRedirect(request, role, mode, 'This email is registered for a different account type.'))
    }

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex')
      const hashedPassword = await hashPassword(randomPassword)

      user = await db.user.create({
        data: {
          email: normalizedEmail,
          name: googleProfile.name || googleProfile.given_name || 'Google User',
          password: hashedPassword,
          role: role as UserRole,
        },
        include: {
          business: true,
        },
      })
    }

    const displayName = user.name || googleProfile.name || googleProfile.given_name || 'User'
    await ensureRoleEntity(user.id, role, displayName, normalizedEmail)

    const business = role === 'BUSINESS_ADMIN'
      ? await db.business.findUnique({ where: { adminId: user.id } })
      : null
    const professional = role === 'PROFESSIONAL_ADMIN'
      ? await db.professional.findUnique({ where: { adminId: user.id } })
      : null

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role as UserRole,
      businessId: business?.id,
      createdAt: user.createdAt.toISOString(),
    }

    const token = generateToken(authUser)
    await createSession(authUser, token)

    const redirectPath = role === 'BUSINESS_ADMIN'
      ? business ? `/dashboard/business/${business.slug}` : '/login/business?error=Business profile missing. Please contact support.'
      : professional ? `/dashboard/professional/${professional.slug}` : '/login/professional?error=Professional profile missing. Please contact support.'

    const response = NextResponse.redirect(new URL(redirectPath, getAppBaseUrl(request)))

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return cleanupCookies(response)
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return cleanupCookies(errorRedirect(request, role, mode, 'Google authentication failed. Please try again.'))
  }
}
