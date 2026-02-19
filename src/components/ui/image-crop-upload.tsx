"use client"

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import ReactImageCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  FileVideo,
  File as FileIcon,
  Ratio,

  Check,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type AspectRatioPreset = {
  label: string
  value: number
}

type UploadMode = 'crop' | 'direct' | 'auto'

type LayoutVariant = 'card' | 'compact' | 'minimal' | 'dropzone'

interface ImageCropUploadProps {
  /** Called with the uploaded URL after successful upload */
  onUpload: (url: string) => void
  /** Called on upload/validation errors */
  onError?: (error: string) => void
  /** Maximum number of files (default: 1) */
  maxFiles?: number
  /** File accept string (default: 'image/*') */
  accept?: string
  /** Additional CSS class */
  className?: string
  /** Allow video uploads */
  allowVideo?: boolean
  /** Allow PDF uploads */
  allowPdf?: boolean
  /** Custom upload API endpoint */
  uploadUrl?: string
  /** Upload type field sent with FormData */
  uploadType?: string
  /** Default aspect ratio for cropping (default: 16/9) */
  aspectRatio?: number
  /** Upload mode: 'crop' forces crop, 'direct' skips crop, 'auto' crops images only (default: 'auto') */
  mode?: UploadMode
  /** Layout variant (default: 'card') */
  variant?: LayoutVariant
  /** Custom aspect ratio presets to show in crop modal */
  aspectPresets?: AspectRatioPreset[]
  /** Whether to show aspect ratio preset buttons (default: true) */
  showAspectPresets?: boolean
  /** Whether to show the canvas preview in crop modal (default: true) */
  showCropPreview?: boolean
  /** Max output width for cropped image in pixels (default: unlimited) */
  maxOutputWidth?: number
  /** Max output height for cropped image in pixels (default: unlimited) */
  maxOutputHeight?: number
  /** Output image quality 0-1 (default: 0.92) */
  outputQuality?: number
  /** Output image format (default: original file type) */
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
  /** Placeholder text */
  placeholder?: string
  /** Whether the component is disabled */
  disabled?: boolean
  /** Current image URL for preview */
  currentImageUrl?: string
  /** Label text */
  label?: string
}

// ─── Default Presets ─────────────────────────────────────────────────────────

const DEFAULT_ASPECT_PRESETS: AspectRatioPreset[] = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:1', value: 3 / 1 },
  { label: '4:1', value: 4 / 1 },
]

// ─── Utility: Crop image via Canvas ──────────────────────────────────────────

async function cropImageToBlob(
  image: HTMLImageElement,
  cropPixels: PixelCrop,
  outputType: string,
  quality: number,
  maxWidth?: number,
  maxHeight?: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas 2d context')

  const naturalWidth = image.naturalWidth
  const naturalHeight = image.naturalHeight
  const scaleX = naturalWidth / image.width
  const scaleY = naturalHeight / image.height

  // Scale crop coordinates to natural image dimensions
  let cropX = cropPixels.x * scaleX
  let cropY = cropPixels.y * scaleY
  let cropW = cropPixels.width * scaleX
  let cropH = cropPixels.height * scaleY

  // Clamp to image bounds
  cropX = Math.max(0, Math.min(cropX, naturalWidth))
  cropY = Math.max(0, Math.min(cropY, naturalHeight))
  cropW = Math.min(cropW, naturalWidth - cropX)
  cropH = Math.min(cropH, naturalHeight - cropY)

  // Calculate output dimensions with optional max constraints
  let outW = cropW
  let outH = cropH

  if (maxWidth && outW > maxWidth) {
    const ratio = maxWidth / outW
    outW = maxWidth
    outH = outH * ratio
  }
  if (maxHeight && outH > maxHeight) {
    const ratio = maxHeight / outH
    outH = maxHeight
    outW = outW * ratio
  }

  canvas.width = Math.round(outW)
  canvas.height = Math.round(outH)

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    cropX, cropY, cropW, cropH,
    0, 0, canvas.width, canvas.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas toBlob failed'))
        resolve(blob)
      },
      outputType,
      quality,
    )
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImageCropUpload({
  onUpload,
  onError,
  maxFiles = 1,
  accept = 'image/*',
  className = '',
  allowVideo = false,
  allowPdf = false,
  uploadUrl,
  uploadType,
  aspectRatio = 16 / 9,
  mode = 'auto',
  variant = 'card',
  aspectPresets,
  showAspectPresets = true,
  showCropPreview = true,
  maxOutputWidth,
  maxOutputHeight,
  outputQuality = 0.92,
  outputFormat,
  placeholder,
  disabled = false,
  currentImageUrl,
  label,
}: ImageCropUploadProps) {
  // ─── State ───────────────────────────────────────────────────────────────
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<number>(aspectRatio)

  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // ─── Derived ─────────────────────────────────────────────────────────────
  const isPdfAccept = accept.includes('pdf') || accept.includes('application/pdf') || allowPdf
  const mediaAccept = useMemo(() => {
    const parts: string[] = []
    if (accept && accept !== 'image/*') parts.push(accept)
    else parts.push('image/*')
    if (allowVideo) parts.push('video/*')
    if (isPdfAccept && !accept.includes('pdf')) parts.push('application/pdf')
    return parts.join(',')
  }, [accept, allowVideo, isPdfAccept])

  const mediaTypeText = allowVideo
    ? 'images and videos'
    : isPdfAccept
      ? 'images or PDFs'
      : 'images'

  const presets = aspectPresets || DEFAULT_ASPECT_PRESETS

  // ─── Cleanup object URLs on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Update preview canvas when crop changes ────────────────────────────
  useEffect(() => {
    if (!showCropPreview || !completedCrop || !imgRef.current || !previewCanvasRef.current) return

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropW = completedCrop.width * scaleX
    const cropH = completedCrop.height * scaleY

    // Preview canvas size (max 200px wide)
    const maxPreviewW = 250
    const ratio = Math.min(maxPreviewW / cropW, maxPreviewW / cropH, 1)
    canvas.width = Math.round(cropW * ratio)
    canvas.height = Math.round(cropH * ratio)

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)
  }, [completedCrop, showCropPreview])

  // ─── Upload handler ──────────────────────────────────────────────────────
  const handleFileUpload = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return

    // Validate size
    const maxSize = allowVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const msg = `File size must be less than ${allowVideo ? '50MB' : '10MB'}`
      onError ? onError(msg) : alert(msg)
      return
    }

    // Validate type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    const allowedPdfTypes = ['application/pdf']
    let allowedTypes = [...allowedImageTypes]
    if (allowVideo) allowedTypes.push(...allowedVideoTypes)
    if (isPdfAccept) allowedTypes.push(...allowedPdfTypes)

    if (!allowedTypes.includes(file.type)) {
      const msg = `Invalid file type. Supported: ${mediaTypeText}`
      onError ? onError(msg) : alert(msg)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('Preparing upload...')

    try {
      setUploadProgress(25)
      setUploadStatus('Uploading to server...')

      const formData = new FormData()
      formData.append('file', file)
      if (uploadType) formData.append('type', uploadType)

      const uploadEndpoint = uploadUrl || '/api/business/upload'
      let response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      // Fallback chain
      if (!response.ok && !uploadUrl) {
        response = await fetch('/api/business/upload', { method: 'POST', body: formData })
      }
      if (!response.ok && !uploadUrl) {
        response = await fetch('/api/upload', { method: 'POST', body: formData })
      }

      setUploadProgress(75)
      setUploadStatus('Processing...')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setUploadProgress(100)
      setUploadStatus('Upload complete!')
      const url = data.url || data.secure_url
      setMediaUrl(url)
      onUpload(url)

      setTimeout(() => setUploadStatus(''), 2000)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload. Please try again.'
      setUploadStatus('Upload failed')
      onError ? onError(errorMessage) : alert(errorMessage)
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (uploadStatus === 'Upload failed') {
        setTimeout(() => setUploadStatus(''), 3000)
      }
    }
  }, [onUpload, onError, allowVideo, isPdfAccept, uploadUrl, uploadType, uploadStatus, mediaTypeText])

  // ─── File selection handler ──────────────────────────────────────────────
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Reset input so same file can be re-selected
    e.target.value = ''

    const isImage = file.type.startsWith('image/')
    const shouldCrop = mode === 'crop' || (mode === 'auto' && isImage)

    if (shouldCrop && isImage) {
      // Clean up previous object URL
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      setSelectedFile(file)
      setSelectedAspect(aspectRatio)
      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
      setCompletedCrop(null)
      setPreviewUrl(null)
      setCropModalOpen(true)
    } else {
      handleFileUpload([file])
    }
  }, [mode, aspectRatio, handleFileUpload, objectUrl])

  // ─── Drag & Drop ────────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const file = files[0]
    const isImage = file.type.startsWith('image/')
    const shouldCrop = mode === 'crop' || (mode === 'auto' && isImage)

    if (shouldCrop && isImage) {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      setSelectedFile(file)
      setSelectedAspect(aspectRatio)
      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
      setCompletedCrop(null)
      setPreviewUrl(null)
      setCropModalOpen(true)
    } else {
      handleFileUpload([file])
    }
  }, [mode, aspectRatio, handleFileUpload, objectUrl, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragActive(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  // ─── Crop confirm ───────────────────────────────────────────────────────
  const handleConfirmCrop = useCallback(async () => {
    if (!selectedFile || !completedCrop || !imgRef.current) return

    try {
      const format = outputFormat || selectedFile.type || 'image/jpeg'
      const blob = await cropImageToBlob(
        imgRef.current,
        completedCrop,
        format,
        outputQuality,
        maxOutputWidth,
        maxOutputHeight,
      )

      // Clean up
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setObjectUrl(null)

      const croppedFile = new window.File([blob], selectedFile.name, { type: format })

      setCropModalOpen(false)
      setSelectedFile(null)
      setCompletedCrop(null)
      setPreviewUrl(null)

      await handleFileUpload([croppedFile])
    } catch (error) {
      console.error('Error cropping image:', error)
      const msg = error instanceof Error ? error.message : 'Failed to crop image.'
      onError ? onError(msg) : alert(msg)
    }
  }, [selectedFile, completedCrop, objectUrl, outputFormat, outputQuality, maxOutputWidth, maxOutputHeight, handleFileUpload, onError])

  // ─── Cancel crop ────────────────────────────────────────────────────────
  const handleCancelCrop = useCallback(() => {
    setCropModalOpen(false)
    setSelectedFile(null)
    setCompletedCrop(null)
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(null)
    setPreviewUrl(null)
  }, [objectUrl])

  // ─── Skip crop (direct upload) ──────────────────────────────────────────
  const handleSkipCrop = useCallback(async () => {
    if (!selectedFile) return
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(null)
    setCropModalOpen(false)
    setCompletedCrop(null)
    setPreviewUrl(null)
    await handleFileUpload([selectedFile])
    setSelectedFile(null)
  }, [selectedFile, objectUrl, handleFileUpload])

  // ─── Open file dialog ───────────────────────────────────────────────────
  const openFileDialog = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!disabled) fileInputRef.current?.click()
  }, [disabled])

  // ─── Clear media ────────────────────────────────────────────────────────
  const clearMedia = useCallback(() => {
    setMediaUrl('')
  }, [])

  // ─── Determine media type for preview ───────────────────────────────────
  const displayUrl = mediaUrl || currentImageUrl || ''
  const isVideo = displayUrl && /\.(mp4|webm|ogg)/i.test(displayUrl)
  const isPdfFile = displayUrl && /\.pdf/i.test(displayUrl)

  // ─── Hidden file input ──────────────────────────────────────────────────
  const fileInput = (
    <Input
      ref={fileInputRef}
      type="file"
      accept={mediaAccept}
      multiple={maxFiles > 1}
      onChange={handleFileSelect}
      className="hidden"
      disabled={disabled || uploading}
    />
  )

  // ─── Media preview thumbnail ────────────────────────────────────────────
  const renderThumbnail = (size: string = 'w-20 h-20') => {
    if (uploading) {
      return <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    }
    if (displayUrl) {
      if (isVideo) {
        return <video src={displayUrl} className={`${size} object-cover rounded-lg`} controls={false} />
      }
      if (isPdfFile) {
        return <FileIcon className="w-8 h-8 text-red-400" />
      }
      return <img src={displayUrl} alt="Preview" className={`${size} object-cover rounded-lg`} />
    }
    if (allowVideo) return <FileVideo className="w-8 h-8 text-gray-400" />
    if (isPdfAccept) return <FileIcon className="w-8 h-8 text-gray-400" />
    return <ImageIcon className="w-8 h-8 text-gray-400" />
  }

  // ─── Crop Modal ─────────────────────────────────────────────────────────
  const cropModal = (
    <Dialog open={cropModalOpen} onOpenChange={(open) => { if (!open) handleCancelCrop() }}>
      <DialogContent className="max-w-6xl w-[96vw] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ratio className="w-5 h-5" />
            Crop Image
          </DialogTitle>
        </DialogHeader>

        {objectUrl && (
          <div className="flex flex-col gap-4">
            {/* Aspect ratio presets */}
            {showAspectPresets && (
              <div className="flex gap-1.5 flex-wrap">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={Math.abs(selectedAspect - preset.value) < 0.01 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedAspect(preset.value)
                      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
                    }}
                    className="text-xs"
                  >
                    <Ratio className="w-3 h-3 mr-1" />
                    {preset.label}
                  </Button>
                ))}
                {/* Free crop option */}
                <Button
                  variant={selectedAspect === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedAspect(0)
                    setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
                  }}
                  className="text-xs"
                >
                  Free
                </Button>
              </div>
            )}

            {/* Crop area + Preview side by side */}
            <div className="flex gap-4">
              {/* Main crop area */}
              <div className="flex-1 overflow-hidden relative bg-gray-100 rounded-lg" style={{ maxHeight: '70vh', minHeight: '400px' }}>
                <ReactImageCrop
                  crop={crop}
                  onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={selectedAspect === 0 ? undefined : selectedAspect}
                  className="max-h-[70vh]"
                >
                  <img
                    ref={imgRef}
                    src={objectUrl}
                    alt="Crop"
                    className="max-h-[70vh] max-w-full block mx-auto"
                    onLoad={() => {
                      // Reset crop on new image load
                      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
                    }}
                  />
                </ReactImageCrop>
              </div>

              {/* Live preview panel */}
              {showCropPreview && completedCrop && (
                <div className="w-64 shrink-0 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Preview
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-[250px] max-h-[250px]"
                    />
                  </div>
                  {completedCrop && (
                    <div className="text-[10px] text-gray-400 text-center">
                      {Math.round(completedCrop.width)}×{Math.round(completedCrop.height)}px
                      <br />
                      (display size)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={handleSkipCrop} className="text-gray-500">
            <Upload className="w-4 h-4 mr-1" />
            Upload Without Crop
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelCrop}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCrop} disabled={!completedCrop}>
              <Check className="w-4 h-4 mr-1" />
              Confirm Crop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // ─── Render variants ────────────────────────────────────────────────────

  // Card variant (original style with Card wrapper)
  if (variant === 'card') {
    return (
      <>
        <div className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)}>
          <div className="p-4">
            {label && (
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{label || `Upload ${allowVideo ? 'Media' : isPdfAccept ? 'Files' : 'Images'}`}</span>
              </div>
            )}
            <div className="flex gap-4 items-center">
              {/* Thumbnail */}
              <div
                className={cn(
                  'w-20 h-20 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-all cursor-pointer relative overflow-hidden',
                  dragActive && 'border-blue-400 bg-blue-50 scale-105',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => openFileDialog()}
                role="button"
                tabIndex={0}
              >
                {renderThumbnail('w-full h-full')}
                {displayUrl && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-1 -right-1 rounded-full p-0 h-5 w-5 z-10"
                    onClick={(e) => { e.stopPropagation(); clearMedia() }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Controls */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    {uploading ? (uploadStatus || 'Uploading...') : (placeholder || `Drag ${mediaTypeText} here`)}
                  </span>
                  {!uploading && (
                    <Button
                      type="button"
                      onClick={() => openFileDialog()}
                      variant="secondary"
                      size="sm"
                      disabled={disabled || uploading}
                    >
                      Select {allowVideo ? 'Media' : isPdfAccept ? 'File' : 'Image'}
                    </Button>
                  )}
                </div>
                {uploading && <Progress value={uploadProgress} className="w-full h-1.5" />}
                {!uploading && (
                  <p className="text-[10px] text-gray-400 mt-0.5">Supported: {mediaTypeText}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {fileInput}
        {cropModal}
      </>
    )
  }

  // Compact variant (inline, no card wrapper)
  if (variant === 'compact') {
    return (
      <>
        <div className={cn('flex gap-3 items-center', className)}>
          <div
            className={cn(
              'w-14 h-14 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all cursor-pointer relative overflow-hidden shrink-0',
              dragActive && 'border-blue-400 bg-blue-50',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => openFileDialog()}
            role="button"
            tabIndex={0}
          >
            {renderThumbnail('w-full h-full')}
            {displayUrl && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -top-1 -right-1 rounded-full p-0 h-4 w-4 z-10"
                onClick={(e) => { e.stopPropagation(); clearMedia() }}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {uploading ? (
              <div>
                <span className="text-xs text-gray-500">{uploadStatus || 'Uploading...'}</span>
                <Progress value={uploadProgress} className="w-full h-1 mt-1" />
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => openFileDialog()}
                variant="outline"
                size="sm"
                disabled={disabled}
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                {placeholder || 'Upload'}
              </Button>
            )}
          </div>
        </div>
        {fileInput}
        {cropModal}
      </>
    )
  }

  // Minimal variant (just a button)
  if (variant === 'minimal') {
    return (
      <>
        <Button
          type="button"
          onClick={() => openFileDialog()}
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          className={cn('gap-1.5', className)}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : (placeholder || 'Upload Image')}
        </Button>
        {fileInput}
        {cropModal}
      </>
    )
  }

  // Dropzone variant (large drop area)
  return (
    <>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => openFileDialog()}
        role="button"
        tabIndex={0}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">{uploadStatus || 'Uploading...'}</span>
            <Progress value={uploadProgress} className="w-48 h-1.5" />
          </div>
        ) : displayUrl ? (
          <div className="flex flex-col items-center gap-3">
            {isVideo ? (
              <video src={displayUrl} className="w-32 h-24 object-cover rounded-lg" controls={false} />
            ) : isPdfFile ? (
              <FileIcon className="w-12 h-12 text-red-400" />
            ) : (
              <img src={displayUrl} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); openFileDialog() }}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => { e.stopPropagation(); clearMedia() }}
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-600">{placeholder || `Drag & drop ${mediaTypeText} here`}</p>
            <p className="text-xs text-gray-400">or click to browse</p>
            <p className="text-[10px] text-gray-400 mt-1">Supported: {mediaTypeText}</p>
          </div>
        )}
      </div>
      {fileInput}
      {cropModal}
    </>
  )
}

// ─── Re-export for backward compatibility ────────────────────────────────────
export { ImageCropUpload }
export type { ImageCropUploadProps, AspectRatioPreset, UploadMode, LayoutVariant }
