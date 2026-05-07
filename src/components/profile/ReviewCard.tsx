"use client"

import Image from "next/image"
import { Star, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ReviewCardProps {
  rating: number
  title?: string
  content: string
  authorName: string
  authorImage?: string
  isVerified?: boolean
  createdAt: string | Date
  className?: string
}

export default function ReviewCard({
  rating,
  title,
  content,
  authorName,
  authorImage,
  isVerified = false,
  createdAt,
  className,
}: ReviewCardProps) {
  const formattedDate =
    typeof createdAt === "string"
      ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
      : formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div className={cn("bg-white rounded-xl p-4 border border-slate-100", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
            {authorImage ? (
              <Image
                src={authorImage}
                alt={authorName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Author Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-900">{authorName}</span>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </div>
            <span className="text-xs text-slate-500">{formattedDate}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-slate-200 text-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {title && <h4 className="font-medium text-slate-900 mb-2">{title}</h4>}
      <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
    </div>
  )
}
