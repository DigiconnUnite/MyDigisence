import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { cache } from 'react'
import BusinessProfile from '@/components/BusinessProfile'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import { headers } from 'next/headers'
import Navigation from '@/components/Navigation'

// Cache the business lookup to avoid duplicate DB calls
const getBusinessBySlug = cache(async (slug: string) => {
  return db.business.findUnique({
    where: { slug },
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
})

// Cache for metadata only - lighter query
const getBusinessMetadata = cache(async (slug: string) => {
  return db.business.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      logo: true,
      address: true,
      phone: true,
      website: true,
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
})

// Enable caching for this page - cache for 60 seconds
export const revalidate = 60

interface PageProps {
  params: Promise<{
    business: string
  }>
}

export default async function BusinessPage({ params }: PageProps) {
  const { business: businessSlug } = await params

  const business = await getBusinessBySlug(businessSlug)

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

  return (
    <div className="mx-auto">
      <BusinessProfile business={processedBusiness} categories={mappedCategories} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { business: businessSlug } = await params

  const business = await getBusinessMetadata(businessSlug)

  if (!business) {
    return {
      title: 'Business Not Found | Mydigisence',
      description: 'The business you are looking for could not be found on Mydigisence - India\'s leading digital presence platform for businesses.',
    }
  }

  const headersList = headers()
  const host = (await headersList).get('host') || 'localhost:3000'
  const protocol = (await headersList).get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${protocol}://${host}`
  const pageUrl = `${baseUrl}/catalog/${businessSlug}`
  
  // Use actual business logo for OG image
  const imageUrl = business.logo 
    ? getOptimizedImageUrl(business.logo, {
        width: 1200,
        height: 630,
        quality: 85,
        format: 'auto',
        crop: 'fill',
        gravity: 'center'
      })
    : `${baseUrl}/og-image.png`

  // Create comprehensive description (150-160 characters for optimal SEO)
  const fullDescription = business.description || `${business.name} - Find products, services, and contact information for ${business.name} on Mydigisence.`
  const description = fullDescription.length > 160 
    ? fullDescription.substring(0, 157) + '...'
    : fullDescription

  // Category for the title format
  const categoryName = business.category?.name || 'Business'

  return {
    title: `${business.name} | business - ${categoryName} | Mydigisence`,
    description: description,
    keywords: `${business.name}, ${categoryName}, business directory, ${categoryName} India, digital business card, online business, Mydigisence business, local business, products and services`,
    authors: [{ name: business.admin?.name || business.name }],
    openGraph: {
      title: `${business.name} | business - ${categoryName} | Mydigisence`,
      description: description,
      url: pageUrl,
      siteName: 'Mydigisence',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${business.name} - ${categoryName} on Mydigisence`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} | business - ${categoryName} | Mydigisence`,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'en': pageUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
