import { NavLink } from "react-router-dom";
import { BookMarked, Settings, X } from "lucide-react";
import { useHotkey } from "../../hooks/useHotkeys.js";

export default function MobileDrawer({ open, onClose, links }) {
  useHotkey("Escape", onClose, { allowInInputs: true });

  return (
    <div
      className={`fixed inset-0 z-[90] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] card-surface p-5 shadow-elevated transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <BookMarked size={17} />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">StudyShelf</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="my-2 h-px bg-[var(--border-subtle)]" />
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            <Settings size={16} />
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
