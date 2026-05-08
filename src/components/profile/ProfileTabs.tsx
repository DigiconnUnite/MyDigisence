"use client"

import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  count?: number
}

interface ProfileTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
}

export default function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
}: ProfileTabsProps) {
  return (
    <div className="border-b border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 sm:gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {tab.count}
                </span>
              )}
              
              {/* Active Indicator */}
              {variant === "underline" && activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
