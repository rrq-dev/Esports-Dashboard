import * as React from "react"
import { Link } from "react-router-dom"
import {
  Command,
  LifeBuoy,
  Send,
  SquareTerminal,
  Users,
  User,
  Trophy,
  Calendar,
  Gamepad2,
  Ticket,
} from "lucide-react"

import { NavMain } from "@/components/common/nav-main"
import { NavSecondary } from "@/components/common/nav-secondary"
import { NavUser } from "@/components/common/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Players",
      url: "/dashboard/players",
      icon: User,
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Trophy,
    },
    {
      title: "Tournaments",
      url: "/dashboard/tournaments",
      icon: Calendar,
    },
    {
      title: "Matches",
      url: "/dashboard/matches",
      icon: Gamepad2,
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: Ticket,
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
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Esports App</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
