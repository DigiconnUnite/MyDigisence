"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import type { ProfessionalProfile } from "@/types/profile"
import ProfileHero from "./ProfileHero"
import ProfileTabs from "./ProfileTabs"
import StatCard from "./StatCard"
import SkillBar from "./SkillBar"
import ServiceCard from "./ServiceCard"
import PortfolioCard from "./PortfolioCard"
import ExperienceTimeline from "./ExperienceTimeline"
import EducationCard from "./EducationCard"
import ReviewCard from "./ReviewCard"
import QRCodeSection from "./QRCodeSection"
import ContactCard from "./ContactCard"
import SocialLinks from "./SocialLinks"
import StickyCTA from "./StickyCTA"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Briefcase,
  Users,
  Clock,
  Headphones,
  Award,
  MapPin,
  Star,
  Calendar,
  CheckCircle2,
  Share2,
  MessageCircle,
  UserPlus,
  Download,
} from "lucide-react"
import { generateProfessionalVCard, downloadVCard } from "@/lib/generators/vcard-generator"
import Footer from "@/components/Footer"
import { PublicPageHeader } from "@/components/UnifiedPublicLayout"

interface ProfessionalProfilePageProps {
  professional: ProfessionalProfile
  baseUrl: string
}

export default function ProfessionalProfilePage({
  professional,
  baseUrl,
}: ProfessionalProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "about", label: "About Me" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "experience", label: "Experience" },
    { id: "reviews", label: "Reviews", count: professional.totalReviews },
    { id: "contact", label: "Contact" },
  ]

  const skills = Array.isArray(professional.skills) ? professional.skills : []
  const services = Array.isArray(professional.servicesOffered)
    ? professional.servicesOffered
    : []
  const portfolio = Array.isArray(professional.portfolio)
    ? professional.portfolio
    : []
  const experience = Array.isArray(professional.workExperience)
    ? professional.workExperience
    : []
  const education = Array.isArray(professional.education)
    ? professional.education
    : []
  const reviews = professional.reviews || []
  const techStack = Array.isArray(professional.techStack)
    ? professional.techStack
    : []

  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      value: professional.yearsExperience || "5+",
      label: "Years Experience",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      value: professional.projectsCompleted || "120+",
      label: "Projects Completed",
    },
    {
      icon: <Award className="w-5 h-5 text-blue-600" />,
      value: professional.happyClients || "80+",
      label: "Happy Clients",
    },
    {
      icon: <Headphones className="w-5 h-5 text-blue-600" />,
      value: "24/7",
      label: "Support",
    },
  ]

  const handleDownloadVCard = () => {
    const vcard = generateProfessionalVCard(professional, baseUrl)
    downloadVCard(vcard, professional.name.replace(/\s+/g, "_"))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${professional.name} - ${professional.professionalHeadline}`,
        url: `${baseUrl}/p/${professional.slug}`,
      })
    } else {
      navigator.clipboard.writeText(`${baseUrl}/p/${professional.slug}`)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {professional.aboutMe || "No about information available."}
                    </p>
                  </CardContent>
                </Card>

                {/* Skills */}
                {skills.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">My Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {skills.map((skill, index) => (
                        <SkillBar
                          key={index}
                          name={skill.name}
                          percentage={skill.percentage}
                        />
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Services */}
                {services.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Services I Offer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {services.slice(0, 4).map((service, index) => (
                          <ServiceCard key={index} {...service} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Portfolio */}
                {portfolio.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Portfolio Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {portfolio.slice(0, 4).map((item, index) => (
                          <PortfolioCard key={index} {...item} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Availability */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-medium text-slate-900">
                        {professional.availability || "Available for new projects"}
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Typical Response Time</p>
                      <p className="text-slate-900">
                        {professional.responseTime || "Within a few hours"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <ContactCard
                  address={professional.location}
                  phone={professional.phone}
                  email={professional.email}
                  website={professional.website}
                />

                {/* QR Code */}
                <QRCodeSection
                  qrCodeUrl={professional.qrCodeUrl}
                  profileUrl={`${baseUrl}/p/${professional.slug}`}
                  onDownload={handleDownloadVCard}
                  onShare={handleShare}
                />

                {/* Social Links */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Connect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SocialLinks
                      facebook={professional.facebook}
                      twitter={professional.twitter}
                      instagram={professional.instagram}
                      linkedin={professional.linkedin}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "about":
        return (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {professional.aboutMe || "No about information available."}
                  </p>
                </CardContent>
              </Card>

              {/* Education */}
              {education.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EducationCard education={education} />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <ContactCard
                address={professional.location}
                phone={professional.phone}
                email={professional.email}
                website={professional.website}
              />
            </div>
          </div>
        )

      case "services":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Services I Offer</CardTitle>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">
                  No services listed yet.
                </p>
              )}
            </CardContent>
          </Card>
        )

      case "portfolio":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((item, index) => (
                    <PortfolioCard key={index} {...item} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">
                  No portfolio items yet.
                </p>
              )}
            </CardContent>
          </Card>
        )

      case "experience":
        return (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExperienceTimeline experiences={experience} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills.map((skill, index) => (
                    <SkillBar
                      key={index}
                      name={skill.name}
                      percentage={skill.percentage}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "reviews":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>
                Reviews ({professional.totalReviews})
                {professional.averageRating > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    <Star className="w-4 h-4 inline fill-yellow-400 text-yellow-400 mr-1" />
                    {professional.averageRating.toFixed(1)} average
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} {...review} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">
                  No reviews yet. Be the first to leave a review!
                </p>
              )}
            </CardContent>
          </Card>
        )

      case "contact":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <ContactCard
              address={professional.location}
              phone={professional.phone}
              email={professional.email}
              website={professional.website}
            />

            <QRCodeSection
              qrCodeUrl={professional.qrCodeUrl}
              profileUrl={`${baseUrl}/p/${professional.slug}`}
              onDownload={handleDownloadVCard}
              onShare={handleShare}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <PublicPageHeader
        variant="solid"
        showSidebarToggle={true}
        showCategorySlider={false}
      />

      {/* Hero Section - Outside container so banner extends to top */}
      <div className="max-w-[1440px] mx-auto border-r border-l border-slate-200">
        <ProfileHero
          type="professional"
          name={professional.name}
          headline={professional.professionalHeadline}
          avatar={professional.profilePicture}
          banner={professional.banner}
          location={professional.location}
          rating={professional.averageRating}
          reviewCount={professional.totalReviews}
          isVerified={professional.isVerified}
          techStack={techStack}
          availability={professional.availability}
          stats={stats.map((s) => ({
            icon: "briefcase",
            value: s.value,
            label: s.label,
          }))}
          onShare={handleShare}
          onMessage={() => setActiveTab("contact")}
          onDownloadVCard={handleDownloadVCard}
        />
      </div>

      {/* Main Content Container with padding for header */}
      <div className="max-w-[1440px] mx-auto border-r border-l border-slate-200">
        {/* Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-30">
          <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Sticky CTA */}
      <StickyCTA
        type="professional"
        phone={professional.phone}
        onMessage={() => setActiveTab("contact")}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
