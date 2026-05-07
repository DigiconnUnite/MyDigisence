"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ExternalLink, ImageIcon } from "lucide-react"

interface PortfolioCardProps {
  title: string
  description?: string
  image?: string
  link?: string
  technologies?: string[]
  className?: string
}

export default function PortfolioCard({
  title,
  description,
  image,
  link,
  technologies = [],
  className,
}: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card
      className={cn(
        "group overflow-hidden border-slate-200 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {image && !imageError ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Link Button */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{description}</p>
        )}
        
        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 3).map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-slate-100 text-slate-600"
              >
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
