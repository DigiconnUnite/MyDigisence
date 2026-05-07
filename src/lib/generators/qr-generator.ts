import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export async function generateQRCode(
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 300,
    margin = 2,
    color = { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel = 'M'
  } = options

  try {
    const dataUrl = await QRCode.toDataURL(data, {
      width,
      margin,
      color,
      errorCorrectionLevel,
    })
    return dataUrl
  } catch (error) {
    console.error('QR Code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateProfileQRCode(
  baseUrl: string,
  slug: string,
  type: 'professional' | 'business',
  options?: QRCodeOptions
): Promise<string> {
  const profileUrl = `${baseUrl}/${type === 'professional' ? 'p' : 'b'}/${slug}`
  return generateQRCode(profileUrl, options)
}

export function generateVCardQRCode(
  vcardData: string,
  options?: QRCodeOptions
): Promise<string> {
  return generateQRCode(vcardData, {
    ...options,
    width: options?.width || 400,
    errorCorrectionLevel: 'H', // High error correction for vCard data
  })
}
