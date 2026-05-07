"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { QrCode, Download, Share2 } from "lucide-react"

interface QRCodeSectionProps {
  qrCodeUrl?: string
  profileUrl: string
  title?: string
  description?: string
  onDownload?: () => void
  onShare?: () => void
  className?: string
}

export default function QRCodeSection({
  qrCodeUrl,
  profileUrl,
  title = "Scan to Connect",
  description = "Save this professional to your network",
  onDownload,
  onShare,
  className,
}: QRCodeSectionProps) {
  return (
    <Card className={cn("border-slate-200", className)}>
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-blue-600" />
          {title}
        </h3>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded-xl border-2 border-slate-100 shadow-sm">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={160}
                  height={160}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                  <QrCode className="w-12 h-12 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <p className="text-sm text-slate-600">{description}</p>
            <p className="text-xs text-slate-400 break-all">{profileUrl}</p>

            <div className="flex flex-wrap gap-2">
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
