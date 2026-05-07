"use client"

import { useState } from "react"
import type { BusinessProfile } from "@/types/profile"
import ProfileHero from "./ProfileHero"
import ProfileTabs from "./ProfileTabs"
import StatCard from "./StatCard"
import ServiceCard from "./ServiceCard"
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
  Star,
  CheckCircle2,
  Award,
  Clock,
  Shield,
  Zap,
  MapPin,
  Phone,
  Mail,
  Globe,
  ImageIcon,
  ChevronRight,
} from "lucide-react"
import Footer from "@/components/Footer"
import { PublicPageHeader } from "@/components/UnifiedPublicLayout"

interface BusinessProfilePageProps {
  business: BusinessProfile
  baseUrl: string
}

export default function BusinessProfilePage({
  business,
  baseUrl,
}: BusinessProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "menu", label: "Menu/Products" },
    { id: "photos", label: "Photos" },
    { id: "reviews", label: "Reviews", count: business.totalReviews },
    { id: "about", label: "About" },
    { id: "highlights", label: "Highlights" },
  ]

  const services = Array.isArray(business.servicesList)
    ? business.servicesList
    : []
  const products = business.products || []
  const reviews = business.reviews || []
  const tags = Array.isArray(business.customTags) ? business.customTags : []
  const highlights = Array.isArray(business.highlights)
    ? business.highlights
    : []
  const portfolio = Array.isArray(business.portfolioContent)
    ? business.portfolioContent
    : []
  const hours = Array.isArray(business.openingHours)
    ? business.openingHours
    : []

  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      value: business.yearsInBusiness || "10+",
      label: "Years in Business",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      value: business.happyCustomers || "50K+",
      label: "Happy Customers",
    },
    {
      icon: <Award className="w-5 h-5 text-blue-600" />,
      value: business.teamSize || "25+",
      label: "Team Members",
    },
    {
      icon: <Star className="w-5 h-5 text-blue-600" />,
      value: business.averageRating.toFixed(1),
      label: "Rating",
    },
  ]

  const trustBadges = [
    { icon: <CheckCircle2 className="w-5 h-5" />, label: "Verified Business" },
    { icon: <Users className="w-5 h-5" />, label: `Trusted by ${business.happyCustomers || "50K+"} Customers` },
    { icon: <Award className="w-5 h-5" />, label: "High Quality Service" },
    { icon: <Zap className="w-5 h-5" />, label: "Quick Response" },
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: `${baseUrl}/b/${business.slug}`,
      })
    } else {
      navigator.clipboard.writeText(`${baseUrl}/b/${business.slug}`)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact & About Combined */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {business.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">{business.address}</p>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                          >
                            Get Directions <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-500" />
                        <a href={`tel:${business.phone}`} className="text-slate-900 hover:text-blue-600">
                          {business.phone}
                        </a>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <a href={`mailto:${business.email}`} className="text-slate-900 hover:text-blue-600">
                          {business.email}
                        </a>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-500" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-900 hover:text-blue-600"
                        >
                          {business.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* About */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About {business.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {business.about || business.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </div>

                {/* Services */}
                {services.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Our Services</CardTitle>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.slice(0, 6).map((service, index) => (
                          <ServiceCard key={index} {...service} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Trust Badges */}
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {trustBadges.map((badge, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="text-blue-600">{badge.icon}</span>
                          <span>{badge.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Menu/Products */}
                {products.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Featured Menu</CardTitle>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View Full Menu
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {products.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="group cursor-pointer"
                          >
                            <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden mb-2">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            {product.price && (
                              <p className="text-sm text-slate-500">
                                ₹{product.price}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Photo Gallery Preview */}
                {portfolio.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Photo Gallery</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => setActiveTab("photos")}
                      >
                        View All Photos
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {portfolio.slice(0, 8).map((item, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg bg-slate-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title || "Gallery image"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-slate-300" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Business Hours */}
                {hours.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Business Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {hours.map((hour, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-slate-600">{hour.day}</span>
                            <span
                              className={
                                hour.isClosed
                                  ? "text-red-500"
                                  : "text-slate-900"
                              }
                            >
                              {hour.isClosed ? "Closed" : `${hour.open} - ${hour.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* QR Code */}
                <QRCodeSection
                  qrCodeUrl={business.qrCodeUrl}
                  profileUrl={`${baseUrl}/b/${business.slug}`}
                  title="Scan to Connect"
                  description="Visit this business instantly by scanning"
                />

                {/* Social Connect */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Connect With Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SocialLinks
                      facebook={business.facebook}
                      twitter={business.twitter}
                      instagram={business.instagram}
                      linkedin={business.linkedin}
                    />
                  </CardContent>
                </Card>

                {/* Share Profile */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Share This Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleShare}>
                        Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "services":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
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

      case "menu":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Menu / Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="aspect-[4/3] bg-slate-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        {product.description && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        {product.price && (
                          <p className="font-medium text-slate-900 mt-2">
                            ₹{product.price}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">
                  No products or menu items available.
                </p>
              )}
            </CardContent>
          </Card>
        )

      case "photos":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {portfolio.map((item, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl bg-slate-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title || "Gallery image"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">No photos available.</p>
              )}
            </CardContent>
          </Card>
        )

      case "reviews":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>
                Reviews ({business.totalReviews})
                {business.averageRating > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    <Star className="w-4 h-4 inline fill-yellow-400 text-yellow-400 mr-1" />
                    {business.averageRating.toFixed(1)} average
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

      case "about":
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>About {business.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {business.about || business.description || "No description available."}
                </p>
              </CardContent>
            </Card>

            <ContactCard
              address={business.address}
              phone={business.phone}
              email={business.email}
              website={business.website}
              hours={hours.map((h) => ({
                day: h.day,
                time: h.isClosed ? "Closed" : `${h.open} - ${h.close}`,
                isOpen: !h.isClosed,
              }))}
            />
          </div>
        )

      case "highlights":
        return (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              {highlights.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-2xl">
                        {highlight.icon || "🏆"}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {highlight.value}
                        </p>
                        <p className="text-sm text-slate-500">{highlight.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">No highlights available.</p>
              )}
            </CardContent>
          </Card>
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
          type="business"
          name={business.name}
          subtitle={business.category?.name}
          avatar={business.logo}
          banner={business.banner || business.heroContent?.[0]?.image || portfolio[0]?.image}
          location={business.address}
          rating={business.averageRating}
          reviewCount={business.totalReviews}
          isVerified={business.isVerified}
          verifiedBadge={business.verifiedBadge || "Verified"}
          tags={tags}
          phone={business.phone}
          stats={stats.map((s) => ({
            icon: "briefcase",
            value: s.value,
            label: s.label,
          }))}
          onShare={handleShare}
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto border-r border-l border-slate-200">
        {/* Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-30">
          <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Sticky CTA */}
      <StickyCTA type="business" phone={business.phone} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
