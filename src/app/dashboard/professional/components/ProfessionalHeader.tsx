"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Bell,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProfessionalHeaderProps {
  onMenuClick?: () => void;
  professionalSlug?: string;
  notificationCount?: number;
  messageCount?: number;
}

export default function ProfessionalHeader({
  onMenuClick,
  professionalSlug,
  notificationCount = 0,
  messageCount = 0,
}: ProfessionalHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = searchRef.current?.querySelector("input");
        searchInput?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleViewPublicProfile = () => {
    if (professionalSlug) {
      window.open(`/pcard/${professionalSlug}`, "_blank");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div 
          ref={searchRef}
          className={cn(
            "hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 transition-all duration-200",
            isSearchFocused && "ring-2 ring-blue-500/20 bg-white border border-blue-200"
          )}
        >
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-64 lg:w-80 px-0 text-sm"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* View Public Profile */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewPublicProfile}
          className="hidden sm:flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <ExternalLink className="h-4 w-4" />
          View Public Profile
        </Button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Messages */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <MessageSquare className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {messageCount > 9 ? "9+" : messageCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {user?.name || "Professional"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === "PROFESSIONAL_ADMIN" ? "Full Stack Developer" : "User"}
                </p>
              </div>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={() => router.push("/dashboard/professional/profile")}>
              <User className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/professional/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
