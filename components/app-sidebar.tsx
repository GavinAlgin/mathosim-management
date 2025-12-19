"use client"
import * as React from "react"
import {
  Command,
  Database,
  Home,
  Inbox,
  LifeBuoy,
  Loader2,
  Send,
  Settings2,
  SquareTerminal,
  User,
  UsersIcon,
} from "lucide-react"


import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavPrimary } from "./nav-primary"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navPrimary: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: User
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: UsersIcon
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Inbox
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Documents",
          url: "/dashboard/documents",
        },
        {
          title: "Calendar",
          url: "/dashboard/calendar",
        },
        {
          title: "Quotation",
          url: "/dashboard/quotation",
        },
      ],
    },
    {
      title: "Stakeholders",
      url: "#",
      icon: Database,
      items: [
        {
          title: "University of Limpopo",
          url: "/dashboard/stakeholders/ul",
        },
        {
          title: "ZCC",
          url: "/dashboard/stakeholders/zcc",
        },
        // {
        //   title: "W&R & FP&M SETA",
        //   url: "/dashboard/stakeholders/seta",
        // },
        {
          title: "Bahwaduba Bus Service",
          url: "#",
        },
        {
          title: "Meropa Casino",
          url: "/dashboard/stakeholders/meropa",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Team",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true);


    /** Check logged in user sessions */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, [router]);

  /** ⏳ Block render until auth check completes */
  if (checkingAuth) {
    return (    
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
    )
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Mathosim</span>
                  <span className="truncate text-xs">Trimming & Upholstery</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={data.navPrimary} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
