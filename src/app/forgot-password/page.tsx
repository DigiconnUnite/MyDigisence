'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.message || "Failed to send reset code")
      } else {
        // Redirect to verify-email page with forgot password context
        router.push(`/verify-email?email=${encodeURIComponent(email)}&purpose=forgot-password`)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex items-center justify-center">

        {/* Forgot Password Card */}
        <div className="bg-card backdrop-blur-sm rounded-2xl border p-8 w-full flex flex-col items-center justify-center">
          {/* Email Display */}
          <div className="text-center mb-6">
           
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Forgot Password
            </h1>
            <p className="text-muted-foreground">
              Enter your email to receive a verification code
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-[44px] pl-10 pr-3.5 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] rounded-lg border border-slate-700/50 bg-primary text-primary-foreground text-sm font-semibold shadow-primary/20 hover:bg-primary/90 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 transition-all duration-150"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Login here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
