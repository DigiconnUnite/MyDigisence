'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { ArrowLeft, ArrowRight, Upload, User } from 'lucide-react'

export default function ProfessionalOnboardingPage() {
  const [formData, setFormData] = useState({
    professionalName: '',
    profession: '',
    headline: '',
    location: '',
    phone: '',
    website: '',
    aboutMe: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const router = useRouter()

  const professions = [
    'Software Developer', 'Designer', 'Marketing Specialist', 'Sales Executive',
    'Project Manager', 'Business Analyst', 'Data Scientist', 'DevOps Engineer',
    'Product Manager', 'UX/UI Designer', 'Content Writer', 'Digital Marketer',
    'Consultant', 'Accountant', 'Lawyer', 'Teacher', 'Other'
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (type: 'photo' | 'resume' | 'portfolio', file: File) => {
    switch (type) {
      case 'photo':
        setPhotoFile(file)
        break
      case 'resume':
        setResumeFile(file)
        break
      case 'portfolio':
        setPortfolioFile(file)
        break
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.professionalName || formData.professionalName.length < 2) {
      newErrors.professionalName = 'Professional name is required'
    }
    if (!formData.profession) {
      newErrors.profession = 'Please select a profession'
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
          path: 'PROFESSIONAL',
          professionalName: formData.professionalName,
          profession: formData.profession,
          headline: formData.headline,
          aboutMe: formData.aboutMe,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
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
            Set up your Professional Profile
          </h1>
          <p className="text-muted-foreground">
            Showcase your skills and find work opportunities
          </p>
        </div>

        {/* Onboarding Form */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Name */}
              <div className="md:col-span-2">
                <AuthInput
                  label="Professional Name"
                  type="text"
                  icon="user"
                  value={formData.professionalName}
                  onChange={(value) => handleChange('professionalName', value)}
                  error={errors.professionalName}
                  placeholder="Enter your professional name"
                  required
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profession
                </label>
                <select
                  value={formData.profession}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('profession', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a profession</option>
                  {professions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
                {errors.profession && (
                  <p className="text-sm text-destructive mt-1">{errors.profession}</p>
                )}
              </div>

              {/* Headline */}
              <div className="md:col-span-2">
                <AuthInput
                  label="Professional Headline"
                  type="text"
                  value={formData.headline}
                  onChange={(value) => handleChange('headline', value)}
                  placeholder="Your professional headline"
                />
              </div>

              {/* Location */}
              <div>
                <AuthInput
                  label="Location"
                  type="text"
                  value={formData.location}
                  onChange={(value) => handleChange('location', value)}
                  placeholder="City, Country"
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
                  placeholder="https://your-portfolio.com"
                />
              </div>

              {/* About Me */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  About Me
                </label>
                <textarea
                  value={formData.aboutMe}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('aboutMe', e.target.value)}
                  rows={4}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Tell us about your professional experience..."
                />
              </div>

              {/* File Uploads */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Photo
                  </label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileChange('photo', e.target.files[0])}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {photoFile ? photoFile.name : 'Upload Photo'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files?.[0] && handleFileChange('resume', e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {resumeFile ? resumeFile.name : 'Upload Resume'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Portfolio Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Portfolio
                  </label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.zip,.rar"
                      onChange={(e) => e.target.files?.[0] && handleFileChange('portfolio', e.target.files[0])}
                      className="hidden"
                      id="portfolio-upload"
                    />
                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {portfolioFile ? portfolioFile.name : 'Upload Portfolio'}
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
