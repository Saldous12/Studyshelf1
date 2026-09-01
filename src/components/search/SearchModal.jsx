import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, History, Search, SearchX, X } from "lucide-react";
import { useActivities } from "../../hooks/useActivities.js";
import { useSearchHistory } from "../../hooks/useSearchHistory.js";
import { searchActivities } from "../../utils/activities.js";
import { useHotkey } from "../../hooks/useHotkeys.js";
import HighlightText from "./HighlightText.jsx";
import Badge from "../ui/Badge.jsx";

export default function SearchModal({ onClose }) {
  const { activities } = useActivities();
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useHotkey("Escape", onClose, { allowInInputs: true });

  const results = useMemo(() => searchActivities(activities, query), [activities, query]);

  function openActivity(id, term) {
    if (term) addSearch(term);
    navigate(`/activity/${id}`);
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (results.length > 0) {
      openActivity(results[0].id, query);
    } else if (query.trim()) {
      addSearch(query);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh] animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl card-surface shadow-elevated animate-scale-in">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3.5">
          <Search size={18} className="flex-none text-[var(--text-tertiary)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, tags…"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex-none rounded-lg p-1 text-[var(--text-tertiary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="hidden flex-none rounded-md border border-[var(--border-strong)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-tertiary)] sm:block">
            ESC
          </kbd>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="p-2">
              {history.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                      <History size={12} />
                      Recent searches
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs font-medium text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {history.map((term) => (
                      <li key={term} className="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-[var(--bg-elevated)]">
                        <button
                          onClick={() => setQuery(term)}
                          className="flex flex-1 items-center gap-2.5 text-left text-sm text-[var(--text-primary)]"
                        >
                          <Clock size={14} className="text-[var(--text-tertiary)]" />
                          {term}
                        </button>
                        <button
                          onClick={() => removeSearch(term)}
                          aria-label={`Remove ${term} from recent searches`}
                          className="flex-none rounded-md p-1 text-[var(--text-tertiary)] opacity-0 transition hover:text-[var(--text-primary)] group-hover:opacity-100"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-2 py-6 text-center text-sm text-[var(--text-tertiary)]">
                  Start typing to search the whole library.
                </p>
              )}
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-medium text-[var(--text-tertiary)]">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <ul>
                {results.map((activity) => (
                  <li key={activity.id}>
                    <button
                      onClick={() => openActivity(activity.id, query)}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-[var(--bg-elevated)]"
                    >
                      <img
                        src={activity.thumbnail}
                        alt=""
                        loading="lazy"
                        className="h-11 w-16 flex-none rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                          <HighlightText text={activity.title} query={query} />
                        </p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">
                          <HighlightText text={activity.description} query={query} />
                        </p>
                      </div>
                      {activity.tags?.[0] && (
                        <Badge className="flex-none">{activity.tags[0]}</Badge>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
                <SearchX size={22} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">No results for "{query}"</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">Try a different name or tag.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
