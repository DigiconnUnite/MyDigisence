'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import UnifiedPublicLayout from '@/components/UnifiedPublicLayout'
import { WavyBackground } from '@/components/WavyBackground'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Building2,
  User,
  MapPin,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Users,
  MessageCircle,
  Eye,
  Filter
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
  type: 'business'
  createdAt: string
}

interface Professional {
  id: string
  name: string
  slug: string
  professionalHeadline: string | null
  profilePicture: string | null
  banner: string | null
  location: string | null
  phone: string | null
  email: string | null
  website: string | null
  aboutme: string | null
  type: 'professional'
  createdAt: string
}

type Listing = (Business | Professional) & {
  rating: number
  reviewCount: number
  status: string
}

const marketplaceCategories = [
  { name: 'All Listings', icon: LayoutGrid, filter: 'all' },
  { name: 'Businesses', icon: Building2, filter: 'business' },
  { name: 'Professionals', icon: User, filter: 'professional' },
]

const sortOptions = [
  { name: 'Featured First', value: 'featured' },
  { name: 'Newest', value: 'newest' },
  { name: 'Name A-Z', value: 'name_asc' },
  { name: 'Name Z-A', value: 'name_desc' },
]

// Generate mock rating for visual completeness
const generateRating = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (3.5 + (hash % 15) / 10)
}

// Generate mock review count
const generateReviewCount = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return 10 + (hash % 90)
}

// Generate status based on type
const generateStatus = (type: string) => {
  return type === 'business' ? 'Open Now' : 'Available'
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

function MarketplaceContent() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null)
  const [location, setLocation] = useState('Agra, Uttar Pradesh')
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [businessesRes, professionalsRes] = await Promise.all([
        fetch('/api/businesses'),
        fetch('/api/professionals')
      ])

      let businessesData: Business[] = []
      let professionalsData: Professional[] = []

      if (businessesRes.ok) {
        const bData = await businessesRes.json()
        businessesData = (bData.businesses || []).map((b: any) => ({ ...b, type: 'business' as const }))
      }

      if (professionalsRes.ok) {
        const pData = await professionalsRes.json()
        professionalsData = (pData.professionals || []).map((p: any) => ({ ...p, type: 'professional' as const }))
      }

      setBusinesses(businessesData)
      setProfessionals(professionalsData)

      // Combine and enhance with mock data
      const combined: Listing[] = [
        ...businessesData.map(b => ({
          ...b,
          rating: generateRating(b.id),
          reviewCount: generateReviewCount(b.id),
          status: generateStatus('business')
        })),
        ...professionalsData.map(p => ({
          ...p,
          rating: generateRating(p.id),
          reviewCount: generateReviewCount(p.id),
          status: generateStatus('professional')
        }))
      ]

      setListings(combined)
      setFeaturedListings(combined.slice(0, 4))
      setFilteredListings(combined)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search handler with proper implementation
  const debouncedSearchHandler = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    []
  )

  // Filter and sort listings
  useEffect(() => {
    let filtered = listings

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => {
        const name = item.name.toLowerCase()
        const desc = ('description' in item ? item.description : 'aboutme' in item ? item.aboutme : '')?.toLowerCase() || ''
        const category = ('category' in item ? item.category?.name : 'professionalHeadline' in item ? item.professionalHeadline : '')?.toLowerCase() || ''
        const location = ('address' in item ? item.address : 'location' in item ? item.location : '')?.toLowerCase() || ''
        return name.includes(term) || desc.includes(term) || category.includes(term) || location.includes(term)
      })
    }

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter)
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => {
        if ('category' in item && item.category) {
          return item.category.name === selectedCategory
        }
        if ('professionalHeadline' in item && item.professionalHeadline) {
          return item.professionalHeadline.includes(selectedCategory)
        }
        return false
      })
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'name_asc':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'featured':
      default:
        // Keep original order (featured first)
        break
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, activeFilter, selectedCategory, sortBy])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  if (!mounted) {
    return <MarketplaceLoading />
  }

  return (
    <UnifiedPublicLayout
      variant="transparent"
      sidebarVariant="marketplace"
      showCategorySlider={false}
      categories={marketplaceCategories.slice(1).map(c => ({ name: c.name, icon: c.icon }))}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
    >
      <div className="min-h-screen  bg-slate-50">
        {/* Hero Search Section with Wavy Background */}
        <WavyBackground
          className="max-w-[1440px] mx-auto  pt-28 md:pt-36 pb-4 md:pb-6 px-4"
          containerClassName="min-h-[280px] bg-slate-900"
          colors={["#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#06b6d4"]}
          blur={10}
          speed="slow"
          waveOpacity={0.5}
          backgroundFill="#0f172a"
        >
          <div className="relative  z-10">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Text Section */}
              <div className="w-full lg:w-1/2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  Discover Businesses & Professionals
                </h1>
                <p className="text-slate-200 text-sm sm:text-base drop-shadow">
                  Explore verified profiles, connect instantly, and grow your network.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-lg p-2 shadow-lg">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for businesses, professionals..."
                      defaultValue={searchTerm}
                      onChange={(e) => debouncedSearchHandler(e.target.value)}
                      className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <div className="relative min-w-[140px]">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option>Agra, Uttar Pradesh</option>
                        <option>Delhi, NCR</option>
                        <option>Mumbai, Maharashtra</option>
                        <option>Bangalore, Karnataka</option>
                      </select>
                    </div>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6">
                      Search
                    </Button>
                  </div>
                  {/* Mobile view - all in same row */}
                  <div className="flex sm:hidden gap-2 items-center">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none"
                      >
                        <option>Agra, Uttar Pradesh</option>
                        <option>Delhi, NCR</option>
                        <option>Mumbai, Maharashtra</option>
                        <option>Bangalore, Karnataka</option>
                      </select>
                    </div>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white p-2">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WavyBackground>
        {/* Main Content */}
        <div className="max-w-[1440px] mx-auto border-r border-l border-gray-200 px-4 pt-0 sm:pt-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Hidden on mobile, shown on lg */}
            <aside className="hidden lg:block w-64 flex-shrink-0 self-stretch">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto">
                {/* Navigation Section */}
                <nav className="space-y-1">
                  {marketplaceCategories.map((cat) => {
                    const Icon = cat.icon
                    const isActive = activeFilter === cat.filter
                    const count = cat.filter === 'all' ? listings.length :
                      cat.filter === 'business' ? businesses.length :
                        professionals.length
                    return (
                      <button
                        key={cat.filter}
                        onClick={() => setActiveFilter(cat.filter)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                          isActive
                            ? "bg-slate-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cat.name}
                        </span>
                        <span className={cn(
                          "text-xs",
                          isActive ? "text-white/70" : "text-gray-400"
                        )}>({count})</span>
                      </button>
                    )
                  })}
                </nav>

                {/* Categories Section */}
                <div className="pt-6 mt-6 border-t h-auto border-gray-200">
                  <div className="flex items-center px-3 mb-3">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categories
                    </span>
                  </div>
                  <div className="space-y-1 max-h-auto overflow-y-auto">
                    {['IT Services', 'Digital Marketing', 'Education', 'Healthcare', 'Real Estate', 'Restaurant', 'Automotive', 'Consulting', 'Travel & Tourism', 'Beauty & Wellness'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(selectedCategory === cat ? null : cat)}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200",
                          selectedCategory === cat
                            ? "bg-slate-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters Section */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center px-3 mb-3">
                    <Filter className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Filters
                    </span>
                  </div>
                  <div className="space-y-3 px-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Location</label>
                      <select className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500">
                        <option>Agra, Uttar Pradesh</option>
                        <option>All Locations</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        {sortOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Listings Area */}
            <main className="flex-1">
              {/* Results Header - Tab Style */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                  {[
                    { id: 'all', label: 'All', count: listings.length },
                    { id: 'business', label: 'Businesses', count: businesses.length },
                    { id: 'professional', label: 'Professionals', count: professionals.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        activeFilter === tab.id
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab.label}
                      <span className="text-gray-400 ml-1">({tab.count})</span>
                      {activeFilter === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex items-center gap-2"
                    onClick={() => {
                      const sidebar = document.getElementById('mobile-filters')
                      sidebar?.classList.toggle('hidden')
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-200"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:bg-gray-200"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              {isLoading ? (
                <div className={cn(
                  "grid gap-4",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
                )}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-9 flex-1" />
                          <Skeleton className="h-9 flex-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-4",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
                )}>
                  {filteredListings.map((item) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      viewMode={viewMode}
                      onClick={() => setLoadingCardId(item.id)}
                      isLoading={loadingCardId === item.id}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>

          {/* Mobile Filters Drawer */}
          <div id="mobile-filters" className="hidden lg:hidden mt-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Filters</span>
                <button
                  onClick={() => {
                    const sidebar = document.getElementById('mobile-filters')
                    sidebar?.classList.add('hidden')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown className="h-5 w-5 rotate-180" />
                </button>
              </div>
              {/* Navigation Section */}
              <nav className="space-y-1 mb-4">
                {marketplaceCategories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeFilter === cat.filter
                  const count = cat.filter === 'all' ? listings.length :
                    cat.filter === 'business' ? businesses.length :
                      professionals.length
                  return (
                    <button
                      key={cat.filter}
                      onClick={() => {
                        setActiveFilter(cat.filter)
                        document.getElementById('mobile-filters')?.classList.add('hidden')
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {cat.name}
                      </span>
                      <span className={cn(
                        "text-xs",
                        isActive ? "text-white/70" : "text-gray-400"
                      )}>({count})</span>
                    </button>
                  )
                })}
              </nav>
              {/* Categories */}
              <div className="pt-4 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Categories</span>
                <div className="flex flex-wrap gap-2">
                  {['IT Services', 'Digital Marketing', 'Education', 'Healthcare', 'Real Estate', 'Restaurant', 'Automotive', 'Consulting', 'Travel & Tourism', 'Beauty & Wellness'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategorySelect(selectedCategory === cat ? null : cat)
                        document.getElementById('mobile-filters')?.classList.add('hidden')
                      }}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full transition-colors duration-200",
                        selectedCategory === cat
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <section className="bg-white border-t">
          <div className="max-w-[1440px] border-r border-l py-12 mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Box Container */}
            <div className="border  rounded-xl overflow-hidden ">
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Card 1 */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Your Profile</h3>
                    <p className="text-sm text-gray-500 mt-1">Build your digital presence in minutes</p>

                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Share & Connect</h3>
                    <p className="text-sm text-gray-500 mt-1">Share your profile and grow your network</p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Get Discovered</h3>
                    <p className="text-sm text-gray-500 mt-1">Be found by the right people & opportunities</p>
                  </div>
                </div>
                {/* Join Card - Larger (spans 2 columns) */}
                <div className="md:col-span-2 bg-linear-to-r from-slate-700 to-slate-800 rounded-xl  p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1">Join Mydigisence Today</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">Create your profile and start your digital presence journey.</p>
                  </div>
                  <Button className="bg-white rounded-full hover:bg-blue-50 px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm flex-shrink-0" asChild>
                    <Link href="/register">Get Started Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UnifiedPublicLayout>
  )
}

// Featured Card Component
function FeaturedCard({ item, isLoading }: { item: Listing; isLoading: boolean }) {
  const isBusiness = item.type === 'business'
  const image = isBusiness ? (item as Business).logo : (item as Professional).banner
  const subtitle = isBusiness
    ? (item as Business).category?.name
    : (item as Professional).professionalHeadline

  return (
    <Card className="overflow-hidden group cursor-pointer border hover:shadow-lg transition-all duration-300">
      <div className="relative h-32 bg-gray-100">
        {image ? (
          <ImageWithFallback
            src={image}
            alt={item.name}
            className="w-full h-full object-cover"
            fallback={<FallbackIcon isBusiness={isBusiness} />}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            {isBusiness ? (
              <Building2 className="h-12 w-12 text-slate-300" />
            ) : (
              <User className="h-12 w-12 text-slate-300" />
            )}
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-600 text-white text-xs">
            <Star className="h-3 w-3 mr-1 fill-white" />
            {item.rating.toFixed(1)} ({item.reviewCount})
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs bg-white/90">
            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            {item.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{subtitle}</p>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">
            {'address' in item && item.address ? item.address :
              'location' in item && item.location ? item.location : 'Agra, Uttar Pradesh'}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {item.phone && (
            <>
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" asChild>
                <a href={`tel:${item.phone}`}>
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </a>
              </Button>
              <Button size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white" asChild>
                <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="h-3 w-3 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Image with fallback component
function ImageWithFallback({ src, alt, className, fallback }: {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  )
}

// Fallback icon component
function FallbackIcon({ isBusiness }: { isBusiness: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {isBusiness ? (
        <Building2 className="h-12 w-12 text-slate-300" />
      ) : (
        <User className="h-12 w-12 text-slate-300" />
      )}
    </div>
  )
}

// Listing Card Component
function ListingCard({ item, viewMode, onClick, isLoading }: { item: Listing; viewMode: 'grid' | 'list'; onClick: () => void; isLoading: boolean }) {
  const isBusiness = item.type === 'business'
  const image = isBusiness ? (item as Business).logo : (item as Professional).profilePicture
  const subtitle = isBusiness
    ? (item as Business).category?.name
    : (item as Professional).professionalHeadline
  const description = isBusiness
    ? (item as Business).description
    : (item as Professional).aboutme

  const href = isBusiness ? `/b/${item.slug}` : `/p/${item.slug}`

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md py-0 border border-slate-500/30 transition-all duration-300">
        <Link href={href} onClick={onClick} className="flex flex-row">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            </div>
          )}
          <div className="w-24 sm:w-40 h-24 sm:h-40 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {image ? (
              <ImageWithFallback
                src={image}
                alt={item.name}
                className="w-full h-full object-cover"
                fallback={<FallbackIcon isBusiness={isBusiness} />}
              />
            ) : (
              <FallbackIcon isBusiness={isBusiness} />
            )}
          </div>
          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">{item.name}</h3>
                  {subtitle && <p className="text-sm text-blue-600 truncate">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-1 text-sm flex-shrink-0">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{item.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({item.reviewCount})</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description || 'View profile for more details'}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <MapPin className="h-3 w-3" />
                {'address' in item && item.address ? item.address : 'location' in item && item.location ? item.location : 'Agra, Uttar Pradesh'}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {item.phone && (
                <>
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <a href={`tel:${item.phone}`} onClick={(e) => e.preventDefault()}>
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </a>
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
                      <FaWhatsapp className="h-3 w-3 mr-1" /> WhatsApp
                    </a>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" className="h-8 text-xs ml-auto" asChild>
                <span>
                  <Eye className="h-3 w-3 mr-1" /> View
                </span>
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  // Grid View - Horizontal card layout matching the image
  return (
    <Card className="overflow-hidden group hover:shadow-lg border border-slate-500/30 transition-all duration-300  p-0 relative  hover:border-gray-800">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
        </div>
      )}

      {/* Top section - Image + Details (Clickable area) */}
      <Link href={href} onClick={onClick} className="flex flex-row p-4 pb-2 block">
        {/* Left side - Image/Logo */}
        <div className="flex-shrink-0">
          {isBusiness ? (
            // Business Logo
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {image ? (
                <ImageWithFallback
                  src={image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  fallback={<FallbackIcon isBusiness={isBusiness} />}
                />
              ) : (
                <Building2 className="h-10 w-10 text-slate-300" />
              )}
            </div>
          ) : (
            // Professional Profile Picture
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-100">
              {(item as Professional).profilePicture ? (
                <ImageWithFallback
                  src={(item as Professional).profilePicture || ''}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  fallback={<FallbackIcon isBusiness={isBusiness} />}
                />
              ) : (
                <User className="h-10 w-10 text-slate-400" />
              )}
            </div>
          )}
        </div>

        {/* Right side - Details */}
        <div className="flex-1 pl-4">
          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-700">{item.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({item.reviewCount})</span>
            <span className="mx-1 text-gray-300">•</span>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {item.status}
            </span>
          </div>

          {/* Category/Profession */}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">
              {'address' in item && item.address ? item.address :
                'location' in item && item.location ? item.location : 'Agra, Uttar Pradesh'}
            </span>
          </div>
        </div>
      </Link>

      
      {/* Bottom section - Full width action buttons (Outside Link) */}
      <div className="grid grid-cols-2 border-t border-gray-100">
        {isBusiness ? (
          // Business buttons: Call, WhatsApp
          <>
            <a
              href={`tel:${item.phone}`}
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors border-r border-gray-100"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </a>
            {item.phone ? (
              <a
                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-2 py-3 text-sm text-green-600 hover:bg-gray-50 hover:text-green-700 transition-colors"
              >
                <FaWhatsapp className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <span className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400">
                <FaWhatsapp className="h-4 w-4" />
                <span>WhatsApp</span>
              </span>
            )}
          </>
        ) : (
          // Professional buttons: Message, View Profile
          <>
            <a
              href={`tel:${item.phone}`}
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors border-r border-gray-100"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Message</span>
            </a>
            <Link
              href={href}
              className="flex items-center justify-center gap-2 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </>
        )}
      </div>
    </Card>
  )
}

function MarketplaceLoading() {
  return (
    <UnifiedPublicLayout variant="solid" sidebarVariant="marketplace">
      <div className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12">
          <div className="max-w-[1440px] mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </section>
        <div className="max-w-[1440px] mx-auto px-4 py-6">
          <div className="flex gap-6">
            <Skeleton className="w-64 h-96 flex-shrink-0" />
            <div className="flex-1 grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnifiedPublicLayout>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  )
}