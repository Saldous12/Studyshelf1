const VARIANTS = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 shadow-soft hover:shadow-elevated active:scale-[0.98]",
  secondary:
    "card-surface text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] active:scale-[0.98]",
  ghost:
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-[0.98]",
  danger:
    "bg-red-500/90 text-white hover:bg-red-500 shadow-soft active:scale-[0.98]",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10",
};

export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <As
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
