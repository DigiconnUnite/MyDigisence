import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import type { User as PrismaUser } from '@prisma/client'

/**
 * Import the Prisma enums for role safety.
 * Will use type compatible with Prisma UserRole
 */
import type { $Enums } from '@prisma/client'

export type UserRole = $Enums.UserRole

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  businessId?: string
  createdAt?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(
  email: string, 
  password: string, 
  name?: string, 
  role: UserRole = 'USER' as UserRole,
  username?: string,
  mobile?: string
): Promise<AuthUser> {
  // Normalize email to lowercase for case-insensitive matching
  const normalizedEmail = email.toLowerCase()
  const hashedPassword = await hashPassword(password)
  
  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      name,
      role,
      username,
      mobile,
    },
    include: {
      business: true,
    },
  } as any)

  return {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
    role: user.role as UserRole,
    businessId: (user as any).business?.id,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function authenticateUser(identifier: string, password: string): Promise<AuthUser | null> {
  // Normalize identifier for case-insensitive matching
  const normalizedIdentifier = identifier.trim().toLowerCase();

  // Try to find user by email, username, or mobile
  let user = await db.user.findFirst({
    where: {
      OR: [
        { email: { equals: normalizedIdentifier, mode: 'insensitive' } },
        { username: { equals: normalizedIdentifier, mode: 'insensitive' } },
        { mobile: normalizedIdentifier }
      ]
    },
    include: {
      business: true,
    },
  } as any)

  if (!user || !user.password) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
    role: user.role as UserRole,
    businessId: (user as any).business?.id,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      business: true,
    },
  } as any)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
    role: user.role as UserRole,
    businessId: (user as any).business?.id,
  }
}

export function isSuperAdmin(user: AuthUser): boolean {
  return user.role === 'SUPER_ADMIN'
}

export function isBusinessAdmin(user: AuthUser): boolean {
  return user.role === 'BUSINESS_ADMIN'
}

export function generatePasswordResetToken(userId: string): string {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' })
  return token
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function generateToken(user: AuthUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    businessId: (user as any).business?.id,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}