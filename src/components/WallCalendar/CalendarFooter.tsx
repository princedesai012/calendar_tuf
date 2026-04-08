import React from 'react';
import { DateKey, fromKey, MONTH_NAMES, daysBetween } from './calendarUtils';

interface CalendarFooterProps {
  isSelecting: boolean;
  rangeStart: DateKey | null;
  rangeEnd: DateKey | null;
}

export default function CalendarFooter({ isSelecting, rangeStart, rangeEnd }: CalendarFooterProps) {
  const hint = !rangeStart
    ? 'Click a date to start selecting a range'
    : isSelecting
    ? 'Now click an end date — hover to preview'
    : 'Click any date to start a new selection';

  const rangeInfo = (() => {
    if (!rangeStart || !rangeEnd) return null;
    const { month: m1, day: d1 } = fromKey(rangeStart);
    const { month: m2, day: d2 } = fromKey(rangeEnd);
    const count = daysBetween(rangeStart, rangeEnd);
    return `${d1} ${MONTH_NAMES[m1].slice(0, 3)} – ${d2} ${MONTH_NAMES[m2].slice(0, 3)} · ${count} day${count > 1 ? 's' : ''}`;
  })();

  return (
    <footer className="calendar-footer">
      <span className="footer-hint">{hint}</span>
      {rangeInfo && <span className="footer-range">{rangeInfo}</span>}
    </footer>
  );
}
