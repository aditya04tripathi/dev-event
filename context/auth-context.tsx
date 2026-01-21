"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserResponse } from "@/types/api-types";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    isOrganizer: boolean;
    isParticipant: boolean;
    logout: () => void;
    login: (user: UserResponse, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: UserResponse, token: string) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
    };

    const isOrganizer = user?.roles.includes("organizer") || false;
    const isParticipant = user?.roles.includes("user") || false;

    return (
        <AuthContext.Provider
            value={{ user, isLoading, isOrganizer, isParticipant, logout, login }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
