// Pure helper functions for working with activity records. These are used
// by search, Discover sorting, and the activity player's "More Like This".

const NEW_WINDOW_DAYS = 14;

export function isNewActivity(activity, now = Date.now()) {
  if (!activity?.dateAdded) return false;
  const added = new Date(activity.dateAdded).getTime();
  if (Number.isNaN(added)) return false;
  const days = (now - added) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= NEW_WINDOW_DAYS;
}

export function matchesQuery(activity, query) {
  if (!query?.trim()) return true;
  const q = query.trim().toLowerCase();
  const haystacks = [
    activity.title,
    activity.description,
    ...(activity.tags || []),
  ];
  return haystacks.some((field) => field && String(field).toLowerCase().includes(q));
}

export function searchActivities(activities, query) {
  if (!query?.trim()) return [];
  const q = query.trim().toLowerCase();

  const scored = activities
    .filter((a) => matchesQuery(a, query))
    .map((a) => {
      let score = 0;
      const title = a.title.toLowerCase();
      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 60;
      else if (title.includes(q)) score += 35;
      if (a.tags?.some((t) => t.toLowerCase() === q)) score += 25;
      if (a.tags?.some((t) => t.toLowerCase().includes(q))) score += 12;
      if (a.description?.toLowerCase().includes(q)) score += 8;
      return { activity: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((s) => s.activity);

  return scored;
}

export function sortActivities(activities, sortBy, launchStats = {}) {
  const list = [...activities];
  switch (sortBy) {
    case "az":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "recent":
      return list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case "played":
      return list.sort((a, b) => (launchStats[b.id]?.count || 0) - (launchStats[a.id]?.count || 0));
    case "random": {
      const arr = [...list];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    default:
      return list;
  }
}

export function getActivityById(activities, id) {
  return activities.find((a) => a.id === id);
}

export function getRelatedActivities(activities, activity, limit = 6) {
  if (!activity) return [];
  const tagSet = new Set(activity.tags || []);
  return activities
    .filter((a) => a.id !== activity.id)
    .map((a) => {
      const sharedTags = (a.tags || []).filter((t) => tagSet.has(t)).length;
      return { activity: a, score: sharedTags };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.activity);
}
