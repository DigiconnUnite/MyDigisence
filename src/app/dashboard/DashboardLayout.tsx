"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "./DashboardHeader";
import  DashboardSidebar  from "./DashboardSidebar";
import  MobileNav  from "./MobileNav";
import  DashboardSkeleton  from "./DashboardSkeleton";
import { LogOut, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  title: string;
  icon: any;
  mobileIcon: any;
  value: string;
  mobileTitle: string;
}

interface DashboardLayoutProps {
  role: "SUPER_ADMIN" | "BUSINESS_ADMIN" | "PROFESSIONAL_ADMIN";
  menuItems: MenuItem[];
  title: string; // Title for the header
  children: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isLoading?: boolean;
  socketConnected?: boolean; // Optional for admin socket status
}

export default function DashboardLayout({
  role,
  menuItems,
  title,
  children,
  currentView,
  onNavigate,
  onLogout,
  isLoading = false,
  socketConnected,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Handle Responsive Sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle Mobile Navigation Change
  const handleMobileNavChange = (value: string) => {
    onNavigate(value);
    // Close "More" menu if open
    setShowMoreMenu(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    await onLogout();
  };

  // Define Background Gradient based on role
  const getBackgroundClass = () => {
    if (role === "SUPER_ADMIN") return "bg-linear-to-b from-blue-400 to-white";
    if (role === "BUSINESS_ADMIN")
      return "bg-linear-to-b from-blue-400 to-white";
    if (role === "PROFESSIONAL_ADMIN")
      return "bg-linear-to-b from-blue-400 to-white";
    return "bg-linear-to-b from-gray-100 to-white";
  };

  // Render Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col">
        <div
          className={`fixed inset-0 ${getBackgroundClass()} bg-center blur-sm -z-10`}
        ></div>
        <div className="flex flex-col h-screen overflow-hidden">
          <DashboardSkeleton role={role} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen min-h-screen relative flex flex-col">
      <div
        className={`fixed inset-0 ${getBackgroundClass()} bg-center blur-sm -z-10`}
      ></div>

      {/* 1. Top Header */}
      <DashboardHeader
        title={title}
        user={user}
        role={role}
        socketConnected={socketConnected}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DashboardSidebar
            menuItems={menuItems}
            currentView={currentView}
            setCurrentView={onNavigate}
            onLogout={handleLogout}
            role={role}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0 bg-transparent">
          <div className="p-4 max-w-7xl mx-auto sm:p-6">
            {typeof children === 'function' ? children({ isMobile }) : children}
          </div>
        </div>

        {/* 3. Mobile Bottom Navigation */}
        {isMobile && (
          <MobileNav
            menuItems={menuItems}
            currentView={currentView}
            onNavChange={handleMobileNavChange}
            showMoreMenu={showMoreMenu}
            setShowMoreMenu={setShowMoreMenu}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
