import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "GalaxyAI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A futuristic AI productivity suite: write emails, summarize meetings, and plan your day.",
      },
    ],
  }),
});

const features = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails in seconds. Choose recipient, purpose, and tone — formal, friendly, or persuasive.",
  },
  {
    to: "/notes" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw meeting notes into key points, decisions, action items, and deadlines.",
  },
  {
    to: "/planner" as const,
    icon: ListTodo,
    title: "AI Task Planner",
    desc: "Organize tasks by priority and generate a suggested schedule with tailored productivity tips.",
  },
];

function Index() {
  return (
    <div>
      <section className="relative py-16 text-center sm:py-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Lovable AI
        </div>
        <h1 className="mt-6 font-display text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">
          <span className="text-galaxy">Work at the speed</span>
          <br />
          <span className="text-foreground">of thought.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          GalaxyAI is your futuristic workplace copilot. Draft emails, summarize meetings, and
          plan your day — all from a single, cosmic command center.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl bg-galaxy px-6 py-3 text-sm font-semibold text-primary-foreground glow transition-transform hover:scale-105 animate-pulse-glow"
          >
            Launch assistant <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/planner"
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
          >
            Plan my day
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-opacity opacity-40 group-hover:opacity-80" />
            <div className="relative">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-galaxy text-primary-foreground glow">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-20 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} GalaxyAI · Built with responsible AI in mind.</p>
      </section>
    </div>
  );
}
