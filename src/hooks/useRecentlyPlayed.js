import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { useSettings } from "./useSettings.js";

// Stored as an array of { id, lastPlayed } ordered most-recent-first.
export function useRecentlyPlayed() {
  const [recent, setRecent] = useLocalStorage("recent", []);
  const { settings } = useSettings();
  const maxSize = settings.maxHistorySize || 24;

  const recordPlay = useCallback(
    (id) => {
      setRecent((prev) => {
        const withoutId = prev.filter((r) => r.id !== id);
        const next = [{ id, lastPlayed: new Date().toISOString() }, ...withoutId];
        return next.slice(0, maxSize);
      });
    },
    [setRecent, maxSize]
  );

  const clearHistory = useCallback(() => setRecent([]), [setRecent]);

  const removeFromHistory = useCallback(
    (id) => setRecent((prev) => prev.filter((r) => r.id !== id)),
    [setRecent]
  );

  return { recent, recordPlay, clearHistory, removeFromHistory };
}
