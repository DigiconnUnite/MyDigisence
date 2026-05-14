"use client";

import React from "react";
import SharedSidebar from "../components/SharedSidebar";
import SharedDashboardHeader from "../components/SharedDashboardHeader";
import DashboardLoading from "../components/DashboardLoading";
import type { HeaderSearchResult } from "../components/SharedDashboardHeader";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  mobileIcon: LucideIcon;
  value: string;
  mobileTitle: string;
}

interface RoleDashboardLayoutProps {
  role: "SUPER_ADMIN" | "BUSINESS_ADMIN" | "PROFESSIONAL_ADMIN" | "USER";
  title: string;
  headerIcon: LucideIcon;
  navLinks: NavItem[];
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void | Promise<void>;
  onSettings?: () => void;
  userName: string;
  userEmail?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchResults?: HeaderSearchResult[];
  recentSearches?: HeaderSearchResult[];
  onSearchResultSelect?: (result: HeaderSearchResult) => void;
  showSearch?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  overlayContent?: React.ReactNode;
  notificationBell?: React.ReactNode;
}

export default function RoleDashboardLayout({
  role,
  title,
  headerIcon,
  navLinks,
  currentView,
  onViewChange,
  onLogout,
  onSettings,
  userName,
  userEmail,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchResults,
  recentSearches,
  onSearchResultSelect,
  showSearch = true,
  isLoading = false,
  children,
  overlayContent,
  notificationBell,
}: RoleDashboardLayoutProps) {
  if (isLoading) {
    return <DashboardLoading title={title} navItemCount={navLinks.length} showSearch={showSearch} />;
  }

  return (
    <div className="max-h-screen min-h-screen relative flex justify-center">
      <div className="fixed inset-0 bg-zinc-100 -z-10"></div>

      <div className="flex flex-1 overflow-hidden max-w-[1440px] w-full mx-auto border-r border-l border-gray-200">
        <SharedSidebar
          navLinks={navLinks}
          currentView={currentView}
          onViewChange={onViewChange}
          onLogout={onLogout}
          onSettings={onSettings}
          isMobile={false}
          headerTitle={title}
          headerIcon={headerIcon}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <SharedDashboardHeader
            title={title}
            userName={userName}
            userEmail={userEmail}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            searchResults={searchResults}
            recentSearches={recentSearches}
            onSearchResultSelect={onSearchResultSelect}
            showSearch={showSearch}
            notificationBell={notificationBell}
            avatar={
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <headerIcon className="h-4 w-4 text-white" />
              </div>
            }
          />

          <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
            <div className="p-4 max-w-7xl mx-auto sm:p-6">{children}</div>
          </div>
        </div>
      </div>

      {overlayContent}
    </div>
  );
}
