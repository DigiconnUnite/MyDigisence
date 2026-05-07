"use client"

import { cn } from "@/lib/utils"

interface SkillBarProps {
  name: string
  percentage: number
  color?: string
  className?: string
}

export default function SkillBar({
  name,
  percentage,
  color = "bg-blue-600",
  className,
}: SkillBarProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="text-sm text-slate-500">{percentage}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
