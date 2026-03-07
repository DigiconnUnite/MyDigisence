"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Upload, 
  RotateCw, 
  FlipHorizontal, 
  Download, 
  Crop as CropIcon, 
  RefreshCw,
  ImageIcon,
  Check,
  ZoomIn,
  X,
  Loader2,
  Eye
} from "lucide-react";
import { toast } from "sonner";

// Banner dimensions: 1500x500 pixels
const BANNER_WIDTH = 1500;
const BANNER_HEIGHT = 500;
const ASPECT_RATIO = BANNER_WIDTH / BANNER_HEIGHT; // 3:1

export type BannerType = 'business' | 'professional';

export interface BannerCropperProps {
  /** Type of banner - determines which API endpoint to use */
  type: BannerType;
  /** Current banner URL (for editing existing banners) */
  currentBanner?: string | null;
  /** Callback when banner is successfully uploaded */
  onUpload?: (url: string) => void;
  /** Business ID (required for business banner uploads) */
  businessId?: string;
  /** Professional ID (required for professional banner uploads) */
  professionalId?: string;
  /** Whether the dialog is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Show the component in trigger-only mode (just a button that opens the dialog) */
  trigger?: React.ReactNode;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      ASPECT_RATIO,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function BannerCropper({
  type,
  currentBanner,
  onUpload,
  businessId,
  professionalId,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger
}: BannerCropperProps) {
  // Internal state for standalone mode
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal
  const isControlled = externalOpen !== undefined && externalOnOpenChange !== undefined;
  const isDialogOpen = isControlled ? externalOpen : internalOpen;
  const setIsDialogOpen = isControlled ? externalOnOpenChange! : setInternalOpen;
  
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flip, setFlip] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size should be less than 20MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setScale(1);
      setRotate(0);
      setFlip(false);
    });
    reader.readAsDataURL(file);
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setFlip((prev) => !prev);
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    setFlip(false);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height));
    }
  };

  const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
    const image = imgRef.current;
    if (!image || !completedCrop) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = BANNER_WIDTH;
    canvas.height = BANNER_HEIGHT;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale * (flip ? -1 : 1), scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // For flip, we need to translate back after flipping
    if (flip) {
      ctx.translate(BANNER_WIDTH, 0);
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      BANNER_WIDTH,
      BANNER_HEIGHT,
    );
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png", 1.0);
    });
  }, [completedCrop, rotate, scale, flip]);

  const handlePreview = async () => {
    const blob = await getCroppedImg();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsPreviewOpen(true);
    }
  };

  const uploadToServer = async (blob: Blob): Promise<string | null> => {
    // Convert blob to File
    const file = new File([blob], `banner-${Date.now()}.png`, { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);

    let uploadUrl: string;
    let uploadEndpoint: string;

    if (type === 'business') {
      if (!businessId) {
        toast.error("Business ID is required for business banner uploads");
        return null;
      }
      // For businesses, use the business upload endpoint
      uploadEndpoint = '/api/business/upload';
      formData.append("businessId", businessId);
    } else {
      // For professionals, use the professional upload endpoint with type='banner'
      // (API uses session-based authentication)
      uploadEndpoint = '/api/professionals/upload';
      formData.append("type", "banner");
    }

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload banner");
      return null;
    }
  };

  const handleUpload = async () => {
    const blob = await getCroppedImg();
    if (!blob) {
      toast.error("Failed to create cropped image");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToServer(blob);
      if (url) {
        toast.success(type === 'business' ? "Business banner uploaded successfully!" : "Professional banner uploaded successfully!");
        
        // Call the onUpload callback if provided
        if (onUpload) {
          onUpload(url);
        }
        
        // Reset and close
        setIsDialogOpen(false);
        setImgSrc("");
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    const blob = await getCroppedImg();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `banner-${BANNER_WIDTH}x${BANNER_HEIGHT}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Banner downloaded successfully!");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setScale(1);
        setRotate(0);
        setFlip(false);
      });
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClose = () => {
    setImgSrc("");
    setPreviewUrl("");
    setScale(1);
    setRotate(0);
    setFlip(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getTitle = () => {
    if (type === 'business') {
      return "Business Banner";
    }
    return "Professional Banner";
  };

  const getSubtitle = () => {
    if (type === 'business') {
      return "Upload and crop your business banner image";
    }
    return "Upload and crop your professional profile banner";
  };

  // If trigger is provided, render in trigger-only mode
  if (trigger) {
    return (
      <>
        <div onClick={() => setIsDialogOpen(true)}>
          {trigger}
        </div>
        {renderDialog()}
      </>
    );
  }

  // Default trigger button
  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Upload className="w-4 h-4" />
      {currentBanner ? "Change Banner" : "Upload Banner"}
    </Button>
  );

  return (
    <>
      <div onClick={() => setIsDialogOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      {renderDialog()}
    </>
  );

  function renderDialog() {
    return (
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
        setIsDialogOpen(open);
      }}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle className="text-md sm:text-lg">{getTitle()}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base mt-1">
              {getSubtitle()}. Output size: {BANNER_WIDTH}×{BANNER_HEIGHT}px
            </DialogDescription>
          </DialogHeader>

          {/* Controls */}
          <div className="px-4 sm:px-6 py-3 border-b bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {/* Zoom Slider */}
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-slate-500" />
                <Slider
                  value={[scale]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => setScale(value)}
                  className="w-24 sm:w-32"
                />
                <span className="text-xs text-slate-500 w-10">{Math.round(scale * 100)}%</span>
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

              {/* Rotate Button */}
              <Button variant="outline" size="icon" onClick={handleRotate} title="Rotate 90°">
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Flip Button */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleFlip} 
                title="Flip Horizontal"
                className={flip ? "bg-primary/10" : ""}
              >
                <FlipHorizontal className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

              {/* Reset Button */}
              <Button variant="outline" size="icon" onClick={handleReset} title="Reset">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

              {/* Preview Button */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePreview} 
                title="Preview"
                disabled={!completedCrop}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cropper Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950">
            {!imgSrc ? (
              /* Upload Area */
              <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <CardContent className="p-0">
                  <div
                    className="flex flex-col items-center justify-center p-8 sm:p-12 cursor-pointer min-h-[300px]"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                      Drop your image here
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4 text-center">
                      or click to browse from your computer
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
                      Supports: JPG, PNG, WebP, GIF (Max 20MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Cropper */
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                minWidth={100}
                minHeight={33}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  style={{
                    transform: `scale(${scale}) scaleX(${flip ? -1 : 1}) rotate(${rotate}deg)`,
                    maxWidth: "100%",
                    maxHeight: "60vh",
                    objectFit: "contain",
                  }}
                  onLoad={onImageLoad}
                  className="rounded-lg shadow-lg"
                />
              </ReactCrop>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 border-t bg-white dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-4">
              
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {imgSrc && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setImgSrc("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }} 
                      className="flex-1 sm:flex-none"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      className="flex-1 sm:flex-none gap-2"
                      disabled={!completedCrop || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {type === 'business' ? 'Save Business Banner' : 'Save Professional Banner'}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl w-[95vw]">
            <DialogHeader>
              <DialogTitle>Preview - {BANNER_WIDTH}×{BANNER_HEIGHT}</DialogTitle>
              <DialogDescription>
                This is how your banner will look at the final size
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-auto max-h-[60vh] bg-slate-100 dark:bg-slate-900 rounded-lg p-2">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded shadow-lg"
                />
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsPreviewOpen(false);
                handleUpload();
              }} className="gap-2" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Upload Banner
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>
    );
  }
}
