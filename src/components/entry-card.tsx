"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import { formatEntryDate } from "@/lib/date";

export function EntryCard({ entry }: { entry: Entry }) {
  const displayDate = formatEntryDate(entry.dateISO);

  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="hover:shadow-sm transition">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <div className="font-semibold line-clamp-1">
            {displayDate}
          </div>
          {entry.mood && <Badge variant="outline">{entry.mood}</Badge>}
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground line-clamp-3">
          {entry.content || "No content yet…"}
        </CardContent>
      </Card>
    </Link>
  );
}
