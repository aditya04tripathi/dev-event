"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "@/types/api-types";

export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/auth/login";
  };

  const isOrganizer = user?.roles.includes("organizer") || false;
  const isParticipant = user?.roles.includes("user") || false;

  return {
    user,
    isLoading,
    isOrganizer,
    isParticipant,
    logout,
  };
}
