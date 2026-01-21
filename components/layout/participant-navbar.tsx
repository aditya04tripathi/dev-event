"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    LogOutIcon,
    SearchIcon,
    TicketIcon,
    UserIcon
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
import Image from "next/image";

export function ParticipantNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                        <span>DevEvent</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/events" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <SearchIcon className="h-4 w-4" />
                            Browse
                        </Link>
                        <Link href="/organizers" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <UserIcon className="h-4 w-4" />
                            Organizers
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                                        <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <TicketIcon className="mr-2 h-4 w-4" />
                                        My Tickets
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
}
