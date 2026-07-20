import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-wide section-sm space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
