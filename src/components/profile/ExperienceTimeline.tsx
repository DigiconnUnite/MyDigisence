"use client"

import { Briefcase, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Experience {
  title: string
  company: string
  duration: string
  description?: string
  location?: string
}

interface ExperienceTimelineProps {
  experiences: Experience[]
  className?: string
}

export default function ExperienceTimeline({
  experiences,
  className,
}: ExperienceTimelineProps) {
  if (experiences.length === 0) {
    return (
      <div className={cn("text-center py-8 text-slate-500", className)}>
        No work experience listed
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Timeline Line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-12 sm:pl-16">
            {/* Timeline Dot */}
            <div className="absolute left-2 sm:left-4 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />

            {/* Content */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.duration}</span>
                </div>
              </div>

              {exp.location && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              )}

              {exp.description && (
                <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
