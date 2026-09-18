import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-8 border-b border-bone/15 pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-64" />
        <Skeleton className="mt-3 h-3 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-72" />
        <Skeleton className="h-72 xl:col-span-2" />
      </div>
    </div>
  );
}
