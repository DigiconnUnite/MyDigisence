import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { cache } from "react"
import { db } from "@/lib/db"
import ProfessionalProfilePage from "@/components/profile/ProfessionalProfilePage"
import type { ProfessionalProfile, Review } from "@/types/profile"

interface PageProps {
  params: Promise<{
    username: string
  }>
}

// Cache the professional lookup
const getProfessionalBySlug = cache(async (slug: string) => {
  const professional = await db.professional.findFirst({
    where: { slug, isActive: true },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
  
  // TODO: Add reviews relation when Prisma schema is regenerated
  // For now, return empty reviews array
  return professional
})

// Enable dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function ProfessionalPage({ params }: PageProps) {
  const { username } = await params

  // Fetch professional data
  const professionalData = await getProfessionalBySlug(username)

  if (!professionalData) {
    notFound()
  }

  // Get base URL for server-side rendering
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${protocol}://${host}`

  // Transform data to match our type
  // Using type assertions for new fields until Prisma client is regenerated
  const rawData = professionalData as any
  
  const professional: ProfessionalProfile = {
    id: professionalData.id,
    name: professionalData.name,
    slug: professionalData.slug,
    email: professionalData.email || undefined,
    phone: professionalData.phone || undefined,
    location: professionalData.location || undefined,
    professionName: professionalData.professionName || undefined,
    professionalHeadline: professionalData.professionalHeadline || undefined,
    aboutMe: rawData.aboutMe || undefined,
    profilePicture: rawData.profilePicture || undefined,
    banner: rawData.banner || undefined,
    resume: rawData.resume || undefined,
    website: rawData.website || undefined,
    facebook: rawData.facebook || undefined,
    twitter: rawData.twitter || undefined,
    instagram: rawData.instagram || undefined,
    linkedin: rawData.linkedin || undefined,
    isActive: professionalData.isActive,
    createdAt: professionalData.createdAt.toISOString(),
    updatedAt: professionalData.updatedAt.toISOString(),
    // JSON fields
    workExperience: rawData.workExperience,
    education: rawData.education,
    skills: rawData.skills,
    servicesOffered: rawData.servicesOffered,
    contactInfo: rawData.contactInfo,
    portfolio: rawData.portfolio,
    contactDetails: rawData.contactDetails,
    ctaButton: rawData.ctaButton,
    // New fields
    totalReviews: rawData.totalReviews || 0,
    averageRating: rawData.averageRating || 0,
    projectsCompleted: rawData.projectsCompleted || undefined,
    yearsExperience: rawData.yearsExperience || undefined,
    happyClients: rawData.happyClients || undefined,
    isVerified: rawData.isVerified || false,
    availability: rawData.availability || undefined,
    responseTime: rawData.responseTime || undefined,
    techStack: rawData.techStack,
    heroContent: rawData.heroContent || undefined,
    qrCodeUrl: rawData.qrCodeUrl || undefined,
    vcardData: rawData.vcardData || undefined,
    reviews: [], // Will be populated when reviews relation is added
    admin: professionalData.admin ? {
      name: professionalData.admin.name || undefined,
      email: professionalData.admin.email,
    } : undefined,
  }

  return (
    <ProfessionalProfilePage
      professional={professional}
      baseUrl={baseUrl}
    />
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const professional = await getProfessionalBySlug(username)

  if (!professional) {
    return {
      title: "Professional Not Found | Mydigisence",
      description: "The professional profile you are looking for could not be found.",
    }
  }

  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const baseUrl = `${protocol}://${host}`

  const pageUrl = `${baseUrl}/p/${professional.slug}`
  const imageUrl = professional.profilePicture || `${baseUrl}/og-image.png`
  const description = professional.aboutMe
    ? professional.aboutMe.length > 160
      ? professional.aboutMe.substring(0, 157) + "..."
      : professional.aboutMe
    : `${professional.name} - ${professional.professionalHeadline || "Professional"} on Mydigisence`

  return {
    title: `${professional.name} | ${professional.professionalHeadline || "Professional"} | Mydigisence`,
    description,
    keywords: `${professional.name}, ${professional.professionalHeadline || "Professional"}, professional directory, services, skills, Mydigisence`,
    openGraph: {
      title: `${professional.name} | ${professional.professionalHeadline || "Professional"} | Mydigisence`,
      description,
      url: pageUrl,
      siteName: "Mydigisence",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${professional.name} on Mydigisence`,
        },
      ],
      type: "profile",
      locale: "en_US",
      profile: {
        firstName: professional.name.split(" ")[0],
        lastName: professional.name.split(" ").slice(1).join(" ") || undefined,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${professional.name} | ${professional.professionalHeadline || "Professional"} | Mydigisence`,
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
