"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { EntryStore } from "@/lib/storage";
import type { Entry } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();

  // Lazy initializer reads once on first render; no effect needed.
  const [entries, setEntries] = useState<Entry[]>(() => EntryStore.list());

  const createNew = () => {
    const e = EntryStore.create({ title: "Today", content: "" });
    setEntries(EntryStore.list());
    router.push(`/entry/${e.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Journal</h2>
        <Button onClick={createNew}>New Entry</Button>
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
