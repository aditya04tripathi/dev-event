import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function HomeLoading() {
  return (
    <section className="container mx-auto w-full px-4">
      <div className="min-h-[400px] sm:min-h-[500px] md:h-[600px] flex gap-3 sm:gap-4 flex-col justify-center items-center py-12 sm:py-16 md:py-0">
        <Skeleton className="h-16 sm:h-20 md:h-24 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 sm:h-8 w-2/3 max-w-xl mt-3 sm:mt-4 md:mt-5" />
        <Skeleton className="h-10 w-32 mt-4" />
      </div>

      <div className="mt-12 sm:mt-16 md:mt-20 space-y-5 sm:space-y-6 md:space-y-7">
        <Skeleton className="h-10 sm:h-12 md:h-14 w-48" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <li key={i}>
              <Card>
                <Skeleton className="w-full h-48 rounded-t-lg" />
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
      </div>
    </section>
  );
}
