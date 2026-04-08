import { type ComponentProps } from "react";
import { Card, CardContent } from "@/components/ui/card";
import HeroBannerManager from "@/components/ui/hero-banner-manager";

type HeroBannerContent = ComponentProps<typeof HeroBannerManager>["heroContent"];

interface BusinessHeroSectionProps {
  heroContent: HeroBannerContent;
  onChange: (nextContent: HeroBannerContent) => Promise<void>;
}

export function BusinessHeroSection({
  heroContent,
  onChange,
}: BusinessHeroSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Hero Banner</h1>
        <p className="text-md text-gray-600">Manage your hero section</p>
      </div>

      <Card className="rounded-3xl p-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <HeroBannerManager heroContent={heroContent} onChange={onChange} />
        </CardContent>
      </Card>
    </div>
  );
}