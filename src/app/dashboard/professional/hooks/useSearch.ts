"use client";

import { useState, useCallback, useEffect } from "react";
import { ProfessionalView, ProfileTabId } from "../types/professional";
import type { HeaderSearchResult } from "../../components/SharedDashboardHeader";

interface UseSearchReturn {
  searchTerm: string;
  commandSearchTerm: string;
  recentSearches: HeaderSearchResult[];
  setSearchTerm: (term: string) => void;
  setCommandSearchTerm: (term: string) => void;
  handleSearchResultSelect: (
    result: HeaderSearchResult,
    onViewChange: (view: ProfessionalView, tab?: ProfileTabId) => void
  ) => void;
  addRecentSearch: (result: HeaderSearchResult) => void;
}

const RECENT_SEARCHES_STORAGE_KEY = "digisence-professional-recent-searches";
const MAX_RECENT_SEARCHES = 8;

const VALID_PROFESSIONAL_VIEWS: ProfessionalView[] = [
  "overview",
  "profile",
  "services",
  "service-form",
  "projects",
  "enquiries",
  "messages",
  "appointments",
  "reviews",
  "account",
  "subscription",
  "analytics",
  "theme",
  "settings",
  "service-requests",
];

const isProfessionalView = (view: string): view is ProfessionalView => {
  return VALID_PROFESSIONAL_VIEWS.includes(view as ProfessionalView);
};

export function useSearch(): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [commandSearchTerm, setCommandSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<HeaderSearchResult[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        console.error("Failed to parse recent searches");
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearchResultSelect = useCallback((
    result: HeaderSearchResult,
    onViewChange: (view: ProfessionalView, tab?: ProfileTabId) => void
  ) => {
    if (!result.view || !isProfessionalView(result.view)) {
      return;
    }

    onViewChange(result.view, result.tab as ProfileTabId);
    setCommandSearchTerm("");
  }, []);

  const addRecentSearch = useCallback((result: HeaderSearchResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== result.id);
      return [result, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  return {
    searchTerm,
    commandSearchTerm,
    recentSearches,
    setSearchTerm,
    setCommandSearchTerm,
    handleSearchResultSelect,
    addRecentSearch,
  };
}
