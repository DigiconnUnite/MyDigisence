"use client"

import { useEffect, useState, type FormEvent } from "react"
import type { BusinessProfile, Review } from "@/types/profile"
import ProfileHero from "./ProfileHero"
import ProfileTabs from "./ProfileTabs"
import StatCard from "./StatCard"
import ServiceCard from "./ServiceCard"
import ReviewCard from "./ReviewCard"
import QRCodeSection from "./QRCodeSection"
import ContactCard from "./ContactCard"
import SocialLinks from "./SocialLinks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [reviewState, setReviewState] = useState(() => ({
    reviews: business.reviews || [],
    totalReviews: business.totalReviews,
    averageRating: business.averageRating,
  }))
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    authorName: "",
    title: "",
    content: "",
  })
  const [reviewError, setReviewError] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "menu", label: "Menu/Products" },
    { id: "photos", label: "Photos" },
    { id: "reviews", label: "Reviews", count: reviewState.totalReviews },
    { id: "about", label: "About" },
    { id: "highlights", label: "Highlights" },
  ]

  const services = Array.isArray(business.servicesList)
    ? business.servicesList
    : []
  const products = business.products || []
  const reviews = reviewState.reviews || []
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
      value: reviewState.averageRating.toFixed(1),
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

  useEffect(() => {
    if (!business.slug) {
      return
    }

    const key = `business-viewed-${business.slug}`
    const now = Date.now()
    const lastView = localStorage.getItem(key)

    if (lastView && now - Number(lastView) < 24 * 60 * 60 * 1000) {
      return
    }

    fetch("/api/business/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: business.slug }),
    }).finally(() => {
      localStorage.setItem(key, String(now))
    })
  }, [business.slug])

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setReviewError("")

    if (!reviewForm.authorName.trim() || !reviewForm.content.trim()) {
      setReviewError("Please provide your name and review message.")
      return
    }

    setSubmittingReview(true)

    const response = await fetch("/api/business/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: business.slug,
        rating: reviewForm.rating,
        title: reviewForm.title.trim() || undefined,
        content: reviewForm.content.trim(),
        authorName: reviewForm.authorName.trim(),
      }),
    })

    const result = await response.json().catch(() => null)
    setSubmittingReview(false)

    if (!response.ok || !result?.review) {
      setReviewError(result?.error || "Unable to submit review. Please try again.")
      return
    }

    const newReview: Review = {
      id: result.review.id,
      rating: result.review.rating,
      title: result.review.title || undefined,
      content: result.review.content,
      authorName: result.review.authorName,
      authorImage: result.review.authorImage || undefined,
      isVerified: result.review.isVerified || false,
      createdAt: result.review.createdAt,
    }

    setReviewState((prev) => ({
      reviews: [newReview, ...prev.reviews],
      totalReviews: result.stats?.totalReviews ?? prev.totalReviews + 1,
      averageRating: result.stats?.averageRating ?? prev.averageRating,
    }))

    setReviewForm({
      rating: 5,
      authorName: "",
      title: "",
      content: "",
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Card */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">About {business.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => setActiveTab("about")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed line-clamp-3">
                      {business.about || business.description || "No description available."}
                    </p>
                    {(business.about || business.description) && ((business.about?.length ?? 0) > 200 || (business.description?.length ?? 0) > 200) && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-blue-600 p-0 h-auto mt-2"
                        onClick={() => setActiveTab("about")}
                      >
                        Read more
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Services Card */}
                {services.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Our Services</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveTab("services")}
                      >
                        View All ({services.length})
                      </Button>
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

                {/* Products/Menu Card */}
                {products.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Menu & Products</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveTab("menu")}
                      >
                        View All ({products.length})
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {products.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="group cursor-pointer"
                            onClick={() => setActiveTab("menu")}
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

                {/* Photo Gallery Card */}
                {portfolio.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Photo Gallery</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveTab("photos")}
                      >
                        View All ({portfolio.length})
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {portfolio.slice(0, 4).map((item, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg bg-slate-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setActiveTab("photos")}
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

                {/* Portfolio/Projects Card */}
                {highlights.length > 0 && (
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Projects & Highlights</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveTab("highlights")}
                      >
                        View All ({highlights.length})
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {highlights.slice(0, 4).map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => setActiveTab("highlights")}
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
                    </CardContent>
                  </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </div>

                {/* Trust Badges */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Why Choose Us</CardTitle>
                  </CardHeader>
                  <CardContent>
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card className="border-slate-800 bg-zinc-50 border-2">
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
                    
                    {/* Social Links - Integrated into Contact Card */}
                    {(business.facebook || business.twitter || business.instagram || business.linkedin) && (
                      <div className="pt-4 border-t border-slate-500">
                        <p className="text-sm font-medium text-slate-700 mb-3">Follow Us</p>
                        <div className="flex flex-wrap gap-2">
                          <SocialLinks
                            facebook={business.facebook}
                            twitter={business.twitter}
                            instagram={business.instagram}
                            linkedin={business.linkedin}
                            className="gap-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

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

                {/* Share Profile */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Share & Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Business Hours */}
                    {hours.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 mb-2">Business Hours</p>
                        {hours.slice(0, 3).map((hour, index) => (
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
                        {hours.length > 3 && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-blue-600 p-0 h-auto"
                            onClick={() => setActiveTab("about")}
                          >
                            View All Hours
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {/* Share Options */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
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
                Reviews ({reviewState.totalReviews})
                {reviewState.averageRating > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    <Star className="w-4 h-4 inline fill-yellow-400 text-yellow-400 mr-1" />
                    {reviewState.averageRating.toFixed(1)} average
                  </span>
                )}
                {business.admin?.name && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    | Admin: {business.admin.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="mb-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Your Name
                    </label>
                    <Input
                      value={reviewForm.authorName}
                      onChange={(event) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          authorName: event.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={reviewForm.rating === value ? "default" : "outline"}
                          className="h-9 w-9 p-0"
                          onClick={() =>
                            setReviewForm((prev) => ({
                              ...prev,
                              rating: value,
                            }))
                          }
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Review Title (Optional)
                  </label>
                  <Input
                    value={reviewForm.title}
                    onChange={(event) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Share a headline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Your Review
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    rows={4}
                    value={reviewForm.content}
                    onChange={(event) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        content: event.target.value,
                      }))
                    }
                    placeholder="Share your experience"
                  />
                </div>
                {reviewError && (
                  <p className="text-sm text-red-600">{reviewError}</p>
                )}
                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>

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
      <div className="max-w-[1440px] mx-auto border-r border-l border-slate-200 pt-14 md:pt-16">
        <ProfileHero
          type="business"
          name={business.name}
          subtitle={business.category?.name}
          avatar={business.logo}
          banner={business.banner}
          heroContent={business.heroContent}
          location={business.address}
          rating={reviewState.averageRating}
          reviewCount={reviewState.totalReviews}
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
          adminName={business.admin?.name}
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto border-r border-l border-slate-200">
        {/* Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-30">
          <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 py-8 pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
