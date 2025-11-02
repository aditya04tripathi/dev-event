"use client";

import { Bell, Brain, CreditCard, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface SettingsSidebarProps {
  children: React.ReactNode;
}

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

export function SettingsSidebar({ children }: SettingsSidebarProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("profile");

  useEffect(() => {
    // Determine active section from pathname
    const section = pathname?.split("/").pop() || "profile";
    setActiveSection(section);
  }, [pathname]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="none" className="w-64">
          <SidebarHeader className="px-4 py-6">
            <div className="mb-2">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-xs text-muted-foreground">
                Manage your account
              </p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="w-full px-6 py-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
