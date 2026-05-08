'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, User, Users } from 'lucide-react'

export default function OnboardingPage() {
  const [selectedPath, setSelectedPath] = useState<'BUSINESS' | 'PROFESSIONAL' | 'NORMAL_USER' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const paths = [
    {
      id: 'BUSINESS' as const,
      title: 'Business',
      description: 'Manage your business and connect with top talent',
      icon: Building2,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'PROFESSIONAL' as const,
      title: 'Professional',
      description: 'Showcase your skills and find work opportunities',
      icon: User,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'NORMAL_USER' as const,
      title: 'Normal User',
      description: 'Explore platform features and connect with businesses',
      icon: Users,
      color: 'from-green-500 to-green-600'
    }
  ]

  const handlePathSelect = async (path: 'BUSINESS' | 'PROFESSIONAL' | 'NORMAL_USER') => {
    setSelectedPath(path)
    setError('')
  }

  const handleContinue = async () => {
    if (!selectedPath) {
      setError('Please select a path to continue')
      return
    }

    setIsLoading(true)
    try {
      // Get user ID from auth context or local storage
      const userId = localStorage.getItem('userId') || ''
      
      const response = await fetch('/api/auth/onboarding/path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          path: selectedPath
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to path-specific onboarding
        router.push(`/onboarding/${selectedPath.toLowerCase()}`)
      } else {
        setError(data.error || 'Failed to select path')
      }
    } catch (error) {
      setError('An error occurred while selecting your path')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=" bg-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center ">
      <div className="w-full min-h-screen max-w-[1440px] border-x flex items-center justify-center">

        {/* Onboarding Card */}
        <div className="bg-card backdrop-blur-sm p-8 w-full flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Choose how you want to use DigiSence <br />
              <span className="text-sm text-muted-foreground">
                Select the path that best describes what you want to accomplish
              </span>
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className="w-8 h-0.5 bg-muted"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Path Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
            {paths.map((path) => {
              const Icon = path.icon
              return (
                <div
                  key={path.id}
                  onClick={() => handlePathSelect(path.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPath === path.id
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  {selectedPath === path.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${path.color} rounded-2xl mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {path.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-center mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 w-full">
            <button
              onClick={() => router.back()}
              disabled={isLoading}
              className="h-[44px] px-6 rounded-lg border border-slate-700/50 bg-background text-foreground text-sm font-semibold hover:bg-accent hover:text-accent-foreground active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 transition-all duration-150"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleContinue}
              disabled={isLoading || !selectedPath}
              className="h-[44px] px-8 rounded-lg border border-slate-700/50 bg-primary text-primary-foreground text-sm font-semibold shadow-primary/20 hover:bg-primary/90 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 transition-all duration-150"
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
