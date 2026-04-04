import React, { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SharedDashboardHeaderProps {
  title: string;
  userName: string;
  userEmail?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  rightActions?: ReactNode;
  avatar?: ReactNode;
}

export default function SharedDashboardHeader({
  title,
  userName,
  userEmail,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  rightActions,
  avatar,
}: SharedDashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 h-13">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-2">
        <div className="flex items-center md:hidden shrink-0">
          <img src="/logo.png" alt="DigiSense" className="h-8 w-auto" />
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <span className="font-semibold line-clamp-1">{title}</span>
        </div>

        {showSearch && searchValue !== undefined && onSearchChange ? (
          <div className="relative flex-1 min-w-[140px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 rounded-xl border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center leading-tight space-x-2 sm:space-x-4 shrink-0">
          {rightActions}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            {userEmail ? <p className="text-xs text-gray-500">{userEmail}</p> : null}
          </div>
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div className="flex items-center space-x-2">{avatar}</div>
        </div>
      </div>
    </div>
  );
}
