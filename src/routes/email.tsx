import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Send, RefreshCw, Eraser } from "lucide-react";
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
import { addHistory } from "@/lib/history";

type Tone = "formal" | "friendly" | "persuasive" | "professional";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator — GalaxyAI" },
      {
        name: "description",
        content: "Generate professional emails with recipient, audience, purpose, and tone.",
      },
    ],
  }),
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [audience, setAudience] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Please fill in recipient and purpose.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { recipient, audience, purpose, tone } });
      setResult(text);
      addHistory({ kind: "email", title: `Email to ${recipient}`, content: text });
      toast.success("Email generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setRecipient("");
    setAudience("");
    setPurpose("");
    setResult("");
    toast.success("Cleared");
  };

  return (
    <div>
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        subtitle="Draft polished, on-tone emails in seconds."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="glass rounded-2xl p-6 space-y-5"
        >
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
            <Label htmlFor="audience">Audience (optional)</Label>
            <Input
              id="audience"
              placeholder="e.g. Executive stakeholders, engineering team"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / context</Label>
            <Textarea
              id="purpose"
              rows={7}
              placeholder="What is this email about? Include key details, dates, or asks."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="click-glow flex-1 bg-galaxy text-primary-foreground glow hover:opacity-90"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Generating…" : "Generate"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={loading || !result}
              onClick={submit}
              className="click-glow"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
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
