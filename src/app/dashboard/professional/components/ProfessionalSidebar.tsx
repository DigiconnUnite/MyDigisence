"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  FileEdit,
  Eye,
  FileText,
  Star,
  Briefcase,
  Wrench,
  Handshake,
  Calendar,
  GraduationCap,
  Award,
  Bookmark,
  MessageSquare,
  Bell,
  Settings,
  CreditCard,
  Receipt,
  Link,
  Lock,
  LogOut,
  ChevronRight,
  Rocket,
  X,
  Menu,
  Plus,
  BarChart3,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSection = "DASHBOARD & OVERVIEW" | "PROFILE MANAGEMENT" | "SERVICES & BUSINESS" | "CLIENT ENGAGEMENT" | "ACCOUNT MANAGEMENT";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  section: NavSection;
  badge?: number;
  subItems?: NavItem[];
}

interface ProfessionalSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigationItems: NavItem[] = [
  // DASHBOARD & OVERVIEW
  { id: "overview", label: "Dashboard", icon: LayoutDashboard, section: "DASHBOARD & OVERVIEW" },
  { id: "analytics", label: "Analytics", icon: BarChart3, section: "DASHBOARD & OVERVIEW" },
  
  // PROFILE MANAGEMENT
  { id: "my-profile", label: "My Profile", icon: User, section: "PROFILE MANAGEMENT" },
  { id: "profile", label: "Edit Profile", icon: FileEdit, section: "PROFILE MANAGEMENT" },
  { id: "reviews", label: "Reviews", icon: Star, section: "PROFILE MANAGEMENT" },
  
  // SERVICES & BUSINESS
  { id: "services", label: "My Services", icon: Wrench, section: "SERVICES & BUSINESS" },
  { id: "add-service", label: "Add Service", icon: Plus, section: "SERVICES & BUSINESS" },
  { id: "service-requests", label: "Service Requests", icon: Handshake, section: "SERVICES & BUSINESS" },
  { id: "projects", label: "My Projects", icon: Briefcase, section: "SERVICES & BUSINESS" },
  
  // CLIENT ENGAGEMENT
  { id: "enquiries", label: "Client Inquiries", icon: MessageSquare, section: "CLIENT ENGAGEMENT", badge: 0 },
  { id: "messages", label: "Messages", icon: MessageSquare, section: "CLIENT ENGAGEMENT", badge: 0 },
  { id: "appointments", label: "Appointments", icon: Calendar, section: "CLIENT ENGAGEMENT" },
];

// Settings items to be shown at bottom with logout
const settingsItems: NavItem[] = [
  { id: "account-settings", label: "Account Settings", icon: Settings, section: "ACCOUNT MANAGEMENT" },
  { id: "settings", label: "Preferences", icon: Cog, section: "ACCOUNT MANAGEMENT" },
  { id: "subscription", label: "Subscription", icon: CreditCard, section: "ACCOUNT MANAGEMENT" },
];

const sections: NavSection[] = ["DASHBOARD & OVERVIEW", "PROFILE MANAGEMENT", "SERVICES & BUSINESS", "CLIENT ENGAGEMENT"];

export default function ProfessionalSidebar({
  currentView,
  onNavigate,
  onLogout,
  isMobile = false,
  mobileOpen = false,
  onMobileClose,
}: ProfessionalSidebarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<NavSection[]>(sections);

  const toggleSection = (section: NavSection) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigate = (item: NavItem) => {
    // Update URL with view parameter
    const params = new URLSearchParams(window.location.search);
    params.set("view", item.id);
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    router.push(newUrl);
    
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = currentView === item.id;
    const Icon = item.icon;
    
    return (
      <button
        key={item.id}
        onClick={() => handleNavigate(item)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
          isActive 
            ? "bg-black text-white" 
            : "text-gray-600 hover:text-black hover:bg-gray-100"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-600 group-hover:text-black")} />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className={cn(
            "px-2 py-0.5 text-xs rounded-full",
            isActive ? "bg-white text-black" : "bg-black text-white"
          )}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (section: NavSection) => {
    const sectionItems = navigationItems.filter(item => item.section === section);
    const isExpanded = expandedSections.includes(section);
    
    return (
      <div key={section} className="mb-2">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
        >
          {section}
          {isExpanded ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3 rotate-90" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-0.5">
            {sectionItems.map(renderNavItem)}
          </div>
        )}
      </div>
    );
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
        
        {/* Mobile Drawer */}
        <div className={cn(
          "fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="mydigisence" width={28} height={28} className="h-7 w-auto" />
                <span className="font-semibold text-white">mydigisence</span>
              </div>
              <button 
                onClick={onMobileClose}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              {sections.map(renderSection)}
            </div>
            
            {/* Upgrade Card */}
            <div className="p-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium text-sm">Upgrade Your Plan</span>
                </div>
                <p className="text-slate-400 text-xs mb-3">Unlock premium features</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
            
            {/* Settings & Logout */}
            <div className="p-4 border-t border-slate-800 space-y-2">
              {settingsItems.map(renderNavItem)}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="mydigisence" width={32} height={32} className="h-8 w-auto" />
          <span className="font-semibold text-white">mydigisence</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">Your Digital Presence, Simplified</p>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        {sections.map(renderSection)}
      </div>
      
      {/* Upgrade Card */}
      <div className="p-3">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium text-sm">Upgrade Your Plan</span>
          </div>
          <p className="text-slate-400 text-xs mb-3">Unlock premium features</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
      
      {/* Settings & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {settingsItems.map(renderNavItem)}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
