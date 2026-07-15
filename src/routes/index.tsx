import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  FileText,
  ListTodo,
  ArrowRight,
  Sparkles,
  Rocket,
  Zap,
  Clock,
  History as HistoryIcon,
  Brain,
  Target,
} from "lucide-react";
import { getHistory, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — GalaxyAI" },
      {
        name: "description",
        content:
          "Your AI workplace command center. Generate emails, summarize meetings, and plan your day.",
      },
    ],
  }),
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails in seconds.",
    accent: "from-fuchsia-500/30 to-purple-500/20",
  },
  {
    to: "/notes" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into decisions and action items.",
    accent: "from-indigo-500/30 to-blue-500/20",
  },
  {
    to: "/planner" as const,
    icon: ListTodo,
    title: "AI Task Planner",
    desc: "Prioritize and schedule your day.",
    accent: "from-violet-500/30 to-pink-500/20",
  },
];

const tips = [
  { icon: Brain, title: "Deep-work blocks", body: "Reserve 90 minutes at your peak time for one high-leverage task." },
  { icon: Zap, title: "Batch shallow work", body: "Group email, Slack, and admin into two 20-minute windows." },
  { icon: Target, title: "One outcome per day", body: "Decide the single result that would make today a win." },
];

function Dashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const sync = () => setHistory(getHistory());
    sync();
    window.addEventListener("galaxyai:history", sync);
    return () => window.removeEventListener("galaxyai:history", sync);
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Lovable AI
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              <span className="text-galaxy">Welcome back, Astro.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Your cosmic productivity command center. Draft, summarize, and plan — all from one
              orbit.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/email"
                className="click-glow inline-flex items-center gap-2 rounded-xl bg-galaxy px-5 py-2.5 text-sm font-semibold text-primary-foreground glow animate-pulse-glow"
              >
                <Rocket className="h-4 w-4" /> Launch Email
              </Link>
              <Link
                to="/planner"
                className="click-glow glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold hover:border-primary/50"
              >
                <ListTodo className="h-4 w-4" /> Plan my day
              </Link>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-background/40 p-5 backdrop-blur">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-galaxy text-primary-foreground font-bold text-xl glow">
              AS
            </div>
            <p className="text-sm font-semibold">Astro User</p>
            <p className="text-xs text-muted-foreground">Free plan · workspace</p>
          </div>
        </div>
      </section>

      {/* Quick tools */}
      <section>
        <h2 className="font-display text-xl font-semibold">Quick access</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, desc, accent }) => (
            <Link
              key={to}
              to={to}
              className="glass group click-glow relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
            >
              <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${accent} blur-3xl opacity-70 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-galaxy text-primary-foreground glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity + Tips */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <HistoryIcon className="h-4 w-4 text-primary" /> Recent activity
            </h2>
            <Link to="/history" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
              No activity yet. Generate your first email or plan to see it here.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/60 text-primary">
                      {h.kind === "email" ? (
                        <Mail className="h-4 w-4" />
                      ) : h.kind === "notes" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <ListTodo className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {new Date(h.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Productivity tips
          </h2>
          <ul className="mt-4 space-y-4">
            {tips.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-galaxy text-primary-foreground glow">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
