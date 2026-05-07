"use client"

import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  className?: string
}

export default function StatCard({ icon, value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-slate-50",
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}
