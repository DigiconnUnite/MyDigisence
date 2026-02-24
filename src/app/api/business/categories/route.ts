import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
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

export async function GET(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await db.category.findMany({
      where: {
        businessId: admin.businessId,
        type: 'PRODUCT'
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const categoryData = categorySchema.parse(body)

    // Generate slug from name
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if slug is already taken for this business
    const existingCategory = await db.category.findFirst({
      where: {
        slug,
        businessId: admin.businessId,
        type: 'PRODUCT'
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const createData: any = {
      name: categoryData.name,
      slug,
      description: categoryData.description,
      type: 'PRODUCT',
      businessId: admin.businessId,
    }

    if (categoryData.parentId) {
      // Verify parent belongs to same business and is PRODUCT type
      const parent = await db.category.findFirst({
        where: {
          id: categoryData.parentId,
          businessId: admin.businessId,
          type: 'PRODUCT'
        }
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Invalid parent category' },
          { status: 400 }
        )
      }
      createData.parentId = categoryData.parentId
    }

    const category = await db.category.create({
      data: createData,
    })

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }

    const body = await request.json()
    const updateData = categorySchema.parse(body)

    // Direct update - Prisma handles non-existent records gracefully
    const category = await db.category.update({
      where: { id: categoryId, businessId: admin.businessId, type: 'PRODUCT' },
      data: updateData,
    }).catch(() => null)

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }

    // Check if category has children FIRST (required for business logic)
    const hasChildren = await db.category.findFirst({
      where: { parentId: categoryId }
    })

    if (hasChildren) {
      return NextResponse.json(
        { error: 'Cannot delete category with child categories. Please delete child categories first.' },
        { status: 400 }
      )
    }

    // Direct delete - Prisma handles non-existent records gracefully
    await db.category.delete({
      where: { id: categoryId, businessId: admin.businessId, type: 'PRODUCT' },
    }).catch(() => null)

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}