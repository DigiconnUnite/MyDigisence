'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardRouter() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const redirectToDashboard = useCallback(async () => {
    if (!user) return

    setRedirecting(true)
    setError(null)

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      if (user.role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin')
        return
      }

      if (user.role === 'BUSINESS_ADMIN') {
        const res = await fetch('/api/business', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'
        })
        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          router.push(`/dashboard/business/${data.business.slug}`)
        } else if (res.status === 401 || res.status === 403) {
          await logout()
          router.push('/login')
        } else {
          const errorData = await res.json().catch(() => ({ error: 'Service temporarily unavailable' }))
          setError(`Unable to load business dashboard: ${errorData.error || 'Please try again later'}`)
        }
      } else if (user.role === 'PROFESSIONAL_ADMIN') {
        const res = await fetch('/api/professionals', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'
        })
        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          const userProfessional = data.professionals?.find(
            (p: any) => p.adminId === user.id
          )

          if (userProfessional) {
            router.push(`/dashboard/professional/${userProfessional.slug}`)
          } else {
            setError('Professional profile not found. Please contact support.')
          }
        } else if (res.status === 401 || res.status === 403) {
          await logout()
          router.push('/login')
        } else {
          const errorData = await res.json().catch(() => ({ error: 'Service temporarily unavailable' }))
          setError(`Unable to load professional dashboard: ${errorData.error || 'Please try again later'}`)
        }
      } else if (user.role === 'USER') {
        router.push('/dashboard/user')
        return
      } else {
        setError('Account type not recognized. Please contact support.')
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else {
        setError('Connection failed. Please check your internet connection and try again.')
      }
    } finally {
      setRedirecting(false)
    }
  }, [user, router, logout])

  useEffect(() => {
    if (loading || redirecting || !user) return
    redirectToDashboard()
  }, [user, loading, redirecting, redirectToDashboard, retryCount])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleRetry = () => {
    setError(null)
    setRetryCount(prev => prev + 1)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading || (redirecting && !error)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} disabled={redirecting} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {redirecting ? 'Retrying...' : 'Try Again'}
            </Button>

            <Button variant="outline" onClick={handleLogout} className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}
