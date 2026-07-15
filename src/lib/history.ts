export type HistoryKind = "email" | "notes" | "planner";

export type HistoryItem = {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  createdAt: number;
};

const KEY = "galaxyai:history:v1";
const MAX = 50;

function read(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  window.dispatchEvent(new Event("galaxyai:history"));
}

export function getHistory(): HistoryItem[] {
  return read();
}

export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const items = read();
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  write([next, ...items]);
  return next;
}

export function removeHistory(id: string) {
  write(read().filter((h) => h.id !== id));
}

export function clearHistory() {
  write([]);
}
