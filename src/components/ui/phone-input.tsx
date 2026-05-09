"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CountryCodeSelector, Country } from "@/components/ui/country-code-selector"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string, country: Country) => void
  onCountryChange?: (country: Country) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  id?: string
  required?: boolean
  defaultCountry?: Country
}

// Phone number validation patterns by country
const phonePatterns: Record<string, { pattern: RegExp; maxLength: number; format?: string }> = {
  "US": { pattern: /^\d{10}$/, maxLength: 10, format: "(XXX) XXX-XXXX" },
  "GB": { pattern: /^\d{10,11}$/, maxLength: 11, format: "XXXX XXXXXX" },
  "CA": { pattern: /^\d{10}$/, maxLength: 10, format: "(XXX) XXX-XXXX" },
  "AU": { pattern: /^\d{9}$/, maxLength: 9, format: "XXXX XXXX" },
  "IN": { pattern: /^\d{10}$/, maxLength: 10, format: "XXXXX XXXXX" },
  "DE": { pattern: /^\d{10,11}$/, maxLength: 11, format: "XXX XXXXXXXX" },
  "FR": { pattern: /^\d{9}$/, maxLength: 9, format: "XX XX XX XX XX" },
  "IT": { pattern: /^\d{9,10}$/, maxLength: 10, format: "XXX XXXXXXX" },
  "ES": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "NL": { pattern: /^\d{9}$/, maxLength: 9, format: "X XXXX XXXX" },
  "BE": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XX XX XX" },
  "CH": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XX XX" },
  "AT": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXXXXXX" },
  "SE": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "NO": { pattern: /^\d{8}$/, maxLength: 8, format: "XX XX XX XX" },
  "DK": { pattern: /^\d{8}$/, maxLength: 8, format: "XX XX XX XX" },
  "FI": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "PL": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "CZ": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "HU": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "RO": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "BG": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "HR": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "SI": { pattern: /^\d{8}$/, maxLength: 8, format: "XXX XXX XX" },
  "SK": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "EE": { pattern: /^\d{8}$/, maxLength: 8, format: "XXX XXX XX" },
  "LV": { pattern: /^\d{8}$/, maxLength: 8, format: "XXX XXX XX" },
  "LT": { pattern: /^\d{8}$/, maxLength: 8, format: "XXX XXX XX" },
  "GR": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "PT": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "IE": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "RU": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX-XX-XX" },
  "UA": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XX XX XX" },
  "TR": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XX XX" },
  "IL": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "AE": { pattern: /^\d{8,9}$/, maxLength: 9, format: "XXX XXXXX" },
  "SA": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "EG": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "ZA": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "NG": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "KE": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "JP": { pattern: /^\d{10,11}$/, maxLength: 11, format: "XX XXXX XXXX" },
  "CN": { pattern: /^\d{11}$/, maxLength: 11, format: "XXX XXXX XXXX" },
  "HK": { pattern: /^\d{8}$/, maxLength: 8, format: "XXXX XXXX" },
  "SG": { pattern: /^\d{8}$/, maxLength: 8, format: "XXXX XXXX" },
  "MY": { pattern: /^\d{9,10}$/, maxLength: 10, format: "XX XXXX XXXX" },
  "TH": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "PH": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "ID": { pattern: /^\d{9,12}$/, maxLength: 12, format: "XXX XXX XXXX" },
  "VN": { pattern: /^\d{9,10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "KR": { pattern: /^\d{9,10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "MX": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "BR": { pattern: /^\d{10,11}$/, maxLength: 11, format: "XXX XXX XXXX" },
  "AR": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "CL": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "CO": { pattern: /^\d{10}$/, maxLength: 10, format: "XXX XXX XXXX" },
  "PE": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
  "NZ": { pattern: /^\d{9}$/, maxLength: 9, format: "XXX XXX XXX" },
}

export function PhoneInput({
  value = "",
  onChange,
  onCountryChange,
  placeholder = "Enter phone number",
  disabled = false,
  error,
  className,
  id,
  required = false,
  defaultCountry,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry || { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValid, setIsValid] = useState(true)

  // Parse initial value to extract country code and phone number
  useEffect(() => {
    if (value) {
      const parsed = parsePhoneNumber(value)
      if (parsed) {
        setSelectedCountry(parsed.country)
        setPhoneNumber(parsed.phone)
      }
    }
  }, [value])

  const parsePhoneNumber = useCallback((fullNumber: string): { country: Country; phone: string } | null => {
    // Remove all non-digit characters
    const digitsOnly = fullNumber.replace(/\D/g, "")
    
    // Try to match with country codes
    for (const country of phonePatterns ? Object.keys(phonePatterns) : []) {
      const countryData = phonePatterns[country]
      const dialCode = getDialCodeForCountry(country)
      
      if (digitsOnly.startsWith(dialCode.replace(/\D/g, ""))) {
        const phoneDigits = digitsOnly.substring(dialCode.replace(/\D/g, "").length)
        if (phoneDigits.length <= countryData.maxLength) {
          const countryInfo = getCountryByCode(country)
          if (countryInfo) {
            return { country: countryInfo, phone: phoneDigits }
          }
        }
      }
    }
    
    return null
  }, [])

  const getDialCodeForCountry = useCallback((countryCode: string): string => {
    // This would ideally come from the countries data
    const commonCodes: Record<string, string> = {
      "US": "+1", "GB": "+44", "CA": "+1", "AU": "+61", "IN": "+91",
      "DE": "+49", "FR": "+33", "IT": "+39", "ES": "+34", "NL": "+31",
      "BE": "+32", "CH": "+41", "AT": "+43", "SE": "+46", "NO": "+47",
      "DK": "+45", "FI": "+358", "PL": "+48", "CZ": "+420", "HU": "+36",
      "RO": "+40", "BG": "+359", "HR": "+385", "SI": "+386", "SK": "+421",
      "EE": "+372", "LV": "+371", "LT": "+370", "GR": "+30", "PT": "+351",
      "IE": "+353", "RU": "+7", "UA": "+380", "TR": "+90", "IL": "+972",
      "AE": "+971", "SA": "+966", "EG": "+20", "ZA": "+27", "NG": "+234",
      "KE": "+254", "JP": "+81", "CN": "+86", "HK": "+852", "SG": "+65",
      "MY": "+60", "TH": "+66", "PH": "+63", "ID": "+62", "VN": "+84",
      "KR": "+82", "MX": "+52", "BR": "+55", "AR": "+54", "CL": "+56",
      "CO": "+57", "PE": "+51", "NZ": "+64"
    }
    return commonCodes[countryCode] || ""
  }, [])

  const getCountryByCode = useCallback((countryCode: string): Country | null => {
    // This would ideally import from the countries data
    const countries: Country[] = [
      { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
      { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
      { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
      { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
      { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
      // ... other countries
    ]
    return countries.find(c => c.code === countryCode) || null
  }, [])

  const handlePhoneChange = useCallback((value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "")
    
    // Apply max length based on selected country
    if (selectedCountry && phonePatterns[selectedCountry.code]) {
      const maxLength = phonePatterns[selectedCountry.code].maxLength
      if (digitsOnly.length > maxLength) {
        return
      }
    }
    
    setPhoneNumber(digitsOnly)
    
    // Validate phone number
    if (selectedCountry && phonePatterns[selectedCountry.code]) {
      const pattern = phonePatterns[selectedCountry.code].pattern
      const valid = pattern.test(digitsOnly)
      setIsValid(valid)
    } else {
      setIsValid(digitsOnly.length >= 6) // Basic validation for unknown countries
    }
    
    // Combine country code and phone number
    if (selectedCountry) {
      const fullNumber = selectedCountry.dialCode + digitsOnly
      onChange?.(fullNumber, selectedCountry)
    }
  }, [selectedCountry, onChange])

  const handleCountryChange = useCallback((country: Country) => {
    setSelectedCountry(country)
    onCountryChange?.(country)
    
    // Re-validate current phone with new country rules
    if (phoneNumber && phonePatterns[country.code]) {
      const pattern = phonePatterns[country.code].pattern
      const valid = pattern.test(phoneNumber)
      setIsValid(valid)
    }
    
    // Update combined value
    const fullNumber = country.dialCode + phoneNumber
    onChange?.(fullNumber, country)
  }, [phoneNumber, onCountryChange, onChange])

  const formatPhoneNumber = useCallback((digits: string, country: Country): string => {
    const pattern = phonePatterns[country.code]
    if (!pattern || !pattern.format) return digits
    
    let formatted = pattern.format
    let digitIndex = 0
    
    for (let i = 0; i < formatted.length && digitIndex < digits.length; i++) {
      if (formatted[i] === 'X') {
        formatted = formatted.substring(0, i) + digits[digitIndex] + formatted.substring(i + 1)
        digitIndex++
      }
    }
    
    return formatted
  }, [])

  const displayValue = phoneNumber && selectedCountry ? formatPhoneNumber(phoneNumber, selectedCountry) : phoneNumber

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="w-[100px] shrink-0">
        <CountryCodeSelector
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={disabled}
        />
      </div>
      <div className="flex-1 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Phone className="h-4 w-4 text-muted-foreground/70" />
        </div>
        <Input
          id={id}
          type="tel"
          value={displayValue}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "pl-10 h-[44px] border border-slate-800/20 shadow-none bg-white",
            error && "border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40",
            !isValid && phoneNumber && "border-orange-300 dark:border-orange-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
          )}
        />
      </div>
    </div>
  )
}

// Utility function to format phone number to E.164 format
export function formatToE164(phoneNumber: string, countryCode: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "")
  
  // If already starts with +, assume it's E.164
  if (phoneNumber.startsWith('+')) {
    return phoneNumber
  }
  
  // Add country code if not present
  if (!digitsOnly.startsWith(countryCode.replace(/\D/g, ""))) {
    return countryCode + digitsOnly
  }
  
  return '+' + digitsOnly
}

// Utility function to validate phone number
export function validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
  const digitsOnly = phoneNumber.replace(/\D/g, "")
  const pattern = phonePatterns[countryCode]
  
  if (!pattern) {
    return digitsOnly.length >= 6 // Basic validation for unknown countries
  }
  
  return pattern.pattern.test(digitsOnly)
}
