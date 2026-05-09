"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLoadingProps {
  title?: string;
  navItemCount?: number;
  showSearch?: boolean;
  maxWidth?: string;
}

export default function DashboardLoading({
  title = "Dashboard",
  navItemCount = 6,
  showSearch = true,
  maxWidth = "max-w-[1440px]",
}: DashboardLoadingProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center">
      {/* Background */}
      <div className="fixed inset-0 bg-zinc-100 -z-10"></div>

      {/* Main Container */}
      <div className={`w-full ${maxWidth} flex flex-col min-h-screen border-r border-l border-gray-200`}>
        {/* Header Skeleton */}
        <div className="bg-zinc-50 border-b border-gray-200 shadow-sm shrink-0 h-14">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2 h-full">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-32 hidden sm:block" />
            </div>

            {/* Middle: Search */}
            {showSearch && (
              <div className="flex-1 max-w-xl mx-4 hidden md:block">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            )}

            {/* Right: User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton - Desktop */}
          <div className="hidden md:flex w-64 bg-zinc-50 border-r border-gray-200 flex-col shadow-sm h-screen">
            {/* Sidebar Header */}
            <div className="px-4 border-b border-gray-200 rounded-t-3xl h-14">
              <div className="flex items-center py-2 gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {Array.from({ length: navItemCount }).map((_, i) => (
                  <li key={i}>
                    <div className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Settings & Logout */}
            <div className="p-4 border-t border-gray-200 mt-auto space-y-2">
              <div className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-red-50">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto hide-scrollbar pb-24 md:pb-0">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              {/* Page Title */}
              <Skeleton className="h-8 w-48 mb-6" />

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-300 rounded-3xl p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>

              {/* Content Section */}
              <div className="bg-white border border-gray-300 rounded-3xl p-4 sm:p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>

                {/* Table Header */}
                <div className="flex gap-4 pb-3 border-b border-gray-100 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-24" />
                  ))}
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16 rounded-full ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex justify-around items-center py-2 px-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-1 px-2">
                <Skeleton className="h-5 w-5 mb-1" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
