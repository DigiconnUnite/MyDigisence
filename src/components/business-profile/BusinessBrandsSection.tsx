import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getOptimizedImageUrl, generateSrcSet } from "@/lib/image-utils";
import { Image } from "lucide-react";

interface BusinessBrandsSectionProps {
  brands: any[];
  viewAllBrands: boolean;
  setViewAllBrands: (value: boolean) => void;
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

function BrandCard({
  brand,
  selectedBrand,
  onSelectBrand,
}: {
  brand: any;
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}) {
  return (
    <div
      className="flex flex-col h-full cursor-pointer transition-all duration-300"
      onClick={() => onSelectBrand(selectedBrand === brand.name ? null : brand.name)}
    >
      <Card
        className={`overflow-hidden rounded-2xl p-0 md:rounded-3xl cursor-pointer transition-all duration-300 h-full flex items-center justify-center flex-col ${
          selectedBrand === brand.name
            ? "bg-orange-50 border-2 border-orange-400 shadow-2xl"
            : "bg-white/70 hover:bg-white/90 hover:shadow-md"
        }`}
      >
        <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-50/50">
          {brand.logo && brand.logo.trim() !== "" ? (
            <img
              src={getOptimizedImageUrl(brand.logo, {
                width: 400,
                height: 300,
                quality: 85,
                format: "auto",
              })}
              srcSet={generateSrcSet(brand.logo)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              alt={brand.name}
              className="w-full my-auto mx-auto h-auto object-contain max-h-[180px]"
              loading="lazy"
            />
          ) : (
            <Image className="h-10 w-10 text-gray-400" />
          )}
        </div>
      </Card>
      <p
        className={`text-center text-xs md:text-base mt-2 font-semibold transition-colors wrap-break-word ${
          selectedBrand === brand.name
            ? "text-orange-400 font-700"
            : "text-gray-700 font-semibold"
        }`}
      >
        {brand.name}
      </p>
    </div>
  );
}

export default function BusinessBrandsSection({
  brands,
  viewAllBrands,
  setViewAllBrands,
  selectedBrand,
  onSelectBrand,
  sectionRef,
}: BusinessBrandsSectionProps) {
  if (!brands.length) return null;

  return (
    <section id="brands" ref={sectionRef} className="py-6 md:py-12 px-0">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold">Trusted By</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setViewAllBrands(!viewAllBrands);
            }}
          >
            {viewAllBrands ? "Show Less" : "View All"}
          </Button>
        </div>

        {viewAllBrands ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {brands
              .filter((brand: any) => brand !== null && brand !== undefined)
              .map((brand: any, index: number) => (
                <BrandCard
                  key={index}
                  brand={brand}
                  selectedBrand={selectedBrand}
                  onSelectBrand={onSelectBrand}
                />
              ))}
          </div>
        ) : (
          <Carousel
            opts={{
              loop: true,
              dragFree: false,
              align: "start",
              watchDrag: true,
              watchResize: true,
              watchSlides: true,
            }}
            className="w-full"
            suppressHydrationWarning
          >
            <CarouselContent>
              {brands
                .filter((brand: any) => brand !== null && brand !== undefined)
                .map((brand: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 md:basis-1/4 lg:basis-1/5"
                  >
                    <BrandCard
                      brand={brand}
                      selectedBrand={selectedBrand}
                      onSelectBrand={onSelectBrand}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-2 md:left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
              <CarouselNext className="right-2 md:right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
