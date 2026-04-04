'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getOptimizedImageUrl, handleImageError, isValidImageUrl } from '@/lib/image-utils'
import Aurora from '@/components/Aurora'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Search,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Eye,
  ArrowRight,
  ImageIcon,
  Code,
  Stethoscope,
  Scale,
  Hammer,
  GraduationCap,
  Palette,
  TrendingUp,
  Briefcase,
  Camera,
  ChefHat,
  Pill,
  Wrench,
  Truck,
  UserCheck,
  Loader2
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import UnifiedPublicLayout from '@/components/UnifiedPublicLayout'

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
}

interface Category {
  id: string
  name: string
  slug: string
}

const professions = [
  { name: 'Developer', icon: Code },
  { name: 'Doctor', icon: Stethoscope },
  { name: 'Lawyer', icon: Scale },
  { name: 'Engineer', icon: Hammer },
  { name: 'Teacher', icon: GraduationCap },
  { name: 'Accountant', icon: TrendingUp },
  { name: 'Designer', icon: Palette },
  { name: 'Marketer', icon: TrendingUp },
  { name: 'Consultant', icon: Briefcase },
  { name: 'Photographer', icon: Camera },
  { name: 'Chef', icon: ChefHat },
  { name: 'Manager', icon: UserCheck },
  { name: 'Architect', icon: Hammer },
  { name: 'Nurse', icon: Stethoscope },
  { name: 'Pharmacist', icon: Pill },
  { name: 'Electrician', icon: Wrench },
  { name: 'Plumber', icon: Wrench },
  { name: 'Driver', icon: Truck }
]

function ProfessionalsContent() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
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
    fetchProfessionals()
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
    const filtered = professionals.filter(professional => {
      const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.professionalHeadline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || professional.professionalHeadline === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredProfessionals(filtered)
  }, [professionals, searchTerm, selectedCategory])

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/professionals')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched professionals data:', data.professionals)
        setProfessionals(data.professionals)
        setFilteredProfessionals(data.professionals)
      } else {
        console.error('Failed to fetch professionals')
      }
    } catch (error) {
      console.error('Error fetching professionals:', error)
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
      sidebarVariant="professionals"
      showCategorySlider={true}
      categories={professions}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
    >
      <div className="bg-slate-200">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/footer-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/70 to-slate-900/35" />

          <div className="container relative z-10 mx-auto px-3  sm:px-4 md:px-6 lg:px-8 ">
            <div className="relative overflow-hidden rounded-3xl  min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-start px-4 sm:px-8 md:px-12 lg:px-16">
              <div className="relative z-10 text-white max-w-xs sm:max-w-md md:max-w-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">
                  Find Top <br /> Professionals
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-slate-100/95">
                  Connect with skilled professionals in your area.
                </p>

                <div className="w-full relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    type="text"
                    placeholder="Search professionals..."
                    value={searchTerm}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="pl-10 pr-24 py-2 sm:py-3 rounded-full border border-white/20 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-800 hover:bg-slate-700 text-white px-4"
                    onClick={() => debouncedSearch(searchTerm)}
                  >
                    Search
                  </Button>
                </div>
              </div>

              <img
                src="/pr-banner-shape.png"
                alt=""
                className="absolute -bottom-6 right-0 w-auto h-3/4 sm:h-4/5 md:h-full opacity-75 pointer-events-none"
              />
            </div>
          </div>
        </section>

        {/* Professional Cards Section */}
        <section className="container mx-auto pb-16 sm:pb-20 px-3 sm:px-4 md:px-6 lg:px-8 mt-8 md:mt-12">
          <div className=" mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden py-0 rounded-3xl bg-white backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-24 md:h-32 m-1.5 mb-0 pb-0 rounded-lg overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <Skeleton className="absolute top-28 md:top-32 left-4 h-18 w-18 md:h-22 md:w-22 rounded-full" />
                    <CardHeader className="pt-8 pb-2 md:pb-4">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="w-18 md:w-22"></div>
                        <div className="flex-1">
                          <Skeleton className="h-4 w-20 sm:w-24 md:w-28 mb-2" />
                          <Skeleton className="h-3 w-16 sm:w-20" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-4 px-4 sm:px-6">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4 mb-2 sm:mb-4" />
                      <div className="flex gap-2 mb-2 sm:mb-4">
                        <Skeleton className="h-8 w-full rounded-full" />
                        <Skeleton className="h-8 w-full rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProfessionals.length === 0 ? (
              <div className="text-center py-16">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  {searchTerm
                    ? "No professionals found"
                    : "No professionals available"}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for new professionals"}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {searchTerm
                      ? `Search Results (${filteredProfessionals.length})`
                      : `All Professionals (${filteredProfessionals.length})`}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProfessionals.map((professional) => (
                    <Link
                      key={professional.id}
                      href={`/pcard/${professional.slug}`}
                      className="group block h-full"
                      onClick={() => setLoadingCardId(professional.id)}
                    >
                      <Card className="relative h-full overflow-hidden  py-0 rounded-2xl border border-slate-400/90 bg-white/95 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400/80 hover:shadow-none">
                        {/* Loading Overlay */}
                        {loadingCardId === professional.id && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                              <span className="text-sm text-slate-600 font-medium">
                                Loading...
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-1.5 pb-0">
                          <div className="relative z-0 h-24 overflow-hidden rounded-xl sm:h-28 md:h-32">
                            {professional.banner ? (
                              <img
                                src={professional.banner}
                                alt="Banner"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Banner image failed to load:",
                                    professional.banner,
                                  );
                                  handleImageError(e);
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-linear-to-r from-slate-100 to-slate-200">
                                <div className="text-center text-gray-400">
                                  <ImageIcon className="h-10 mx-auto w-10 text-gray-400" />
                                  <div className="text-sm">No banner</div>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/35 via-slate-900/10 to-transparent" />
                          </div>
                        </div>

                        <div className="relative z-10 p-3 sm:p-4">
                          <div className="-mt-10 mb-3 flex items-end justify-between sm:-mt-12">
                            {professional.profilePicture ? (
                              <img
                                src={professional.profilePicture}
                                alt={professional.name}
                                className="relative z-20 h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
                                loading="lazy"
                                onError={(e) => {
                                  console.error(
                                    "Profile picture failed to load:",
                                    professional.profilePicture,
                                  );
                                  handleImageError(e);
                                }}
                              />
                            ) : (
                              <div className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-slate-200 to-slate-300 shadow-md sm:h-24 sm:w-24">
                                <User className="h-9 w-9 text-slate-600 sm:h-10 sm:w-10" />
                              </div>
                            )}

                            {professional.location && (
                              <div className="mb-1 inline-flex max-w-[58%] items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:max-w-[60%] sm:text-xs">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                                <span
                                  className="truncate"
                                  title={professional.location}
                                >
                                  {professional.location}
                                </span>
                              </div>
                            )}
                          </div>

                          <CardHeader className="p-0 pb-3">
                            <div className="min-w-0">
                              <CardTitle className="truncate text-base font-bold text-slate-800 transition-colors group-hover:text-slate-950 sm:text-lg">
                                {professional.name}
                              </CardTitle>
                              {professional.professionalHeadline && (
                                <Badge
                                  variant="secondary"
                                  className="mt-2 inline-flex max-w-full truncate border-transparent bg-slate-100 px-2.5 py-0 text-[11px] font-medium text-slate-600 sm:text-xs"
                                >
                                  {professional.professionalHeadline}
                                </Badge>
                              )}
                            </div>

                            {professional.aboutme ? (
                              <CardDescription className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                                {professional.aboutme}
                              </CardDescription>
                            ) : (
                              <CardDescription className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                                Explore this professional&apos;s profile,
                                services, and contact details.
                              </CardDescription>
                            )}
                          </CardHeader>

                          <CardContent className="space-y-3 p-0">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
                              {professional.phone && (
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-600">
                                  Phone available
                                </span>
                              )}
                              {professional.email && (
                                <span className="rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-600">
                                  Email available
                                </span>
                              )}
                              {professional.website && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-600">
                                  <Globe className="h-3 w-3" />
                                  Website
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2 pt-1">
                              {professional.phone && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 flex-1 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 shadow-none transition-colors hover:bg-slate-50 hover:text-slate-900 sm:text-xs"
                                  asChild
                                >
                                  <a
                                    href={`tel:${professional.phone}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="mr-1 h-3.5 w-3.5" />
                                    <span className="truncate">Call</span>
                                  </a>
                                </Button>
                              )}
                              {professional.phone && (
                                <Button
                                  size="sm"
                                  className="h-9 flex-1 rounded-full border-green-600 bg-green-600 text-[11px] text-white shadow-none transition-colors hover:bg-green-700 sm:text-xs"
                                  asChild
                                >
                                  <a
                                    href={`https://wa.me/${professional.phone.replace(
                                      /[^0-9]/g,
                                      "",
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaWhatsapp className="mr-1 h-3.5 w-3.5" />
                                    <span className="truncate">WhatsApp</span>
                                  </a>
                                </Button>
                              )}
                              {professional.email && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 flex-1 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 shadow-none transition-colors hover:bg-slate-50 hover:text-slate-900 sm:text-xs"
                                  asChild
                                >
                                  <a
                                    href={`mailto:${professional.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Mail className="mr-1 h-3.5 w-3.5" />
                                    <span className="truncate">Email</span>
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
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

function ProfessionalsLoading() {
  return (
    <UnifiedPublicLayout
      variant="solid"
      sidebarVariant="professionals"
      showCategorySlider={true}
      categories={professions}
      selectedCategory={null}
      onCategorySelect={() => {}}
    >
      <div className="bg-slate-200 min-h-screen">
        <section className="">
          <div className=" mx-auto">
            <div className="relative overflow-hidden  bg-linear-to-r from-slate-950 to-cyan-800 aspect-4/2 md:aspect-4/1  flex items-center justify-start pl-4 sm:pl-6 md:pl-12 lg:pl-16">
              <div className="relative z-10 text-white max-w-xs sm:max-w-md">
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
                  Find Top <br /> Professionals
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6">
                  Connect with skilled professionals in your area.
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

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<ProfessionalsLoading />}>
      <ProfessionalsContent />
    </Suspense>
  )
}
