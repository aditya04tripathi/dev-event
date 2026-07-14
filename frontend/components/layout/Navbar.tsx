"use client";

import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Ticket,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/organizers", label: "Organizers" },
  { href: "/contact", label: "Contact" },
] as const;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isOrganizer } = useAuth();
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-sm font-bold text-primary-foreground">
                D
              </span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              DevEvent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActiveLink(link.href)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user && isOrganizer && (
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActiveLink("/dashboard")
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-3">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {user.fullName?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Ticket className="mr-2 size-4" />
                      My Tickets
                    </Link>
                  </DropdownMenuItem>
                  {isOrganizer && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon-sm">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    pathname === "/"
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                >
                  Home
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActiveLink(link.href)
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && isOrganizer && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActiveLink("/dashboard")
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <User className="mr-3 size-5" />
                        Profile
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                      >
                        <Ticket className="mr-3 size-5" />
                        My Tickets
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="mr-3 size-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full" size="lg">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
