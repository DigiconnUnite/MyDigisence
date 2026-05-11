"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit3, User, Briefcase, Award, Clock, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePreviewProps {
  professional?: {
    id?: string;
    name?: string;
    headline?: string;
    location?: string;
    about?: string;
    avatar?: string;
    banner?: string;
    isVerified?: boolean;
    stats?: {
      projects?: number;
      clients?: number;
      experience?: number;
      support?: string;
    };
  };
  isLoading?: boolean;
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

const defaultProfessional = {
  name: "Shivam Thakur",
  headline: "Full Stack Developer",
  location: "Agra, Uttar Pradesh, India",
  about: "Passionate full stack developer with expertise in building scalable web applications. I love turning ideas into real-world digital products.",
  isVerified: true,
  stats: {
    projects: 120,
    clients: 80,
    experience: 5,
    support: "24/7",
  },
};

export default function ProfilePreview({
  professional,
  isLoading = false,
  onViewProfile,
  onEditProfile,
}: ProfilePreviewProps) {
  const data = { ...defaultProfessional, ...professional };

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

  const stats = [
    { icon: Briefcase, value: `${data.stats?.projects || 0}+`, label: "Projects" },
    { icon: User, value: `${data.stats?.clients || 0}+`, label: "Happy Clients" },
    { icon: Award, value: `${data.stats?.experience || 0}+`, label: "Years Exp." },
    { icon: Clock, value: data.stats?.support || "24/7", label: "Support" },
  ];

  return (
    <Card className="p-0 overflow-hidden bg-white border border-gray-100">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="px-4 pb-4">
        {/* Avatar */}
        <div className="relative -mt-10 mb-3">
          <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt={data.name}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </div>
          {data.isVerified && (
            <div className="absolute bottom-0 right-0 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            {data.isVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{data.headline}</p>
          <p className="text-xs text-gray-400 mt-1">{data.location}</p>
        </div>

        {/* About */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{data.about}</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
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
