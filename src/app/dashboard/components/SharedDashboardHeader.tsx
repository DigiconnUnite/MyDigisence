"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface HeaderSearchResult {
  id: string;
  label: string;
  description: string;
  routeLabel?: string;
  view?: string;
  tab?: string;
  sectionId?: string;
}

interface SharedDashboardHeaderProps {
  title: string;
  userName: string;
  userEmail?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  searchResults?: HeaderSearchResult[];
  recentSearches?: HeaderSearchResult[];
  onSearchResultSelect?: (result: HeaderSearchResult) => void;
  rightActions?: ReactNode;
  avatar?: ReactNode;
}

export default function SharedDashboardHeader({
  title,
  userName,
  userEmail,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  searchResults = [],
  recentSearches = [],
  onSearchResultSelect,
  rightActions,
  avatar,
}: SharedDashboardHeaderProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const normalizedSearch = (searchValue || "").trim();
  const displayResults = normalizedSearch.length > 0 ? searchResults : recentSearches;
  const showDropdown = dropdownOpen && displayResults.length > 0;

  useEffect(() => {
    if (normalizedSearch.length > 0 && searchResults.length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  }, [normalizedSearch, recentSearches.length, searchResults.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let prevOverflow: string | null = null;
    if (typeof document !== "undefined") {
      prevOverflow = document.body.style.overflow;
    }

    if (mobileSearchOpen) {
      // focus the mobile input when opened
      setTimeout(() => mobileInputRef.current?.focus(), 50);
      if (typeof document !== "undefined") document.body.style.overflow = "hidden";
    } else {
      if (typeof document !== "undefined") document.body.style.overflow = prevOverflow || "";
    }

    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = prevOverflow || "";
    };
  }, [mobileSearchOpen]);

  const handleSelect = (result: HeaderSearchResult) => {
    if (onSearchResultSelect) {
      onSearchResultSelect(result);
    }
    setDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && event.key !== "ArrowDown") {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setDropdownOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, displayResults.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      if (activeIndex >= 0 && displayResults[activeIndex]) {
        event.preventDefault();
        handleSelect(displayResults[activeIndex]);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, HeaderSearchResult[]> = {
      Pages: [],
      Settings: [],
      Recent: [],
    };

    if (normalizedSearch.length === 0) {
      groups.Recent = recentSearches;
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    for (const result of displayResults) {
      if (result.view === "settings") {
        groups.Settings.push(result);
      } else {
        groups.Pages.push(result);
      }
    }

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [displayResults, normalizedSearch.length, recentSearches]);

  let resultCursor = -1;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 h-13">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2">
        <div className="flex items-center md:hidden shrink-0 min-w-0">
          <img src="/logo.png" alt="DigiSense" className="h-8 w-8 object-contain rounded-md" />
          <span className="h-8 border-l border-gray-300 mx-2" />
          <span className="font-semibold line-clamp-1 truncate max-w-[30vw] sm:max-w-[40vw]">{title}</span>
        </div>

        {showSearch && searchValue !== undefined && onSearchChange ? (
          <>
            {/* Desktop: inline search */}
            <div ref={wrapperRef} className="hidden md:flex relative flex-1 w-full min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (normalizedSearch.length > 0 && displayResults.length > 0) {
                    setDropdownOpen(true);
                  }
                }}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
              />

              {showDropdown && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-80 overflow-y-auto py-2">
                    {groupedResults.map(([groupName, items]) => (
                      <div key={groupName}>
                        <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          {groupName}
                        </div>
                        {items.map((item) => {
                          resultCursor += 1;
                          const currentIndex = resultCursor;
                          const isActive = currentIndex === activeIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setActiveIndex(currentIndex)}
                              onClick={() => handleSelect(item)}
                              className={`w-full px-3 py-2 text-left transition-colors ${isActive ? "bg-slate-100" : "hover:bg-gray-50"}`}
                            >
                              <div className="text-sm font-medium text-gray-900">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                              {item.routeLabel ? (
                                <div className="mt-0.5 text-[11px] text-slate-500">{item.routeLabel}</div>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center leading-tight space-x-2 sm:space-x-4 md:shrink-0">
          {/* Mobile search icon placed next to right actions */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          {rightActions}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            {userEmail ? <p className="text-xs text-gray-500">{userEmail}</p> : null}
          </div>
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div className="flex items-center space-x-2">{avatar}</div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-60 flex items-start pt-16 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSearchOpen(false)}
          />

          <div className="relative w-full bg-white rounded-none shadow-none overflow-hidden transform transition-transform duration-300 ease-out">
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <Search className="text-gray-400 h-4 w-4" />
              <input
                ref={mobileInputRef}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e as any)}
                placeholder={searchPlaceholder}
                className="flex-1 h-10 px-2 text-sm rounded-md border border-gray-200"
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Close search"
              >
                ×
              </button>
            </div>

            {displayResults.length > 0 && (
              <div className="max-h-72 overflow-y-auto">
                {groupedResults.map(([groupName, items]) => (
                  <div key={groupName}>
                    <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {groupName}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          handleSelect(item);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
