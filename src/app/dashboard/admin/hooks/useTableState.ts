import { useCallback, useState } from "react";

interface BaseTableQuery {
  page: number;
  limit: number;
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export function useTableState<TQuery extends BaseTableQuery, TId extends string = string>(initialQuery: TQuery) {
  const [query, setQuery] = useState<TQuery>(initialQuery);
  const [selectedIds, setSelectedIds] = useState<Set<TId>>(new Set());

  const handleSort = useCallback((column: string) => {
    setQuery((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setQuery((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const handleSelectOne = useCallback((id: TId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAllFrom = useCallback((ids: TId[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    query,
    setQuery,
    selectedIds,
    setSelectedIds,
    handleSort,
    handlePageChange,
    handleLimitChange,
    handleSelectOne,
    handleSelectAllFrom,
    handleDeselectAll,
  };
}
