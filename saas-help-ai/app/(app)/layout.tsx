"use client";

import { AppSidebarCustom } from "@/components/app-sidebar-custom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebarCustom />
      <SidebarInset className="flex h-full flex-col">
        <div className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </div>
        <ScrollArea className="p-6 flex-1 overflow-auto max-h-[calc(100vh-64px)] h-[calc(100vh-64px)]">
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
