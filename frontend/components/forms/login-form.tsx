"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/api/use-auth-api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success("Welcome back!");
        login(data.user, data.token);

        if (data.user.roles.includes("organizer")) {
          router.push("/dashboard");
        } else {
          router.push("/events");
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Invalid credentials");
      },
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
      </BlurFade>

      {/* Form */}
      <BlurFade delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail">Email or Username</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.usernameOrEmail}
                onChange={(e) =>
                  setFormData({ ...formData, usernameOrEmail: e.target.value })
                }
                required
                disabled={loginMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loginMutation.isPending}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loginMutation.isPending}
            loadingText="Signing in..."
          >
            Sign in
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </form>
      </BlurFade>

      {/* Footer */}
      <BlurFade delay={0.15}>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </BlurFade>
    </div>
  );
}
