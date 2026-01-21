import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | DevEvent",
    description: "Login to your account to manage events and bookings.",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-background via-background/50 to-primary/5">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <LoginForm />
            </div>
        </div>
    );
}
