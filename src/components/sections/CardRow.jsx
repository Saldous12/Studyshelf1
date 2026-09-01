import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ActivityCard from "../cards/ActivityCard.jsx";
import ActivityCardSkeleton from "../cards/ActivityCardSkeleton.jsx";

export default function CardRow({
  title,
  subtitle,
  activities,
  seeAllHref,
  loading = false,
  launchStats = {},
  recentMap = {},
  emptyMessage,
  compact = false,
}) {
  if (!loading && (!activities || activities.length === 0)) {
    if (!emptyMessage) return null;
    return null;
  }

  return (
    <section className="animate-fade-up">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="flex flex-none items-center gap-1 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            See all
            <ChevronRight size={15} />
          </Link>
        )}
      </div>

      <div className="scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[240px] flex-none sm:w-[260px]">
                <ActivityCardSkeleton />
              </div>
            ))
          : activities.map((activity) => (
              <div key={activity.id} className={compact ? "w-[180px] flex-none sm:w-[200px]" : "w-[240px] flex-none sm:w-[260px]"}>
                <ActivityCard
                  activity={activity}
                  compact={compact}
                  launchCount={launchStats[activity.id]?.count}
                  lastPlayed={recentMap[activity.id]}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
