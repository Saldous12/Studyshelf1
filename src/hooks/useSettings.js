import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

export const DEFAULT_SETTINGS = {
  appearance: "dark", // "dark" | "light" | "system"
  animations: true,
  compactCards: false,
  confirmBeforeLeaving: false,
  maxHistorySize: 24,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage("settings", DEFAULT_SETTINGS);

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  // Keep <html class="dark"> and the animations toggle in sync with settings.
  useEffect(() => {
    const root = document.documentElement;

    function resolveTheme() {
      if (settings.appearance === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return settings.appearance;
    }

    function apply() {
      const resolved = resolveTheme();
      root.classList.toggle("dark", resolved === "dark");
      root.setAttribute("data-theme", resolved);
    }

    apply();

    if (settings.appearance === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [settings.appearance]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-animations", !settings.animations);
  }, [settings.animations]);

  return { settings, updateSetting, resetSettings, setSettings };
}
