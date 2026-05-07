"use client"

import { cn } from "@/lib/utils"
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiWhatsapp } from "react-icons/si"

interface SocialLinksProps {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  whatsapp?: string
  className?: string
}

const socialConfig = [
  { key: "facebook", icon: SiFacebook, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
  { key: "twitter", icon: SiX, color: "bg-slate-800 hover:bg-slate-900", label: "Twitter" },
  { key: "instagram", icon: SiInstagram, color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:opacity-90", label: "Instagram" },
  { key: "linkedin", icon: SiLinkedin, color: "bg-blue-700 hover:bg-blue-800", label: "LinkedIn" },
  { key: "whatsapp", icon: SiWhatsapp, color: "bg-green-500 hover:bg-green-600", label: "WhatsApp" },
] as const

export default function SocialLinks({
  facebook,
  twitter,
  instagram,
  linkedin,
  whatsapp,
  className,
}: SocialLinksProps) {
  const links = { facebook, twitter, instagram, linkedin, whatsapp }

  const hasAnyLink = Object.values(links).some(Boolean)
  if (!hasAnyLink) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {socialConfig.map(({ key, icon: Icon, color, label }) => {
        const url = links[key as keyof typeof links]
        if (!url) return null

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200",
              color
            )}
            aria-label={label}
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}
