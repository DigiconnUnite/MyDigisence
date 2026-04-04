import { useCallback, useEffect, useRef, useState } from "react";
import { exportAdminCsv, fetchAdminList } from "./adminQuery";
import { useTableState } from "./useTableState";
import type { BusinessQueryParams, ProfessionalApiResponse } from "../types";

interface UseProfessionalTableOptions {
  debouncedSearch: string;
  currentView: string;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
}

export function useProfessionalTable({ debouncedSearch, currentView, toast }: UseProfessionalTableOptions) {
  const {
    query: professionalQuery,
    setQuery: setProfessionalQuery,
    selectedIds: selectedProfessionalIds,
    setSelectedIds: setSelectedProfessionalIds,
    handleSort,
    handlePageChange: handleProfessionalPageChange,
    handleLimitChange: handleProfessionalLimitChange,
    handleSelectOne: handleSelectProfessional,
    handleSelectAllFrom,
    handleDeselectAll: handleDeselectAllProfessionals,
  } = useTableState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [professionalData, setProfessionalData] = useState<ProfessionalApiResponse | null>(null);
  const [professionalLoading, setProfessionalLoading] = useState(false);
  const [professionalExportLoading, setProfessionalExportLoading] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);
  const fetchRequestRef = useRef(0);

  const fetchProfessionals = useCallback(async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    const requestId = ++fetchRequestRef.current;

    setProfessionalLoading(true);
    try {
      const params = new URLSearchParams({
        page: professionalQuery.page.toString(),
        limit: professionalQuery.limit.toString(),
        search: professionalQuery.search,
        status: professionalQuery.status,
        sortBy: professionalQuery.sortBy,
        sortOrder: professionalQuery.sortOrder,
      });

      const data = await fetchAdminList<ProfessionalApiResponse>(
        `/api/admin/professionals?${params}`,
        controller.signal
      );

      if (data && fetchRequestRef.current === requestId) {
        setProfessionalData(data);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error("Failed to fetch professionals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch professionals",
        variant: "destructive",
      });
    } finally {
      if (fetchRequestRef.current === requestId && fetchControllerRef.current === controller) {
        setProfessionalLoading(false);
        fetchControllerRef.current = null;
      }
    }
  }, [professionalQuery, toast]);

  useEffect(() => {
    if (currentView === "professionals") {
      fetchProfessionals();
    }
  }, [fetchProfessionals, currentView]);

  useEffect(() => {
    setProfessionalQuery((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      fetchControllerRef.current?.abort();
    };
  }, []);

  const handleProfessionalSort = useCallback((column: string) => {
    handleSort(column);
  }, [handleSort]);

  const handleSelectAllProfessionals = useCallback(() => {
    if (professionalData?.professionals) {
      const allIds = professionalData.professionals.map((p) => p.id);
      handleSelectAllFrom(allIds);
    }
  }, [professionalData, handleSelectAllFrom]);

  const handleProfessionalExport = useCallback(async () => {
    setProfessionalExportLoading(true);
    await exportAdminCsv(
      "/api/admin/professionals/export?format=csv",
      "professionals",
      (description) => toast({ title: "Success", description }),
      (description) => toast({ title: "Error", description, variant: "destructive" })
    );
    setProfessionalExportLoading(false);
  }, [toast]);

  return {
    professionalQuery,
    setProfessionalQuery,
    professionalData,
    setProfessionalData,
    professionalLoading,
    selectedProfessionalIds,
    setSelectedProfessionalIds,
    professionalExportLoading,
    professionalSortBy: professionalQuery.sortBy,
    professionalSortOrder: professionalQuery.sortOrder,
    fetchProfessionals,
    handleProfessionalSort,
    handleProfessionalPageChange,
    handleProfessionalLimitChange,
    handleSelectProfessional,
    handleSelectAllProfessionals,
    handleDeselectAllProfessionals,
    handleProfessionalExport,
  };
}
