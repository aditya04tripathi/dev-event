"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/hooks/api/use-auth-api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon, MailIcon, LockIcon, UserIcon, AtSignIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

export function SignupForm() {
    const router = useRouter();
    const { login } = useAuth();
    const signupMutation = useSignupMutation();
    const [role, setRole] = useState("user");
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        signupMutation.mutate({ ...formData, role }, {
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
        });
    };

    return (
        <Card className="w-full max-w-md border-primary/10 shadow-xl backdrop-blur-sm bg-background/80">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">
                    Join our community of developers and event organizers
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full justify-center flex items-center gap-2">
                    <Label>Participant</Label>
                    <Switch onCheckedChange={(e) => setRole(e ? "organizer" : "user")} />
                    <Label>Organizer</Label>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-4">
                    <div className="flex items-center gap-2">
                        <AtSignIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            id="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            id="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <LockIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Password"
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </form>
            </CardContent >
            <CardFooter className="flex flex-col space-y-4">
                <Button
                    className="w-full"
                    type="submit"
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up as {role === "user" ? "Participant" : "Organizer"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/login")}>
                        Login
                    </Button>
                </p>
            </CardFooter>
        </Card >
    );
}
