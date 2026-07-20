import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide section-sm space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
