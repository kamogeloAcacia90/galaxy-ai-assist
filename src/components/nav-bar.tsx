import { Link } from "@tanstack/react-router";
import { Orbit, Mail, FileText, ListTodo } from "lucide-react";

const links = [
  { to: "/email", label: "Email", icon: Mail },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/planner", label: "Planner", icon: ListTodo },
] as const;

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative">
            <Orbit className="h-6 w-6 text-primary animate-float" />
            <span className="absolute inset-0 -z-10 rounded-full blur-lg bg-primary/50 opacity-60 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="font-display text-lg font-bold text-galaxy">GalaxyAI</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              activeProps={{ className: "bg-secondary/80 text-foreground" }}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
