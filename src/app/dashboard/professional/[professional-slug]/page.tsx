"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, ThemeProvider } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Folder,
  MessageSquare,
  Mail,
  Calendar,
  Star,
  BarChart,
  Settings,
} from "lucide-react";

// Custom hooks
import { useProfessionalData } from "../hooks/useProfessionalData";
import { ProfessionalView } from "../config/searchIndex";

// Components
import {
  ProfessionalDashboardLayout,
  ProfessionalLoadingLayout,
} from "../components/ProfessionalLayouts";

// Views
import OverviewView from "../views/OverviewView";
import MyProfileView from "../views/MyProfileView";
import ServicesView from "../views/ServicesView";
import ProjectsView from "../views/ProjectsView";
import EnquiriesView from "../views/EnquiriesView";
import MessagesView from "../views/MessagesView";
import AppointmentsView from "../views/AppointmentsView";
import ReviewsView from "../views/ReviewsView";
import AccountSettingsView from "../views/AccountSettingsView";
import SubscriptionView from "../views/SubscriptionView";
import AnalyticsView from "../views/AnalyticsView";
import SettingsView from "../views/SettingsView";
import ServiceRequestsView from "../views/ServiceRequestsView";

import {
  PROFESSIONAL_SEARCH_INDEX,
  VALID_PROFESSIONAL_VIEWS,
} from "../config/searchIndex";
import type { HeaderSearchResult } from "../../components/SharedDashboardHeader";

const isProfessionalView = (view: string): view is ProfessionalView => {
  return VALID_PROFESSIONAL_VIEWS.includes(view as ProfessionalView);
};

export default function ProfessionalDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { getBackgroundClass } = useTheme();

  // Custom hook for data
  const {
    professional,
    loading: dataLoading,
    fetchData,
  } = useProfessionalData();

  // Local UI state
  const [currentView, setCurrentView] = useState<ProfessionalView>("overview");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<HeaderSearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<HeaderSearchResult[]>([]);

  // Fetch data on mount
  useEffect(() => {
    if (user?.role === "PROFESSIONAL_ADMIN") {
      fetchData();
    }
  }, [user, fetchData]);

  // Hydrate dashboard state from URL query params for deep linking.
  // We read from window.location so local history.replaceState updates stay in sync.
  useEffect(() => {
    const applyUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");

      if (viewParam && isProfessionalView(viewParam)) {
        setCurrentView(viewParam);
      }
    };

    applyUrlState();
    window.addEventListener("popstate", applyUrlState);
    return () => {
      window.removeEventListener("popstate", applyUrlState);
    };
  }, []);

  // Keep URL synchronized with current internal view state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("view", currentView);

    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [currentView]);

  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Filter search index based on value
    if (value.trim()) {
      const filtered = PROFESSIONAL_SEARCH_INDEX.filter(
        (item: { label: string; description: string; keywords: string[] }) =>
          item.label.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.keywords.some((k: string) => k.toLowerCase().includes(value.toLowerCase()))
      ).map((item: { id: string; label: string; description: string; view: string; tab?: string }) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        view: item.view,
        tab: item.tab,
      }));
      setSearchResults(filtered as HeaderSearchResult[]);
    } else {
      setSearchResults([]);
    }
  }, []);

  // Handle search result selection
  const handleSearchResultSelect = useCallback((result: HeaderSearchResult) => {
    if (result.view && isProfessionalView(result.view)) {
      setCurrentView(result.view);
      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((r) => r.id !== result.id);
        return [result, ...filtered].slice(0, 8);
      });
    }
    setSearchValue("");
    setSearchResults([]);
  }, []);

  // View change handler
  const handleViewChange = useCallback((view: string) => {
    if (isProfessionalView(view)) {
      setCurrentView(view);
    }
  }, []);

  // Navigation links for sidebar
  const navLinks = useMemo(
    () => [
      { value: "overview", title: "Overview", icon: LayoutDashboard, mobileIcon: LayoutDashboard, mobileTitle: "Overview" },
      { value: "profile", title: "My Profile", icon: User, mobileIcon: User, mobileTitle: "Profile" },
      { value: "services", title: "Services", icon: Briefcase, mobileIcon: Briefcase, mobileTitle: "Services" },
      { value: "projects", title: "Projects", icon: Folder, mobileIcon: Folder, mobileTitle: "Projects" },
      { value: "enquiries", title: "Enquiries", icon: MessageSquare, mobileIcon: MessageSquare, mobileTitle: "Enquiries" },
      { value: "messages", title: "Messages", icon: Mail, mobileIcon: Mail, mobileTitle: "Messages" },
      { value: "appointments", title: "Appointments", icon: Calendar, mobileIcon: Calendar, mobileTitle: "Calendar" },
      { value: "reviews", title: "Reviews", icon: Star, mobileIcon: Star, mobileTitle: "Reviews" },
      { value: "analytics", title: "Analytics", icon: BarChart, mobileIcon: BarChart, mobileTitle: "Analytics" },
      { value: "settings", title: "Settings", icon: Settings, mobileIcon: Settings, mobileTitle: "Settings" },
    ],
    []
  );

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <ThemeProvider>
        <ProfessionalLoadingLayout />
      </ThemeProvider>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access the professional dashboard.</p>
      </div>
    );
  }

  // Render current view
  const renderMiddleContent = () => {
    const viewProps = {
      professional,
      isLoading: dataLoading,
    };

    switch (currentView) {
      case "overview":
        return <OverviewView {...viewProps} onNavigate={handleViewChange} />;
      case "profile":
      case "my-profile":
        return <MyProfileView {...viewProps} />;
      case "services":
        return <ServicesView {...viewProps} />;
      case "projects":
        return <ProjectsView {...viewProps} />;
      case "enquiries":
        return <EnquiriesView {...viewProps} />;
      case "messages":
        return <MessagesView {...viewProps} />;
      case "appointments":
        return <AppointmentsView {...viewProps} />;
      case "reviews":
        return <ReviewsView {...viewProps} />;
      case "account-settings":
        return <AccountSettingsView {...viewProps} />;
      case "subscription":
        return <SubscriptionView {...viewProps} />;
      case "analytics":
        return <AnalyticsView {...viewProps} />;
      case "settings":
        return <SettingsView {...viewProps} />;
      case "service-requests":
        return <ServiceRequestsView {...viewProps} />;
      default:
        return <OverviewView {...viewProps} onNavigate={handleViewChange} />;
    }
  };

  return (
   
      <div className={`min-h-screen `}>
        <ProfessionalDashboardLayout
          isMobile={false}
          navLinks={navLinks}
          currentView={currentView}
          onViewChange={handleViewChange}
          onLogout={logout}
          userName={user?.name || "Professional"}
          userEmail={user?.email}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search professional dashboard..."
          searchResults={searchResults}
          recentSearches={recentSearches}
          onSearchResultSelect={handleSearchResultSelect}
          middleContent={renderMiddleContent()}
        />
      </div>
  );
}
