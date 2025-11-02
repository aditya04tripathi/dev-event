"use client";

import { Bell, Brain, CreditCard, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

interface ProfileSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function ProfileSidebar({ ...props }: ProfileSidebarProps) {
  const pathname = usePathname();

  // Determine active tab from pathname
  const activeTab = pathname?.split("/").pop() || "profile";

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader className="px-4 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mb-2">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-xs text-muted-foreground">
                Manage your accounthhs
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
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
  );
}
