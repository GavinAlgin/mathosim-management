"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col w-full">
          <header className="flex items-center justify-between border-b p-4">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-xl font-semibold">Overview</h1>
            </div>

            <Avatar className="rounded-lg">
              <AvatarImage
                src={"https://github.com/evilrabbit.png"}
                alt={"User"}
              />
              <AvatarFallback>
                {("US").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </header>

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
