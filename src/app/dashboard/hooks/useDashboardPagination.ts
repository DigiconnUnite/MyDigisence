import { useState, useCallback } from "react";

export interface PaginationState {
  page: number;
  limit: number;
}

export function useDashboardPagination(
  initial: PaginationState = { page: 1, limit: 10 }
) {
  const [state, setState] = useState<PaginationState>(initial);

  const setPage = useCallback(
    (page: number) => setState((prev) => ({ ...prev, page })),
    []
  );
  const setLimit = useCallback(
    (limit: number) => setState((prev) => ({ ...prev, limit, page: 1 })),
    []
  );
  const nextPage = useCallback(
    () => setState((prev) => ({ ...prev, page: prev.page + 1 })),
    []
  );
  const prevPage = useCallback(
    () => setState((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) })),
    []
  );

  return {
    ...state,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    setPagination: setState,
  } as const;
}
