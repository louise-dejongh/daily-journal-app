"use client";

import { useParams, useRouter } from "next/navigation";
import EntryForm from "@/components/entry-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="flex items-center gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h2 className="text-xl font-semibold">Edit Entry</h2>
      <EntryForm
        id={id}
        onSaved={(e) => router.replace(`/entry/${e.id}`)}
        onDeleted={() => router.replace("/")}
      />
    </div>
  );
}
