"use client";

import { useParams, useRouter } from "next/navigation";
import EntryForm from "@/components/entry-form";

export default function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Entry</h2>
      <EntryForm
        id={id}
        onSaved={(e) => router.replace(`/entry/${e.id}`)}
        onDeleted={() => router.replace("/")}
      />
    </div>
  );
}
