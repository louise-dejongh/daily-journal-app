export type Entry = {
  id: string;
  title: string;
  content: string;
  dateISO: string; // YYYY-MM-DD
  mood?: string;

  createdAt: number;
  updatedAt: number;

  startedAt: number; // ms since epoch
  endedAt?: number; // ms since epoch (set on first save)
};
