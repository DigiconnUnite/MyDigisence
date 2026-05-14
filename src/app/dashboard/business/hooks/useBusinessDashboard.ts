import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDashboardRouter } from "../hooks/useDashboardRouter";
import { useDashboardSearch } from "../hooks/useDashboardSearch";
import { useDashboardKeyboardShortcuts } from "../hooks/useDashboardKeyboardShortcuts";
import type { HeaderSearchResult } from "../components/SharedDashboardHeader";
import type { BusinessView } from "../business/[business-slug]/page";

const VALID_BUSINESS_VIEWS: BusinessView[] = [
  "dashboard",
  "profile",
  "products",
  "inquiries",
  "categories",
  "brands",
  "portfolio",
  "analytics",
  "settings",
];

const RECENT_SEARCHES_STORAGE_KEY = "digisence-business-recent-searches";

export interface SearchableItem {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  routeLabel?: string;
  view?: string;
  [key: string]: any;
}

export function useBusinessDashboard(
  options: {
    products: any[];
    inquiries: any[];
    categories: any[];
    brands: any[];
    onNavigateToProducts: () => void;
    onNavigateToInquiries: () => void;
    onNavigateToCategories: () => void;
    onNavigateToBrands: () => void;
  }
) {
  const { toast } = useToast();
  const {
    products,
    inquiries,
    categories,
    brands,
    onNavigateToProducts,
    onNavigateToInquiries,
    onNavigateToCategories,
    onNavigateToBrands,
  } = options;

  const { currentView, setCurrentView } = useDashboardRouter(VALID_BUSINESS_VIEWS, "dashboard");

  // Build dynamic search index from current data
  const searchIndex = useMemo<SearchableItem[]>(() => {
    const items: SearchableItem[] = [
      { id: "nav-products", label: "Products", description: "Manage your products", keywords: ["product", "item", "catalog"], view: "products" },
      { id: "nav-inquiries", label: "Inquiries", description: "Customer inquiries", keywords: ["inquiry", "message", "lead"], view: "inquiries" },
      { id: "nav-categories", label: "Categories", description: "Product categories", keywords: ["category", "group", "type"], view: "categories" },
      { id: "nav-brands", label: "Brands", description: "Your brand listings", keywords: ["brand", "logo", "partner"], view: "brands" },
      { id: "nav-settings", label: "Settings", description: "Business settings", keywords: ["settings", "config", "preferences"], view: "settings" },
      { id: "nav-analytics", label: "Analytics", description: "View analytics", keywords: ["analytics", "stats", "charts"], view: "analytics" },
      { id: "nav-profile", label: "Business Profile", description: "Edit your profile", keywords: ["profile", "business", "info"], view: "profile" },
      { id: "nav-portfolio", label: "Portfolio", description: "Portfolio images", keywords: ["portfolio", "gallery", "images"], view: "portfolio" },
    ];

    products.forEach((p) =>
      items.push({
        id: `product-${p.id}`,
        label: p.name,
        description: p.description || "Product",
        keywords: [p.name, "product"],
        view: "products",
      })
    );

    inquiries.forEach((i) =>
      items.push({
        id: `inquiry-${i.id}`,
        label: i.name || "Inquiry",
        description: i.message || "Customer inquiry",
        keywords: [i.name, "inquiry", "message"],
        view: "inquiries",
      })
    );

    categories.forEach((c) =>
      items.push({
        id: `category-${c.id}`,
        label: c.name,
        description: c.description || "Category",
        keywords: [c.name, "category"],
        view: "categories",
      })
    );

    brands.forEach((b) =>
      items.push({
        id: `brand-${b.id}`,
        label: b.name,
        description: b.description || "Brand",
        keywords: [b.name, "brand"],
        view: "brands",
      })
    );

    return items;
  }, [products, inquiries, categories, brands]);

  const {
    query: searchTerm,
    setQuery: setSearchTerm,
    displayResults: searchResults,
    addRecent,
  } = useDashboardSearch(searchIndex, {
    recentStorageKey: RECENT_SEARCHES_STORAGE_KEY,
    maxRecent: 8,
  });

  const handleSearchResultSelect = useCallback(
    (result: HeaderSearchResult) => {
      addRecent(result as any);
      if (result.view && VALID_BUSINESS_VIEWS.includes(result.view as BusinessView)) {
        setCurrentView(result.view as BusinessView);
      }
      setSearchTerm("");
    },
    [addRecent, setCurrentView, setSearchTerm]
  );

  // Keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      { key: "p", ctrlKey: true, action: onNavigateToProducts, description: "Go to Products" },
      { key: "i", ctrlKey: true, action: onNavigateToInquiries, description: "Go to Inquiries" },
      { key: "c", ctrlKey: true, action: onNavigateToCategories, description: "Go to Categories" },
      { key: "b", ctrlKey: true, action: onNavigateToBrands, description: "Go to Brands" },
      { key: "d", ctrlKey: true, action: () => setCurrentView("dashboard"), description: "Go to Dashboard" },
      { key: "s", ctrlKey: true, action: () => setCurrentView("settings"), description: "Go to Settings" },
      {
        key: "/",
        action: () => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          input?.focus();
        },
        description: "Focus search",
      },
    ],
    [onNavigateToProducts, onNavigateToInquiries, onNavigateToCategories, onNavigateToBrands, setCurrentView]
  );

  useDashboardKeyboardShortcuts(shortcuts, true);

  return {
    currentView,
    setCurrentView,
    searchTerm,
    setSearchTerm,
    searchResults,
    handleSearchResultSelect,
  };
}
