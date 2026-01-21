"use client";

import { useOrganizers } from "@/hooks/use-organizers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

export default function OrganizersPage() {
    const { data: organizers, isLoading, error } = useOrganizers();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading organizers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p className="text-destructive">Failed to load organizers. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Meet Our Organizers</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover the talented individuals and teams behind the amazing events on DevEvent.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizers && organizers.map((organizer: any) => (
                    <Card key={organizer._id} className="hover:shadow-lg transition-shadow bg-background/50 backdrop-blur-sm border-primary/10">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${organizer.username}`} />
                                <AvatarFallback>{organizer.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{organizer.fullName}</CardTitle>
                                <CardDescription>@{organizer.username}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <UserIcon className="h-4 w-4" />
                                <span>Organizer</span>
                            </div>
                            <Link href={`/organizers/${organizer._id}`} className="w-full">
                                <Button className="w-full" variant="outline">
                                    View Profile
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}

                {(!organizers || organizers.length === 0) && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No organizers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
