// src/app/page.tsx
"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EntryCard } from "@/components/entry-card";
import { EntryStore } from "@/lib/storage";
import type { Entry } from "@/lib/types";
import { formatTodayLabel } from "@/lib/date";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import { Sun, Moon } from "lucide-react";

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

      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Sun className="h-12 w-12 text-amber-500 mb-3" />
            <h3 className="font-semibold text-lg">Morning Reflection</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Moon className="h-12 w-12 text-indigo-500 mb-3" />
            <h3 className="font-semibold text-lg">Evening Reflection</h3>
          </CardContent>
        </Card>
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
