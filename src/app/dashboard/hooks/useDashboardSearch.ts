import { useState, useEffect, useMemo, useCallback } from "react";

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  routeLabel?: string;
  [key: string]: any;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const matrix: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) matrix[i][0] = i;
  for (let j = 0; j <= n; j++) matrix[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[m][n];
}

export function useDashboardSearch<T extends SearchItem>(
  index: T[],
  options?: {
    maxResults?: number;
    recentStorageKey?: string;
    maxRecent?: number;
  }
) {
  const { maxResults = 10, recentStorageKey, maxRecent = 8 } = options || {};
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<T[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (!recentStorageKey) return;
    try {
      const raw = window.localStorage.getItem(recentStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, maxRecent));
      }
    } catch {
      // ignore storage errors
    }
  }, [recentStorageKey, maxRecent]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);

    return index
      .map((item) => {
        let score = 0;
        const label = item.label.toLowerCase();
        const desc = item.description.toLowerCase();
        const haystack = item.keywords.join(" ").toLowerCase();

        if (label.startsWith(q)) score += 120;
        else if (label.includes(q)) score += 80;
        if (desc.includes(q)) score += 35;
        if (haystack.includes(q)) score += 50;

        const matchedKeywords = item.keywords.filter((k) =>
          k.toLowerCase().includes(q)
        ).length;
        score += matchedKeywords * 20;

        for (const token of tokens) {
          if (label.includes(token)) score += 22;
          if (desc.includes(token)) score += 12;
          if (haystack.includes(token)) score += 16;
        }

        const compactLabel = label.replace(/[^a-z0-9]/g, "");
        const compactQuery = q.replace(/[^a-z0-9]/g, "");
        if (compactQuery.length >= 3) {
          const dist = levenshteinDistance(
            compactQuery,
            compactLabel.slice(0, Math.max(compactQuery.length, 1))
          );
          if (dist <= 1) score += 32;
          else if (dist <= 2) score += 20;
          else if (dist <= 3) score += 8;
        }

        return { score, item };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((x) => x.item);
  }, [query, index, maxResults]);

  const addRecent = useCallback(
    (item: T) => {
      if (!recentStorageKey) return;
      setRecentSearches((prev) => {
        const next = [item, ...prev.filter((i) => i.id !== item.id)].slice(
          0,
          maxRecent
        );
        try {
          window.localStorage.setItem(
            recentStorageKey,
            JSON.stringify(next)
          );
        } catch {
          // ignore
        }
        return next;
      });
    },
    [recentStorageKey, maxRecent]
  );

  const displayResults = query.trim().length > 0 ? results : recentSearches;

  return {
    query,
    setQuery,
    results,
    recentSearches,
    displayResults,
    addRecent,
  } as const;
}
