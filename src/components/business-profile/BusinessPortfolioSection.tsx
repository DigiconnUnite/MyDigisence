"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image, Minus, Plus, X } from "lucide-react";
import { generateSrcSet, getOptimizedImageUrl } from "@/lib/image-utils";

interface BusinessPortfolioSectionProps {
  images: any[];
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function BusinessPortfolioSection({
  images,
  sectionRef,
}: BusinessPortfolioSectionProps) {
  const validImages = useMemo(
    () => images.filter((image: any) => image !== null && image !== undefined),
    [images],
  );
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);
  const touchPanStartRef = useRef<{ x: number; y: number } | null>(null);

  const selectedPreview =
    previewIndex !== null ? validImages[previewIndex] : null;
  const isPreviewVideo =
    Boolean(selectedPreview?.url) &&
    (selectedPreview.url.includes(".mp4") ||
      selectedPreview.url.includes(".webm") ||
      selectedPreview.url.includes(".ogg"));

  useEffect(() => {
    if (!selectedPreview) {
      setZoomScale(1);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [selectedPreview]);

  useEffect(() => {
    if (zoomScale <= 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoomScale]);

  if (!images.length) return null;

  const closePreview = () => {
    setPreviewIndex(null);
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const zoomIn = () => setZoomScale((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoomScale((prev) => Math.max(prev - 0.5, 1));

  const goToPrevious = () => {
    if (previewIndex === null || validImages.length <= 1) return;
    setPreviewIndex((previewIndex - 1 + validImages.length) % validImages.length);
  };

  const goToNext = () => {
    if (previewIndex === null || validImages.length <= 1) return;
    setPreviewIndex((previewIndex + 1) % validImages.length);
  };

  const getTouchDistance = (touches: React.TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomScale <= 1 || isPreviewVideo) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging || !dragStartRef.current || zoomScale <= 1 || isPreviewVideo) {
      return;
    }
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (isPreviewVideo) return;

    if (e.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(e.touches);
      pinchStartScaleRef.current = zoomScale;
      touchPanStartRef.current = null;
      return;
    }

    if (e.touches.length === 1 && zoomScale > 1) {
      touchPanStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (isPreviewVideo) return;

    if (e.touches.length === 2 && pinchStartDistanceRef.current) {
      const currentDistance = getTouchDistance(e.touches);
      const nextScale = Math.min(
        Math.max(
          pinchStartScaleRef.current *
            (currentDistance / pinchStartDistanceRef.current),
          1,
        ),
        3,
      );
      setZoomScale(nextScale);
      e.preventDefault();
      return;
    }

    if (e.touches.length === 1 && zoomScale > 1 && touchPanStartRef.current) {
      setPan({
        x: e.touches[0].clientX - touchPanStartRef.current.x,
        y: e.touches[0].clientY - touchPanStartRef.current.y,
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length < 2) {
      pinchStartDistanceRef.current = null;
    }

    if (e.touches.length === 0) {
      touchPanStartRef.current = null;
    }
  };

  return (
    <section className="w-full my-8 md:my-12 px-0" id="portfolio" ref={sectionRef}>
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold">Portfolio</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {validImages.map((image: any, index: number) => {
            const isVideo =
              image.url &&
              (image.url.includes(".mp4") ||
                image.url.includes(".webm") ||
                image.url.includes(".ogg"));

            return (
              <div
                key={index}
                className="bg-gray-100 border rounded-xl shadow-sm flex items-center justify-center hover:shadow transition-shadow bg-center bg-cover relative overflow-hidden aspect-3/2 cursor-pointer"
                onClick={() => {
                  if (!image?.url) return;
                  setPreviewIndex(index);
                }}
              >
                {isVideo ? (
                  <video
                    src={image.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    style={{ pointerEvents: "none" }}
                  />
                ) : image.url ? (
                  <img
                    src={getOptimizedImageUrl(image.url, {
                      width: 1200,
                      height: 800,
                      quality: 85,
                      format: "auto",
                      crop: "fill",
                      gravity: "auto",
                    })}
                    srcSet={generateSrcSet(image.url)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={image.alt || "Portfolio image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="flex items-center justify-center rounded-full bg-gray-200 w-10 h-10 md:w-14 md:h-14">
                    <Image className="text-gray-400 w-6 h-6 md:w-8 md:h-8" />
                  </span>
                )}

                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg
                        className="w-4 h-4 md:w-6 md:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {selectedPreview?.url && (
        <div className="fixed inset-0 z-110 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
            <p className="text-white text-sm truncate pr-2">
              {selectedPreview.alt || "Portfolio Preview"}
            </p>
            <div className="flex items-center gap-2">
              {!isPreviewVideo && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={zoomOut}
                    disabled={zoomScale <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={zoomIn}
                    disabled={zoomScale >= 3}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              )}
              {validImages.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={closePreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4 md:p-6 touch-none">
            <div className="h-full w-full flex items-center justify-center">
              {isPreviewVideo ? (
                <video
                  src={selectedPreview.url}
                  className="max-h-full max-w-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={getOptimizedImageUrl(selectedPreview.url, {
                    width: 1800,
                    quality: 92,
                    format: "auto",
                    crop: "fill",
                    gravity: "auto",
                  })}
                  srcSet={generateSrcSet(selectedPreview.url)}
                  sizes="100vw"
                  alt={selectedPreview.alt || "Portfolio image"}
                  className={`max-h-full max-w-full object-contain select-none transition-transform ${
                    zoomScale > 1
                      ? isDragging
                        ? "cursor-grabbing"
                        : "cursor-grab"
                      : "cursor-default"
                  }`}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
                    transformOrigin: "center",
                  }}
                  loading="eager"
                  decoding="async"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  draggable={false}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
