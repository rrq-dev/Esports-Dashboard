import {
  AppWindow,
  GalleryVerticalEnd,
  Home,
  Ticket as TicketIcon,
  Users,
  Trophy,
  Shield,
  Command, // Add Command icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { NavUser } from "@/components/common/nav-user";

export function AppSidebar() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  const isActive = (path) => location.pathname.startsWith(path);

  const adminNavItems = [
    { href: "/dashboard", icon: AppWindow, label: "Dashboard" },
    { href: "/dashboard/users", icon: Users, label: "Users" },
    { href: "/dashboard/players", icon: Users, label: "Players" },
    { href: "/dashboard/teams", icon: Shield, label: "Teams" },
    { href: "/dashboard/tournaments", icon: Trophy, label: "Tournaments" },
    { href: "/dashboard/matches", icon: GalleryVerticalEnd, label: "Matches" },
  ];

  const userNavItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/my-tickets", icon: TicketIcon, label: "Tiket Saya" },
  ];
  
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={isAdmin ? "/dashboard" : "/home"}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Esports App</span>
                  <span className="truncate text-xs">{isAdmin ? "Dashboard" : "Menu"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem className="m-3 mb-2" key={item.href}>
              <SidebarMenuButton size="default" isActive={isActive(item.href)} asChild>
                <Link to={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
