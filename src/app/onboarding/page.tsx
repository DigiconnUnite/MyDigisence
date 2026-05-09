'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, User, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function OnboardingPage() {
  const [selectedPath, setSelectedPath] = useState<'BUSINESS' | 'PROFESSIONAL' | 'NORMAL_USER' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  // Check if user has already completed onboarding and redirect them
  useEffect(() => {
    if (user && user.onboardingCompleted && user.userPath) {
      // User has already completed onboarding, redirect to dashboard
      router.push('/dashboard')
      return
    }
  }, [user, router])

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
    <div className="min-h-screen  dark:bg-gray-950 flex items-center justify-center lg:p-4">
      <div className="w-full container mx-auto   lg:border-2 lg:overflow-hidden lg:border-slate-800 dark:lg:border-slate-800 lg:rounded-4xl flex h-fit flex-col lg:flex-row">

        {/* ───────────────────────────────────────────── */}
        {/* MOBILE HEADER SECTION (shown on mobile only) */}
        {/* ───────────────────────────────────────────── */}
        <div className="lg:hidden w-full relative  bg-slate-950">
          {/* Mobile decorative blurs - matching desktop */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-[200px] h-[200px] bg-white/[0.08] rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-white/[0.04] rounded-full blur-[80px]" />
            <div className="absolute top-[40%] left-[20%] w-[100px] h-[100px] bg-white/[0.06] rounded-full blur-[40px]" />
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.095]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Mobile header content - matching desktop structure */}
          <div className="relative z-10 flex flex-col justify-between flex-1 p-6 pb-8">

            {/* Top section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/[0.12] backdrop-blur-sm border border-white/[0.15] rounded-full px-3.5 py-1.5 text-[13px] text-white/90 w-fit">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-400" />
                </span>
                Choose your path
              </div>

              <h2 className="text-2xl font-bold text-white leading-[1.15]">
                Start your{' '}
                <span className="text-white/75">journey</span>{' '}
                today
              </h2>

              <p className="text-white/60 text-sm leading-relaxed">
                Select the path that best describes what you want to accomplish with DigiSence.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 mt-6">
              {[
                {
                  icon: (
                    <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ),
                  title: 'Personalized experience',
                  desc: 'Tailored features based on your unique needs'
                },
                {
                  icon: (
                    <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  title: 'Secure & private',
                  desc: 'Your data is protected with enterprise-grade security'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-2.5 hover:bg-white/[0.13] transition-colors duration-200"
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 bg-white/[0.12] rounded text-white/90 group-hover:bg-white/[0.18] transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-semibold text-white leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-[11px] text-white/50 leading-snug mt-px">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { value: '10M+', label: 'Users worldwide' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '4.9★', label: 'User rating' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-6 bg-white/[0.12] -ml-4" />}
                  <div>
                    <div className="text-lg font-bold text-white leading-none">{stat.value}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────── */}
        {/* LEFT COLUMN — FORM SIDE                      */}
        {/* ───────────────────────────────────────────── */}
        <div className="w-full w-auto bg-slate-50 dark:bg-gray-900 flex flex-col min-h-screen lg:min-h-0 relative z-20 lg:z-auto">
          {/* Mobile rounded corners */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-8 bg-slate-50 dark:bg-gray-950 -translate-y-4 rounded-t-3xl"></div>

          {/* ── Center Content ── */}
          <div className="flex-1 flex items-start justify-center pt-4 lg:pt-8 lg:items-center">
            <div className="w-full max-w-2xl space-y-8 bg-slate-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-t-none lg:mt-0 -mt-4 p-6 sm:p-8">

              {/* Heading */}
              <div className="space-y-1.5">
                <h1 className="text-[28px] sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                  Choose Your Path
                </h1>
                <p className="text-[15px] text-muted-foreground">
                  Select how you want to use DigiSence
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 1
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
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedPath === path.id
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
      </div>
    </div>
  )
}
