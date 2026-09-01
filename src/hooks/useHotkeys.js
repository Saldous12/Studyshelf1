import { useEffect } from "react";

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

/**
 * Registers a global keyboard shortcut.
 * combo examples: "/", "Escape", "mod+k" (mod = Cmd on Mac, Ctrl elsewhere)
 */
export function useHotkey(combo, handler, { allowInInputs = false } = {}) {
  useEffect(() => {
    function onKeyDown(e) {
      const isMod = e.metaKey || e.ctrlKey;
      const parts = combo.split("+");
      const wantsMod = parts.includes("mod");
      const key = parts[parts.length - 1];

      const matches = wantsMod
        ? isMod && e.key.toLowerCase() === key.toLowerCase()
        : e.key === key || e.key.toLowerCase() === key.toLowerCase();

      if (!matches) return;
      if (!allowInInputs && isTypingTarget(e.target) && key !== "Escape") return;

      e.preventDefault();
      handler(e);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, handler, allowInInputs]);
}
