'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Building2, User, ExternalLink, Star } from 'lucide-react'

interface SavedBusiness {
  id: string
  name: string
  slug: string
  description: string
  logo?: string
  category: string
  rating: number
  reviewsCount: number
  savedAt: string
}

interface SavedProfessional {
  id: string
  name: string
  slug: string
  professionalHeadline: string
  profilePicture?: string
  headline?: string
  rating: number
  reviewsCount: number
  savedAt: string
}

export default function UserSavedItems() {
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([])
  const [savedProfessionals, setSavedProfessionals] = useState<SavedProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'businesses' | 'professionals'>('businesses')

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true)
      // This would be replaced with actual API calls
      setTimeout(() => {
        setSavedBusinesses([])
        setSavedProfessionals([])
        setLoading(false)
      }, 1000)
    }

    fetchSavedItems()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Items</h2>
        <p className="text-gray-600">
          Businesses and professionals you've saved for quick access
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'businesses'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span className="font-medium">Businesses</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {savedBusinesses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('professionals')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'professionals'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="font-medium">Professionals</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {savedProfessionals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Businesses Tab */}
      {activeTab === 'businesses' && (
        <div>
          {savedBusinesses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved businesses</h3>
              <p className="text-gray-600 mb-6">
                Start exploring and save businesses you're interested in
              </p>
              <a
                href="/businesses"
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Browse Businesses
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {business.logo ? (
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Bookmark className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {business.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{business.rating}</span>
                      <span className="text-gray-400">({business.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Saved {new Date(business.savedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={`/b/${business.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      View
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Professionals Tab */}
      {activeTab === 'professionals' && (
        <div>
          {savedProfessionals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved professionals</h3>
              <p className="text-gray-600 mb-6">
                Discover and save professionals you want to work with
              </p>
              <a
                href="/professionals"
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Find Professionals
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProfessionals.map((professional) => (
                <div
                  key={professional.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      {professional.profilePicture ? (
                        <img
                          src={professional.profilePicture}
                          alt={professional.name}
                          className="w-14 h-14 object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Bookmark className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{professional.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{professional.professionalHeadline}</p>
                  {professional.headline && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {professional.headline}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{professional.rating}</span>
                      <span className="text-gray-400">({professional.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Saved {new Date(professional.savedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={`/p/${professional.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      View
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🔖 How to Use Saved Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Quick Access</h4>
            <p>Save businesses and professionals for easy access to their profiles and contact information.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Compare Options</h4>
            <p>Build your collection to compare different businesses and professionals before making decisions.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Track Changes</h4>
            <p>Stay updated with changes in saved businesses and professional profiles.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Organize Favorites</h4>
            <p>Create your personal collection of trusted businesses and go-to professionals.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
