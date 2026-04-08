// ─── Types ───────────────────────────────────────────────────────────────────

export type DateKey = string; // "YYYY-MM-DD"

export interface DayCell {
  year: number;
  month: number; // 0-indexed
  day: number;
  key: DateKey;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean; // SAT or SUN (Mon-first grid: col 5 or 6)
  dow: number; // 0=Mon … 6=Sun
  holiday?: { name: string; emoji: string };
}

export interface RangeState {
  start: DateKey | null;
  end: DateKey | null;
  /** true while user has clicked start but not end yet */
  selecting: boolean;
}

export interface NotesState {
  /** Free-form monthly lines */
  lines: string[];
  /** Note attached to the selected range */
  rangeNote: string;
}

// ─── Date key helpers ────────────────────────────────────────────────────────

export function toKey(year: number, month: number, day: number): DateKey {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function fromKey(key: DateKey): { year: number; month: number; day: number } {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

export function cmpKeys(a: DateKey, b: DateKey): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function daysBetween(start: DateKey, end: DateKey): number {
  const { year: y1, month: m1, day: d1 } = fromKey(start);
  const { year: y2, month: m2, day: d2 } = fromKey(end);
  const diff = new Date(y2, m2, d2).getTime() - new Date(y1, m1, d1).getTime();
  return Math.round(diff / 86_400_000) + 1;
}

// ─── Holidays ────────────────────────────────────────────────────────────────
// Month-agnostic list (MM-DD) + year-specific entries

const ANNUAL_HOLIDAYS: Record<string, { name: string; emoji: string }> = {
  '01-01': { name: "New Year's Day",    emoji: '🎆' },
  '02-14': { name: "Valentine's Day",   emoji: '💝' },
  '03-17': { name: "St. Patrick's Day", emoji: '🍀' },
  '04-01': { name: "April Fools'",      emoji: '🃏' },
  '04-22': { name: "Earth Day",         emoji: '🌍' },
  '05-01': { name: "Labour Day",        emoji: '⚒️' },
  '06-21': { name: "Father's Day",      emoji: '👔' },
  '07-04': { name: "Independence Day",  emoji: '🗽' },
  '10-31': { name: "Halloween",         emoji: '🎃' },
  '11-11': { name: "Veterans Day",      emoji: '🎖️' },
  '12-24': { name: "Christmas Eve",     emoji: '🎄' },
  '12-25': { name: "Christmas Day",     emoji: '🎁' },
  '12-31': { name: "New Year's Eve",    emoji: '🥂' },
};

export function getHoliday(year: number, month: number, day: number) {
  const mmdd = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return ANNUAL_HOLIDAYS[mmdd] ?? null;
}

// ─── Month theme colors ───────────────────────────────────────────────────────

export const MONTH_THEMES: Record<number, { accent: string; accentDark: string; accentLight: string; accentXLight: string; heroGrad: string }> = {
  0:  { accent: '#3b82f6', accentDark: '#1d4ed8', accentLight: '#dbeafe', accentXLight: '#eff6ff', heroGrad: '#1e3a5f,#3b82f6' }, // Jan — deep blue
  1:  { accent: '#ec4899', accentDark: '#be185d', accentLight: '#fce7f3', accentXLight: '#fdf2f8', heroGrad: '#7c1d4e,#ec4899' }, // Feb — pink
  2:  { accent: '#22c55e', accentDark: '#15803d', accentLight: '#dcfce7', accentXLight: '#f0fdf4', heroGrad: '#14532d,#22c55e' }, // Mar — spring green
  3:  { accent: '#1E9BD4', accentDark: '#0d6fa0', accentLight: '#d4eef9', accentXLight: '#eaf6fd', heroGrad: '#0c4a6e,#1E9BD4' }, // Apr — sky blue (default)
  4:  { accent: '#f59e0b', accentDark: '#b45309', accentLight: '#fef3c7', accentXLight: '#fffbeb', heroGrad: '#78350f,#f59e0b' }, // May — amber
  5:  { accent: '#0ea5e9', accentDark: '#0369a1', accentLight: '#e0f2fe', accentXLight: '#f0f9ff', heroGrad: '#082f49,#0ea5e9' }, // Jun — ocean
  6:  { accent: '#f97316', accentDark: '#c2410c', accentLight: '#ffedd5', accentXLight: '#fff7ed', heroGrad: '#7c2d12,#f97316' }, // Jul — sunset orange
  7:  { accent: '#a855f7', accentDark: '#7e22ce', accentLight: '#f3e8ff', accentXLight: '#faf5ff', heroGrad: '#4a044e,#a855f7' }, // Aug — purple
  8:  { accent: '#ef4444', accentDark: '#b91c1c', accentLight: '#fee2e2', accentXLight: '#fef2f2', heroGrad: '#7f1d1d,#ef4444' }, // Sep — autumn red
  9:  { accent: '#d97706', accentDark: '#92400e', accentLight: '#fef3c7', accentXLight: '#fffbeb', heroGrad: '#78350f,#d97706' }, // Oct — harvest gold
  10: { accent: '#6366f1', accentDark: '#4338ca', accentLight: '#e0e7ff', accentXLight: '#eef2ff', heroGrad: '#1e1b4b,#6366f1' }, // Nov — indigo
  11: { accent: '#14b8a6', accentDark: '#0f766e', accentLight: '#ccfbf1', accentXLight: '#f0fdfa', heroGrad: '#042f2e,#14b8a6' }, // Dec — teal
};

// ─── Month grid builder ──────────────────────────────────────────────────────

const TODAY = new Date();
const TODAY_KEY = toKey(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

export function buildMonthGrid(year: number, month: number): DayCell[] {
  const cells: DayCell[] = [];

  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const leadingBlanks = (firstDow + 6) % 7; // shift to Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Leading cells from previous month
  for (let i = 0; i < leadingBlanks; i++) {
    const d = daysInPrevMonth - leadingBlanks + 1 + i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    const dow = i;
    cells.push(makeCell(py, pm, d, dow, false));
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (leadingBlanks + d - 1) % 7;
    cells.push(makeCell(year, month, d, dow, true));
  }

  // Trailing cells for next month
  const total = cells.length;
  const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= trailing; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    const dow = (total + d - 1) % 7;
    cells.push(makeCell(ny, nm, d, dow, false));
  }

  return cells;
}

function makeCell(
  year: number,
  month: number,
  day: number,
  dow: number,
  isCurrentMonth: boolean,
): DayCell {
  const key = toKey(year, month, day);
  return {
    year, month, day, key,
    isCurrentMonth,
    isToday: key === TODAY_KEY,
    isWeekend: dow === 5 || dow === 6,
    dow,
    holiday: isCurrentMonth ? (getHoliday(year, month, day) ?? undefined) : undefined,
  };
}

// ─── Month/year label helpers ─────────────────────────────────────────────────

export const MONTH_NAMES = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER',
] as const;

export const WEEKDAY_LABELS = ['MON','TUE','WED','THU','FRI','SAT','SUN'] as const;
