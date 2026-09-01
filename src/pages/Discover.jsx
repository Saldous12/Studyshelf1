import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Shuffle, LayoutGrid } from "lucide-react";
import { useActivities } from "../hooks/useActivities.js";
import { useLaunchStats } from "../hooks/useLaunchStats.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { useSettings } from "../hooks/useSettings.js";
import { isNewActivity, sortActivities } from "../utils/activities.js";
import CardRow from "../components/sections/CardRow.jsx";
import ActivityCard from "../components/cards/ActivityCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const SORT_OPTIONS = [
  { value: "", label: "Curated" },
  { value: "az", label: "A–Z" },
  { value: "recent", label: "Recently Added" },
  { value: "played", label: "Most Played" },
  { value: "random", label: "Random" },
];

export default function Discover() {
  const { activities, featuredActivities } = useActivities();
  const { stats } = useLaunchStats();
  const { recent } = useRecentlyPlayed();
  const { settings } = useSettings();
  const compact = settings.compactCards;
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";

  const recentMap = useMemo(
    () => Object.fromEntries(recent.map((r) => [r.id, r.lastPlayed])),
    [recent]
  );

  function setSort(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("sort", value);
    else next.delete("sort");
    setSearchParams(next, { replace: true });
  }

  const isSorting = Boolean(sort);
  const flatList = useMemo(() => sortActivities(activities, sort || "az", stats), [activities, sort, stats]);

  const trending = useMemo(() => sortActivities(activities, "played", stats).slice(0, 10), [activities, stats]);
  const newActivities = useMemo(() => activities.filter((a) => isNewActivity(a)), [activities]);
  const mostPlayed = useMemo(() => sortActivities(activities, "played", stats).slice(0, 10), [activities, stats]);
  const recentlyAdded = useMemo(() => sortActivities(activities, "recent").slice(0, 10), [activities]);
  const recommended = useMemo(() => sortActivities(activities, "az").slice(0, 10), [activities]);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col gap-10">
        <section className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Discover</h1>
          <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
            Browse the full library, sorted however you like.
          </p>
        </section>
        <EmptyState
          icon={LayoutGrid}
          title="No activities yet"
          description="Add your first activity to get started — see src/data/activities.js for the two-minute setup."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-start justify-between gap-4 animate-fade-up sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Discover</h1>
          <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
            Browse the full library, sorted however you like.
          </p>
        </div>

        <div className="flex flex-none items-center gap-1.5">
          <label className="sr-only" htmlFor="sort-select">
            Sort activities
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-sm text-[var(--text-primary)] focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {sort === "random" && (
            <button
              onClick={() => setSort("random")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              aria-label="Reshuffle"
              title="Reshuffle"
            >
              <Shuffle size={15} />
            </button>
          )}
        </div>
      </section>

      {isSorting ? (
        <section className={`grid grid-cols-2 gap-4 animate-fade-up sm:grid-cols-3 lg:grid-cols-4 ${compact ? "xl:grid-cols-6" : "xl:grid-cols-5"}`}>
          {flatList.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              compact={compact}
              launchCount={stats[activity.id]?.count}
              lastPlayed={recentMap[activity.id]}
            />
          ))}
        </section>
      ) : (
        <div className="flex flex-col gap-10">
          <CardRow title="Featured" subtitle="Hand-picked highlights" activities={featuredActivities} launchStats={stats} recentMap={recentMap} />
          <CardRow title="Trending" subtitle="Getting the most play right now" activities={trending} launchStats={stats} recentMap={recentMap} />
          <CardRow title="New" subtitle="Added in the last two weeks" activities={newActivities} launchStats={stats} recentMap={recentMap} />
          <CardRow title="Most Played" subtitle="All-time favorites by launch count" activities={mostPlayed} launchStats={stats} recentMap={recentMap} />
          <CardRow title="Recommended" subtitle="Worth a look" activities={recommended} launchStats={stats} recentMap={recentMap} />
          <CardRow title="Recently Added" subtitle="Newest first" activities={recentlyAdded} launchStats={stats} recentMap={recentMap} />

          <section className="animate-fade-up">
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">
              All Activities
            </h2>
            <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${compact ? "xl:grid-cols-6" : "xl:grid-cols-5"}`}>
              {sortActivities(activities, "az").map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  compact={compact}
                  launchCount={stats[activity.id]?.count}
                  lastPlayed={recentMap[activity.id]}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
