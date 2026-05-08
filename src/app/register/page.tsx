'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, User, Shield, Lock, Mail, Phone } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      newErrors.mobile = 'Mobile number must be at least 10 digits'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/verify-email?email=' + encodeURIComponent(formData.email))
      } else {
        setErrors({ general: data.error || 'Registration failed' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during registration' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-stretch">

      {/* ═══════════════════════════════════════════════ */}
      {/* MAIN CONTAINER — 1440px with side borders      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="w-full  mx-auto  border-gray-200 dark:border-gray-800 flex min-h-screen flex-col lg:flex-row">

        {/* ───────────────────────────────────────────── */}
        {/* MOBILE HEADER SECTION (shown on mobile only) */}
        {/* ───────────────────────────────────────────── */}
        <div className="lg:hidden w-full relative overflow-hidden bg-slate-950">
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
                Join our community
              </div>

              <h2 className="text-2xl font-bold text-white leading-[1.15]">
                Start your{' '}
                <span className="text-white/75">journey</span>{' '}
                today
              </h2>

              <p className="text-white/60 text-sm leading-relaxed">
                Create your account and unlock access to powerful features designed to help you succeed.
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
        <div className="w-full w-auto  dark:bg-gray-900 flex flex-col min-h-screen lg:min-h-0 relative z-20 lg:z-auto">
          {/* Mobile rounded corners */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-8 bg-slate-50 dark:bg-gray-950 -translate-y-4 rounded-t-3xl"></div>

          {/* ── Center Content ── */}
          <div className="flex-1 flex items-start justify-center pt-4 lg:pt-8 lg:items-center">
            <div className="w-full max-w-2xl space-y-8 bg-slate-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-t-none lg:mt-0 -mt-4 p-6 sm:p-8">


              {/* Heading */}
              <div className="space-y-1.5">
                <h1 className="text-[28px] sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                  Create your account
                </h1>
                <p className="text-[15px] text-muted-foreground">
                  Join thousands of users who trust our platform
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* General Error */}
                {errors.general && (
                  <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-3.5 py-3 rounded-lg text-sm">
                    <svg className="shrink-0 w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                      className={
                        'w-full h-[44px] pl-10 pr-3.5 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 ' +
                        (errors.name
                          ? 'border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                          : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        )
                      }
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400 pl-0.5">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
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
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={
                        'w-full h-[44px] pl-10 pr-3.5 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 ' +
                        (errors.email
                          ? 'border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                          : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        )
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 pl-0.5">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label htmlFor="mobile" className="block text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      autoComplete="tel"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={
                        'w-full h-[44px] pl-10 pr-3.5 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 ' +
                        (errors.mobile
                          ? 'border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                          : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        )
                      }
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-red-600 dark:text-red-400 pl-0.5">{errors.mobile}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      className={
                        'w-full h-[44px] pl-10 pr-10 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 ' +
                        (errors.password
                          ? 'border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                          : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 pl-0.5">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-muted-foreground/70" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className={
                        'w-full h-[44px] pl-10 pr-10 rounded-lg border border-slate-800/20 bg-white dark:bg-gray-900 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-150 ' +
                        (errors.confirmPassword
                          ? 'border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40'
                          : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 pl-0.5">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2.5 pt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-3.5 w-3.5 rounded border border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/20 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-[13px] text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[44px] rounded-lg border border-slate-700/50 bg-primary text-primary-foreground text-sm font-semibold  shadow-primary/20 hover:bg-primary/90 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 transition-all duration-150"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Creating account…
                    </span>
                  ) : (
                    'Create account'
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="grow border-t border-gray-200 dark:border-gray-700" />
                  <span className="shrink-0 mx-3 text-xs text-muted-foreground/60 uppercase tracking-wide">
                    or
                  </span>
                  <div className="grow border-t border-gray-200 dark:border-gray-700" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => console.log('Google OAuth not implemented yet')}
                  className="w-full h-[44px] rounded-lg border border-slate-700/50 bg-white dark:bg-gray-900 text-sm font-medium text-foreground inline-flex items-center justify-center gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:ring-offset-2 transition-all duration-150"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="shrink-0 px-6 text-center sm:px-10 lg:px-16 xl:px-24 pb-6 pt-2">
            <p className="text-xs text-muted-foreground/40">
              © {new Date().getFullYear()} MyDigiSense. All rights reserved.
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────────────── */}
        {/* RIGHT COLUMN — VISUAL SIDE                  */}
        {/* ───────────────────────────────────────────── */}
        <div className="hidden lg:flex w-full relative overflow-hidden bg-slate-950 flex-col">

          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-white/[0.08] rounded-full blur-[80px]" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[100px]" />
            <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-white/[0.06] rounded-full blur-[60px]" />
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.095]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between flex-1 p-10 xl:p-14">

            {/* Top */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/[0.12] backdrop-blur-sm border border-white/[0.15] rounded-full px-3.5 py-1.5 text-[13px] text-white/90 w-fit">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-400" />
                </span>
                Join our community
              </div>

              <h2 className="text-3xl xl:text-[38px] font-bold text-white leading-[1.15] max-w-[380px] tracking-tight">
                Start your{' '}
                <span className="text-white/75">journey</span>{' '}
                today
              </h2>

              <p className="text-white/60 text-[15px] leading-relaxed max-w-[340px]">
                Create your account and unlock access to powerful features designed to help you succeed.
              </p>
            </div>

            {/* Middle — Feature Cards */}
            <div className="space-y-3 max-w-[380px]">
              {[
                {
                  icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ),
                  title: 'Personalized experience',
                  desc: 'Tailored features based on your unique needs'
                },
                {
                  icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  title: 'Secure & private',
                  desc: 'Your data is protected with enterprise-grade security'
                },
                {
                  icon: (
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                  title: 'Get started fast',
                  desc: 'Quick setup and intuitive interface for immediate productivity'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 py-3 hover:bg-white/[0.13] transition-colors duration-200"
                >
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 bg-white/[0.12] rounded-lg text-white/90 group-hover:bg-white/[0.18] transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-white leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-[12px] text-white/50 leading-snug mt-px">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom — Stats */}
            <div className="flex items-center gap-6 xl:gap-8">
              {[
                { value: '10M+', label: 'Users worldwide' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '4.9★', label: 'User rating' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 xl:gap-8">
                  {i > 0 && <div className="w-px h-8 bg-white/[0.12] -ml-6 xl:-ml-8" />}
                  <div>
                    <div className="text-xl xl:text-2xl font-bold text-white leading-none">{stat.value}</div>
                    <div className="text-[11px] text-white/40 mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
