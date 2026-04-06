import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface BusinessHeroSectionProps {
  heroContent: any;
  safeSlides: any[];
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function BusinessHeroSection({
  heroContent,
  safeSlides,
  currentSlideIndex,
  setCurrentSlideIndex,
}: BusinessHeroSectionProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  return (
    <section className="relative w-full mx-auto">
      <div className=" aspect-4/2 bg-center md:aspect-3/1 w-full rounded-xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-gray-900 relative">
        {heroContent.slides && safeSlides.length > 0 ? (
          <>
            {(() => {
              const firstSlide = heroContent.slides[0];
              const isVideo =
                firstSlide.mediaType === "video" ||
                (firstSlide.media &&
                  (firstSlide.media.includes(".mp4") ||
                    firstSlide.media.includes(".webm") ||
                    firstSlide.media.includes(".ogg")));
              const videoUrl = isVideo
                ? firstSlide.media || firstSlide.image
                : null;

              if (isVideo && videoUrl) {
                return (
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={
                      firstSlide.image && firstSlide.image !== videoUrl
                        ? firstSlide.image
                        : undefined
                    }
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = "none";
                    }}
                  />
                );
              }

              return (
                <>
                  <div
                    className="flex transition-transform duration-700 ease-in-out w-full h-full"
                    style={{
                      transform: `translateX(-${currentSlideIndex * 100}%)`,
                    }}
                    onTouchStart={(e) => {
                      setTouchEnd(null);
                      setTouchStart(e.targetTouches[0].clientX);
                    }}
                    onTouchMove={(e) => {
                      setTouchEnd(e.targetTouches[0].clientX);
                    }}
                    onTouchEnd={() => {
                      if (!touchStart || !touchEnd) return;
                      const distance = touchStart - touchEnd;
                      const isLeftSwipe = distance > 50;
                      const isRightSwipe = distance < -50;
                      if (isLeftSwipe) {
                        setCurrentSlideIndex((prev) =>
                          prev < heroContent.slides.length - 1 ? prev + 1 : 0,
                        );
                      }
                      if (isRightSwipe) {
                        setCurrentSlideIndex((prev) =>
                          prev > 0 ? prev - 1 : heroContent.slides.length - 1,
                        );
                      }
                    }}
                    onMouseDown={(e) => {
                      setTouchEnd(null);
                      setTouchStart(e.clientX);
                    }}
                    onMouseMove={(e) => {
                      setTouchEnd(e.clientX);
                    }}
                    onMouseUp={() => {
                      if (!touchStart || !touchEnd) return;
                      const distance = touchStart - touchEnd;
                      const isLeftSwipe = distance > 50;
                      const isRightSwipe = distance < -50;
                      if (isLeftSwipe) {
                        setCurrentSlideIndex((prev) =>
                          prev < heroContent.slides.length - 1 ? prev + 1 : 0,
                        );
                      }
                      if (isRightSwipe) {
                        setCurrentSlideIndex((prev) =>
                          prev > 0 ? prev - 1 : heroContent.slides.length - 1,
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      setTouchStart(null);
                      setTouchEnd(null);
                    }}
                  >
                    {safeSlides
                      .filter((slide: any) => slide !== null && slide !== undefined)
                      .map((slide: any, index: number) => {
                        const mediaUrl = slide.media || slide.image;
                        return (
                          <div
                            key={index}
                            className="w-full shrink-0 h-full relative"
                          >
                            {mediaUrl && mediaUrl.trim() !== "" ? (
                              <img
                                src={getOptimizedImageUrl(mediaUrl, {
                                  width: 1600,
                                  quality: 90,
                                  format: "auto",
                                  crop: "fill",
                                  gravity: "auto",
                                })}
                                alt={`Slide ${index + 1}`}
                                className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${
                                  index === currentSlideIndex
                                    ? "scale-105"
                                    : "scale-100"
                                }`}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <ImageOff className="h-12 w-12 md:h-24 md:w-24 text-gray-300" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {heroContent.showArrows !== false && safeSlides.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentSlideIndex((prev) =>
                            prev > 0 ? prev - 1 : heroContent.slides.length - 1,
                          )
                        }
                        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full p-1 md:p-3 transition-all duration-300 hover:scale-110 z-20 group/btn"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="h-3 w-3 md:h-5 md:w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentSlideIndex((prev) =>
                            prev < heroContent.slides.length - 1 ? prev + 1 : 0,
                          )
                        }
                        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full p-1 md:p-3 transition-all duration-300 hover:scale-110 z-20 group/btn"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="h-3 w-3 md:h-5 md:w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </>
                  )}

                  {heroContent.showDots !== false && safeSlides.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center space-x-2 md:space-x-3 z-20">
                      {safeSlides
                        .filter((slide: any) => slide !== null && slide !== undefined)
                        .map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlideIndex(index)}
                            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                              index === currentSlideIndex
                                ? "w-4 md:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "w-1.5 md:w-2 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <ImageOff className="h-12 w-12 md:h-24 md:w-24 text-gray-300 mb-2" />
            <p className="text-sm md:text-lg text-gray-500 font-medium">
              No banner configured
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
