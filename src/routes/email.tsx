import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultCard } from "@/components/result-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — GalaxyAI" },
      {
        name: "description",
        content: "Generate professional emails with recipient, purpose, and tone.",
      },
    ],
  }),
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "persuasive">("formal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Please fill in recipient and purpose.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { recipient, purpose, tone } });
      setResult(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        subtitle="Draft polished, on-tone emails in seconds."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Sarah, Head of Marketing"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / context</Label>
            <Textarea
              id="purpose"
              rows={7}
              placeholder="What is this email about? Include any key details, dates, or asks."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-galaxy text-primary-foreground glow hover:opacity-90"
          >
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </form>

        <div>
          <ResultCard
            title="Generated email"
            content={result}
            loading={loading}
            icon={<Mail className="h-4 w-4" />}
          />
          <ResponsibleAiNotice />
        </div>
      </div>
    </div>
  );
}
