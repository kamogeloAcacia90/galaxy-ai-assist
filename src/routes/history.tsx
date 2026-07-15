import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { History as HistoryIcon, Mail, FileText, ListTodo, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { clearHistory, getHistory, removeHistory, type HistoryItem, type HistoryKind } from "@/lib/history";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "History — GalaxyAI" },
      { name: "description", content: "Your previously generated emails, summaries, and plans." },
    ],
  }),
});

const kindIcon = {
  email: Mail,
  notes: FileText,
  planner: ListTodo,
} as const;

const kindLabel: Record<HistoryKind, string> = {
  email: "Email",
  notes: "Summary",
  planner: "Plan",
};

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<HistoryKind | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setItems(getHistory());
    sync();
    window.addEventListener("galaxyai:history", sync);
    return () => window.removeEventListener("galaxyai:history", sync);
  }, []);

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <PageHeader
        icon={<HistoryIcon className="h-5 w-5" />}
        title="History"
        subtitle="Everything you've generated with GalaxyAI, stored locally on your device."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "email", "notes", "planner"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`click-glow rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === k
                  ? "border-primary/60 bg-primary/20 text-foreground"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "all" ? "All" : kindLabel[k]}
            </button>
          ))}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearHistory();
              toast.success("History cleared");
            }}
            className="click-glow text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {visible.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No history yet. Generate something from Email, Notes, or Planner.
          </div>
        ) : (
          visible.map((h) => {
            const Icon = kindIcon[h.kind];
            const open = openId === h.id;
            return (
              <div key={h.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => setOpenId(open ? null : h.id)}
                    className="click-glow flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-galaxy text-primary-foreground glow">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {kindLabel[h.kind]} · {new Date(h.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </button>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copy(h.id, h.content)}
                      className="click-glow"
                    >
                      {copiedId === h.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        removeHistory(h.id);
                        toast.success("Removed");
                      }}
                      className="click-glow text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {open && (
                  <pre className="mt-4 max-h-96 overflow-auto rounded-xl border border-border/40 bg-background/40 p-4 text-xs whitespace-pre-wrap break-words font-sans">
                    {h.content}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
