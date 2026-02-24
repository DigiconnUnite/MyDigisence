import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ProfessionalProfile from '../../../components/ProfessionalProfile'
import { db } from '@/lib/db'

interface PageProps {
  params: Promise<{
    professional: string
  }>
}

// Enable dynamic rendering for all professional pages
// The sitemap will handle discovery of all pages
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

// Remove generateStaticParams to allow dynamic rendering for all professionals
// This ensures all professional pages can be indexed via sitemap

export default async function ProfessionalPage({ params }: PageProps) {
  const { professional: professionalSlug } = await params

  // Fetch directly from database instead of API to avoid double-fetching
  const professional = await db.professional.findFirst({
    where: { slug: professionalSlug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      professionalHeadline: true,
      aboutMe: true,
      profilePicture: true,
      banner: true,
      resume: true,
      location: true,
      phone: true,
      email: true,
      website: true,
      facebook: true,
      twitter: true,
      instagram: true,
      linkedin: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      adminId: true,
      workExperience: true,
      education: true,
      skills: true,
      servicesOffered: true,
      contactInfo: true,
      portfolio: true,
      contactDetails: true,
      ctaButton: true,
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!professional) {
    notFound()
  }

  return <ProfessionalProfile professional={professional} />
}

export async function generateMetadata({ params }: PageProps) {
  const { professional: professionalSlug } = await params

  // Fetch directly from database to avoid double API call
  const professional = await db.professional.findFirst({
    where: { slug: professionalSlug, isActive: true },
    select: {
      name: true,
      professionalHeadline: true,
      aboutMe: true,
      profilePicture: true,
      admin: { select: { name: true } },
    },
  })

  if (!professional) {
    return {
      title: 'Professional Not Found',
      description: 'The professional profile you are looking for could not be found.',
    }
  }

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const pageUrl = `${baseUrl}/pcard/${professionalSlug}`
  const imageUrl = professional.profilePicture ? `${baseUrl}/api/placeholder/1200/630?text=${encodeURIComponent(professional.name)}` : `${baseUrl}`

  const description = (professional.aboutMe || `Professional profile for ${professional.name}`).slice(0, 160)

  return {
    title: `${professional.name} - ${professional.professionalHeadline || 'Professional'} | DigiSence`,
    description: `${description}. View ${professional.name}'s professional profile on DigiSence - India's global digital presence platform for professionals.`,
    keywords: `${professional.name}, ${professional.professionalHeadline || 'professional'}, services, skills, expert, ${professional.professionalHeadline || 'professional'} India`,
    authors: [{ name: professional.admin?.name || professional.name }],
    openGraph: {
      title: `${professional.name} - ${professional.professionalHeadline || 'Professional'} | DigiSence`,
      description,
      url: pageUrl,
      siteName: 'DigiSence',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${professional.name} profile picture`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${professional.name} - ${professional.professionalHeadline || 'Professional'} | DigiSence`,
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