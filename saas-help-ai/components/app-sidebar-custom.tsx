"use client";

import {
  BarChart3,
  Bell,
  Brain,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  LayoutDashboard,
  Lock,
  Search,
  Shield,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "validate",
    label: "Validate Idea",
    icon: Search,
    href: "/validate",
  },
];

const billingMenuItems = [
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: DollarSign,
    href: "/pricing",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: FileText,
    href: "/invoices",
  },
  {
    id: "usage",
    label: "Usage",
    icon: BarChart3,
    href: "/usage",
  },
];

const settingsMenuItems = [
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
    href: "/ai",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    href: "/security",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
];

const legalMenuItems = [
  {
    id: "privacy",
    label: "Privacy",
    icon: Lock,
    href: "/privacy",
  },
  {
    id: "terms",
    label: "Terms",
    icon: FileCheck,
    href: "/terms",
  },
];

interface AppSidebarCustomProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

export function AppSidebarCustom({
  activeTab,
  ...props
}: AppSidebarCustomProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-28">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/" className="flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <span className="font-bold text-lg">Startup Validator</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
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
        <SidebarGroup>
          <SidebarGroupLabel>Billing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {billingMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href) || false;
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
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href) || false;
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
        <SidebarGroup>
          <SidebarGroupLabel>Legal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {legalMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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
