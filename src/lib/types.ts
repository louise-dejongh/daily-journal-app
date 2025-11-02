export type Entry = {
  id: string;
  title: string;
  content: string;
  dateISO: string; // YYYY-MM-DD
  mood?: string;
  createdAt: number;
  updatedAt: number;
};
