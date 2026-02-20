import React, { useState } from "react";
import {
  LogOut,
  MoreHorizontal,
  Settings,
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  mobileIcon: any;
  value: string;
  mobileTitle: string;
}

interface SharedSidebarProps {
  navLinks: MenuItem[];
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  onSettings?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile: boolean;
  headerTitle: string;
  headerIcon?: any;
  showMoreMenu?: boolean;
}

export default function SharedSidebar({
  navLinks,
  currentView,
  onViewChange,
  onLogout,
  onSettings,
  onCollapsedChange,
  isMobile,
  headerTitle,
  headerIcon: HeaderIcon,
}: SharedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center gap-2  px-3">
          {navLinks.slice(0, 5).map((item) => {
            const MobileIcon = item.mobileIcon;
            return (
              <button
                key={item.value}
                onClick={() => onViewChange(item.value)}
                className={`flex flex-col items-center justify-center py-2 w-full rounded-none transition-all duration-200 ${
                  currentView === item.value
                    ? " text-orange-400 font-extrabold border-t-4 rounded-none border-orange-400"
                    : "text-gray-500 border-t-4 border-transparent hover:text-gray-700"
                }`}
              >
                <MobileIcon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.mobileTitle}</span>
              </button>
            );
          })}
          {/* More button for additional items and logout */}
          {(navLinks.length > 5 ||
            onSettings !== undefined ||
            onLogout !== undefined) && (
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-none transition-all duration-200 ${
                  navLinks
                    .slice(5)
                    .some((item) => item.value === currentView) ||
                  currentView === "settings"
                    ? " text-orange-400 font-extrabold border-t-4 rounded-none border-orange-400"
                    : "text-gray-500 border-t-4 border-transparent hover:text-gray-700"
                }`}
              >
                <MoreHorizontal className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">More</span>
              </button>

              {/* More Menu Overlay - FIXED POSITIONING */}
              {showMoreMenu && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <div className="p-2 space-y-1">
                    {/* Additional Navigation Items */}
                    {navLinks.slice(5).map((item) => {
                      const MobileIcon = item.mobileIcon;
                      return (
                        <button
                          key={item.value}
                          onClick={() => {
                            onViewChange(item.value);
                            setShowMoreMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                            currentView === item.value
                              ? "bg-slate-800 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <MobileIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {item.mobileTitle}
                          </span>
                        </button>
                      );
                    })}

                    {/* Settings */}
                    {onSettings && (
                      <button
                        onClick={() => {
                          onSettings();
                          setShowMoreMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                          currentView === "settings"
                            ? "bg-slate-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-sm font-medium">Settings</span>
                      </button>
                    )}

                    {/* Logout */}
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setShowMoreMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out h-screen ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="px-4 border-b border-gray-200 rounded-t-3xl h-13">
        <div className="flex items-center py-2 justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="DigiSense" className="h-8 w-auto" />
              <span className="h-8 border-l border-gray-300 mx-2"></span>
              <span className="font-semibold line-clamp-1 ">{headerTitle}</span>
            </div>
          )}
          <button
            onClick={handleToggleCollapse}
            className="p-1 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <nav className={`flex-1 p-4 ${isCollapsed ? "px-2" : ""}`}>
        <ul className="space-y-2">
          {navLinks.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => onViewChange(item.value)}
                className={`w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} cursor-pointer px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === item.value
                    ? "bg-slate-800 text-white"
                    : "text-gray-700 bg-gray-50 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={isCollapsed ? "h-6 w-6" : "h-5 w-5"} />
                {!isCollapsed && <span>{item.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions Section */}
      <div
        className={`p-4 border-t border-gray-200 mb-5 mt-auto space-y-2 ${isCollapsed ? "px-2" : ""}`}
      >
        {onSettings && (
          <button
            onClick={onSettings}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} px-3 py-2 rounded-md text-left transition-colors ${
              currentView === "settings"
                ? "bg-slate-800 text-white"
                : "text-gray-700 bg-gray-50 hover:bg-gray-100"
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className={isCollapsed ? "h-6 w-6" : "h-5 w-5"} />
            {!isCollapsed && <span>Settings</span>}
          </button>
        )}
        <button
          onClick={onLogout}
          className={`w-full flex items-center cursor-pointer ${isCollapsed ? "justify-center" : "space-x-3"} px-3 py-2 rounded-md text-left transition-colors text-red-600 bg-red-50 hover:bg-red-100`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={isCollapsed ? "h-6 w-6" : "h-5 w-5"} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
