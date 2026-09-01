import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BookMarked, Menu, Search, Settings } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import Tooltip from "../ui/Tooltip.jsx";
import MobileDrawer from "./MobileDrawer.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/discover", label: "Discover" },
  { to: "/favorites", label: "Favorites" },
  { to: "/recent", label: "Recent" },
];

export default function Navbar({ onOpenSearch }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <NavLink to="/" className="flex flex-none items-center gap-2 pr-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
              <BookMarked size={17} strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">StudyShelf</span>
          </NavLink>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--text-primary)] bg-[var(--bg-elevated)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2">
            <Tooltip label="Search  /">
              <button
                onClick={onOpenSearch}
                className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] sm:border sm:border-[var(--border-subtle)]"
                aria-label="Search"
              >
                <Search size={17} />
                <span className="hidden text-[var(--text-tertiary)] sm:inline">Search…</span>
              </button>
            </Tooltip>
            <ThemeToggle />
            <Tooltip label="Settings">
              <NavLink
                to="/settings"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                aria-label="Settings"
              >
                <Settings size={18} />
              </NavLink>
            </Tooltip>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={NAV_LINKS} />
    </>
  );
}
