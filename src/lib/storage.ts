"use client";
import type { Entry } from "@/lib/types";
import { todayISO } from "@/lib/date";

const KEY = "journal.entries.v1";

// --- tiny pub/sub for useSyncExternalStore ---
type Listener = () => void;
const listeners = new Set<Listener>();
function notify() {
  for (const l of listeners) l();
}
function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
// ---------------------------------------------

let cache: Entry[] | null = null; // 👈 cached, stable snapshot

function readRaw(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function computeSnapshot(entries: Entry[]): Entry[] {
  // stable, sorted clone
  return [...entries].sort((a, b) => b.createdAt - a.createdAt);
}

function getSnapshot(): Entry[] {
  // serve the same reference until write() updates it
  if (cache) return cache;
  cache = computeSnapshot(readRaw());
  return cache;
}

function write(next: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(next));
  cache = computeSnapshot(next); // 👈 update cached snapshot (new ref)
  notify(); // 👈 tell subscribers
}

export const EntryStore = {
  // useSyncExternalStore hooks
  subscribe,
  getSnapshot, // 👈 use this in the page

  // convenience helpers
  list(): Entry[] {
    // keep list() too, but prefer getSnapshot() in UIs
    return getSnapshot();
  },
  get(id: string) {
    return getSnapshot().find((e) => e.id === id);
  },
  create(partial: Pick<Entry, "title" | "content">) {
    const now = Date.now();
    const entry: Entry = {
      id: crypto.randomUUID(),
      title: partial.title || "Today",
      content: partial.content || "",
      dateISO: todayISO(new Date()),
      createdAt: now,
      updatedAt: now,
      startedAt: now,
      endedAt: undefined,
    };
    const all = readRaw();
    all.push(entry);
    write(all);
    return entry;
  },
  update(
    id: string,
    patch: Partial<Pick<Entry, "title" | "content" | "mood" | "endedAt">>
  ) {
    const all = readRaw();
    const i = all.findIndex((e) => e.id === id);
    if (i === -1) return undefined;
    const updated: Entry = { ...all[i], ...patch, updatedAt: Date.now() };
    all[i] = updated;
    write(all);
    return updated;
  },
  remove(id: string) {
    write(readRaw().filter((e) => e.id !== id));
  },
};
