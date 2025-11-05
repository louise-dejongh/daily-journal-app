"use client";

import * as React from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

export function WeeklyCalendar() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);

  // Calculate the start of the current week (Sunday)
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday

  // Generate array of 7 days starting from Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="rounded-lg border shadow-sm p-4">
      <div className="flex gap-2 justify-between">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg p-3 min-w-[60px] transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                isToday && !isSelected && "bg-accent text-accent-foreground"
              )}
            >
              <span className="text-xs font-medium uppercase mb-1">
                {format(day, "EEE")}
              </span>
              <span className="text-lg font-semibold">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
