import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton-shimmer animate-shimmer rounded-md", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
