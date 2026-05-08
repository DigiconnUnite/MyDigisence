'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { ArrowLeft, ArrowRight, Upload, Building2 } from 'lucide-react'

export default function BusinessOnboardingPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    location: '',
    phone: '',
    website: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const router = useRouter()

  const categories = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 
    'Manufacturing', 'Consulting', 'Real Estate', 'Hospitality', 'Other'
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (type: 'logo' | 'cover', file: File) => {
    if (type === 'logo') {
      setLogoFile(file)
    } else {
      setCoverFile(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName || formData.businessName.length < 2) {
      newErrors.businessName = 'Business name is required'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.location) {
      newErrors.location = 'Location is required'
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
      const userId = localStorage.getItem('userId') || ''
      
      const response = await fetch('/api/auth/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          path: 'BUSINESS',
          businessName: formData.businessName,
          category: formData.category,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
          description: formData.description,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(data.redirectPath)
      } else {
        setErrors({ general: data.error || 'Failed to complete onboarding' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during onboarding' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Set up your Business Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about your business to get started
          </p>
        </div>

        {/* Onboarding Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="md:col-span-2">
                <AuthInput
                  label="Business Name"
                  type="text"
                  icon="user"
                  value={formData.businessName}
                  onChange={(value) => handleChange('businessName', value)}
                  error={errors.businessName}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('category', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <AuthInput
                  label="Location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  error={errors.location}
                  placeholder="City, Country"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <AuthInput
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleChange('phone', value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <AuthInput
                  label="Website"
                  type="text"
                  value={formData.website}
                  onChange={(value) => handleChange('website', value)}
                  placeholder="https://your-website.com"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Tell us about your business..."
                />
              </div>

              {/* File Uploads */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange('logo', e.target.files[0])}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {logoFile ? logoFile.name : 'Upload Logo'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange('cover', e.target.files[0])}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {coverFile ? coverFile.name : 'Upload Cover Image'}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <AuthButton
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </AuthButton>
              
              <AuthButton
                type="submit"
                loading={isLoading}
                className="px-8"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
