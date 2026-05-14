import { useState, useEffect, useCallback, useRef } from "react";

export function useDashboardRouter<T extends string>(
  validViews: readonly T[],
  defaultView: T
) {
  const [currentView, setCurrentView] = useState<T>(defaultView);

  const isValidView = useCallback(
    (view: string): view is T => validViews.includes(view as T),
    [validViews]
  );

  // Hydrate from URL on mount
  useEffect(() => {
    const apply = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("view");
      if (v && isValidView(v)) setCurrentView(v);
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, [isValidView]);

  // Sync URL when view changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("view", currentView);
    const next = `${window.location.pathname}?${params}`;
    const cur = `${window.location.pathname}${window.location.search}`;
    if (next !== cur) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [currentView]);

  const navigate = useCallback(
    (view: string) => {
      if (isValidView(view)) setCurrentView(view);
    },
    [isValidView]
  );

  return { currentView, setCurrentView: navigate, isValidView } as const;
}
