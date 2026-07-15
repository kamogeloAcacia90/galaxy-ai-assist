import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Mail, FileText, ListTodo, History as HistoryIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Help — GalaxyAI" },
      { name: "description", content: "Get help using GalaxyAI features." },
    ],
  }),
});

const guides = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    body: "Enter the recipient, audience, tone, and purpose. Click Generate. Use Regenerate to try another variation or Copy to send it to your email client.",
  },
  {
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Paste your raw notes or transcript. The summary is broken into Executive Summary, Key Discussion Points, Decisions, Action Items, Deadlines, and Responsible Persons.",
  },
  {
    icon: ListTodo,
    title: "AI Task Planner",
    body: "List your tasks one per line. You can include deadlines and priorities using ' | ' separators. GalaxyAI returns a prioritized schedule and productivity tips.",
  },
  {
    icon: HistoryIcon,
    title: "History",
    body: "Everything you generate is stored locally in your browser under History. You can filter by type, copy items again, or remove them.",
  },
];

const faqs = [
  {
    q: "Where is my data stored?",
    a: "History is stored in your browser's localStorage only. It never leaves your device unless you copy or share it.",
  },
  {
    q: "Which AI model powers GalaxyAI?",
    a: "GalaxyAI uses Google Gemini via the Lovable AI Gateway on the server. Your API key is never exposed to the browser.",
  },
  {
    q: "Can I trust the outputs?",
    a: "AI-generated content can be incorrect or biased. Always review before sending, sharing, or acting on it.",
  },
  {
    q: "I got a rate-limit error. What now?",
    a: "Wait a moment and try again. If credits are exhausted, add more from your workspace billing settings.",
  },
];

function HelpPage() {
  return (
    <div>
      <PageHeader
        icon={<LifeBuoy className="h-5 w-5" />}
        title="Help & guides"
        subtitle="Everything you need to get productive with GalaxyAI."
      />

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {guides.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-galaxy text-primary-foreground glow">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-semibold">{title}</p>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="glass mt-8 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-3">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="click-glow text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
