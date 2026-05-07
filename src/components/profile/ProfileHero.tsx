"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  CheckCircle2,
  Share2,
  Phone,
  Download,
  UserPlus,
  MessageCircle,
  Building2,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"

interface ProfileHeroProps {
  type: "professional" | "business"
  name: string
  subtitle?: string
  headline?: string
  avatar?: string
  banner?: string
  location?: string
  rating?: number
  reviewCount?: number
  isVerified?: boolean
  verifiedBadge?: string
  tags?: string[]
  phone?: string
  email?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  stats?: Array<{
    icon: string
    value: string
    label: string
  }>
  techStack?: string[]
  availability?: string
  onShare?: () => void
  onMessage?: () => void
  onDownloadVCard?: () => void
  onSaveContact?: () => void
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export default function ProfileHero({
  type,
  name,
  subtitle,
  headline,
  avatar,
  banner,
  location,
  rating,
  reviewCount,
  isVerified = false,
  verifiedBadge = "Verified",
  tags = [],
  phone,
  email,
  website,
  socialLinks = {},
  stats = [],
  techStack = [],
  availability,
  onShare,
  onMessage,
  onDownloadVCard,
  onSaveContact,
  breadcrumbs = [],
}: ProfileHeroProps) {
  const [imageError, setImageError] = useState({ banner: false, avatar: false })

  const displayRating = rating || 0
  const displayReviewCount = reviewCount || 0

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-[200px] sm:h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden">
        {banner && !imageError.banner ? (
          <Image
            src={banner}
            alt={`${name} banner`}
            fill
            className="object-cover"
            priority
            onError={() => setImageError((prev) => ({ ...prev, banner: true }))}
          />
        ) : type === "business" ? (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <Building2 className="w-24 h-24 text-slate-700" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Bar - Share & Like */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="hidden sm:inline">958</span>
          </button>
        </div>

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-sm text-white/80">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-white/50">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Profile Info Container - Stacked Layout Like Reference Image */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 pb-6">
            {/* Top Row: Avatar + Quick Actions */}
            <div className="flex items-end justify-between">
              {/* Avatar - Positioned to overlap banner */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                  {avatar && !imageError.avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                      onError={() => setImageError((prev) => ({ ...prev, avatar: true }))}
                    />
                  ) : type === "business" ? (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-slate-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Availability Badge - Only for Professionals */}
                {type === "professional" && availability && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-md">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {availability}
                  </div>
                )}
              </div>

              {/* Action Buttons - Desktop Only, positioned on right */}
              <div className="hidden md:flex items-center gap-3 pb-2">
                {type === "professional" ? (
                  <>
                    {phone && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-green-500 text-green-600 hover:bg-green-50 font-medium"
                        asChild
                      >
                        <a
                          href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="w-5 h-5 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button
                      size="lg"
                      onClick={onMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    {phone && (
                      <>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                          asChild
                        >
                          <a href={`tel:${phone}`}>
                            <Phone className="w-5 h-5 mr-2" />
                            Call Now
                          </a>
                        </Button>
                        <Button
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                          asChild
                        >
                          <a
                            href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp className="w-5 h-5 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Profile Info - BELOW the avatar */}
            <div className="mt-4 md:mt-5">
              {/* Name Row with Verification */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  {name}
                </h1>
                {isVerified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 px-2.5 py-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {verifiedBadge}
                  </Badge>
                )}
              </div>

              {/* Subtitle/Headline */}
              {headline && (
                <p className="text-base sm:text-lg text-slate-600 mt-1.5 font-medium">
                  {headline}
                </p>
              )}

              {/* Rating & Review Count */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-slate-800">
                    {displayRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  ({displayReviewCount} Reviews)
                </span>
                {subtitle && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm text-slate-600">{subtitle}</span>
                  </>
                )}
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              )}

              {/* Tags Row */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tech Stack - Only for Professionals */}
              {type === "professional" && techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {techStack.slice(0, 8).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                  {techStack.length > 8 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      +{techStack.length - 8}
                    </span>
                  )}
                </div>
              )}

              {/* Stats Row */}
              {stats.length > 0 && (
                <div className="flex flex-wrap items-center gap-6 mt-4 pt-3">
                  {stats.slice(0, 4).map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 text-lg">
                          {stat.icon === "star" && "★"}
                          {stat.icon === "users" && "👥"}
                          {stat.icon === "briefcase" && "💼"}
                          {stat.icon === "calendar" && "📅"}
                          {stat.icon === "clock" && "⏰"}
                          {stat.icon === "award" && "🏆"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Action Buttons */}
              <div className="flex md:hidden items-center gap-3 mt-5">
                {type === "professional" ? (
                  <>
                    {phone && (
                      <Button
                        variant="outline"
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        asChild
                      >
                        <a
                          href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button
                      onClick={onMessage}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    {phone && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                          asChild
                        >
                          <a href={`tel:${phone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </a>
                        </Button>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          asChild
                        >
                          <a
                            href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp className="w-4 h-4 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Secondary Actions Row */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                {onSaveContact && (
                  <button
                    onClick={onSaveContact}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Save Contact
                  </button>
                )}
                {onDownloadVCard && (
                  <button
                    onClick={onDownloadVCard}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download vCard
                  </button>
                )}
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
