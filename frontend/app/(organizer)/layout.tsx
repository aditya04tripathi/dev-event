"use client";

import { OrganizerNavbar } from "@/components/layout/organizer-navbar";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isOrganizer } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/auth/login");
            } else if (!isOrganizer) {
                router.push("/");
            }
        }
    }, [user, isLoading, isOrganizer, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isOrganizer) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <OrganizerNavbar />
            <main className="flex-1 bg-muted/10">{children}</main>
        </div>
    );
}
