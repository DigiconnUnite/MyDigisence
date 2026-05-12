"use client";

import { useState, useCallback, useMemo } from "react";

interface SearchItem {
  id: string;
  type: "product" | "inquiry" | "category" | "brand";
  title: string;
  subtitle?: string;
  action: () => void;
}

interface UseBusinessSearchProps {
  products: any[];
  inquiries: any[];
  categories: any[];
  brands: any[];
  onNavigateToProducts: () => void;
  onNavigateToInquiries: () => void;
  onNavigateToCategories: () => void;
  onNavigateToBrands: () => void;
}

export function useBusinessSearch({
  products,
  inquiries,
  categories,
  brands,
  onNavigateToProducts,
  onNavigateToInquiries,
  onNavigateToCategories,
  onNavigateToBrands,
}: UseBusinessSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Build searchable items from all data sources
  const searchItems = useMemo(() => {
    const items: SearchItem[] = [];

    // Products
    products.forEach((product) => {
      items.push({
        id: `product-${product.id}`,
        type: "product",
        title: product.name,
        subtitle: product.category?.name || "Uncategorized",
        action: () => {
          onNavigateToProducts();
        },
      });
    });

    // Inquiries
    inquiries.forEach((inquiry) => {
      items.push({
        id: `inquiry-${inquiry.id}`,
        type: "inquiry",
        title: inquiry.name,
        subtitle: inquiry.subject || "No subject",
        action: () => {
          onNavigateToInquiries();
        },
      });
    });

    // Categories
    categories.forEach((category) => {
      items.push({
        id: `category-${category.id}`,
        type: "category",
        title: category.name,
        subtitle: category.description || "Category",
        action: () => {
          onNavigateToCategories();
        },
      });
    });

    // Brands
    brands.forEach((brand) => {
      items.push({
        id: `brand-${brand.name}`,
        type: "brand",
        title: brand.name,
        subtitle: "Brand",
        action: () => {
          onNavigateToBrands();
        },
      });
    });

    return items;
  }, [products, inquiries, categories, brands, onNavigateToProducts, onNavigateToInquiries, onNavigateToCategories, onNavigateToBrands]);

  // Fuzzy search implementation
  const fuzzyMatch = useCallback((text: string, query: string): boolean => {
    if (!query) return true;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let queryIndex = 0;
    let textIndex = 0;

    while (queryIndex < lowerQuery.length && textIndex < lowerText.length) {
      if (lowerText[textIndex] === lowerQuery[queryIndex]) {
        queryIndex++;
      }
      textIndex++;
    }

    return queryIndex === lowerQuery.length;
  }, []);

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return searchItems.filter((item) => {
      return (
        fuzzyMatch(item.title, searchTerm) ||
        (item.subtitle && fuzzyMatch(item.subtitle, searchTerm))
      );
    });
  }, [searchTerm, searchItems, fuzzyMatch]);

  // Add to recent searches
  const addToRecentSearches = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t !== term);
      return [term, ...filtered].slice(0, 5);
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Handle search result selection
  const handleSearchResultSelect = useCallback(
    (item: SearchItem) => {
      addToRecentSearches(item.title);
      item.action();
      setSearchTerm("");
    },
    [addToRecentSearches]
  );

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
    handleSearchResultSelect,
  };
}
