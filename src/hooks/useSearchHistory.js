import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const MAX_HISTORY = 8;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage("searchHistory", []);

  const addSearch = useCallback(
    (query) => {
      const q = query.trim();
      if (!q) return;
      setHistory((prev) => {
        const withoutQuery = prev.filter((h) => h.toLowerCase() !== q.toLowerCase());
        return [q, ...withoutQuery].slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const removeSearch = useCallback(
    (query) => setHistory((prev) => prev.filter((h) => h !== query)),
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  return { history, addSearch, removeSearch, clearHistory };
}
