import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useHotkey } from "../../hooks/useHotkeys.js";
import Button from "./Button.jsx";

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useHotkey("Escape", onCancel, { allowInInputs: true });

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-sm rounded-2xl card-surface p-6 shadow-elevated animate-scale-in"
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
              destructive ? "bg-red-500/15 text-red-500" : "bg-brand-500/15 text-brand-500"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={destructive ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
