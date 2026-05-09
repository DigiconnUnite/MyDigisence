"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SharedSidebar from "./components/SharedSidebar";
import SharedDashboardHeader from "./components/SharedDashboardHeader";
import DashboardLoading from "./components/DashboardLoading";
import { User } from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  mobileIcon: any;
  value: string;
  mobileTitle: string;
}

interface DashboardLayoutProps {
  role: "SUPER_ADMIN" | "BUSINESS_ADMIN" | "PROFESSIONAL_ADMIN" | "USER";
  menuItems: MenuItem[];
  title: string;
  children: any;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isLoading?: boolean;
  socketConnected?: boolean;
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
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = async () => await onLogout();

  if (isLoading) {
    return <DashboardLoading title={title} navItemCount={menuItems.length} showSearch={false} />;
  }

  return (
    <div className="max-h-screen  bg-zinc-100 min-h-screen relative flex flex-col">
      <SharedDashboardHeader
        title={title}
        userName={user?.name || "User"}
        userEmail={user?.email}
        showSearch={false}
        avatar={
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <SharedSidebar
          navLinks={menuItems}
          currentView={currentView}
          onViewChange={onNavigate}
          onLogout={handleLogout}
          isMobile={isMobile}
          headerTitle={title}
          headerIcon={User}
        />

        <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
          <div className="p-4 max-w-7xl mx-auto sm:p-6">
            {typeof children === "function" ? children({ isMobile }) : children}
          </div>
        </div>
      </div>
    </div>
  );
}
