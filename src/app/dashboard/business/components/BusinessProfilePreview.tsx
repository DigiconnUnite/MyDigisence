"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit3, Building, Shield, MapPin } from "lucide-react";

interface BusinessProfilePreviewProps {
  business?: {
    name?: string;
    category?: string;
    location?: string;
    description?: string;
    logo?: string | null;
    isVerified?: boolean;
  };
  stats?: {
    products?: number;
    inquiries?: number;
    rating?: number;
    years?: string;
  };
  isLoading?: boolean;
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

const defaultBusiness = {
  name: "Your Business",
  category: "Business",
  location: "Location not set",
  description: "Complete your business profile to improve visibility.",
  isVerified: false,
};

export default function BusinessProfilePreview({
  business,
  stats,
  isLoading = false,
  onViewProfile,
  onEditProfile,
}: BusinessProfilePreviewProps) {
  const data = { ...defaultBusiness, ...business };
  const previewStats = [
    { label: "Products", value: `${stats?.products ?? 0}` },
    { label: "Inquiries", value: `${stats?.inquiries ?? 0}` },
    { label: "Rating", value: `${stats?.rating ?? 0}` },
    { label: "Years", value: stats?.years ?? "-" },
  ];

  if (isLoading) {
    return (
      <Card className="p-0 overflow-hidden animate-pulse">
        <div className="h-24 bg-gray-200" />
        <div className="px-4 pb-4">
          <div className="relative -mt-10 mb-3">
            <div className="h-20 w-20 bg-gray-200 rounded-full border-4 border-white" />
          </div>
          <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-16 w-full bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden bg-white border border-gray-100">
      <div className="relative h-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="px-4 pb-4">
        <div className="relative -mt-10 mb-3">
          <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center overflow-hidden">
            {data.logo ? (
              <Image
                src={data.logo}
                alt={data.name || "Business"}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <Building className="h-10 w-10 text-white" />
            )}
          </div>
          {data.isVerified && (
            <div className="absolute bottom-0 right-0 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            {data.isVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{data.category}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {data.location}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{data.description}</p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {previewStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 hover:bg-gray-50"
            onClick={onViewProfile}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={onEditProfile}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}
