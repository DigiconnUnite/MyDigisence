"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface UnifiedModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function UnifiedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className = "",
  showCloseButton = false,
}: UnifiedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          " max-h-[90vh] max-w-[90vw] w-full p-0 overflow-hidden flex flex-col bg-white rounded-xl border-2 border-slate-600 shadow-xl",
          "top-[50%] translate-y-[-50%]  left-1/2 translate-x-[-50%] ",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        {/* 1. Fixed Header */}
        <DialogHeader className="px-6 py-5 border-b border-gray-200 shrink-0 bg-white z-10 text-left">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-gray-900 leading-none tracking-tight">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-gray-500 font-normal text-left">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
          {children}
        </div>

        {/* 3. Fixed Footer (Optional) */}
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-white shrink-0 z-10 flex flex-row justify-end gap-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
