import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EventDetailsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8 space-y-2">
        <Skeleton className="h-12 sm:h-14 md:h-16 w-3/4" />
        <Skeleton className="h-5 sm:h-6 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <Skeleton className="w-full h-[300px] sm:h-[400px] rounded" />

          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-10 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-10 w-40" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full max-w-md" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-10 w-24" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full max-w-lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 sm:mt-14 md:mt-16 space-y-5 sm:space-y-6">
        <Separator />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="w-full h-48 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
