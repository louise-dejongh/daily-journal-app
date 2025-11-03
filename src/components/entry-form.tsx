"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EntryStore } from "@/lib/storage";
import type { Entry } from "@/lib/types";
import { toast } from "sonner";
import { formatTodayLabel, formatTimeHM } from "@/lib/date";

type Props = {
  id?: string;
  onSaved?: (entry: Entry) => void;
  onDeleted?: () => void;
};

export default function EntryForm({ id, onSaved, onDeleted }: Props) {
  const existing = useMemo(() => (id ? EntryStore.get(id) : undefined), [id]);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");

  // Track times locally so the UI updates immediately on first save
  const [startedAt, setStartedAt] = useState<number | undefined>(
    existing?.startedAt
  );
  const [endedAt, setEndedAt] = useState<number | undefined>(existing?.endedAt);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(existing?.title ?? formatTodayLabel());
    setContent(existing?.content ?? "");
    setStartedAt(existing?.startedAt);
    setEndedAt(existing?.endedAt);
  }, [existing?.id]);

  const save = () => {
    setBusy(true);
    try {
      let saved: Entry | undefined;

      if (id && existing) {
        const firstSave = !existing.endedAt;
        const patch: Partial<Pick<Entry, "title" | "content" | "endedAt">> = {
          title,
          content,
        };
        if (firstSave) patch.endedAt = Date.now();

        saved = EntryStore.update(id, patch);
      } else {
        saved = EntryStore.create({ title, content }); // should set startedAt internally
      }

      if (saved) {
        setStartedAt(saved.startedAt);
        setEndedAt(saved.endedAt);

        toast.success("Entry saved");
        onSaved?.(saved);
      }
    } finally {
      setBusy(false);
    }
  };

  const del = () => {
    if (!id) return;
    EntryStore.remove(id);
    toast.error("Entry deleted 🗑️");
    onDeleted?.();
  };

  const startedAtText = startedAt
    ? formatTimeHM(new Date(startedAt))
    : undefined;
  const finishedAtText = endedAt ? formatTimeHM(new Date(endedAt)) : undefined;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="text-xs text-muted-foreground">
        {startedAtText && (
          <>
            Started at <span className="font-medium">{startedAtText}</span>
          </>
        )}
        {finishedAtText && (
          <>
            {" · "}Finished at{" "}
            <span className="font-medium">{finishedAtText}</span>
          </>
        )}
      </div>

      <Textarea
        className="min-h-60"
        placeholder="How was your day?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <Button onClick={save} disabled={busy}>
          Save
        </Button>
        {id && (
          <Button variant="secondary" onClick={del} disabled={busy}>
            Delete
          </Button>
        )}
        <Button variant="outline" disabled title="AI summary coming soon">
          AI Summary (disabled)
        </Button>
      </div>
    </div>
  );
}
