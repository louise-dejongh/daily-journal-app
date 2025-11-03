// src/app/page.tsx
"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { EntryStore } from "@/lib/storage";
import type { Entry } from "@/lib/types";
import { formatTodayLabel } from "@/lib/date";
import { WeeklyCalendar } from "@/components/weekly-calendar";

// stable, cached server snapshot (same reference every time)
const EMPTY_ENTRIES: Entry[] = [];
const getServerSnapshot = () => EMPTY_ENTRIES;

export default function HomePage() {
  const router = useRouter();

  const entries = useSyncExternalStore(
    EntryStore.subscribe,
    () => EntryStore.list(),
    getServerSnapshot
  ) as Entry[];

  const createNew = () => {
    const e = EntryStore.create({ title: formatTodayLabel(), content: "" });
    router.push(`/entry/${e.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Good morning!</h2>
        <Button onClick={createNew}>New Entry</Button>
      </div>

      <div>
        <WeeklyCalendar />
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">
          No entries yet. Create your first one.
        </p>
      ) : (
        <div className="grid gap-3">
          {entries.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
