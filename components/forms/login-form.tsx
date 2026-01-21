"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/hooks/api/use-auth-api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon, MailIcon, LockIcon } from "lucide-react";
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
                toast.success("Logged in successfully!");
                login(data.user, data.token);

                // Redirect based on role
                if (data.user.roles.includes("organizer")) {
                    router.push("/dashboard");
                } else {
                    router.push("/events"); // Or use redirect param if present? The logic can be enhanced later.
                }
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Invalid credentials");
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full max-w-md border-primary/10 shadow-xl backdrop-blur-sm bg-background/80">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-stretch gap-4">
                        <div className="flex items-center gap-2">
                            <MailIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                                id="usernameOrEmail"
                                placeholder="Email Address"
                                value={formData.usernameOrEmail}
                                onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <LockIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={loginMutation.isPending}
                        onClick={handleSubmit}
                    >
                        {loginMutation.isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/signup")}>
                            Sign Up
                        </Button>
                    </p>
                </CardFooter>
            </Card >
        </form>
    );
}
