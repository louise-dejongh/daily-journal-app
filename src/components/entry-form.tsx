"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EntryStore } from "@/lib/storage";
import type { Entry } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  id?: string; // if undefined -> creating new entry
  onSaved?: (entry: Entry) => void;
  onDeleted?: () => void;
};

export default function EntryForm({ id, onSaved, onDeleted }: Props) {
  const existing = useMemo(() => (id ? EntryStore.get(id) : undefined), [id]);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(existing?.title ?? "");
    setContent(existing?.content ?? "");
  }, [existing?.id]);

  const save = () => {
    setBusy(true);
    try {
      let saved: Entry | undefined;
      if (id && existing) saved = EntryStore.update(id, { title, content });
      else saved = EntryStore.create({ title, content });

      if (saved) {
        toast.success("Entry saved ✅");
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        className="min-h-[240px]"
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
