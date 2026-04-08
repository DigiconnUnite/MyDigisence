import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Find the original business
    const originalBusiness = await db.business.findUnique({
      where: { id },
      include: {
        admin: true,
        category: true,
      },
    })

    if (!originalBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Generate unique slug
    const baseSlug = originalBusiness.slug
    let slug = baseSlug
    let counter = 1
    while (await db.business.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-copy-${counter}`
      counter++
    }

    // Generate unique email for the new admin account
    const baseEmail = originalBusiness.admin.email.split('@')[0]
    const timestamp = Date.now().toString().slice(-4)
    const domain = originalBusiness.admin.email.split('@')[1]
    let newEmail = `${baseEmail}+copy${timestamp}@${domain}`.toLowerCase()
    
    // Check if email exists, if so, add more random characters
    let emailExists = await db.user.findUnique({ where: { email: newEmail } })
    while (emailExists) {
      const randomStr = Math.random().toString(36).substring(2, 6)
      newEmail = `${baseEmail}+copy${timestamp}${randomStr}@${domain}`.toLowerCase()
      emailExists = await db.user.findUnique({ where: { email: newEmail } })
    }

    // Generate password and hash it
    const { hashPassword } = await import('@/lib/auth')
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = "Adm@"
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const hashedPassword = await hashPassword(password)

    // Create new user and business in transaction
    const result = await db.$transaction(async (tx) => {
      // Create new user
      const user = await tx.user.create({
        data: {
          email: newEmail,
          password: hashedPassword,
          name: `${originalBusiness.admin.name || originalBusiness.name} (Copy)`,
          role: 'BUSINESS_ADMIN',
        },
      })

      // Create duplicate business
      const duplicatedBusiness = await tx.business.create({
        data: {
          name: `${originalBusiness.name} (Copy)`,
          slug,
          description: originalBusiness.description,
          logo: originalBusiness.logo,
          address: originalBusiness.address,
          phone: originalBusiness.phone,
          email: newEmail,
          website: originalBusiness.website,
          isActive: false, // Start as inactive
          adminId: user.id,
          categoryId: originalBusiness.categoryId,
        },
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
              inquiries: true,
            },
          },
        },
      })

      return { user, business: duplicatedBusiness }
    })

    // Emit Socket.IO event for real-time update
    broadcast('business-created', {
      business: result.business,
      action: 'duplicate',
      timestamp: new Date().toISOString(),
      adminId: admin.userId
    })

    return NextResponse.json({
      success: true,
      business: result.business,
      loginCredentials: {
        email: newEmail,
        password, // Return unhashed password for admin to share
      },
    })
  } catch (error) {
    console.error('Error duplicating business:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate business' },
      { status: 500 }
    )
  }
}
