import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

// Stored as { [activityId]: { count, lastPlayed } }
export function useLaunchStats() {
  const [stats, setStats] = useLocalStorage("launches", {});

  const recordLaunch = useCallback(
    (id) => {
      setStats((prev) => {
        const existing = prev[id] || { count: 0, lastPlayed: null };
        return {
          ...prev,
          [id]: { count: existing.count + 1, lastPlayed: new Date().toISOString() },
        };
      });
    },
    [setStats]
  );

  const totalLaunches = useMemo(
    () => Object.values(stats).reduce((sum, s) => sum + (s.count || 0), 0),
    [stats]
  );

  const getLaunchCount = useCallback((id) => stats[id]?.count || 0, [stats]);

  return { stats, recordLaunch, totalLaunches, getLaunchCount };
}
