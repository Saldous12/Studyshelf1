export default function ActivityCardSkeleton({ compact = false }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl card-surface">
      <div className={`skeleton ${compact ? "aspect-[16/10]" : "aspect-[16/10]"} w-full`} />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3.5 w-2/3 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
      </div>
    </div>
  );
}
