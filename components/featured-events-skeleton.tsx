import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FeaturedEventsSkeleton() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {[...Array(3)].map((_, i) => (
        <li key={i}>
          <Card>
            <CardHeader>
              <Skeleton className="w-full h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
