"use client";
import type { Entry } from "@/lib/types";

const KEY = "journal.entries.v1";

function read(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export const EntryStore = {
  list(): Entry[] {
    return read().sort((a, b) => b.createdAt - a.createdAt);
  },
  get(id: string) {
    return read().find((e) => e.id === id);
  },
  create(partial: Pick<Entry, "title" | "content">) {
    const now = Date.now();
    const entry: Entry = {
      id: crypto.randomUUID(),
      title: partial.title || "Today",
      content: partial.content || "",
      dateISO: new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    const all = read();
    all.push(entry);
    write(all);
    return entry;
  },
  update(
    id: string,
    patch: Partial<Pick<Entry, "title" | "content" | "mood">>
  ) {
    const all = read();
    const i = all.findIndex((e) => e.id === id);
    if (i === -1) return undefined;
    const updated = { ...all[i], ...patch, updatedAt: Date.now() };
    all[i] = updated;
    write(all);
    return updated;
  },
  remove(id: string) {
    write(read().filter((e) => e.id !== id));
  },
};
