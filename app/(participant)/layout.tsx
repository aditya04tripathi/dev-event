"use client";

import { ParticipantNavbar } from "@/components/layout/participant-navbar";
import { useAuth } from "@/context/auth-context";
import Footer from "@/components/layout/Footer";

export default function ParticipantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <ParticipantNavbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
