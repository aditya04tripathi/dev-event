"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  UserIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function OrganizerNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container-wide h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-bold text-primary-foreground text-sm">
                D
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold leading-none">DevEvent</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Organizer
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboardIcon className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
              >
                <ExternalLinkIcon className="size-4" />
                View Site
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/events/new">
            <Button size="sm" className="gap-2">
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8 ring-2 ring-border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user?.fullName ? getUserInitials(user.fullName) : "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <ExternalLinkIcon className="mr-2 size-4" />
                  View Public Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOutIcon className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
