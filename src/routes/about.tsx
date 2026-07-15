import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles, ShieldAlert, Zap } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — GalaxyAI" },
      { name: "description", content: "About GalaxyAI Workplace Productivity Assistant." },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <PageHeader
        icon={<Info className="h-5 w-5" />}
        title="About GalaxyAI"
        subtitle="Your futuristic workplace productivity copilot."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass lg:col-span-2 rounded-2xl p-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">GalaxyAI</span> is a modern AI-powered
            productivity suite designed to help teams work at the speed of thought. It combines
            three focused tools — a Smart Email Generator, a Meeting Notes Summarizer, and an AI
            Task Planner — inside one cohesive galaxy-themed workspace.
          </p>
          <p>
            The app is built with TanStack Start, React, Tailwind CSS, and the Lovable AI Gateway.
            Everything runs on a responsive, accessible interface with glowing interactions and
            smooth transitions.
          </p>
          <p>
            GalaxyAI is a demonstration project showcasing what a commercial AI productivity tool
            can feel like. It's designed to be extended: swap the model, add authentication,
            persist history to a database, or plug in your own workflows.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: Sparkles, title: "AI-powered", body: "Google Gemini via Lovable AI Gateway." },
            { icon: Zap, title: "Fast & responsive", body: "Built for desktop, tablet, and mobile." },
            { icon: ShieldAlert, title: "Responsible AI", body: "Always review outputs before use." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-galaxy text-primary-foreground glow">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
