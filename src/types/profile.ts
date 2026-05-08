// Profile Types for Professional and Business Detail Pages

export interface Review {
  id: string
  rating: number
  title?: string
  content: string
  authorName: string
  authorImage?: string
  isVerified: boolean
  createdAt: string | Date
}

export interface ProfessionalProfile {
  id: string
  name: string
  slug: string
  professionName?: string
  professionalHeadline?: string
  aboutMe?: string
  profilePicture?: string
  banner?: string
  resume?: string
  location?: string
  phone?: string
  email?: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
  
  // Stats
  totalReviews: number
  averageRating: number
  projectsCompleted?: string
  yearsExperience?: string
  happyClients?: string
  isVerified: boolean
  availability?: string
  responseTime?: string
  
  // Content
  heroContent?: {
    slides: Array<{
      mediaType?: 'image' | 'video'
      media?: string
      image?: string
      headline?: string
      subheadline?: string
      subtext?: string
      cta?: string
      ctaLink?: string
    }>
    autoPlay?: boolean
    transitionSpeed?: number
    showDots?: boolean
    showArrows?: boolean
  }
  techStack?: string[]
  skills?: Array<{
    name: string
    percentage: number
  }>
  servicesOffered?: Array<{
    name: string
    description?: string
    price?: string
    icon?: string
  }>
  workExperience?: Array<{
    title: string
    company: string
    duration: string
    description?: string
    location?: string
  }>
  education?: Array<{
    degree: string
    institution: string
    year?: string
    description?: string
  }>
  portfolio?: Array<{
    title: string
    description?: string
    image?: string
    link?: string
    technologies?: string[]
  }>
  contactDetails?: {
    address?: string
    phone?: string
    email?: string
    website?: string
  }
  contactInfo?: Record<string, any>
  ctaButton?: {
    text: string
    link: string
    type: 'primary' | 'secondary'
  }
  
  // Generated content
  qrCodeUrl?: string
  vcardData?: string
  
  // Relations
  reviews?: Review[]
  admin?: {
    name?: string
    email: string
  }
}

export interface BusinessProfile {
  id: string
  name: string
  slug: string
  description?: string
  about?: string
  logo?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  catalogPdf?: string
  gstNumber?: string
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
  
  // Stats
  totalReviews: number
  averageRating: number
  happyCustomers?: string
  teamSize?: string
  yearsInBusiness?: string
  isVerified: boolean
  verifiedBadge?: string
  
  // Banner
  banner?: string
  
  // Content
  heroContent?: {
    slides: Array<{
      mediaType?: 'image' | 'video'
      media?: string
      image?: string // legacy support
      headline?: string
      subheadline?: string
      subtext?: string
      cta?: string
      ctaLink?: string
    }>
    autoPlay?: boolean
    transitionSpeed?: number
    showDots?: boolean
    showArrows?: boolean
  }
  brandContent?: Array<{
    name: string
    logo?: string
  }>
  portfolioContent?: Array<{
    image: string
    title?: string
    description?: string
  }>
  highlights?: Array<{
    title: string
    value: string
    icon?: string
  }>
  customTags?: string[]
  servicesList?: Array<{
    name: string
    icon?: string
    description?: string
  }>
  openingHours?: Array<{
    day: string
    open: string
    close: string
    isClosed?: boolean
  }>
  
  // Generated content
  qrCodeUrl?: string
  
  // Relations
  reviews?: Review[]
  category?: {
    id: string
    name: string
    slug?: string
  }
  categories?: Array<{
    id: string
    name: string
  }>
  products?: Array<{
    id: string
    name: string
    description?: string
    price?: number
    image?: string
    inStock: boolean
    isActive: boolean
    additionalInfo?: Record<string, any>
    category?: {
      id: string
      name: string
    }
    brandName?: string
  }>
  admin?: {
    name?: string
    email: string
  }
}

export type ProfileTab = 
  | 'overview' 
  | 'about' 
  | 'services' 
  | 'portfolio' 
  | 'experience' 
  | 'education' 
  | 'reviews' 
  | 'contact'

export type BusinessTab = 
  | 'overview' 
  | 'services' 
  | 'menu' 
  | 'photos' 
  | 'reviews' 
  | 'about' 
  | 'highlights'

export interface StatItem {
  icon: string
  value: string
  label: string
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp'
  url: string
}
