"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  PlusIcon,
  MenuIcon,
  HomeIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/events", label: "Browse Events", icon: CalendarIcon },
    { href: "/about", label: "About", icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
          <span className="text-xl font-bold">DevEvent</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm">
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Create Event Button - Always visible */}
          <Link href="/events/new" className="hidden sm:block">
            <Button size="sm">
              <PlusIcon className="size-4 mr-2" />
              Create Event
            </Button>
          </Link>

          {/* Mobile Create Event Button - Icon only */}
          <Link href="/events/new" className="sm:hidden">
            <Button size="sm" variant="default">
              <PlusIcon className="size-4" />
            </Button>
          </Link>

          {/* Mobile Menu Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <MenuIcon className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/icons/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                  />
                  DevEvent
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8 px-5">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                    >
                      <link.icon className="size-5" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <Link
                  className="px-5"
                  href="/events/new"
                  onClick={() => setOpen(false)}
                >
                  <Button className="w-full justify-start gap-3">
                    <PlusIcon className="size-5" />
                    Create Event
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
