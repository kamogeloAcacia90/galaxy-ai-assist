import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Palette, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — GalaxyAI" },
      { name: "description", content: "Theme, appearance, and Responsible AI information." },
    ],
  }),
});

type Accent = "nebula" | "cosmos" | "aurora";

const accents: Record<Accent, { label: string; swatch: string; primary: string; nebula: string; cosmos: string; glow: string }> = {
  nebula: {
    label: "Nebula (default)",
    swatch: "linear-gradient(135deg,#a855f7,#3b82f6)",
    primary: "0.72 0.22 300",
    nebula: "0.55 0.22 320",
    cosmos: "0.55 0.2 240",
    glow: "0.85 0.18 300",
  },
  cosmos: {
    label: "Deep Cosmos",
    swatch: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    primary: "0.7 0.2 240",
    nebula: "0.55 0.2 260",
    cosmos: "0.55 0.2 210",
    glow: "0.85 0.18 240",
  },
  aurora: {
    label: "Aurora",
    swatch: "linear-gradient(135deg,#22d3ee,#a855f7)",
    primary: "0.75 0.2 190",
    nebula: "0.6 0.2 200",
    cosmos: "0.55 0.22 310",
    glow: "0.85 0.15 190",
  },
};

function SettingsPage() {
  const [dark, setDark] = useState(true);
  const [accent, setAccent] = useState<Accent>("nebula");

  useEffect(() => {
    const savedAccent = (localStorage.getItem("galaxyai:accent") as Accent | null) || "nebula";
    const savedDark = localStorage.getItem("galaxyai:dark");
    setAccent(savedAccent);
    setDark(savedDark === null ? true : savedDark === "1");
  }, []);

  useEffect(() => {
    const a = accents[accent];
    const root = document.documentElement;
    root.style.setProperty("--primary", `oklch(${a.primary})`);
    root.style.setProperty("--ring", `oklch(${a.primary})`);
    root.style.setProperty("--nebula", `oklch(${a.nebula})`);
    root.style.setProperty("--cosmos", `oklch(${a.cosmos})`);
    root.style.setProperty("--glow", `oklch(${a.glow})`);
    localStorage.setItem("galaxyai:accent", accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("galaxyai:dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <div>
      <PageHeader
        icon={<SettingsIcon className="h-5 w-5" />}
        title="Settings"
        subtitle="Personalize your workspace."
      />

      <div className="mt-8 space-y-6">
        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            {dark ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
            Appearance
          </h2>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border/40 bg-background/30 p-4">
            <div>
              <Label htmlFor="dark" className="text-sm font-medium">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Galaxy theme looks best in the dark.</p>
            </div>
            <Switch
              id="dark"
              checked={dark}
              onCheckedChange={(v) => {
                setDark(v);
                toast.success(v ? "Dark mode on" : "Light mode on");
              }}
            />
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Palette className="h-4 w-4 text-primary" /> Theme options
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(accents) as Accent[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setAccent(k);
                  toast.success(`Theme: ${accents[k].label}`);
                }}
                className={`click-glow group rounded-xl border p-4 text-left transition-colors ${
                  accent === k ? "border-primary/60 bg-primary/10" : "border-border/50 hover:border-primary/40"
                }`}
              >
                <div
                  className="h-14 w-full rounded-lg glow"
                  style={{ background: accents[k].swatch }}
                />
                <p className="mt-3 text-sm font-medium">{accents[k].label}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl border border-primary/20 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShieldAlert className="h-4 w-4 text-primary" /> Responsible AI
          </h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>
              GalaxyAI generates content with large language models. Outputs may be inaccurate,
              incomplete, or reflect biases from training data. Always review AI-generated content
              before sending it, sharing it, or acting on it.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Never paste secrets, passwords, or sensitive personal data.</li>
              <li>Verify facts, names, numbers, and dates before use.</li>
              <li>You are accountable for anything you send under your name.</li>
              <li>History is stored locally in your browser only.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
