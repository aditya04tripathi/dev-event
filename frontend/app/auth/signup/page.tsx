import { Suspense } from "react";
import { SignupForm } from "@/components/forms/signup-form";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up | DevEvent",
  description:
    "Create an account to join our community of developers and organizers.",
};

export default function SignupPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4">
      {/* Background Pattern */}
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 -z-10 opacity-30",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      {/* Card Container */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <span className="text-base font-bold text-primary-foreground">
                D
              </span>
            </div>
            <span className="text-xl font-semibold tracking-tight">
              DevEvent
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            }
          >
            <SignupForm />
          </Suspense>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
