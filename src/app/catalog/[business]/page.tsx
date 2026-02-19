import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import BusinessProfile from '@/components/BusinessProfile'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import { headers } from 'next/headers'
import Navigation from '@/components/Navigation'

// Enable caching for this page - cache for 60 seconds
export const revalidate = 60

interface PageProps {
  params: Promise<{
    business: string
  }>
}

export default async function BusinessPage({ params }: PageProps) {
  const { business: businessSlug } = await params

  const business = await db.business.findUnique({
    where: { slug: businessSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true, 
      address: true,
      phone: true,
      email: true,
      website: true,
      facebook: true,
      twitter: true,
      instagram: true,
      linkedin: true,
      about: true,
      catalogPdf: true,
      openingHours: true,
      gstNumber: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      adminId: true,
      categoryId: true,
      heroContent: true,
      brandContent: true,
      portfolioContent: true,
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
      category: true,
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          inStock: true,
          isActive: true,
          additionalInfo: true,
          createdAt: true,
          updatedAt: true,
          businessId: true,
          categoryId: true,
          brandName: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        } as any,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!business || !business.isActive) {
    notFound()
  }

  // Fetch categories that have products for this business
  const categories = await db.category.findMany({
    where: {
      type: 'PRODUCT',
      products: {
        some: {
          businessId: business?.id,
          isActive: true
        }
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      businessId: true,
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  console.log('Business ID:', business.id)
  console.log('Products count:', (business as any).products?.length || 0)
  console.log('Categories fetched:', categories.length, categories.map(c => ({ id: c.id, name: c.name, type: 'PRODUCT', _count: c._count })))

  const mappedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || undefined,
    parentId: cat.parentId || undefined,
    _count: cat._count
  }))

  // Process openingHours to match the expected type
  const processedBusiness = {
    ...business,
    openingHours: business.openingHours ? (Array.isArray(business.openingHours) ? business.openingHours : JSON.parse(business.openingHours as string)) as any[] : undefined
  } as any

  return <BusinessProfile business={processedBusiness} categories={mappedCategories} />
}

export async function generateMetadata({ params }: PageProps) {
  const { business: businessSlug } = await params

  const business = await db.business.findUnique({
    where: { slug: businessSlug },
    select: {
      name: true,
      description: true,
      logo: true,
      category: {
        select: {
          name: true,
        },
      },
      admin: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!business) {
    return {
      title: 'Business Not Found',
      description: 'The business you are looking for could not be found.',
    }
  }

  const headersList = headers()
  const host = (await headersList).get('host') || 'localhost:3000'
  const protocol = (await headersList).get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${protocol}://${host}`
  const pageUrl = `${baseUrl}/catalog/${businessSlug}`
  const imageUrl = business.logo ? getOptimizedImageUrl(business.logo, {
    width: 1200,
    height: 630,
    quality: 85,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  }) : `${baseUrl}`

  const description = (business.description || `Professional profile for ${business.name}`).slice(0, 160)

  return {
    title: `${business.name} - ${business.category?.name || 'Business'} | DigiSence`,
    description: `${description}. Discover ${business.name} on DigiSence - India's global digital presence platform. View products, services, and contact information.`,
    keywords: `${business.name}, ${business.category?.name || 'business'}, products, services, ${business.category?.name || 'business'} India, digital presence`,
    authors: [{ name: business.admin?.name || business.name }],
    openGraph: {
      title: `${business.name} - ${business.category?.name || 'Business'} | DigiSence`,
      description: description,
      url: pageUrl,
      siteName: 'DigiSence',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${business.name} logo`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} - ${business.category?.name || 'Business'} | DigiSence`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}