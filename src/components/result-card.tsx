import { useState, type ReactNode } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ResultCard({
  title,
  content,
  loading,
  empty,
  icon,
}: {
  title: string;
  content: string;
  loading: boolean;
  empty?: ReactNode;
  icon?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon ?? <Sparkles className="h-4 w-4" />}</span>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          disabled={!content || loading}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="loading-shimmer h-4 w-2/3 rounded" />
          <div className="loading-shimmer h-4 w-full rounded" />
          <div className="loading-shimmer h-4 w-5/6 rounded" />
          <div className="loading-shimmer h-4 w-3/4 rounded" />
          <div className="loading-shimmer h-4 w-4/5 rounded" />
        </div>
      ) : content ? (
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
          {content}
        </pre>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {empty ?? "Your AI-generated result will appear here."}
        </div>
      )}
    </div>
  );
}
