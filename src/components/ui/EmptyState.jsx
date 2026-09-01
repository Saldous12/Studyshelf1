export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl card-surface px-6 py-16 text-center animate-fade-up ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
