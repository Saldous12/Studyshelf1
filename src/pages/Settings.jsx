import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
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

const ACCENT_OPTIONS = [
  { value: "mint", label: "Mint", color: "#a9e9ca" },
  { value: "sky", label: "Sky", color: "#82dcf5" },
  { value: "coral", label: "Coral", color: "#ff9b78" },
  { value: "gold", label: "Gold", color: "#f3cf75" },
];

const BACKGROUND_OPTIONS = [
  { value: "aurora", label: "Aurora", preview: "settings-preview-aurora" },
  { value: "grid", label: "Grid", preview: "settings-preview-grid" },
  { value: "plain", label: "Plain", preview: "settings-preview-plain" },
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

      <SettingsSection title="Personalize" description="Shape the colors and atmosphere of your shelf.">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"><Palette size={16} /> Accent color</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ACCENT_OPTIONS.map((option) => {
                const active = settings.accent === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateSetting("accent", option.value)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${active ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--text-primary)]" : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}`}
                  >
                    <span className="h-5 w-5 rounded-full" style={{ backgroundColor: option.color, boxShadow: `0 0 14px ${option.color}55` }} />
                    <span>{option.label}</span>
                    {active && <Check size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--text-primary)]">Background style</p>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUND_OPTIONS.map((option) => {
                const active = settings.backgroundStyle === option.value;
                return (
                  <button key={option.value} type="button" onClick={() => updateSetting("backgroundStyle", option.value)} className={`overflow-hidden rounded-xl border text-left transition ${active ? "border-[var(--color-brand-500)] ring-2 ring-[var(--color-brand-500)]/20" : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"}`}>
                    <span className={`settings-background-preview ${option.preview}`} />
                    <span className="block px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
