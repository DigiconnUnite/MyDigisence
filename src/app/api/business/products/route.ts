import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.string().optional(),
  brandName: z.string().optional(),
  additionalInfo: z.object({}).catchall(z.string()).optional(),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
})

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.string().optional(),
  brandName: z.string().optional(),
  additionalInfo: z.object({}).catchall(z.string()).optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

async function getBusinessAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'BUSINESS_ADMIN') {
    return null
  }
  
  // Use businessId directly from JWT if available (avoiding DB lookup)
  if (payload.businessId) {
    return { ...payload, businessId: payload.businessId }
  }
  
  // Fallback: Get the business for this admin if not in JWT
  const business = await db.business.findUnique({
    where: { adminId: payload.userId },
    select: { id: true }
  })
  
  if (!business) {
    return null
  }
  
  return { ...payload, businessId: business.id }
}

async function getBusinessId(adminId: string) {
  const business = await db.business.findUnique({
    where: { adminId },
    select: { id: true }
  })
  return business?.id
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin || !admin.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await db.product.findMany({
      where: { businessId: admin.businessId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin || !admin.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const productData = productSchema.parse(body)

    // Convert empty strings to null for optional fields
    const cleanedData = {
      ...productData,
      categoryId: productData.categoryId || null,
      brandName: productData.brandName || null,
      description: productData.description || null,
      price: productData.price || null,
      image: productData.image || null,
    }

    const product = await db.product.create({
      data: {
        ...cleanedData,
        businessId: admin.businessId,
      },
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin || !admin.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params
    
    // Direct delete - Prisma handles non-existent records gracefully
    await db.product.delete({
      where: { id: productId, businessId: admin.businessId },
    }).catch(() => null)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
