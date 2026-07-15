import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Wand2, Eraser } from "lucide-react";
import { toast } from "sonner";

import { summarizeNotes } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/result-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { PageHeader } from "@/components/page-header";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — GalaxyAI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, decisions, action items, and deadlines.",
      },
    ],
  }),
});

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 10) {
      toast.error("Please paste at least a few sentences of notes.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { notes } });
      setResult(text);
      addHistory({
        kind: "notes",
        title: `Summary · ${notes.slice(0, 40).trim() || "meeting"}…`,
        content: text,
      });
      toast.success("Summary ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setNotes("");
    setResult("");
    toast.success("Cleared");
  };

  return (
    <div>
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        subtitle="Executive summary, key points, decisions, and owners."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder="Paste your transcript, bullets, or free-form notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="click-glow flex-1 bg-galaxy text-primary-foreground glow hover:opacity-90"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={clearAll}
              className="click-glow"
            >
              <Eraser className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </form>

        <div>
          <ResultCard
            title="Structured summary"
            content={result}
            loading={loading}
            icon={<FileText className="h-4 w-4" />}
          />
          <ResponsibleAiNotice />
        </div>
      </div>
    </div>
  );
}
