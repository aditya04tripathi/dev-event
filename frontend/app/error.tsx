"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-wide section-sm flex flex-col items-center justify-center text-center gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h2>
      <p className="text-muted-foreground max-w-md">
        We could not load this page. Please try again.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
