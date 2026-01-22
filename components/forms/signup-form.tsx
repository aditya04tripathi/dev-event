"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSignupMutation } from "@/hooks/api/use-auth-api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurFade } from "@/components/ui/blur-fade";
import { User, Mail, Lock, AtSign, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const signupMutation = useSignupMutation();

  const initialRole =
    searchParams.get("role") === "organizer" ? "organizer" : "user";
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
      { label: "", color: "" },
      { label: "Weak", color: "bg-destructive" },
      { label: "Fair", color: "bg-warning" },
      { label: "Good", color: "bg-primary" },
      { label: "Strong", color: "bg-success" },
      { label: "Very Strong", color: "bg-success" },
    ];

    return { score, ...levels[score] };
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(
      { ...formData, role },
      {
        onSuccess: (data) => {
          toast.success("Account created successfully!");
          login(data.user, data.token);

          if (data.user.roles.includes("organizer")) {
            router.push("/dashboard");
          } else {
            router.push("/events");
          }
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join thousands of developers in our community
          </p>
        </div>
      </BlurFade>

      {/* Role selector */}
      <BlurFade delay={0.1}>
        <div className="flex p-1 mb-6 rounded-xl bg-muted">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
              role === "user"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {role === "user" && <Check className="size-4" />}
              Participant
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
              role === "organizer"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {role === "organizer" && <Check className="size-4" />}
              Organizer
            </span>
          </button>
        </div>
      </BlurFade>

      {/* Form */}
      <BlurFade delay={0.15}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  disabled={signupMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={signupMutation.isPending}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={signupMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
                minLength={8}
                disabled={signupMutation.isPending}
              />
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="pt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Password strength:{" "}
                  <span className="font-medium">{passwordStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={signupMutation.isPending}
            loadingText="Creating account..."
          >
            Create account
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </form>
      </BlurFade>

      {/* Footer */}
      <BlurFade delay={0.2}>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </BlurFade>
    </div>
  );
}
