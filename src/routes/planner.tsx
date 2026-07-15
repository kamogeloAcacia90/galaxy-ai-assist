import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListTodo, Rocket, Eraser, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { planTasks } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/result-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { PageHeader } from "@/components/page-header";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner — GalaxyAI" },
      {
        name: "description",
        content: "Prioritize tasks with deadlines and get a smart daily schedule.",
      },
    ],
  }),
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [workHours, setWorkHours] = useState("9:00–17:00");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (tasks.trim().length < 3) {
      toast.error("Please list at least one task.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { tasks, workHours } });
      setResult(text);
      addHistory({ kind: "planner", title: `Daily plan · ${workHours}`, content: text });
      toast.success("Plan ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTasks("");
    setResult("");
    toast.success("Cleared");
  };

  return (
    <div>
      <PageHeader
        icon={<ListTodo className="h-5 w-5" />}
        title="AI Task Planner"
        subtitle="Prioritize tasks by deadline and importance."
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
            <Label htmlFor="hours">Work hours</Label>
            <Input
              id="hours"
              placeholder="e.g. 9:00–17:00"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks · deadline · priority</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={
                "One per line, e.g.\n- Prepare Q3 board deck | Fri | High\n- Review design PR | today | Medium\n- Reply to customer emails | today | Low"
              }
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="click-glow flex-1 bg-galaxy text-primary-foreground glow hover:opacity-90"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {loading ? "Planning…" : "Plan my day"}
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
            title="Your daily plan"
            content={result}
            loading={loading}
            icon={<ListTodo className="h-4 w-4" />}
          />
          <ResponsibleAiNotice />
        </div>
      </div>
    </div>
  );
}
