import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useDashboardKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled = true
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!shortcut.ctrlKey === e.ctrlKey &&
          !!shortcut.metaKey === e.metaKey
        ) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
