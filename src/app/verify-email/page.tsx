'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OTPInput } from '@/components/auth/OTPInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const purpose = searchParams.get('purpose') || 'register'

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleOTPComplete = async (value: string) => {
    setOtp(value)
    setError('')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    try {
      // Different API endpoints based on purpose
      const endpoint = purpose === 'forgot-password' 
        ? '/api/auth/verify-otp' 
        : '/api/auth/verify-email'
      
      const body = purpose === 'forgot-password' 
        ? { email, otp, purpose: 'password_reset' }
        : { email, otp }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        setIsVerified(true)
        setTimeout(() => {
          if (purpose === 'forgot-password') {
            // Redirect to reset password page with OTP
            router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`)
          } else {
            router.push('/onboarding')
          }
        }, 2000)
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch (error) {
      setError('An error occurred during verification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      // Different API endpoints based on purpose
      const endpoint = purpose === 'forgot-password' 
        ? '/api/auth/forgot-password' 
        : '/api/auth/send-verification'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok || data.success) {
        setTimeLeft(600) // Reset timer
        setError('')
      } else {
        setError(data.error || 'Failed to resend code')
      }
    } catch (error) {
      setError('An error occurred while resending code')
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {purpose === 'forgot-password' ? 'Code Verified!' : 'Email Verified!'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {purpose === 'forgot-password' ? 'Redirecting you to reset password...' : 'Redirecting you to onboarding...'}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex items-center justify-center">

        {/* Verification Card */}
        <div className="bg-card backdrop-blur-sm rounded-2xl border-2 border-slate-800 p-8 w-full flex flex-col items-center justify-center">
          {/* Email Display */}
          <div className="text-center mb-6">
           
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {purpose === 'forgot-password' ? 'Verify Your Code' : 'Verify Your Email'}
            </h1>
            <p className="text-muted-foreground">
              {purpose === 'forgot-password' 
                ? "We've sent a 6-digit code to reset your password to<br />" 
                : "We've sent a 6-digit code to<br />"
              }
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* OTP Input */}
          <form onSubmit={handleVerify} className="space-y-6 ">
            <div className="text-center">
              <OTPInput
                onComplete={handleOTPComplete}
                autoFocus={true}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-center">
                {error}
              </div>
            )}

            {/* Timer */}
            <div className="text-center text-sm text-muted-foreground mb-4">
              {timeLeft > 0 ? (
                <>
                  <Clock className="h-4 w-4 inline mr-1" />
                  Code expires in {formatTime(timeLeft)}
                </>
              ) : (
                <span className="text-destructive">Code expired</span>
              )}
            </div>

            {/* Verify Button */}
            <AuthButton
              type="submit"
              loading={isLoading}
              fullWidth
              disabled={otp.length !== 6 || timeLeft === 0}
              className="w-full"
            >
              Verify Email
            </AuthButton>

            {/* Resend Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || timeLeft > 540} // Don't allow resend until 1 minute left
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? 'Sending...' : timeLeft > 540 ? `Resend in ${Math.floor((timeLeft - 540) / 60)}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
