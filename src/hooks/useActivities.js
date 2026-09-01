import { useMemo } from "react";
import { ACTIVITIES } from "../data/activities.js";

/**
 * The single source of truth for "what activities exist" — everything
 * defined in src/data/activities.js. To add, edit, or remove an activity,
 * edit that file directly (see the comments at the top of it).
 */
export function useActivities() {
  const activities = ACTIVITIES;

  const featuredActivities = useMemo(() => {
    return activities
      .filter((a) => a.featured)
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }, [activities]);

  return { activities, featuredActivities };
}
