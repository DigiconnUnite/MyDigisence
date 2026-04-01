import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import type { UserRole } from './auth';

// Re-export UserRole for convenience
export type { UserRole };

/**
 * Supported user roles in the system
 * - SUPER_ADMIN: Full system access
 * - BUSINESS_ADMIN: Business owner access
 * - PROFESSIONAL_ADMIN: Professional user access
 */
export type SupportedRole = 'SUPER_ADMIN' | 'BUSINESS_ADMIN' | 'PROFESSIONAL_ADMIN';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Auth user type from JWT payload
 */
export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  businessId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Get token from request - checks both Authorization header and auth-token cookie
 * @param request - NextRequest object
 * @returns token string or null if not found
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookie as fallback
  return request.cookies.get('auth-token')?.value || null;
}

/**
 * Verify JWT token and return the payload
 * @param token - JWT token string
 * @returns AuthUser object or null if invalid
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Middleware wrapper for route handlers that enforces authentication
 * @param role - Single role or array of roles that are allowed to access the route
 * @returns Middleware function that wraps the route handler
 * 
 * @example
 * // Single role
 * export const GET = withAuth('SUPER_ADMIN')(async (request, user) => {
 *   // handler logic
 * });
 * 
 * @example
 * // Multiple roles
 * export const GET = withAuth(['SUPER_ADMIN', 'BUSINESS_ADMIN'])(async (request, user) => {
 *   // handler logic
 * });
 */
export function withAuth(
  role: SupportedRole | SupportedRole[]
) {
  return (
    handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
  ) => {
    return async (request: NextRequest) => {
      // Get token from request
      const token = getTokenFromRequest(request);
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Verify token
      const user = verifyToken(token);
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      // Check role authorization
      const allowedRoles = Array.isArray(role) ? role : [role];
      
      if (!allowedRoles.includes(user.role as SupportedRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Call the original handler with the user object
      return handler(request, user);
    };
  };
}

/**
 * Get super admin user from request
 * @param request - NextRequest object
 * @returns AuthUser if token is valid and user is SUPER_ADMIN, null otherwise
 */
export async function getSuperAdmin(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const user = verifyToken(token);
  if (!user || user.role !== 'SUPER_ADMIN') return null;
  
  return user;
}

/**
 * Get business admin user from request
 * @param request - NextRequest object
 * @returns AuthUser if token is valid and user is BUSINESS_ADMIN, null otherwise
 */
export async function getBusinessAdmin(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const user = verifyToken(token);
  if (!user || user.role !== 'BUSINESS_ADMIN') return null;
  
  return user;
}

/**
 * Get professional admin user from request
 * @param request - NextRequest object
 * @returns AuthUser if token is valid and user is PROFESSIONAL_ADMIN, null otherwise
 */
export async function getProfessional(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const user = verifyToken(token);
  if (!user || user.role !== 'PROFESSIONAL_ADMIN') return null;
  
  return user;
}

/**
 * Get user with business context (BUSINESS_ADMIN or PROFESSIONAL_ADMIN)
 * @param request - NextRequest object
 * @returns AuthUser with businessId if token is valid and user has a business, null otherwise
 */
export async function getBusinessUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const user = verifyToken(token);
  if (!user || (user.role !== 'BUSINESS_ADMIN' && user.role !== 'PROFESSIONAL_ADMIN')) return null;
  
  // Get businessId from database if not in token
  if (!user.businessId) {
    if (user.role === 'BUSINESS_ADMIN') {
      const business = await db.business.findUnique({
        where: { adminId: user.userId },
        select: { id: true }
      });
      if (business) {
        user.businessId = business.id;
      }
    } else if (user.role === 'PROFESSIONAL_ADMIN') {
      const professional = await db.professional.findUnique({
        where: { adminId: user.userId },
        select: { id: true }
      });
      if (professional) {
        user.businessId = professional.id;
      }
    }
  }
  
  return user;
}

/**
 * Get authenticated user from request (any valid token)
 * @param request - NextRequest object
 * @returns AuthUser if token is valid, null otherwise
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Require super admin authentication — alias for getSuperAdmin.
 * Returns the AuthUser if the token is valid and the user is SUPER_ADMIN, null otherwise.
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AuthUser | null> {
  return getSuperAdmin(request);
}

/**
 * Return a 401 Unauthorized JSON response.
 */
export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Return a 404 Not Found JSON response.
 */
export function notFound(message = 'Not found'): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Return a 400 Bad Request JSON response.
 */
export function badRequest(message = 'Bad request'): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}
