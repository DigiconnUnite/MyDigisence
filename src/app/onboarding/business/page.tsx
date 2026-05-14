'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthInput } from '@/components/auth/AuthInput'
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function BusinessOnboardingPage() {
  const [formData, setFormData] = useState({ businessName: '', category: '', location: '', phone: '', website: '', description: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const categories = ['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Manufacturing', 'Consulting', 'Real Estate', 'Hospitality', 'Other']

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.businessName || formData.businessName.length < 2) newErrors.businessName = 'Business name is required'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.location) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const data = new FormData()
      data.append('userId', user?.id || '')
      data.append('path', 'BUSINESS')
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      if (logoFile) data.append('logo', logoFile)
      if (coverFile) data.append('cover', coverFile)

      const response = await fetch('/api/auth/onboarding/complete', { method: 'POST', body: data })
      const result = await response.json()

      if (result.success) {
        router.push(result.redirectPath || '/dashboard')
      } else {
        setErrors({ general: result.error || 'Failed to complete onboarding' })
      }
    } catch (err) {
      setErrors({ general: 'An error occurred during onboarding' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-gray-950 flex items-center justify-center lg:p-4">
      <div className="w-full container mx-auto lg:border-2 lg:overflow-hidden lg:border-slate-800 lg:rounded-4xl flex h-fit flex-col lg:flex-row">

        {/* LEFT DECORATIVE PANEL (Consistent) */}
        <div className="hidden lg:flex w-full lg:w-1/2 relative bg-slate-950">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.095]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="relative z-10 flex flex-col justify-center flex-1 p-10">
            <h2 className="text-3xl font-bold text-white mb-4">Set up your <span className="text-blue-400">Business</span> Profile</h2>
            <p className="text-white/60 text-sm leading-relaxed">Tell us about your business to get started and connect with top talent.</p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-gray-900 flex flex-col min-h-screen lg:min-h-0 relative z-20">
          <div className="lg:hidden w-full relative bg-slate-950 p-6 pb-8">
            <h2 className="text-xl font-bold text-white">Business Profile</h2>
            <p className="text-white/60 text-sm mt-1">Tell us about your business</p>
          </div>

          <div className="flex-1 flex items-start justify-center pt-4 lg:pt-8 lg:items-center p-6 sm:p-8 overflow-y-auto">
            <div className="w-full max-w-xl space-y-6">

              <div className="hidden lg:block space-y-1.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Business Profile</h1>
                <p className="text-[15px] text-muted-foreground">Tell us about your business to get started</p>
              </div>

              {/* Progress Indicator (Step 2 active) */}
              <div className="flex items-center space-x-2">
                {['Path', 'Details', 'Complete'].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                    {i < 2 && <div className={`w-12 h-0.5 ${i < 1 ? 'bg-primary' : 'bg-muted'}`}></div>}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <AuthInput label="Business Name" type="text" value={formData.businessName} onChange={(value) => handleChange('businessName', value)} error={errors.businessName} placeholder="Enter your business name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Select a category</option>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <AuthInput label="Location" type="text" value={formData.location} onChange={(value) => handleChange('location', value)} error={errors.location} placeholder="City, Country" required />
                  </div>
                  <div>
                    <AuthInput label="Phone" type="tel" value={formData.phone} onChange={(value) => handleChange('phone', value)} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <AuthInput label="Website" type="text" value={formData.website} onChange={(value) => handleChange('website', value)} placeholder="https://your-website.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" placeholder="Tell us about your business..." />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    {['logo', 'cover'].map((type) => (
                      <div key={type}>
                        <label className="block text-sm font-medium text-foreground mb-2 capitalize">{type} Image</label>
                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors h-24 flex flex-col items-center justify-center">
                          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && (type === 'logo' ? setLogoFile(e.target.files[0]) : setCoverFile(e.target.files[0]))} className="hidden" id={`${type}-upload`} />
                          <label htmlFor={`${type}-upload`} className="cursor-pointer flex flex-col items-center">
                            <Upload className="h-5 w-5 mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate w-full px-2">{type === 'logo' ? (logoFile?.name || 'Upload Logo') : (coverFile?.name || 'Upload Cover')}</p>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {errors.general && <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">{errors.general}</div>}

                <div className="flex justify-between">
                  <button type="button" onClick={() => router.back()} disabled={isLoading} className="h-[44px] px-6 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-accent active:scale-[0.985] transition-all"><ArrowLeft className="h-4 w-4 mr-2 inline" />Back</button>
                  <button type="submit" disabled={isLoading} className="h-[44px] px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.985] transition-all disabled:opacity-50">
                    {isLoading ? <span className="inline-flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>Saving...</span> : <>Continue<ArrowRight className="h-4 w-4 ml-2 inline" /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}