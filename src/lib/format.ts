/** Formatting helpers shared across cards, meta blocks and article headers. */

export function formatDate(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value);
}

export function formatDateISO(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toISOString().split('T')[0] ?? '';
}

/** Editorial counters read as 01 / 06, never 1 of 6. */
export function pad(index: number, length = 2): string {
  return String(index).padStart(length, '0');
}

export function counter(index: number, total: number): string {
  return `${pad(index)} / ${pad(total)}`;
}

const WORDS_PER_MINUTE = 200;

export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
