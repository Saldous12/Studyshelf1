import { X } from "lucide-react";
import { useHotkey } from "../../hooks/useHotkeys.js";

const SHORTCUTS = [
  { keys: ["/"], description: "Open search" },
  { keys: ["Ctrl", "K"], mac: ["⌘", "K"], description: "Open search" },
  { keys: ["Esc"], description: "Close any modal or dialog" },
  { keys: ["?"], description: "Show this shortcuts list" },
];

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

export default function KeyboardShortcutsModal({ onClose }) {
  useHotkey("Escape", onClose, { allowInInputs: true });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl card-surface p-6 shadow-elevated animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Keyboard shortcuts</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <ul className="space-y-2.5">
          {SHORTCUTS.map((s, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">{s.description}</span>
              <span className="flex gap-1">
                {(isMac && s.mac ? s.mac : s.keys).map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[1.75rem] rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-1.5 py-1 text-center text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
