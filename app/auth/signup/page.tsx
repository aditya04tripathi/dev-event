import { SignupForm } from "@/components/forms/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | DevEvent",
    description: "Create an account to join our community of developers and organizers.",
};

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-background via-background/50 to-primary/5">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <SignupForm />
            </div>
        </div>
    );
}
