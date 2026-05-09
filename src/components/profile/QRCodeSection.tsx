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
    <Card className={cn("bg-linear-0 from-slate-900 to-slate-950 border-slate-800", className)}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            {title}
          </h3>

          {/* QR Code - Centered */}
          <div className="flex justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-3 rounded-xl shadow-lg border-2 border-slate-700">
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

          {/* Info - Centered */}
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{description}</p>
            <p className="text-xs text-slate-400 break-all px-4">{profileUrl}</p>

            <div className="flex justify-center gap-2">
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload} className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare} className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
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
