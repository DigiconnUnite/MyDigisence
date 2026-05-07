import type { ProfessionalProfile } from '@/types/profile'

export interface VCardData {
  firstName: string
  lastName: string
  fullName?: string
  title?: string
  organization?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  photo?: string
  note?: string
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ]

  // Name
  const fullName = data.fullName || `${data.firstName} ${data.lastName}`.trim()
  lines.push(`FN:${fullName}`)
  lines.push(`N:${data.lastName};${data.firstName};;;`)

  // Title/Job
  if (data.title) {
    lines.push(`TITLE:${data.title}`)
  }

  // Organization
  if (data.organization) {
    lines.push(`ORG:${data.organization}`)
  }

  // Phone
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`)
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`)
  }

  // Website
  if (data.website) {
    lines.push(`URL:${data.website}`)
  }

  // Address
  if (data.address) {
    lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`)
  }

  // Photo (base64 encoded if provided)
  if (data.photo) {
    lines.push(`PHOTO;VALUE=URL:${data.photo}`)
  }

  // Note
  if (data.note) {
    lines.push(`NOTE:${data.note.replace(/\n/g, '\\n')}`)
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function generateProfessionalVCard(
  professional: ProfessionalProfile,
  baseUrl: string
): string {
  const nameParts = professional.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || ''

  return generateVCard({
    firstName,
    lastName,
    title: professional.professionalHeadline || professional.professionName,
    phone: professional.phone,
    email: professional.email,
    website: professional.website || `${baseUrl}/p/${professional.slug}`,
    address: professional.location,
    photo: professional.profilePicture,
    note: professional.aboutMe?.substring(0, 200), // vCard note has length limits
  })
}

export function downloadVCard(vcardData: string, filename: string): void {
  if (typeof window === 'undefined') return

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.vcf') ? filename : `${filename}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(url)
}
