import { useCallback, useRef } from "react";
import {
  buildBusinessStats,
  BUSINESS_FETCH_ENDPOINTS,
  createInitialBusinessDashboardData,
  getUniqueProductImages,
} from "./businessDataHelpers";
import { fetchBusinessJsonOrNull } from "./businessQuery";
import type {
  BusinessDashboardData,
  BusinessResponse,
  CategoriesResponse,
  InquiriesResponse,
  ProductsResponse,
} from "../types";

interface UseBusinessDataLoaderOptions {
  onSuccess: (payload: {
    data: BusinessDashboardData;
    stats: ReturnType<typeof buildBusinessStats>;
    images: string[];
  }) => void;
  onError?: (message: string) => void;
  onFinally?: () => void;
}

export const useBusinessDataLoader = ({
  onSuccess,
  onError,
  onFinally,
}: UseBusinessDataLoaderOptions) => {
  const fetchControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const loadBusinessDashboardData = useCallback(async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    try {
      const [businessRes, categoriesRes, productsRes, inquiriesRes] = await Promise.all([
        fetchBusinessJsonOrNull<BusinessResponse>(BUSINESS_FETCH_ENDPOINTS.business, controller.signal),
        fetchBusinessJsonOrNull<CategoriesResponse>(BUSINESS_FETCH_ENDPOINTS.categories, controller.signal),
        fetchBusinessJsonOrNull<ProductsResponse>(BUSINESS_FETCH_ENDPOINTS.products, controller.signal),
        fetchBusinessJsonOrNull<InquiriesResponse>(BUSINESS_FETCH_ENDPOINTS.inquiries, controller.signal),
      ]);

      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      const nextData: BusinessDashboardData = {
        ...createInitialBusinessDashboardData(),
        business: businessRes?.business ?? null,
        categories: categoriesRes?.categories ?? [],
        products: productsRes?.products ?? [],
        inquiries: inquiriesRes?.inquiries ?? [],
      };

      onSuccess({
        data: nextData,
        stats: buildBusinessStats(nextData.products, nextData.inquiries),
        images: getUniqueProductImages(nextData.products),
      });
    } catch {
      if (!controller.signal.aborted) {
        onError?.("Failed to load business dashboard data");
      }
    } finally {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        onFinally?.();
      }
    }
  }, [onError, onFinally, onSuccess]);

  const cancelLoad = useCallback(() => {
    fetchControllerRef.current?.abort();
  }, []);

  return {
    loadBusinessDashboardData,
    cancelLoad,
  };
};
