"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
    BuildingIcon,
    CalendarIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    PlusIcon,
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

export function OrganizerNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <BuildingIcon className="h-6 w-6 text-primary" />
                        <span>DevEvent Org</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <LayoutDashboardIcon className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard/events/new">
                        <Button size="sm">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create Event
                        </Button>
                    </Link>

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
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
