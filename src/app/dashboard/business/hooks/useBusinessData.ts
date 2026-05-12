"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusinessDataLoader } from "./useBusinessDataLoader";
import { buildBusinessStats, getUniqueProductImages } from "./businessDataHelpers";
import type { Business, Category, Inquiry, Product, BrandContent, PortfolioContent } from "../types";

interface BusinessData {
  business: Business | null;
  categories: Category[];
  products: Product[];
  inquiries: Inquiry[];
  images: string[];
  brandContent: BrandContent;
  portfolioContent: PortfolioContent;
  loading: boolean;
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
    readInquiries: number;
    repliedInquiries: number;
  };
}

interface UseBusinessDataReturn extends BusinessData {
  fetchData: () => Promise<void>;
  updateBusinessState: (business: Business | null) => void;
  isLoading: boolean;
  error: string | null;
  cancelLoad: () => void;
  brands: any[];
}

export function useBusinessData(): UseBusinessDataReturn {
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalInquiries: 0,
    newInquiries: 0,
    readInquiries: 0,
    repliedInquiries: 0,
  });

  const onSuccess = useCallback(
    ({
      data,
      stats: nextStats,
      images: nextImages,
    }: {
      data: { business: Business | null; categories: Category[]; products: Product[]; inquiries: Inquiry[] };
      stats: ReturnType<typeof buildBusinessStats>;
      images: string[];
    }) => {
      setBusiness(data.business);
      setCategories(data.categories);
      setProducts(data.products);
      setInquiries(data.inquiries);
      setImages(nextImages);
      setStats(nextStats);
    },
    []
  );

  const onError = useCallback(
    (message: string) => {
      setError(message);
      toast({
        title: "Error",
        description: `${message}. Please refresh the page.`,
        variant: "destructive",
      });
    },
    [toast]
  );

  const onFinally = useCallback(() => setLoading(false), []);

  const { loadBusinessDashboardData } = useBusinessDataLoader({
    onSuccess,
    onError,
    onFinally,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    await loadBusinessDashboardData();
  }, [loadBusinessDashboardData]);

  const cancelLoad = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  const updateBusinessState = useCallback((nextBusiness: Business | null) => {
    if (!nextBusiness) {
      setBusiness(null);
      return;
    }
    setBusiness(nextBusiness);
  }, []);

  return {
    business,
    categories,
    products,
    inquiries,
    images,
    brandContent: business?.brandContent || { brands: [] },
    portfolioContent: business?.portfolioContent || { images: [] },
    loading,
    isLoading: loading,
    error,
    stats,
    fetchData,
    updateBusinessState,
    cancelLoad,
    brands: business?.brandContent?.brands || [],
  };
}
