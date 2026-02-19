/**
 * @deprecated Use ImageCropUpload from '@/components/ui/image-crop-upload' instead.
 * This file is kept for backward compatibility and re-exports ImageCropUpload as ImageUpload.
 */
import ImageCropUpload from '@/components/ui/image-crop-upload'
import type { ImageCropUploadProps } from '@/components/ui/image-crop-upload'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  maxFiles?: number
  accept?: string
  className?: string
  allowVideo?: boolean
  uploadUrl?: string
  uploadType?: string
  aspectRatio?: number
}

/**
 * @deprecated Use `ImageCropUpload` from `@/components/ui/image-crop-upload` directly.
 */
export default function ImageUpload({
  onUpload,
  onError,
  maxFiles = 1,
  accept = 'image/*',
  className = '',
  allowVideo = false,
  uploadUrl,
  uploadType,
  aspectRatio = 16 / 9,
}: ImageUploadProps) {
  return (
    <ImageCropUpload
      onUpload={onUpload}
      onError={onError}
      maxFiles={maxFiles}
      accept={accept}
      className={className}
      allowVideo={allowVideo}
      allowPdf={accept?.includes('pdf') || false}
      uploadUrl={uploadUrl}
      uploadType={uploadType}
      aspectRatio={aspectRatio}
      mode="auto"
      variant="card"
    />
  )
}
