import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string().min(1).max(200),
  audience: z.string().max(200).optional(),
  purpose: z.string().min(1).max(2000),
  tone: z.enum(["formal", "friendly", "persuasive", "professional"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    const { callAi } = await import("./ai-gateway.server");
    const text = await callAi({
      system:
        "You are an expert email writing assistant. Write clear, well-structured, professional emails. Always include a Subject line on the first line prefixed with 'Subject:'. Then a greeting, body, closing, and signature placeholder. Match the requested tone precisely.",
      user: `Recipient: ${data.recipient}\nAudience: ${data.audience || "n/a"}\nTone: ${data.tone}\nPurpose / context:\n${data.purpose}\n\nWrite the complete email now.`,
    });
    return { text };
  });

const NotesInput = z.object({
  notes: z.string().min(10).max(20000),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => NotesInput.parse(data))
  .handler(async ({ data }) => {
    const { callAi } = await import("./ai-gateway.server");
    const text = await callAi({
      system:
        "You are a meeting notes analyst. Given raw meeting notes, produce a clean structured markdown summary with these exact sections in this order:\n\n## Executive Summary\nA 2-3 sentence high-level overview.\n\n## Key Discussion Points\n- ...\n\n## Decisions Made\n- ...\n\n## Action Items\n- Owner — task\n\n## Deadlines\n- Task — date\n\n## Responsible Persons\n- Name — responsibility\n\nUse concise bullet points. If a section has no items, write 'None identified'.",
      user: data.notes,
    });
    return { text };
  });

const PlannerInput = z.object({
  tasks: z.string().min(3).max(5000),
  workHours: z.string().max(200).optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlannerInput.parse(data))
  .handler(async ({ data }) => {
    const { callAi } = await import("./ai-gateway.server");
    const text = await callAi({
      system:
        "You are a productivity coach. Given a list of tasks with optional deadlines and priorities, organize them and generate a structured daily plan in markdown with these sections:\n\n## Prioritized Tasks\n1. **[High/Medium/Low]** Task — brief reasoning\n\n## Suggested Schedule\n- HH:MM–HH:MM — Task\n\n## Productivity Tips\n- 3 to 5 concise, tailored tips\n\n## Time Optimization\n- 2 to 4 recommendations for saving time or batching work\n\nRespect the user's stated work hours if given, otherwise assume 9:00–17:00.",
      user: `Work hours: ${data.workHours || "9:00–17:00"}\n\nTasks:\n${data.tasks}`,
    });
    return { text };
  });
