import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListTodo, Rocket } from "lucide-react";
import { toast } from "sonner";

import { planTasks } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/result-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { PageHeader } from "./email";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner — GalaxyAI" },
      {
        name: "description",
        content: "Prioritize tasks and get a suggested schedule with productivity tips.",
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.trim().length < 3) {
      toast.error("Please list at least one task.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { tasks, workHours } });
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
        icon={<ListTodo className="h-5 w-5" />}
        title="AI Task Planner"
        subtitle="Prioritize your day and get a smart schedule."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-5">
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
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={
                "One task per line, e.g.\n- Prepare Q3 board deck\n- Review design PR\n- 1:1 with Alex\n- Reply to customer emails"
              }
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-galaxy text-primary-foreground glow hover:opacity-90"
          >
            <Rocket className="mr-2 h-4 w-4" />
            {loading ? "Planning…" : "Plan my day"}
          </Button>
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
