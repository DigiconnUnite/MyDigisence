'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import UnifiedPublicLayout from '@/components/UnifiedPublicLayout'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Coffee,
  ShoppingCart,
  Heart,
  GraduationCap,
  Code,
  ChefHat,
  Truck,
  Calculator,
  Building,
  Hammer,
  Home,
  Camera,
  Scale,
  Megaphone,
  Plane,
  Cog,
  Users,
  Loader2
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  category: {
    name: string
  } | null
  products: {
    id: string
  }[]
}

interface Category {
  id: string
  name: string
  slug: string
}

const businessCategories = [
  { name: 'IT Services', icon: Code },
  { name: 'Restaurant', icon: ChefHat },
  { name: 'Digital Marketing', icon: Megaphone },
  { name: 'Travel Agency', icon: Plane },
  { name: 'Shop', icon: ShoppingBag },
  { name: 'Hotel', icon: Building },
  { name: 'Cafe', icon: Coffee },
  { name: 'Retail', icon: ShoppingCart },
  { name: 'Healthcare', icon: Heart },
  { name: 'Education', icon: GraduationCap },
  { name: 'Automotive', icon: Truck },
  { name: 'Real Estate', icon: Home },
  { name: 'Construction', icon: Hammer },
  { name: 'Consulting', icon: Users },
  { name: 'Manufacturing', icon: Cog },
  { name: 'Finance', icon: Calculator },
  { name: 'Legal', icon: Scale },
  { name: 'Photography', icon: Camera }
]

function BusinessesContent() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  useEffect(() => {
    fetchBusinesses()
    fetchCategories()
  }, [])

  // Debounced search handler
  const debouncedSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  // Update URL when search term stabilizes
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set('q', searchTerm)
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, router, searchParams])

  useEffect(() => {
    const filtered = businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || business.category?.name === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredBusinesses(filtered)
  }, [businesses, searchTerm, selectedCategory])

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/businesses')
      if (response.ok) {
        const data = await response.json()
        setBusinesses(data.businesses)
        setFilteredBusinesses(data.businesses)
      } else {
        console.error('Failed to fetch businesses')
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return (
    <UnifiedPublicLayout
      variant="solid"
      sidebarVariant="businesses"
      showCategorySlider={true}
      categories={businessCategories}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
    >
      <div className="bg-slate-200">
        {/* Hero Banner */}
        <section className="">
          <div className=" mx-auto">
            <div
              className=" relative py-20 md:py-30 h-fit overflow-hidden bg-cover bg-center bg-no-repeat aspect-4/2 md:aspect-4/1  flex items-center justify-start pl-4 sm:pl-6 md:pl-12 lg:pl-16"
              style={{ backgroundImage: "url('/footer-bg.jpg')" }}
            >
              <div className="relative z-10 text-white max-w-xs sm:max-w-md">
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
                  Find Top <br /> Businesses
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6">
                  Discover amazing businesses and explore their products.
                </p>
                {/* Search Bar Inside Banner */}
                <div className="w-full  relative max-w-md">
                  <Search className="absolute left-3  top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="pl-10 pr-24 py-2 sm:py-3 rounded-full border border-white/20 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 transform  -translate-y-1/2  rounded-full bg-slate-800 hover:bg-slate-700 text-white px-4"
                    onClick={() => debouncedSearch(searchTerm)}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <img
                src="/pr-banner-shape.png"
                alt=""
                className="absolute -bottom-5 right-0 w-auto h-3/4 sm:h-4/5 md:h-full opacity-80"
              />
            </div>
          </div>
        </section>

        {/* Business Cards Section */}
        <section className="pb-16 sm:pb-20 px-3 sm:px-4 md:px-6 lg:px-8 mt-8 md:mt-12">
          <div className=" mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border rounded-2xl bg-white flex flex-col h-full relative"
                  >
                    {/* Skeleton Layout Matching New Design */}
                    <div className="p-3 sm:p-4 flex flex-col h-full relative z-10 pointer-events-none">
                      <div className="flex items-center space-x-3 mb-3">
                        <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2 mb-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <div className="mt-auto pt-2">
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  {searchTerm
                    ? "No businesses found"
                    : "No businesses available"}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for new businesses"}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {searchTerm
                      ? `Search Results (${filteredBusinesses.length})`
                      : `All Businesses (${filteredBusinesses.length})`}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                  {filteredBusinesses.map((business) => (
                    <Card
                      key={business.id}
                      className="group overflow-hidden  p-0 border border-slate-500/50  hover:border-slate-800 rounded-3xl bg-white backdrop-blur-sm flex flex-col h-full relative transition-colors"
                    >
                      {/* Invisible Link Overlay - Makes the whole card clickable */}
                      <Link
                        href={`/catalog/${business.slug}`}
                        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
                        aria-label={`View details for ${business.name}`}
                        onClick={() => setLoadingCardId(business.id)}
                      />

                      {/* Loading Overlay */}
                      {loadingCardId === business.id && (
                        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                            <span className="text-sm text-slate-600 font-medium">Loading...</span>
                          </div>
                        </div>
                      )}

                      <div className="relative z-10 flex flex-col h-full p-3 sm:p-4 pointer-events-none">
                        {/* Header Section */}
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                          <div className="shrink-0">
                            {business.logo ? (
                              <img
                                src={getOptimizedImageUrl(business.logo, {
                                  width: 80,
                                  height: 80,
                                  quality: 90,
                                  format: "auto",
                                  crop: "fill",
                                  gravity: "center",
                                })}
                                alt={business.name}
                                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border border-slate-100 shadow-sm"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-slate-200 flex items-center justify-center border border-slate-100">
                                <Building2 className="h-7 w-7 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate leading-tight  transition-colors">
                              {business.name}
                            </h3>
                            {business.category && (
                              <Badge
                                variant="secondary"
                                className="mt-1.5 text-[10px] sm:text-xs bg-slate-100 text-slate-600 border-transparent px-2 py-0 h-5 inline-flex"
                              >
                                {business.category.name}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Description & Address Section */}
                        <div className="flex-1 space-y-2 mb-3">
                          {business.description && (
                            <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-snug">
                              {business.description}
                            </p>
                          )}
                          <div className="flex"></div>
                          {business.address && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="" title={business.address}>
                                {business.address}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1.5 sm:gap-2 mt-auto pt-2 pointer-events-auto">
                          {business.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-full text-[10px] sm:text-xs h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-none"
                              asChild
                            >
                              <a href={`tel:${business.phone}`}>
                                <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                <span className="truncate">Call</span>
                              </a>
                            </Button>
                          )}
                          {business.phone && (
                            <Button
                              size="sm"
                              className="flex-1 rounded-full shadow-none text-[10px] sm:text-xs h-9 bg-green-600 hover:bg-green-700 text-white border-green-600  transition-colors"
                              asChild
                            >
                              <a
                                href={`https://wa.me/${business.phone.replace(
                                  /[^0-9]/g,
                                  "",
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaWhatsapp className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                <span className="truncate">WhatsApp</span>
                              </a>
                            </Button>
                          )}
                          {business.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-full shadow-none text-[10px] sm:text-xs h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors "
                              asChild
                            >
                              <a href={`mailto:${business.email}`}>
                                <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                <span className="truncate">Email</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </UnifiedPublicLayout>
  );
}

function BusinessesLoading() {
  return (
    <UnifiedPublicLayout 
      variant="solid" 
      sidebarVariant="businesses"
      showCategorySlider={true}
      categories={businessCategories}
      selectedCategory={null}
      onCategorySelect={() => {}}
    >
      <div className="bg-slate-200 min-h-screen">
        <section className="">
          <div className=" mx-auto">
            <div className="relative overflow-hidden  bg-linear-to-r from-slate-950 to-cyan-800 aspect-4/2 md:aspect-4/1  flex items-center justify-start pl-4 sm:pl-6 md:pl-12 lg:pl-16">
              <div className="relative z-10 text-white max-w-xs sm:max-w-md">
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
                  Find Top <br /> Businesses
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6">
                  Discover amazing businesses and explore their products.
                </p>
              </div>
              <img
                src="/pr-banner-shape.png"
                alt=""
                className="absolute bottom-0 right-0 w-auto h-3/4 sm:h-4/5 md:h-full opacity-80"
              />
            </div>
          </div>
        </section>
      </div>
    </UnifiedPublicLayout>
  )
}

export default function BusinessesPage() {
  return (
    <Suspense fallback={<BusinessesLoading />}>
      <BusinessesContent />
    </Suspense>
  )
}
