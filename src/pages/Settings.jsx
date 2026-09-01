import { Monitor, Moon, Sun } from "lucide-react";
import { useSettings, DEFAULT_SETTINGS } from "../hooks/useSettings.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { useConfirm } from "../context/ConfirmContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { clearAllStudyShelfData } from "../utils/storage.js";

const APPEARANCE_OPTIONS = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
];

export default function Settings() {
  const { settings, updateSetting, setSettings } = useSettings();
  const { clearFavorites } = useFavorites();
  const { clearHistory } = useRecentlyPlayed();
  const confirm = useConfirm();
  const { showToast } = useToast();

  async function handleClearHistory() {
    const ok = await confirm({
      title: "Clear play history?",
      description: "Every entry on your Recent page will be removed. This can't be undone.",
      confirmLabel: "Clear history",
    });
    if (ok) {
      clearHistory();
      showToast("Play history cleared", "success");
    }
  }

  async function handleClearFavorites() {
    const ok = await confirm({
      title: "Clear all favorites?",
      description: "Every activity you've starred will be unfavorited. This can't be undone.",
      confirmLabel: "Clear favorites",
    });
    if (ok) {
      clearFavorites();
      showToast("Favorites cleared", "success");
    }
  }

  async function handleResetAll() {
    const ok = await confirm({
      title: "Reset all local data?",
      description:
        "This wipes favorites, history, launch stats, settings, and search history. This cannot be undone.",
      confirmLabel: "Reset everything",
    });
    if (ok) {
      clearAllStudyShelfData();
      setSettings(DEFAULT_SETTINGS);
      showToast("All local data has been reset", "success");
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <section className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Settings</h1>
        <p className="mt-1.5 text-[15px] text-[var(--text-secondary)]">
          Everything here is saved to this browser only.
        </p>
      </section>

      <SettingsSection title="Appearance" description="Choose how StudyShelf looks.">
        <div className="grid grid-cols-3 gap-2.5">
          {APPEARANCE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = settings.appearance === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateSetting("appearance", opt.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
                  active
                    ? "border-brand-500 bg-brand-500/10 text-brand-500"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection title="Preferences" description="Fine-tune how the app behaves.">
        <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
          <ToggleRow
            label="Animations"
            description="Card hovers, page transitions, and micro-interactions."
            checked={settings.animations}
            onChange={(v) => updateSetting("animations", v)}
          />
          <ToggleRow
            label="Compact cards"
            description="Show smaller, denser activity cards without descriptions."
            checked={settings.compactCards}
            onChange={(v) => updateSetting("compactCards", v)}
          />
          <ToggleRow
            label="Confirm before leaving activity"
            description="Ask before navigating away from an open activity."
            checked={settings.confirmBeforeLeaving}
            onChange={(v) => updateSetting("confirmBeforeLeaving", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Data" description="Manage what StudyShelf remembers on this device.">
        <div className="flex flex-col gap-3">
          <DataRow
            label="Clear recent history"
            description="Removes every entry from your Recent page."
            actionLabel="Clear"
            onClick={handleClearHistory}
          />
          <DataRow
            label="Clear favorites"
            description="Unfavorites every activity you've starred."
            actionLabel="Clear"
            onClick={handleClearFavorites}
          />
          <DataRow
            label="Reset all local data"
            description="Wipes everything StudyShelf has saved in this browser."
            actionLabel="Reset all"
            danger
            onClick={handleResetAll}
          />
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <section className="animate-fade-up rounded-2xl card-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      {description && <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 flex-none rounded-full transition-colors duration-200 ${
          checked ? "bg-brand-500" : "bg-[var(--border-strong)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function DataRow({ label, description, actionLabel, onClick, danger }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`flex-none rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
