// Utility functions for phone number formatting and validation

export interface CountryPhoneInfo {
  code: string
  name: string
  dialCode: string
  flag: string
  format?: string
  maxLength: number
}

// Country phone information
export const countryPhoneData: CountryPhoneInfo[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", format: "(XXX) XXX-XXXX", maxLength: 10 },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", format: "XXXX XXXXXX", maxLength: 11 },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", format: "(XXX) XXX-XXXX", maxLength: 10 },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺", format: "XXXX XXXX", maxLength: 9 },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", format: "XXXXX XXXXX", maxLength: 10 },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪", format: "XXX XXXXXXXX", maxLength: 11 },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷", format: "XX XX XX XX XX", maxLength: 9 },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹", format: "XXX XXXXXXX", maxLength: 10 },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸", format: "XXX XXX XXX", maxLength: 9 },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱", format: "X XXXX XXXX", maxLength: 9 },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪", format: "XXX XX XX XX", maxLength: 9 },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭", format: "XXX XXX XX XX", maxLength: 9 },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹", format: "XXX XXXXXXX", maxLength: 10 },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪", format: "XXX XXX XXX", maxLength: 9 },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴", format: "XX XX XX XX", maxLength: 8 },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰", format: "XX XX XX XX", maxLength: 8 },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮", format: "XXX XXX XXX", maxLength: 9 },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱", format: "XXX XXX XXX", maxLength: 9 },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿", format: "XXX XXX XXX", maxLength: 9 },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺", format: "XXX XXX XXX", maxLength: 9 },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴", format: "XXX XXX XXX", maxLength: 9 },
  { code: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬", format: "XXX XXX XXX", maxLength: 9 },
  { code: "HR", name: "Croatia", dialCode: "+385", flag: "🇭🇷", format: "XXX XXX XXX", maxLength: 9 },
  { code: "SI", name: "Slovenia", dialCode: "+386", flag: "🇸🇮", format: "XXX XXX XX", maxLength: 8 },
  { code: "SK", name: "Slovakia", dialCode: "+421", flag: "🇸🇰", format: "XXX XXX XXX", maxLength: 9 },
  { code: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪", format: "XXX XXX XX", maxLength: 8 },
  { code: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻", format: "XXX XXX XX", maxLength: 8 },
  { code: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹", format: "XXX XXX XX", maxLength: 8 },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹", format: "XXX XXX XXX", maxLength: 9 },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪", format: "XXX XXX XXX", maxLength: 9 },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺", format: "XXX XXX-XX-XX", maxLength: 10 },
  { code: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦", format: "XXX XX XX XX", maxLength: 9 },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷", format: "XXX XXX XX XX", maxLength: 10 },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱", format: "XXX XXX XXX", maxLength: 9 },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪", format: "XXX XXXXX", maxLength: 9 },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", format: "XXX XXX XXX", maxLength: 9 },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦", format: "XXX XXX XXX", maxLength: 9 },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪", format: "XXX XXX XXX", maxLength: 9 },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵", format: "XX XXXX XXXX", maxLength: 11 },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳", format: "XXX XXXX XXXX", maxLength: 11 },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰", format: "XXXX XXXX", maxLength: 8 },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬", format: "XXXX XXXX", maxLength: 8 },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾", format: "XX XXXX XXXX", maxLength: 10 },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭", format: "XXX XXX XXX", maxLength: 9 },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩", format: "XXX XXX XXXX", maxLength: 12 },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷", format: "XXX XXX XXXX", maxLength: 11 },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱", format: "XXX XXX XXX", maxLength: 9 },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴", format: "XXX XXX XXXX", maxLength: 10 },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪", format: "XXX XXX XXX", maxLength: 9 },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿", format: "XXX XXX XXX", maxLength: 9 },
]

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  const countryData = countryPhoneData.find(c => c.code === countryCode)
  if (!countryData || !countryData.format) return phoneNumber

  const digitsOnly = phoneNumber.replace(/\D/g, "")
  let formatted = countryData.format
  let digitIndex = 0

  for (let i = 0; i < formatted.length && digitIndex < digitsOnly.length; i++) {
    if (formatted[i] === 'X') {
      formatted = formatted.substring(0, i) + digitsOnly[digitIndex] + formatted.substring(i + 1)
      digitIndex++
    }
  }

  return formatted
}

/**
 * Parse phone number and extract country info
 */
export function parsePhoneNumber(fullNumber: string): { country: CountryPhoneInfo; phone: string } | null {
  // Remove all non-digit characters
  const digitsOnly = fullNumber.replace(/\D/g, "")
  
  // Try to match with country codes
  for (const country of countryPhoneData) {
    const dialCodeDigits = country.dialCode.replace(/\D/g, "")
    
    if (digitsOnly.startsWith(dialCodeDigits)) {
      const phoneDigits = digitsOnly.substring(dialCodeDigits.length)
      if (phoneDigits.length <= country.maxLength) {
        return { country, phone: phoneDigits }
      }
    }
  }
  
  return null
}

/**
 * Format phone number to E.164 format
 */
export function formatToE164(phoneNumber: string, countryCode: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "")
  
  // If already starts with +, assume it's E.164
  if (phoneNumber.startsWith('+')) {
    return phoneNumber
  }
  
  // Add country code if not present
  const countryData = countryPhoneData.find(c => c.code === countryCode)
  if (!countryData) return phoneNumber

  const dialCodeDigits = countryData.dialCode.replace(/\D/g, "")
  if (!digitsOnly.startsWith(dialCodeDigits)) {
    return countryData.dialCode + digitsOnly
  }
  
  return '+' + digitsOnly
}

/**
 * Validate phone number for a specific country
 */
export function validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
  const digitsOnly = phoneNumber.replace(/\D/g, "")
  const countryData = countryPhoneData.find(c => c.code === countryCode)
  
  if (!countryData) {
    return digitsOnly.length >= 6 // Basic validation for unknown countries
  }
  
  return digitsOnly.length >= countryData.maxLength - 2 && digitsOnly.length <= countryData.maxLength
}

/**
 * Get country info from phone number
 */
export function getCountryFromPhone(phoneNumber: string): CountryPhoneInfo | null {
  const parsed = parsePhoneNumber(phoneNumber)
  return parsed ? parsed.country : null
}

/**
 * Display phone number with country flag and formatting
 */
export function displayPhoneNumber(phoneNumber: string): string {
  const countryInfo = getCountryFromPhone(phoneNumber)
  if (!countryInfo) return phoneNumber

  const parsed = parsePhoneNumber(phoneNumber)
  if (!parsed) return phoneNumber

  const formattedPhone = formatPhoneNumber(parsed.phone, countryInfo.code)
  return `${countryInfo.flag} ${countryInfo.dialCode} ${formattedPhone}`
}
