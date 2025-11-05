// Format: Sunday, 2 November 2025
export function formatDateLong(d = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

//   Format "Today (Sunday, 2 November 2025)"
//   We do NOT include time here now — time is shown separately in the UI.
export function formatTodayLabel(d = new Date()) {
  return `Today (${formatDateLong(d)})`;
}

//  Format time: 20:31
export function formatTimeHM(d = new Date()) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ISO date: 2025-11-02
export function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

// Format entry title based on date
// - Today: "Today (Sunday, 2 November 2025)"
// - Yesterday: "Yesterday (Saturday, 1 November 2025)"
// - Older: "Friday, 30 October 2025"
export function formatEntryDate(dateISO: string) {
  const entryDate = new Date(dateISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const entryDateNormalized = new Date(entryDate);
  entryDateNormalized.setHours(0, 0, 0, 0);

  const longFormat = formatDateLong(entryDate);

  if (entryDateNormalized.getTime() === today.getTime()) {
    return `Today (${longFormat})`;
  } else if (entryDateNormalized.getTime() === yesterday.getTime()) {
    return `Yesterday (${longFormat})`;
  } else {
    return longFormat;
  }
}
