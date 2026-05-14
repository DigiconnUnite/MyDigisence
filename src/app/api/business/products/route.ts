import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
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
  price: z.coerce.number().optional(),
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

    const cleanedData: Prisma.ProductUncheckedCreateInput = {
      name: productData.name,
      businessId: admin.businessId,
      description: productData.description === '' ? null : productData.description ?? null,
      price: productData.price == null ? null : productData.price,
      image: productData.image === '' ? null : productData.image ?? null,
      categoryId: productData.categoryId === '' ? null : productData.categoryId ?? null,
      brandName: productData.brandName === '' ? null : productData.brandName ?? null,
      inStock: productData.inStock,
      isActive: productData.isActive,
      additionalInfo: productData.additionalInfo ?? null,
    }

    const product = await db.product.create({
      data: cleanedData,
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


