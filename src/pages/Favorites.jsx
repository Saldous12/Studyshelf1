import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useActivities } from "../hooks/useActivities.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { useLaunchStats } from "../hooks/useLaunchStats.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { useSettings } from "../hooks/useSettings.js";
import { pluralize } from "../utils/format.js";
import ActivityCard from "../components/cards/ActivityCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";

export default function Favorites() {
  const { activities } = useActivities();
  const { favorites } = useFavorites();
  const { stats } = useLaunchStats();
  const { recent } = useRecentlyPlayed();
  const { settings } = useSettings();

  const recentMap = useMemo(
    () => Object.fromEntries(recent.map((r) => [r.id, r.lastPlayed])),
    [recent]
  );

  const favoriteActivities = useMemo(
    () => activities.filter((a) => favorites.includes(a.id)),
    [activities, favorites]
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Favorites</h1>
        <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
          {pluralize(favoriteActivities.length, "activity", "activities")} you've starred.
        </p>
      </section>

      {favoriteActivities.length > 0 ? (
        <section className={`grid grid-cols-2 gap-4 animate-fade-up sm:grid-cols-3 lg:grid-cols-4 ${settings.compactCards ? "xl:grid-cols-6" : "xl:grid-cols-5"}`}>
          {favoriteActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              compact={settings.compactCards}
              launchCount={stats[activity.id]?.count}
              lastPlayed={recentMap[activity.id]}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any activity card to save it here for quick access."
          action={
            <Button as={Link} to="/discover" variant="primary">
              Browse activities
            </Button>
          }
        />
      )}
    </div>
  );
}
