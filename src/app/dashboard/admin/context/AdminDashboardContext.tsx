import React, { createContext, useContext, useMemo, useState } from "react";

interface AdminDashboardContextValue {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  showRightPanel: boolean;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminDashboardContext = createContext<AdminDashboardContextValue | null>(null);

export function AdminDashboardProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(false);

  const value = useMemo(
    () => ({ currentView, setCurrentView, searchTerm, setSearchTerm, showRightPanel, setShowRightPanel }),
    [currentView, searchTerm, showRightPanel]
  );

  return <AdminDashboardContext.Provider value={value}>{children}</AdminDashboardContext.Provider>;
}

export function useAdminDashboardContext() {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error("useAdminDashboardContext must be used within AdminDashboardProvider");
  }
  return context;
}
