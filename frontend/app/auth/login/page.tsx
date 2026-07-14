import { LoginForm } from "@/components/forms/login-form";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | DevEvent",
  description: "Login to your account to manage events and bookings.",
};

export default function LoginPage() {
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
          <LoginForm />
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
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
