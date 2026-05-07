"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Zap,
  ChefHat,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  ShoppingBag,
  Coffee,
  Utensils,
  Wrench,
  Truck,
  Plane,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  design: Palette,
  web: Globe,
  mobile: Smartphone,
  database: Database,
  cloud: Cloud,
  security: Shield,
  zap: Zap,
  restaurant: ChefHat,
  automotive: Car,
  realestate: Home,
  business: Briefcase,
  education: GraduationCap,
  healthcare: Heart,
  retail: ShoppingBag,
  cafe: Coffee,
  food: Utensils,
  repair: Wrench,
  transport: Truck,
  travel: Plane,
}

interface ServiceCardProps {
  name: string
  description?: string
  price?: string
  icon?: string
  className?: string
}

export default function ServiceCard({
  name,
  description,
  price,
  icon = "code",
  className,
}: ServiceCardProps) {
  const IconComponent = iconMap[icon.toLowerCase()] || Code

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all duration-300 border-slate-200",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
          <IconComponent className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-slate-500 mb-2 line-clamp-2">{description}</p>
        )}
        {price && (
          <p className="text-sm font-medium text-blue-600">{price}</p>
        )}
      </CardContent>
    </Card>
  )
}
