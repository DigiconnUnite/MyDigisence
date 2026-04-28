import { User } from "lucide-react";
import { getOptimizedImageUrl, handleImageError } from "@/lib/image-utils";

interface BusinessHeaderAvatarProps {
  businessName: string;
  logoUrl: string | null;
}

export function BusinessHeaderAvatar({
  businessName,
  logoUrl,
}: BusinessHeaderAvatarProps) {
  if (logoUrl) {
    return (
      <img
        src={getOptimizedImageUrl(logoUrl, {
          width: 32,
          height: 32,
          quality: 85,
          format: "auto",
        })}
        alt={`${businessName} logo`}
        className="w-8 h-8 rounded-full object-cover border border-gray-200"
        onError={handleImageError}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <User className="h-4 w-4 text-gray-400" />
    </div>
  );
}