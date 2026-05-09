"use client"

import { cn } from "@/lib/utils"
import { 
  Home, 
  Info, 
  Briefcase, 
  UtensilsCrossed, 
  Image, 
  Star, 
  MessageSquare, 
  Trophy 
} from "lucide-react"

interface Tab {
  id: string
  label: string
  count?: number
  icon?: any
}

interface ProfileTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
}

const tabIcons: Record<string, any> = {
  overview: Home,
  about: Info,
  services: Briefcase,
  menu: UtensilsCrossed,
  photos: Image,
  reviews: Star,
  highlights: Trophy,
}

export default function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
}: ProfileTabsProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block p-1 bg-zinc-50 border-none">
        <div className="max-w-[1440px] bg-white mx-auto rounded-sm border px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 sm:gap-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative px-3 sm:px-4 py-3 cursor-pointer  text-sm font-semibold transition-colors whitespace-nowrap",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
                  activeTab === tab.id
                    ? "text-slate-600"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={cn(
                      "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                      activeTab === tab.id
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
                
                {/* Active Indicator */}
                {variant === "underline" && activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white  shadow-top shadow-xl z-50">
        <div className="flex justify-around items-center ">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.id] || Home
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-none p-2 transition-colors min-w-0 max-w-20",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  activeTab === tab.id
                    ? "bg-blue-50 text-slate-800 border-t-3 border-slate-800"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate max-w-16">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {tab.count > 99 ? "99+" : tab.count}
                  </span>
                )}
              </button>
            )})}
        </div>
      </div>
    </>
  )
}
