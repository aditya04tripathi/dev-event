"use client";

import { Bell, Brain, CreditCard, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    id: "ai",
    label: "AI Preferences",
    icon: Brain,
    href: "/profile/ai",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    href: "/profile/security",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/profile/notifications",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
];

interface ProfileMenuProps {
  onItemClick?: () => void;
}

export function ProfileMenu({ onItemClick }: ProfileMenuProps) {
  const pathname = usePathname();

  // Determine active tab from pathname
  // Extract the last segment (e.g., /profile/ai -> "ai", /profile -> "profile")
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Determine active tab from last segment
  const activeTab = lastSegment || "profile";

  return (
    <div className="flex flex-col">
      <div className="px-4 py-6">
        <div className="mb-2">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-xs text-muted-foreground">Manage your account</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if current pathname starts with the item href
          const isActive =
            pathname?.startsWith(item.href) || activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
