import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Compass, LayoutGrid, Search, Sparkles } from "lucide-react";
import { useActivities } from "../hooks/useActivities.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { useLaunchStats } from "../hooks/useLaunchStats.js";
import { getActivityById, sortActivities } from "../utils/activities.js";
import ContinueCard from "../components/sections/ContinueCard.jsx";
import CardRow from "../components/sections/CardRow.jsx";
import Button from "../components/ui/Button.jsx";

export default function Home({ onOpenSearch }) {
  const { activities } = useActivities();
  const { recent } = useRecentlyPlayed();
  const { favorites } = useFavorites();
  const { stats } = useLaunchStats();

  const recentMap = useMemo(
    () => Object.fromEntries(recent.map((r) => [r.id, r.lastPlayed])),
    [recent]
  );

  const mostRecent = recent[0];
  const mostRecentActivity = mostRecent ? getActivityById(activities, mostRecent.id) : null;

  const continuePlayingActivities = useMemo(
    () =>
      recent
        .slice(1, 9)
        .map((r) => getActivityById(activities, r.id))
        .filter(Boolean),
    [recent, activities]
  );

  const recentlyAdded = useMemo(
    () => sortActivities(activities, "recent").slice(0, 10),
    [activities]
  );

  const popular = useMemo(() => {
    const played = activities.filter((a) => (stats[a.id]?.count || 0) > 0);
    if (played.length > 0) return sortActivities(played, "played").slice(0, 10);
    return activities.filter((a) => a.featured).slice(0, 10);
  }, [activities, stats]);

  const recommended = useMemo(() => {
    const seedIds = new Set([...favorites, ...recent.map((r) => r.id)]);
    if (seedIds.size === 0) return activities.filter((a) => a.featured).slice(0, 10);

    const seedActivities = activities.filter((a) => seedIds.has(a.id));
    const tagWeights = {};
    seedActivities.forEach((a) => {
      (a.tags || []).forEach((t) => (tagWeights[t] = (tagWeights[t] || 0) + 1));
    });

    return activities
      .filter((a) => !seedIds.has(a.id))
      .map((a) => {
        let score = 0;
        (a.tags || []).forEach((t) => (score += tagWeights[t] || 0));
        return { activity: a, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((s) => s.activity);
  }, [activities, favorites, recent]);

  const favoriteActivities = useMemo(
    () => activities.filter((a) => favorites.includes(a.id)),
    [activities, favorites]
  );

  return (
    <div className="flex flex-col gap-12">
      <section className="animate-fade-up">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Welcome back.
            </h1>
            <p className="mt-2 max-w-lg text-[15px] text-[var(--text-secondary)]">
              Your shelf of study tools and quick activities — pick up where you left off or find
              something new.
            </p>
          </div>
          <div className="flex flex-none gap-2.5">
            <Button variant="secondary" onClick={onOpenSearch}>
              <Search size={16} />
              Search
            </Button>
            <Button as={Link} to="/discover" variant="primary">
              <Compass size={16} />
              Discover
            </Button>
          </div>
        </div>
      </section>

      {activities.length === 0 ? (
        <section className="flex flex-col items-center gap-4 rounded-3xl card-surface px-6 py-16 text-center animate-fade-up">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-500">
            <LayoutGrid size={26} strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">No activities yet</h2>
            <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
              Add your first activity to get started — see the instructions at the top of
              src/data/activities.js.
            </p>
          </div>
        </section>
      ) : mostRecentActivity ? (
        <ContinueCard activity={mostRecentActivity} lastPlayed={mostRecent.lastPlayed} />
      ) : (
        <section className="flex flex-col items-center gap-4 rounded-3xl card-surface px-6 py-16 text-center animate-fade-up">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-500">
            <Sparkles size={26} strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Nothing played yet</h2>
            <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
              Launch your first activity and it'll show up here so you can jump right back in.
            </p>
          </div>
          <Button as={Link} to="/discover" variant="primary">
            Browse the shelf
          </Button>
        </section>
      )}

      <CardRow
        title="Continue Playing"
        subtitle="Pick up something you started recently"
        activities={continuePlayingActivities}
        seeAllHref="/recent"
        recentMap={recentMap}
        launchStats={stats}
      />

      <CardRow
        title="Recently Added"
        subtitle="Fresh additions to the shelf"
        activities={recentlyAdded}
        seeAllHref="/discover?sort=recent"
        launchStats={stats}
        recentMap={recentMap}
      />

      <CardRow
        title="Popular"
        subtitle="What everyone's launching most"
        activities={popular}
        seeAllHref="/discover?sort=played"
        launchStats={stats}
        recentMap={recentMap}
      />

      <CardRow
        title="Recommended for you"
        subtitle="Based on what you play and favorite"
        activities={recommended}
        seeAllHref="/discover"
        launchStats={stats}
        recentMap={recentMap}
      />

      {favoriteActivities.length > 0 && (
        <CardRow
          title="Favorites"
          subtitle="Everything you've starred"
          activities={favoriteActivities}
          seeAllHref="/favorites"
          launchStats={stats}
          recentMap={recentMap}
        />
      )}
    </div>
  );
}
