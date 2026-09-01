import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, History, Trash2 } from "lucide-react";
import { useActivities } from "../hooks/useActivities.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { getActivityById } from "../utils/activities.js";
import { timeAgo } from "../utils/format.js";
import { pluralize } from "../utils/format.js";
import { useConfirm } from "../context/ConfirmContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

export default function Recent() {
  const { activities } = useActivities();
  const { recent, clearHistory, removeFromHistory } = useRecentlyPlayed();
  const confirm = useConfirm();
  const { showToast } = useToast();

  const entries = useMemo(
    () =>
      recent
        .map((r) => ({ ...r, activity: getActivityById(activities, r.id) }))
        .filter((r) => r.activity),
    [recent, activities]
  );

  async function handleClear() {
    const ok = await confirm({
      title: "Clear play history?",
      description: "This removes every entry from your Recent page. Favorites and settings won't be affected.",
      confirmLabel: "Clear history",
    });
    if (ok) {
      clearHistory();
      showToast("Play history cleared", "success");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-start justify-between gap-4 animate-fade-up sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Recent</h1>
          <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
            {pluralize(entries.length, "activity", "activities")}, most recently played first.
          </p>
        </div>
        {entries.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleClear}>
            <Trash2 size={14} />
            Clear history
          </Button>
        )}
      </section>

      {entries.length > 0 ? (
        <section className="flex flex-col gap-2.5 animate-fade-up">
          {entries.map(({ id, lastPlayed, activity }) => {
            return (
              <div
                key={id}
                className="group flex items-center gap-4 rounded-2xl card-surface p-3 shadow-soft transition-all duration-200 hover:border-[var(--border-strong)] sm:p-3.5"
              >
                <Link to={`/activity/${id}`} className="flex-none overflow-hidden rounded-xl">
                  <img
                    src={activity.thumbnail}
                    alt=""
                    loading="lazy"
                    className="h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-[70px] sm:w-[110px]"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/activity/${id}`} className="truncate text-sm font-semibold text-[var(--text-primary)] hover:underline sm:text-base">
                    {activity.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                    {activity.tags?.[0] && <Badge>{activity.tags[0]}</Badge>}
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {timeAgo(lastPlayed)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <Button as={Link} to={`/activity/${id}`} size="sm" variant="secondary" className="hidden sm:inline-flex">
                    Continue
                  </Button>
                  <button
                    onClick={() => removeFromHistory(id)}
                    aria-label={`Remove ${activity.title} from recent`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition hover:bg-[var(--bg-elevated)] hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={History}
          title="No recent activity"
          description="Activities you open will show up here so you can jump back in quickly."
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
