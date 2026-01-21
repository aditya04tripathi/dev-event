"use client";

import { CalendarIcon, HomeIcon, MenuIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const { user, logout, isOrganizer } = useAuth();

	const navigationLinks = [
		{ href: "/", label: "Home", icon: HomeIcon },
		{ href: "/events", label: "Browse Events", icon: CalendarIcon },
	];

	if (user) {
		if (isOrganizer) {
			navigationLinks.push({ href: "/dashboard", label: "Dashboard", icon: HomeIcon });
		} else {
			// navigationLinks.push({ href: "/profile", label: "My Bookings", icon: UserIcon });
		}
	}

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
					<nav className="hidden md:flex items-center gap-1">
						{navigationLinks.map((link) => (
							<Link key={link.href} href={link.href}>
								<Button variant="ghost" size="sm">
									{link.label}
								</Button>
							</Link>
						))}
					</nav>

					{user ? (
						<div className="flex items-center gap-2">
							<Link href="/events/new" className="hidden sm:block">
								<Button size="sm">
									<PlusIcon className="size-4 mr-2" />
									Create Event
								</Button>
							</Link>
							<Button variant="outline" size="sm" onClick={logout}>
								Logout
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/auth/login">
								<Button variant="ghost" size="sm">
									Login
								</Button>
							</Link>
							<Link href="/auth/signup">
								<Button size="sm">Sign Up</Button>
							</Link>
						</div>
					)}

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
								{user ? (
									<>
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
										<div className="px-5 mt-2">
											<Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
												Logout
											</Button>
										</div>
									</>
								) : (
									<div className="flex flex-col gap-2 px-5">
										<Link href="/auth/login" onClick={() => setOpen(false)}>
											<Button variant="ghost" className="w-full justify-start">
												Login
											</Button>
										</Link>
										<Link href="/auth/signup" onClick={() => setOpen(false)}>
											<Button className="w-full justify-start">
												Sign Up
											</Button>
										</Link>
									</div>
								)}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
