"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  RotateCw, 
  FlipHorizontal, 
  Crop as CropIcon, 
  RefreshCw,
  ImageIcon,
  Check,
  ZoomIn,
  X,
  Loader2,
  Eye,
  Film,
  Scissors,
  Play
} from "lucide-react";
import { toast } from "sonner";

// Banner dimensions: 1500x500 pixels (3:1 aspect ratio)
const BANNER_WIDTH = 1500;
const BANNER_HEIGHT = 500;
const ASPECT_RATIO = BANNER_WIDTH / BANNER_HEIGHT; // 3:1

export interface BusinessBannerUploaderProps {
  /** Current banner URL (for editing existing banners) */
  currentBanner?: string | null;
  /** Current media type */
  mediaType?: 'image' | 'video';
  /** Callback when banner is successfully uploaded */
  onUpload?: (url: string, type: 'image' | 'video') => void;
  /** Business ID (required for business banner uploads) */
  businessId?: string;
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

export default function BusinessBannerUploader({
  currentBanner,
  mediaType: initialMediaType = 'image',
  onUpload,
  businessId,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger
}: BusinessBannerUploaderProps) {
  // Internal state for standalone mode
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal
  const isControlled = externalOpen !== undefined && externalOnOpenChange !== undefined;
  const isDialogOpen = isControlled ? externalOpen : internalOpen;
  const setIsDialogOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  // Media type state
  const [mediaType, setMediaType] = useState<'image' | 'video'>(initialMediaType);
  
  // Image crop state
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flip, setFlip] = useState(false);
  
  // Video state
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string>("");
  const [videoCropFrame, setVideoCropFrame] = useState<Crop>();
  const [completedVideoCrop, setCompletedVideoCrop] = useState<PixelCrop>();
  const [videoTime, setVideoTime] = useState(0);
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  
  // Preview & upload state
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const videoImgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset all state
  const resetState = useCallback(() => {
    setImgSrc("");
    setVideoSrc("");
    setVideoFile(null);
    setVideoThumbnail("");
    setScale(1);
    setRotate(0);
    setFlip(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setVideoCropFrame(undefined);
    setCompletedVideoCrop(undefined);
    setVideoTime(0);
    setPreviewUrl("");
  }, []);

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

  const onVideoFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (max 100MB for videos)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size should be less than 100MB");
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoThumbnail("");
    setVideoTime(0);
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const onVideoThumbnailLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setVideoCropFrame(centerAspectCrop(width, height));
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
    if (mediaType === 'image' && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height));
    } else if (mediaType === 'video' && videoImgRef.current) {
      const { width, height } = videoImgRef.current;
      setVideoCropFrame(centerAspectCrop(width, height));
    }
  };

  // Extract frame from video at current time
  const extractFrame = useCallback(() => {
    if (!videoRef.current) return;
    
    setIsExtractingFrame(true);
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Failed to extract frame");
      setIsExtractingFrame(false);
      return;
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setVideoThumbnail(dataUrl);
    setIsExtractingFrame(false);
  }, []);

  const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
    const image = mediaType === 'image' ? imgRef.current : videoImgRef.current;
    const completed = mediaType === 'image' ? completedCrop : completedVideoCrop;
    
    if (!image || !completed) return null;

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
    
    if (flip) {
      ctx.translate(BANNER_WIDTH, 0);
    }

    ctx.drawImage(
      image,
      completed.x * scaleX,
      completed.y * scaleY,
      completed.width * scaleX,
      completed.height * scaleY,
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
  }, [mediaType, completedCrop, completedVideoCrop, rotate, scale, flip]);

  const handlePreview = async () => {
    const blob = await getCroppedImg();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsPreviewOpen(true);
    }
  };

  const uploadToServer = async (blob: Blob, isVideo: boolean, originalFile?: File): Promise<string | null> => {
    let file: File;
    
    if (isVideo && originalFile) {
      // For video, use the original video file with correct MIME type
      file = originalFile;
    } else {
      // For images, create a file from the blob
      file = new File(
        [blob], 
        `banner-${Date.now()}.png`, 
        { type: "image/png" }
      );
    }
    
    const formData = new FormData();
    formData.append("file", file);

    let uploadEndpoint: string;

    if (isVideo) {
      // For video banners, upload the actual video file
      if (!videoFile) {
        toast.error("No video file selected");
        return null;
      }
      const videoFormData = new FormData();
      videoFormData.append("file", videoFile);
      if (businessId) {
        videoFormData.append("businessId", businessId);
      }
      
      try {
        const response = await fetch('/api/business/upload', {
          method: "POST",
          body: videoFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to upload video");
        return null;
      }
    } else {
      // For image banners
      uploadEndpoint = '/api/business/upload';
      if (businessId) {
        formData.append("businessId", businessId);
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
    }
  };

  const handleUpload = async () => {
    let blob: Blob | null = null;
    let isVideo = mediaType === 'video' && videoFile !== null;
    let originalFile: File | undefined = undefined;

    if (mediaType === 'image') {
      blob = await getCroppedImg();
      if (!blob) {
        toast.error("Failed to create cropped image");
        return;
      }
    } else if (mediaType === 'video' && videoFile) {
      // For video, we upload the actual video file
      originalFile = videoFile;
      blob = videoFile;
      isVideo = true;
    } else if (mediaType === 'video' && videoThumbnail && !videoFile) {
      // If user extracted a frame from existing video URL and wants to use as image
      blob = await getCroppedImg();
      isVideo = false;
    }

    if (!blob) {
      toast.error("No media to upload");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToServer(blob, isVideo, originalFile);
      if (url) {
        toast.success(isVideo ? "Business video banner uploaded successfully!" : "Business banner uploaded successfully!");
        
        if (onUpload) {
          onUpload(url, isVideo ? 'video' : 'image');
        }
        
        setIsDialogOpen(false);
        resetState();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    resetState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  // If trigger is provided AND dialog is not controlled, render in trigger-only mode
  if (trigger && !isControlled) {
    return (
      <>
        <div onClick={() => setIsDialogOpen(true)}>
          {trigger}
        </div>
        {renderDialog()}
      </>
    );
  }

  // If no trigger and not controlled, show default button
  if (!isControlled && !trigger) {
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
          {defaultTrigger}
        </div>
        {renderDialog()}
      </>
    );
  }

  // If controlled mode (open/onOpenChange provided), don't render any trigger
  // Just render the dialog based on open state
  return renderDialog();

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
            <DialogTitle className="text-xl sm:text-2xl">Business Banner</DialogTitle>
            <DialogDescription className="text-sm sm:text-base mt-1">
              Upload and crop your business banner. Output size: {BANNER_WIDTH}×{BANNER_HEIGHT}px
            </DialogDescription>
          </DialogHeader>

          {/* Media Type Tabs */}
          <div className="px-4 sm:px-6 pt-4">
            <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'image' | 'video')} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="image" className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center justify-center gap-2">
                  <Film className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              {/* Image Tab Content */}
              <TabsContent value="image" className="mt-4">
                {renderImageCropper()}
              </TabsContent>

              {/* Video Tab Content */}
              <TabsContent value="video" className="mt-4">
                {renderVideoUploader()}
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 border-t bg-white dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">
                  Output: {BANNER_WIDTH} × {BANNER_HEIGHT} pixels
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  className="flex-1 sm:flex-none gap-2"
                  disabled={isUploading || (mediaType === 'image' && !completedCrop) || (mediaType === 'video' && !videoSrc && !videoThumbnail)}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Banner
                    </>
                  )}
                </Button>
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

  function renderImageCropper() {
    return (
      <div className="space-y-4">
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
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 cursor-pointer min-h-[300px]">
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
      </div>
    );
  }

  function renderVideoUploader() {
    return (
      <div className="space-y-4">
        {/* Video Preview Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950">
          {!videoSrc ? (
            /* Upload Area */
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer" onClick={() => videoInputRef.current?.click()}>
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 cursor-pointer min-h-[300px]">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Film className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Drop your video here
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4 text-center">
                    or click to browse from your computer
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
                    Supports: MP4, WebM, MOV (Max 100MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full max-h-[40vh] object-contain"
                  controls
                  onTimeUpdate={(e) => setVideoTime(e.currentTarget.currentTime)}
                />
              </div>

              {/* Time Control */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Seek to:</span>
                  <Slider
                    value={[videoTime]}
                    min={0}
                    max={videoRef.current?.duration || 60}
                    step={0.1}
                    onValueChange={([value]) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = value;
                        setVideoTime(value);
                      }
                    }}
                    className="w-32"
                  />
                  <span className="text-xs text-slate-500 w-16">{videoTime.toFixed(1)}s</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={extractFrame}
                  disabled={isExtractingFrame}
                  className="gap-2"
                >
                  {isExtractingFrame ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Scissors className="w-4 h-4" />
                  )}
                  Extract Frame
                </Button>
              </div>

              {/* Thumbnail Crop Area */}
              {videoThumbnail && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CropIcon className="w-4 h-4" />
                    Crop Thumbnail (optional - for preview)
                  </h4>
                  <ReactCrop
                    crop={videoCropFrame}
                    onChange={(c) => setVideoCropFrame(c)}
                    onComplete={(c) => setCompletedVideoCrop(c)}
                    aspect={ASPECT_RATIO}
                    minWidth={100}
                    minHeight={33}
                    className="max-w-full"
                  >
                    <img
                      ref={videoImgRef}
                      alt="Video thumbnail crop"
                      src={videoThumbnail}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "40vh",
                        objectFit: "contain",
                      }}
                      onLoad={onVideoThumbnailLoad}
                      className="rounded-lg shadow-lg"
                    />
                  </ReactCrop>
                </div>
              )}

              {/* Clear Video */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setVideoSrc("");
                  setVideoFile(null);
                  setVideoThumbnail("");
                  if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                  }
                }}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Choose Different Video
              </Button>
            </div>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={onVideoFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }
}
