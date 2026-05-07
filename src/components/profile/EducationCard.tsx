"use client"

import { GraduationCap, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Education {
  degree: string
  institution: string
  year?: string
  description?: string
}

interface EducationCardProps {
  education: Education[]
  className?: string
}

export default function EducationCard({ education, className }: EducationCardProps) {
  if (education.length === 0) {
    return (
      <div className={cn("text-center py-8 text-slate-500", className)}>
        No education listed
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {education.map((edu, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
            <p className="text-sm text-slate-600">{edu.institution}</p>
            {edu.year && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{edu.year}</span>
              </div>
            )}
            {edu.description && (
              <p className="text-sm text-slate-500 mt-2">{edu.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
