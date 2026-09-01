import { lazy, Suspense, useCallback, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import ToastContainer from "./components/ui/ToastContainer.jsx";
import SearchModal from "./components/search/SearchModal.jsx";
import KeyboardShortcutsModal from "./components/ui/KeyboardShortcutsModal.jsx";
import { useHotkey } from "./hooks/useHotkeys.js";
import { useSettings } from "./hooks/useSettings.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Discover = lazy(() => import("./pages/Discover.jsx"));
const Favorites = lazy(() => import("./pages/Favorites.jsx"));
const Recent = lazy(() => import("./pages/Recent.jsx"));
const ActivityPage = lazy(() => import("./pages/ActivityPage.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-brand-500" />
    </div>
  );
}

export default function App() {
  // Mount once to keep <html> class / attribute in sync with appearance setting.
  useSettings();

  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const location = useLocation();

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useHotkey("/", () => setSearchOpen(true));
  useHotkey("mod+k", () => setSearchOpen(true));
  useHotkey("?", () => setShortcutsOpen(true));

  return (
    <div className="app-shell-bg min-h-screen">
      <Navbar onOpenSearch={openSearch} />

      <main key={location.pathname} className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 animate-fade-in sm:px-6 lg:px-8">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home onOpenSearch={openSearch} />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/activity/:activityId" element={<ActivityPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {shortcutsOpen && <KeyboardShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      <ToastContainer />
    </div>
  );
}
