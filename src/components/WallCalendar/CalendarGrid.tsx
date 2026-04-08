import React from 'react';
import {
  DayCell,
  DateKey,
  MONTH_NAMES,
  WEEKDAY_LABELS,
  cmpKeys,
  buildMonthGrid,
} from './calendarUtils';

interface CalendarGridProps {
  viewYear: number;
  viewMonth: number;
  effectiveStart: DateKey | null;
  effectiveEnd: DateKey | null;
  isSelecting: boolean;
  onDayClick: (key: DateKey) => void;
  onDayHover: (key: DateKey | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function getDayClasses(
  cell: DayCell,
  effectiveStart: DateKey | null,
  effectiveEnd: DateKey | null,
): string {
  const classes: string[] = ['day-cell'];

  if (!cell.isCurrentMonth) classes.push('other-month');
  if (cell.isToday)         classes.push('today');
  if (cell.isWeekend && cell.isCurrentMonth) classes.push('weekend');

  if (effectiveStart && effectiveEnd) {
    const lo = effectiveStart;
    const hi = effectiveEnd;
    if (cell.key === lo) classes.push('range-start');
    if (cell.key === hi) classes.push('range-end');
    if (cell.key === lo && cell.key === hi) classes.push('range-single');
    if (cmpKeys(cell.key, lo) > 0 && cmpKeys(cell.key, hi) < 0) classes.push('in-range');
  } else if (effectiveStart && cell.key === effectiveStart) {
    classes.push('range-start', 'range-single');
  }

  return classes.join(' ');
}

export default function CalendarGrid({
  viewYear,
  viewMonth,
  effectiveStart,
  effectiveEnd,
  isSelecting,
  onDayClick,
  onDayHover,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const cells = buildMonthGrid(viewYear, viewMonth);
  const monthTitle =
    MONTH_NAMES[viewMonth].charAt(0) +
    MONTH_NAMES[viewMonth].slice(1).toLowerCase() +
    ' ' +
    viewYear;

  return (
    <div className="grid-section">
      {/* Month navigation */}
      <div className="month-nav">
        <button
          className="nav-btn"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="month-nav-title">{monthTitle}</span>
        <button
          className="nav-btn"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="weekday-row" role="row">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`weekday-label${i >= 5 ? ' weekend' : ''}`}
            role="columnheader"
            aria-label={label}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        className="days-grid"
        role="grid"
        aria-label={`Calendar grid for ${monthTitle}`}
        onMouseLeave={() => onDayHover(null)}
      >
        {cells.map(cell => (
          <div
            key={cell.key}
            className={getDayClasses(cell, effectiveStart, effectiveEnd)}
            role="gridcell"
            aria-label={`${cell.day} ${MONTH_NAMES[cell.month]} ${cell.year}${cell.isToday ? ', today' : ''}`}
            aria-selected={
              !!(effectiveStart && effectiveEnd &&
                cmpKeys(cell.key, effectiveStart) >= 0 &&
                cmpKeys(cell.key, effectiveEnd) <= 0)
            }
            onClick={() => onDayClick(cell.key)}
            onMouseEnter={() => isSelecting && onDayHover(cell.key)}
            tabIndex={cell.isCurrentMonth ? 0 : -1}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDayClick(cell.key);
              }
            }}
          >
            <span className="day-num">{cell.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
