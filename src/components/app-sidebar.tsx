import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListTodo,
  History,
  Settings,
  Info,
  LifeBuoy,
  Orbit,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { getSessionUsername, onAuthChange, signOut } from "@/lib/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const main = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: ListTodo },
] as const;

const secondary = [
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About", icon: Info },
  { to: "/help", label: "Help", icon: LifeBuoy },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setUsername(getSessionUsername());
    sync();
    return onAuthChange(sync);
  }, []);

  const initials = (username ?? "AS").slice(0, 2).toUpperCase();

  function handleSignOut() {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }


  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40">
        <Link to="/" className="group flex items-center gap-2 px-2 py-1.5">
          <span className="relative">
            <Orbit className="h-6 w-6 text-primary animate-float" />
            <span className="absolute inset-0 -z-10 rounded-full blur-lg bg-primary/60 opacity-70 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="font-display text-lg font-bold text-galaxy group-data-[collapsible=icon]:hidden">
            GalaxyAI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive(to)} tooltip={label}>
                    <Link to={to} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive(to)} tooltip={label}>
                    <Link to={to} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-galaxy text-primary-foreground font-semibold glow">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{username ?? "Guest"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {username ? `${username}@galaxyai.app` : "Not signed in"}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="click-glow rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="click-glow hidden group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:my-2 group-data-[collapsible=icon]:grid group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:place-items-center rounded-md text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
