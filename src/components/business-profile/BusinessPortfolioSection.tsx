import { Image } from "lucide-react";
import { generateSrcSet, getOptimizedImageUrl } from "@/lib/image-utils";

interface BusinessPortfolioSectionProps {
  images: any[];
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function BusinessPortfolioSection({
  images,
  sectionRef,
}: BusinessPortfolioSectionProps) {
  if (!images.length) return null;

  return (
    <section className="w-full my-8 md:my-12 px-0" id="portfolio" ref={sectionRef}>
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold">Portfolio</h2>
      </div>

      <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 md:grid-rows-2">
        {images
          .filter((image: any) => image !== null && image !== undefined)
          .slice(0, 6)
          .map((image: any, index: number) => {
            const gridClasses = [
              "md:row-span-1 md:col-span-2 col-span-2 row-span-2",
              "md:row-span-1 md:col-span-2 col-span-2 row-span-2",
              "md:row-span-1 md:col-span-1 col-span-1",
              "md:row-span-1 md:col-span-1 col-span-1",
              "md:row-span-1 md:col-span-1 col-span-1",
              "md:row-span-1 md:col-span-1 col-span-1",
            ];

            const isVideo =
              image.url &&
              (image.url.includes(".mp4") ||
                image.url.includes(".webm") ||
                image.url.includes(".ogg"));

            return (
              <div
                key={index}
                className={`bg-gray-100 border rounded-xl shadow-sm flex items-center justify-center hover:shadow transition-shadow bg-center bg-cover relative overflow-hidden ${gridClasses[index] || "md:row-span-1 md:col-span-1"} ${index === 0 || index === 1 ? "min-h-[140px] md:min-h-[180px]" : "min-h-[100px] md:min-h-[120px]"}`}
                style={{
                  aspectRatio: index === 0 || index === 1 ? "2/1" : "1/1",
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
                      width: index === 0 || index === 1 ? 600 : 300,
                      height: index === 0 || index === 1 ? 300 : 300,
                      quality: 85,
                      format: "auto",
                      crop: "fill",
                      gravity: "auto",
                    })}
                    srcSet={generateSrcSet(image.url)}
                    sizes={
                      index === 0 || index === 1
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    }
                    alt={image.alt || "Portfolio image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span
                    className={`flex items-center justify-center rounded-full bg-gray-200 ${index === 0 || index === 1 ? "w-[60px] h-[60px] md:w-20 md:h-20" : "w-10 h-10 md:w-14 md:h-14"}`}
                  >
                    <Image
                      className={`text-gray-400 ${index === 0 || index === 1 ? "w-8 h-8 md:w-10 md:h-10" : "w-6 h-6 md:w-8 md:h-8"}`}
                    />
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
    </section>
  );
}
