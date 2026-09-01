import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { timeAgo } from "../../utils/format.js";
import Badge from "../ui/Badge.jsx";

export default function ContinueCard({ activity, lastPlayed }) {
  if (!activity) return null;

  return (
    <section className="animate-fade-up">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">
        Continue where you left off
      </h2>
      <Link
        to={`/activity/${activity.id}`}
        className="group relative flex flex-col overflow-hidden rounded-3xl card-surface shadow-elevated transition-all duration-300 hover:-translate-y-1 sm:flex-row"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-auto sm:w-[420px] sm:flex-none">
          <img
            src={activity.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-elevated">
              <Play size={22} fill="black" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {activity.tags?.slice(0, 2).map((tag) => <Badge key={tag}>{tag}</Badge>)}
            <span className="text-xs font-medium text-[var(--text-tertiary)]">
              Last played {timeAgo(lastPlayed)}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{activity.title}</h3>
          <p className="max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">{activity.description}</p>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 group-hover:bg-brand-400 group-hover:shadow-elevated">
            Resume
            <ArrowRight size={15} />
          </span>
        </div>
      </Link>
    </section>
  );
}
