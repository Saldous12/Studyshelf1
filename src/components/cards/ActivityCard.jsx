import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Heart, Play } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites.js";
import { isNewActivity } from "../../utils/activities.js";
import { timeAgo } from "../../utils/format.js";
import Badge from "../ui/Badge.jsx";

export default function ActivityCard({ activity, compact = false, lastPlayed, launchCount }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [popping, setPopping] = useState(false);
  const favorite = isFavorite(activity.id);
  const isNew = isNewActivity(activity);

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setPopping(true);
    toggleFavorite(activity.id, activity.title);
    setTimeout(() => setPopping(false), 350);
  }

  return (
    <Link
      to={`/activity/${activity.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl card-surface shadow-soft outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-elevated hover:border-[var(--border-strong)] focus-visible:-translate-y-1"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[16/10]"} bg-[var(--bg-elevated)]`}>
        <img
          src={activity.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* top-left badges */}
        {isNew && (
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            <Badge color="#38bdf8" className="backdrop-blur-md">
              New
            </Badge>
          </div>
        )}

        {/* favorite button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/55 active:scale-90"
        >
          <Heart
            size={16}
            className={`${popping ? "animate-pop" : ""} transition-colors`}
            fill={favorite ? "#f04759" : "none"}
            color={favorite ? "#f04759" : "white"}
          />
        </button>

        {/* recently played indicator */}
        {lastPlayed && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            <Clock size={11} />
            {timeAgo(lastPlayed)}
          </div>
        )}

        {/* launch button, revealed on hover */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center pb-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-black shadow-elevated">
            <Play size={14} fill="black" />
            Launch
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">{activity.title}</h3>
        {!compact && (
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {activity.description}
          </p>
        )}
        {!compact && activity.tags?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {activity.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        {typeof launchCount === "number" && launchCount > 0 && (
          <p className="mt-1 text-[11px] font-medium text-[var(--text-tertiary)]">
            Played {launchCount} time{launchCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </Link>
  );
}
