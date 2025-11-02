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
