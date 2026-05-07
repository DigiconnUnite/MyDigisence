"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Phone, MessageCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

interface StickyCTAProps {
  phone?: string
  onMessage?: () => void
  type: "professional" | "business"
  className?: string
}

export default function StickyCTA({
  phone,
  onMessage,
  type,
  className,
}: StickyCTAProps) {
  if (!phone && !onMessage) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-lg z-50 md:hidden",
        className
      )}
    >
      <div className="flex gap-2">
        {type === "business" && phone && (
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </a>
          </Button>
        )}

        {type === "professional" && onMessage && (
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onMessage}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        )}

        {phone && (
          <Button
            variant="outline"
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
            asChild
          >
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
