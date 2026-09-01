import { Moon, Sun } from "lucide-react";
import { useSettings } from "../../hooks/useSettings.js";
import Tooltip from "./Tooltip.jsx";

export default function ThemeToggle() {
  const { settings, updateSetting } = useSettings();

  const isDark =
    settings.appearance === "dark" ||
    (settings.appearance === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  function toggle() {
    updateSetting("appearance", isDark ? "light" : "dark");
  }

  return (
    <Tooltip label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <button
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] active:scale-95"
        aria-label="Toggle theme"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Sun
            size={19}
            className={`absolute transition-all duration-300 ${isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
          />
          <Moon
            size={19}
            className={`absolute transition-all duration-300 ${isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"}`}
          />
        </span>
      </button>
    </Tooltip>
  );
}
