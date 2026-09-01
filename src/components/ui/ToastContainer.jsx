import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";

const ICONS = {
  success: CheckCircle2,
  error: TriangleAlert,
  default: Info,
};

const ICON_COLORS = {
  success: "text-emerald-500",
  error: "text-red-500",
  default: "text-brand-500",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:top-5">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || ICONS.default;
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl card-surface px-4 py-3 shadow-elevated animate-toast-in"
          >
            <Icon size={18} className={`flex-none ${ICON_COLORS[toast.type] || ICON_COLORS.default}`} />
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-none rounded-lg p-1 text-[var(--text-tertiary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
