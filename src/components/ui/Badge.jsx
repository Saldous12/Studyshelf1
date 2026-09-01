export default function Badge({ children, color, className = "", variant = "solid" }) {
  const style = color
    ? variant === "solid"
      ? { backgroundColor: `color-mix(in oklab, ${color} 22%, transparent)`, color, borderColor: `color-mix(in oklab, ${color} 40%, transparent)` }
      : { color, borderColor: `color-mix(in oklab, ${color} 45%, transparent)` }
    : undefined;

  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        color ? "" : "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
      } ${className}`}
    >
      {children}
    </span>
  );
}
