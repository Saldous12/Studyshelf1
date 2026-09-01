import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Expand, Gauge, Heart, TriangleAlert } from "lucide-react";
import { useActivities } from "../hooks/useActivities.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { useLaunchStats } from "../hooks/useLaunchStats.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { useSettings } from "../hooks/useSettings.js";
import { getActivityById, getRelatedActivities } from "../utils/activities.js";
import { timeAgo } from "../utils/format.js";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import CardRow from "../components/sections/CardRow.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import NotFound from "./NotFound.jsx";

export default function ActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { activities } = useActivities();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { stats, recordLaunch, getLaunchCount } = useLaunchStats();
  const { recent, recordPlay } = useRecentlyPlayed();
  const { settings } = useSettings();

  const activity = getActivityById(activities, activityId);
  const frameRef = useRef(null);
  const playerWrapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [frameError, setFrameError] = useState(false);

  const recentEntry = recent.find((r) => r.id === activityId);
  const recentMap = useMemo(
    () => Object.fromEntries(recent.map((r) => [r.id, r.lastPlayed])),
    [recent]
  );

  // Recording the launch + recent-play the moment the player page is opened
  // is what makes "open an activity" == "play it" for tracking purposes.
  useEffect(() => {
    if (!activity) return;
    recordLaunch(activity.id);
    recordPlay(activity.id);
    setLoaded(false);
    setFrameError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity?.id]);

  if (!activity) return <NotFound />;

  const related = getRelatedActivities(activities, activity, 6);
  const favorite = isFavorite(activity.id);

  function handleBack() {
    if (settings.confirmBeforeLeaving) {
      const ok = window.confirm("Leave this activity? Your progress inside it may not be saved.");
      if (!ok) return;
    }
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  }

  function handleFullscreen() {
    const el = playerWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs items={[{ label: "Discover", to: "/discover" }, { label: activity.title }]} />

      <div className="flex items-center justify-between animate-fade-up">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div
        ref={playerWrapRef}
        className="group relative aspect-video w-full overflow-hidden rounded-3xl card-surface shadow-elevated animate-fade-up"
      >
        {!loaded && !frameError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-surface)]">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-brand-500" />
            <p className="text-sm text-[var(--text-tertiary)]">Loading {activity.title}…</p>
          </div>
        )}
        {frameError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-surface)] px-6 text-center">
            <TriangleAlert size={28} className="text-amber-500" />
            <p className="text-sm font-medium text-[var(--text-primary)]">This activity couldn't be loaded</p>
            <p className="max-w-xs text-xs text-[var(--text-secondary)]">
              Make sure a file exists at <code className="rounded bg-[var(--bg-elevated)] px-1 py-0.5">{activity.url}</code>.
            </p>
          </div>
        )}
        <iframe
          ref={frameRef}
          title={activity.title}
          src={activity.url}
          onLoad={() => setLoaded(true)}
          onError={() => setFrameError(true)}
          className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
          allow="fullscreen; gamepad; autoplay"
        />

        <button
          onClick={handleFullscreen}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:bg-black/60"
          aria-label="Fullscreen"
          title="Fullscreen"
        >
          <Expand size={17} />
        </button>
      </div>

      <div className="flex flex-col gap-6 animate-fade-up lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          {activity.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activity.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {activity.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {activity.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <Gauge size={13} />
              Played {getLaunchCount(activity.id)} time{getLaunchCount(activity.id) === 1 ? "" : "s"}
            </span>
            {recentEntry && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Last played {timeAgo(recentEntry.lastPlayed)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-none gap-2.5">
          <Button
            data-testid="favorite-toggle"
            variant={favorite ? "primary" : "secondary"}
            onClick={() => toggleFavorite(activity.id, activity.title)}
            aria-pressed={favorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} fill={favorite ? "white" : "none"} />
            {favorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>

      {related.length > 0 ? (
        <CardRow title="More Like This" activities={related} launchStats={stats} recentMap={recentMap} />
      ) : (
        <EmptyState title="Nothing similar yet" description="Activities that share tags with this one will show up here." />
      )}
    </div>
  );
}
