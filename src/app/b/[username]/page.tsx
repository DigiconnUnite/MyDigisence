import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { cache } from "react"
import { db } from "@/lib/db"
import BusinessProfilePage from "@/components/profile/BusinessProfilePage"
import type { BusinessProfile } from "@/types/profile"

interface PageProps {
  params: Promise<{
    username: string
  }>
}

// Cache the business lookup
const getBusinessBySlug = cache(async (slug: string) => {
  const business = await db.business.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: "desc" },
      },
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
  
  // TODO: Add reviews relation when Prisma schema is regenerated
  return business
})

export const revalidate = 3600 // Revalidate every hour

export default async function BusinessPage({ params }: PageProps) {
  const { username } = await params

  // Fetch business data
  const businessData = await getBusinessBySlug(username)

  if (!businessData || !businessData.isActive) {
    notFound()
  }

  // Get base URL for server-side rendering
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${protocol}://${host}`

  // Process openingHours if needed
  const openingHours = businessData.openingHours
    ? Array.isArray(businessData.openingHours)
      ? businessData.openingHours
      : JSON.parse(JSON.stringify(businessData.openingHours))
    : []

  // Transform data to match our type
  // Using type assertions for new fields until Prisma client is regenerated
  const rawData = businessData as any
  
  const business: BusinessProfile = {
    id: businessData.id,
    name: businessData.name,
    slug: businessData.slug,
    description: rawData.description || undefined,
    about: rawData.about || undefined,
    logo: rawData.logo || undefined,
    address: rawData.address || undefined,
    phone: rawData.phone || undefined,
    email: rawData.email || undefined,
    website: rawData.website || undefined,
    facebook: rawData.facebook || undefined,
    twitter: rawData.twitter || undefined,
    instagram: rawData.instagram || undefined,
    linkedin: rawData.linkedin || undefined,
    catalogPdf: rawData.catalogPdf || undefined,
    gstNumber: rawData.gstNumber || undefined,
    isActive: businessData.isActive,
    createdAt: businessData.createdAt.toISOString(),
    updatedAt: businessData.updatedAt.toISOString(),
    // Category and relations
    category: businessData.category || undefined,
    admin: businessData.admin ? {
      name: businessData.admin.name || undefined,
      email: businessData.admin.email,
    } : undefined,
    // Stats
    totalReviews: rawData.totalReviews || 0,
    averageRating: rawData.averageRating || 0,
    happyCustomers: rawData.happyCustomers || undefined,
    teamSize: rawData.teamSize || undefined,
    yearsInBusiness: rawData.yearsInBusiness || undefined,
    isVerified: rawData.isVerified || false,
    verifiedBadge: rawData.verifiedBadge || undefined,
    // Banner
    banner: rawData.banner || undefined,
    // JSON content fields
    heroContent: rawData.heroContent || undefined,
    brandContent: rawData.brandContent || undefined,
    portfolioContent: rawData.portfolioContent || undefined,
    highlights: rawData.highlights || undefined,
    customTags: rawData.customTags || undefined,
    servicesList: rawData.servicesList || undefined,
    qrCodeUrl: rawData.qrCodeUrl || undefined,
    openingHours,
    reviews: businessData.reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      title: review.title || undefined,
      content: review.content,
      authorName: review.authorName,
      authorImage: review.authorImage || undefined,
      isVerified: review.isVerified ?? false,
      createdAt: review.createdAt.toISOString(),
    })),
    products: businessData.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || undefined,
      price: product.price || undefined,
      image: product.image || undefined,
      inStock: product.inStock ?? true,
      isActive: product.isActive ?? true,
      brandName: product.brandName || undefined,
      category: product.category || undefined,
      additionalInfo: product.additionalInfo
        ? (typeof product.additionalInfo === "string"
            ? JSON.parse(product.additionalInfo)
            : product.additionalInfo)
        : undefined,
    })),
  }

  return <BusinessProfilePage business={business} baseUrl={baseUrl} />
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const business = await getBusinessBySlug(username)

  if (!business) {
    return {
      title: "Business Not Found | Mydigisence",
      description: "The business you are looking for could not be found.",
    }
  }

  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${protocol}://${host}`

  const pageUrl = `${baseUrl}/b/${business.slug}`
  const imageUrl = business.logo || `${baseUrl}/og-image.png`
  const description = business.description
    ? business.description.length > 160
      ? business.description.substring(0, 157) + "..."
      : business.description
    : `${business.name} - Find products and services on Mydigisence`

  return {
    title: `${business.name} | ${business.category?.name || "Business"} | Mydigisence`,
    description,
    keywords: `${business.name}, ${business.category?.name || "Business"}, business directory, products, services, Mydigisence`,
    openGraph: {
      title: `${business.name} | ${business.category?.name || "Business"} | Mydigisence`,
      description,
      url: pageUrl,
      siteName: "Mydigisence",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${business.name} on Mydigisence`,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} | ${business.category?.name || "Business"} | Mydigisence`,
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
