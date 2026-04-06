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

  return (
    <div className="">
      <ProfessionalProfile professional={professional} />
    </div>
  )
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
      location: true,
      phone: true,
      website: true,
      admin: { select: { name: true } },
    },
  })

  if (!professional) {
    return {
      title: 'Professional Not Found | Mydigisence',
      description: 'The professional profile you are looking for could not be found on Mydigisence - India\'s leading digital presence platform for professionals.',
    }
  }

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const pageUrl = `${baseUrl}/pcard/${professionalSlug}`
  
  // Use actual profile picture for OG image - use the original URL without transformation
  const imageUrl = professional.profilePicture || `${baseUrl}/og-image.png`

  // Create comprehensive description (150-160 characters for optimal SEO)
  const fullDescription = professional.aboutMe || `${professional.name} - ${professional.professionalHeadline || 'Professional'} on Mydigisence. Find contact information, services, and expertise.`
  const description = fullDescription.length > 160 
    ? fullDescription.substring(0, 157) + '...'
    : fullDescription

  // Professional headline as category
  const categoryName = professional.professionalHeadline || 'Professional'

  return {
    title: `${professional.name} | professional - ${categoryName} | Mydigisence`,
    description: description,
    keywords: `${professional.name}, ${categoryName}, professional directory, ${categoryName} India, digital business card, expert, Mydigisence professional, services, skills`,
    authors: [{ name: professional.admin?.name || professional.name }],
    openGraph: {
      title: `${professional.name} | professional - ${categoryName} | Mydigisence`,
      description: description,
      url: pageUrl,
      siteName: 'Mydigisence',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${professional.name} - ${categoryName} on Mydigisence`,
        },
      ],
      type: 'profile',
      locale: 'en_US',
      profile: {
        firstName: professional.name.split(' ')[0],
        lastName: professional.name.split(' ').slice(1).join(' ') || undefined,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${professional.name} | professional - ${categoryName} | Mydigisence`,
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
