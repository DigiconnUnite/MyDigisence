"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SharedSidebar from "../../components/SharedSidebar";
import SharedDashboardHeader from "../../components/SharedDashboardHeader";

type AdminLoadingLayoutProps = {
  isMobile: boolean;
  skeletonContent: React.ReactNode;
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
  middleContent: React.ReactNode;
  overlayContent?: React.ReactNode;
};

export function AdminLoadingLayout({ isMobile, skeletonContent }: AdminLoadingLayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="fixed inset-0     bg-center bg-slate-200  -z-10"></div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-6 py-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl">
              <Skeleton className="h-8 w-8" />
            </div>
            <div>
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Skeleton className="h-8 w-24 rounded-2xl hidden sm:flex" />
            <Skeleton className="h-8 w-20 rounded-2xl hidden sm:flex" />
            <div className="text-right hidden sm:block">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-fit overflow-hidden">
        {!isMobile && (
          <div className="w-64 border bg-white border-r border-gray-200 flex flex-col shadow-sm overflow-auto hide-scrollbar">
            <div className="p-4 border-b border-gray-200 rounded-t-3xl">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}>
                    <div className="w-full flex items-center space-x-3 px-3 py-2 rounded-2xl">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 mb-5 mt-auto">
              <div className="w-full flex items-center space-x-3 px-3 py-2 rounded-2xl">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 m-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out pb-20 md:pb-0">
          <div className="flex-1   p-4 max-w-7xl mx-auto sm:p-6 overflow-auto hide-scrollbar">
            {skeletonContent}
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-gray-200 z-40">
          <div className="flex justify-around items-center py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-2 px-3 rounded-xl">
                <Skeleton className="h-5 w-5 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
  middleContent,
  overlayContent,
}: AdminDashboardLayoutProps) {
  return (
    <div className="max-h-screen min-h-screen relative flex">
      <div className="fixed inset-0    bg-slate-200  -z-10"></div>

      <div className="flex flex-1 overflow-hidden">
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
            showSearch={false}
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