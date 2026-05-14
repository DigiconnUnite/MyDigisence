import { useEffect } from "react";

export function useBusinessUrlSync(currentView: string) {
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

  // Hydrate from URL on mount
  useEffect(() => {
    const apply = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("view");
      if (v) {
        // Parent component should handle validation
        return v;
      }
      return null;
    };
    apply();
  }, []);
}
