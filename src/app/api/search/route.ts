import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const entities = searchParams.getAll('entities') || ['business', 'professional', 'product']
    const limit = parseInt(searchParams.get('limit') || '10')

    const results: any = {}

    if (entities.includes('business') || entities.includes('all')) {
      const businesses = await db.business.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          category: { select: { name: true } },
        },
        take: limit,
      })
      results.businesses = businesses
    }

    if (entities.includes('professional') || entities.includes('all')) {
      const professionals = await db.professional.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { professionalHeadline: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          profilePicture: true,
          professionName: true,
        },
        take: limit,
      })
      results.professionals = professionals
    }

    if (entities.includes('product') || entities.includes('all')) {
      const products = await db.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          business: { select: { name: true, slug: true } },
        },
        take: limit,
      })
      results.products = products
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Global search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
