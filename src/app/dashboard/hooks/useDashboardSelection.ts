import { useState, useCallback } from "react";

export function useDashboardSelection<T extends string | number>() {
  const [selected, setSelected] = useState<Set<T>>(new Set());

  const toggle = useCallback((id: T) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: T[]) => {
    setSelected(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const isSelected = useCallback(
    (id: T) => selected.has(id),
    [selected]
  );

  const selectedArray = Array.from(selected);

  return {
    selected,
    selectedArray,
    toggle,
    selectAll,
    deselectAll,
    isSelected,
  } as const;
}
