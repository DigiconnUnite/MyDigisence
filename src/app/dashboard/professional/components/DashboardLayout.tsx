"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfessionalSidebar from "./ProfessionalSidebar";
import ProfessionalHeader from "./ProfessionalHeader";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  professionalSlug?: string;
  notificationCount?: number;
  messageCount?: number;
  pageTitle?: string;
  pageDescription?: string;
}

export default function DashboardLayout({
  children,
  currentView,
  onNavigate,
  onLogout,
  professionalSlug,
  notificationCount = 0,
  messageCount = 0,
  pageTitle,
  pageDescription,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ProfessionalSidebar
          currentView={currentView}
          onNavigate={onNavigate}
          onLogout={onLogout}
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar */}
      <ProfessionalSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isMobile={true}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ProfessionalHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
          professionalSlug={professionalSlug}
          notificationCount={notificationCount}
          messageCount={messageCount}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            {/* Page Header (optional) */}
            {(pageTitle || pageDescription) && (
              <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                {pageTitle && (
                  <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                )}
                {pageDescription && (
                  <p className="mt-1 text-sm text-gray-500">{pageDescription}</p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
