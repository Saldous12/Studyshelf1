import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
      <Link to="/" className="flex items-center gap-1 rounded-md px-1 py-0.5 transition hover:text-[var(--text-primary)]">
        <Home size={13} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="opacity-60" />
          {item.to ? (
            <Link to={item.to} className="rounded-md px-1 py-0.5 transition hover:text-[var(--text-primary)]">
              {item.label}
            </Link>
          ) : (
            <span className="px-1 py-0.5 font-medium text-[var(--text-primary)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
