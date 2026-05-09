"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SharedSidebar from "../../components/SharedSidebar";
import SharedDashboardHeader from "../../components/SharedDashboardHeader";
import DashboardLoading from "../../components/DashboardLoading";
import type { HeaderSearchResult } from "../../components/SharedDashboardHeader";

type AdminLoadingLayoutProps = {
  navItemCount?: number;
};

type AdminDashboardLayoutProps = {
  isMobile: boolean;
  navLinks: any[];
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void | Promise<void>;
  onSettings: () => void;
  userName: string;
  userEmail?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchResults?: HeaderSearchResult[];
  recentSearches?: HeaderSearchResult[];
  onSearchResultSelect?: (result: HeaderSearchResult) => void;
  middleContent: React.ReactNode;
  overlayContent?: React.ReactNode;
};

export function AdminLoadingLayout({ navItemCount = 6 }: AdminLoadingLayoutProps) {
  return <DashboardLoading title="Super Admin" navItemCount={navItemCount} showSearch={true} />;
}

export function AdminDashboardLayout({
  isMobile,
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
  middleContent,
  overlayContent,
}: AdminDashboardLayoutProps) {
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
          isMobile={isMobile}
          headerTitle="Super Admin"
          headerIcon={Shield}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <SharedDashboardHeader
            title="Super Admin"
            userName={userName}
            userEmail={userEmail}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            searchResults={searchResults}
            recentSearches={recentSearches}
            onSearchResultSelect={onSearchResultSelect}
            showSearch={true}
            avatar={
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
              </div>
            }
          />

          <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
            <div className="p-4 max-w-7xl mx-auto sm:p-6">{middleContent}</div>
          </div>
        </div>
      </div>

      {overlayContent}
    </div>
  );
}