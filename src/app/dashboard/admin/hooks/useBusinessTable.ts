import { useCallback, useEffect, useRef, useState } from "react";
import { exportAdminCsv, fetchAdminList } from "./adminQuery";
import { useTableState } from "./useTableState";
import type { BusinessApiResponse, BusinessQueryParams } from "../types";

interface UseBusinessTableOptions {
  debouncedSearch: string;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useBusinessTable({ debouncedSearch, toast }: UseBusinessTableOptions) {
  const {
    query: businessQuery,
    setQuery: setBusinessQuery,
    selectedIds: selectedBusinessIds,
    setSelectedIds: setSelectedBusinessIds,
    handleSort,
    handlePageChange,
    handleLimitChange,
    handleSelectOne: handleSelectBusiness,
    handleSelectAllFrom,
    handleDeselectAll,
  } = useTableState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [businessData, setBusinessData] = useState<BusinessApiResponse | null>(null);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);
  const fetchRequestRef = useRef(0);

  const fetchBusinesses = useCallback(async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    const requestId = ++fetchRequestRef.current;

    setBusinessLoading(true);
    try {
      const params = new URLSearchParams({
        page: businessQuery.page.toString(),
        limit: businessQuery.limit.toString(),
        search: businessQuery.search,
        status: businessQuery.status,
        sortBy: businessQuery.sortBy,
        sortOrder: businessQuery.sortOrder,
      });

      const data = await fetchAdminList<BusinessApiResponse>(
        `/api/admin/businesses?${params}`,
        controller.signal
      );

      if (data && fetchRequestRef.current === requestId) {
        setBusinessData(data);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error("Failed to fetch businesses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch businesses",
        variant: "destructive",
      });
    } finally {
      if (fetchRequestRef.current === requestId && fetchControllerRef.current === controller) {
        setBusinessLoading(false);
        fetchControllerRef.current = null;
      }
    }
  }, [businessQuery, toast]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    setBusinessQuery((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      fetchControllerRef.current?.abort();
    };
  }, []);

  const handleSelectAll = useCallback(() => {
    if (businessData?.businesses) {
      const allIds = businessData.businesses.map((b) => b.id);
      handleSelectAllFrom(allIds);
    }
  }, [businessData, handleSelectAllFrom]);

  const handleExport = useCallback(async () => {
    setExportLoading(true);
    await exportAdminCsv(
      "/api/admin/businesses/export?format=csv",
      "businesses",
      (description) => toast({ title: "Success", description }),
      (description) => toast({ title: "Error", description, variant: "destructive" })
    );
    setExportLoading(false);
  }, [toast]);

  return {
    businessQuery,
    setBusinessQuery,
    businessData,
    setBusinessData,
    businessLoading,
    selectedBusinessIds,
    setSelectedBusinessIds,
    exportLoading,
    fetchBusinesses,
    handleSort,
    handlePageChange,
    handleLimitChange,
    handleSelectBusiness,
    handleSelectAll,
    handleDeselectAll,
    handleExport,
  };
}
