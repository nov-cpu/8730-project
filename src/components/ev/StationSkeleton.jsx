export default function StationSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded shimmer" />
          <div className="h-3 w-1/2 rounded shimmer" />
          <div className="h-3 w-2/3 rounded shimmer" />
          <div className="flex gap-2 pt-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-5 w-16 rounded-full shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}