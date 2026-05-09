"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { displayPhoneNumber } from "@/lib/phone-utils"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Navigation,
} from "lucide-react"

interface ContactCardProps {
  address?: string
  phone?: string
  email?: string
  website?: string
  hours?: Array<{
    day: string
    time: string
    isOpen?: boolean
  }>
  showDirections?: boolean
  className?: string
}

export default function ContactCard({
  address,
  phone,
  email,
  website,
  hours,
  showDirections = true,
  className,
}: ContactCardProps) {
  return (
    <Card className={cn("border-slate-200", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        {address && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">Address</p>
              <p className="text-sm text-slate-600 break-words">{address}</p>
              {showDirections && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                >
                  <Navigation className="w-3 h-3" />
                  Get Directions
                </a>
              )}
            </div>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Phone</p>
              <a
                href={`tel:${phone}`}
                className="text-sm text-slate-600 hover:text-blue-600"
              >
                {displayPhoneNumber(phone)}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-sm text-slate-600 hover:text-blue-600 break-all"
              >
                {email}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {website && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">Website</p>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-blue-600 break-all"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        )}

        {/* Hours */}
        {hours && hours.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 mb-2">Business Hours</p>
              <div className="space-y-1">
                {hours.map((hour, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600">{hour.day}</span>
                    <span
                      className={
                        hour.isOpen === false
                          ? "text-red-500"
                          : "text-slate-900"
                      }
                    >
                      {hour.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
