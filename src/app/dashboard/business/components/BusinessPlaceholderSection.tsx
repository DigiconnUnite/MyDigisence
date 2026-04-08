import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessPlaceholderSectionProps {
  heading: string;
  subtitle: string;
  cardTitle: string;
  cardDescription: string;
  icon: LucideIcon;
}

export function BusinessPlaceholderSection({
  heading,
  subtitle,
  cardTitle,
  cardDescription,
  icon: Icon,
}: BusinessPlaceholderSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">{heading}</h1>
        <p className="text-md text-gray-600">{subtitle}</p>
      </div>
      <Card className="rounded-3xl">
        <CardContent className="text-center py-12">
          <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{cardTitle}</h3>
          <p className="text-gray-600">{cardDescription}</p>
        </CardContent>
      </Card>
    </div>
  );
}