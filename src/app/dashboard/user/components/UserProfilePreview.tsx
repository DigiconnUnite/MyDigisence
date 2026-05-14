"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, User } from "lucide-react";

interface UserProfilePreviewProps {
  user?: {
    name?: string;
    avatar?: string;
    memberSince?: string;
    location?: string;
    bio?: string;
  };
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

export default function UserProfilePreview({
  user,
  onViewProfile,
  onEditProfile,
}: UserProfilePreviewProps) {
  const data = user || {};

  return (
    <Card className="p-0 overflow-hidden bg-white border border-gray-100">
      {/* Banner placeholder */}
      <div className="relative h-24 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600" />

      <div className="px-4 pb-4">
        {/* Avatar */}
        <div className="relative -mt-10 mb-3">
          <div className="h-20 w-20 rounded-full border-4 border-white bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt={data.name || "Profile avatar"}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{data.name || "Your profile"}</h3>
          <p className="text-xs text-gray-400 mt-1">{data.location || "Location not set"}</p>
          <p className="text-xs text-gray-400">Member since {data.memberSince || "recently"}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{data.bio || "Add a short bio to introduce yourself."}</p>

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