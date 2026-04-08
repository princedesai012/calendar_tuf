'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './WallCalendar.module.css';
import { useCalendarState } from '@/hooks/useCalendarState';
import {
  MONTH_NAMES, WEEKDAY_LABELS, buildMonthGrid,
  cmpKeys, fromKey, daysBetween, MONTH_THEMES,
} from './calendarUtils';
import type { DateKey } from './calendarUtils';

// ─── Rings ───────────────────────────────────────────────────────────────────
function Rings() {
  return (
    <div className={styles.rings} aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className={styles.ring} />
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ monthName, year, accent }: { monthName: string; year: number; accent: string }) {
  return (
    <div className={styles.hero}>
      <svg
        className={styles.heroBg}
        viewBox="0 0 680 230"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Sky */}
        <rect width="680" height="230" fill="#a4b4bf" />
        <rect width="680" height="115" fill="#bdd0da" opacity="0.55" />
        <rect width="680" height="65" fill="#d2e2ec" opacity="0.35" />
        {/* Clouds */}
        <ellipse cx="105" cy="40" rx="82" ry="17" fill="#dce9f1" opacity="0.45" />
        <ellipse cx="170" cy="33" rx="54" ry="12" fill="#e4eff6" opacity="0.4" />
        <ellipse cx="500" cy="29" rx="104" ry="15" fill="#dce9f1" opacity="0.35" />
        <ellipse cx="592" cy="43" rx="66" ry="11" fill="#e4eff6" opacity="0.3" />
        {/* Background mountains */}
        <polygon points="555,230 640,108 724,230" fill="#7a8e9c" />
        <polygon points="516,230 608,122 702,230" fill="#6e8290" />
        <polygon points="-22,230 62,128 162,230" fill="#7e9199" />
        <polygon points="0,230 82,144 132,230" fill="#7a8d97" />
        {/* Main rock slab */}
        <polygon points="88,230 224,78 504,230" fill="#4e5c6a" />
        <polygon points="198,230 292,62 484,230 382,230" fill="#8fa2b0" />
        <polygon points="268,102 312,65 354,102 312,90" fill="#aabbca" opacity="0.55" />
        {/* Snow */}
        <polygon points="278,92 296,60 314,92 296,87" fill="white" opacity="0.72" />
        <polygon points="296,60 306,70 290,84" fill="white" opacity="0.48" />
        {/* Rock grain lines */}
        <line x1="224" y1="78" x2="292" y2="184" stroke="#5c6a78" strokeWidth="1" opacity="0.28" />
        <line x1="254" y1="73" x2="316" y2="178" stroke="#5c6a78" strokeWidth="0.8" opacity="0.22" />
        <line x1="322" y1="66" x2="362" y2="162" stroke="#8ca0ae" strokeWidth="0.8" opacity="0.18" />
        {/* Left cliff */}
        <polygon points="0,230 0,158 142,230" fill="#3d4d5a" />
        <polygon points="0,230 62,172 0,202" fill="#2e3d4a" />

        {/* ── Climber ── */}
        <g transform="translate(370, 120) rotate(-18)">
          {/* Legs */}
          <line x1="0" y1="30" x2="-10" y2="56" stroke="#2c3a46" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="30" x2="8" y2="56" stroke="#2c3a46" strokeWidth="4" strokeLinecap="round" />
          {/* Boots */}
          <line x1="-10" y1="56" x2="-17" y2="58" stroke="#1a2830" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="8" y1="56" x2="15" y2="58" stroke="#1a2830" strokeWidth="3.5" strokeLinecap="round" />
          {/* Torso */}
          <line x1="0" y1="5" x2="0" y2="30" stroke="#c0392b" strokeWidth="6" strokeLinecap="round" />
          {/* Left arm + ice-axe */}
          <line x1="0" y1="12" x2="20" y2="-16" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="-16" x2="26" y2="-23" stroke="#8a9a6a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="-25" x2="30" y2="-18" stroke="#6a7a5a" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm braced */}
          <line x1="0" y1="14" x2="-13" y2="25" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
          {/* Head */}
          <circle cx="1" cy="-4" r="6" fill="#d4a678" />
          {/* Helmet */}
          <ellipse cx="1" cy="-9" rx="7" ry="5" fill="#c0392b" />
          {/* Pack */}
          <rect x="2" y="8" width="8" height="14" rx="2" fill="#b03020" opacity="0.7" />
        </g>
        {/* Rock chips */}
        <circle cx="384" cy="160" r="2" fill="#9aaab8" opacity="0.6" />
        <circle cx="377" cy="164" r="1.5" fill="#8a9aa8" opacity="0.5" />
        <circle cx="392" cy="162" r="1" fill="#9aaab8" opacity="0.4" />
      </svg>

      {/* Wave cutout */}
      <svg className={styles.heroWave} viewBox="0 0 340 52" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,52 L0,0 L272,0 Q306,0 306,28 Q306,52 340,52 Z" fill="white" />
        <path d="M0,0 L220,0 Q258,0 278,20 Q292,36 328,52 L258,52 Q230,32 214,12 Z" fill={accent} />
      </svg>

      {/* Badge */}
      <div className={styles.heroBadge}>
        <span className={styles.heroYear}>{year}</span>
        <span className={styles.heroMonth} style={{ color: accent }}>{monthName}</span>
      </div>
    </div>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────
function Notes({
  lines, rangeNote, rangeStart, rangeEnd,
  onLineChange, onRangeNoteChange, onClearRange,
  accent, accentDark, accentLight, accentXLight,
}: {
  lines: string[];
  rangeNote: string;
  rangeStart: DateKey | null;
  rangeEnd: DateKey | null;
  onLineChange: (i: number, v: string) => void;
  onRangeNoteChange: (v: string) => void;
  onClearRange: () => void;
  accent: string;
  accentDark: string;
  accentLight: string;
  accentXLight: string;
}) {
  const hasRange = rangeStart && rangeEnd;

  const rangeLabel = (() => {
    if (!rangeStart || !rangeEnd) return null;
    const { month: m1, day: d1 } = fromKey(rangeStart);
    const { month: m2, day: d2 } = fromKey(rangeEnd);
    const count = daysBetween(rangeStart, rangeEnd);
    const sameMonth = m1 === m2;
    return sameMonth
      ? `${d1}–${d2} ${MONTH_NAMES[m1].slice(0, 3).charAt(0) + MONTH_NAMES[m1].slice(1, 3).toLowerCase()} · ${count}d`
      : `${d1} ${MONTH_NAMES[m1].slice(0, 3)} – ${d2} ${MONTH_NAMES[m2].slice(0, 3)} · ${count}d`;
  })();

  return (
    <aside className={styles.notesSection}>
      <p className={styles.notesLabel}>Notes</p>
      <div className={styles.notesLines}>
        {lines.map((v, i) => (
          <input
            key={i}
            className={styles.noteLine}
            type="text"
            value={v}
            onChange={e => onLineChange(i, e.target.value)}
            placeholder={i === 0 ? 'Write a note…' : ''}
            aria-label={`Note line ${i + 1}`}
            maxLength={60}
            style={{ '--focus-color': accent } as React.CSSProperties}
          />
        ))}
      </div>

      {hasRange && (
        <div
          className={styles.rangeNoteBlock}
          style={{ background: accentXLight, borderColor: accentLight }}
        >
          <div className={styles.rangeNoteHeader}>
            <div>
              <p className={styles.rangeNoteMeta} style={{ color: accent }}>Selected range</p>
              <p className={styles.rangeNoteLabel} style={{ color: accentDark }}>{rangeLabel}</p>
            </div>
            <button
              className={styles.clearBtn}
              onClick={onClearRange}
              aria-label="Clear range"
              style={{ borderColor: accent, color: accent }}
            >✕</button>
          </div>
          <textarea
            className={styles.rangeNoteTextarea}
            value={rangeNote}
            onChange={e => onRangeNoteChange(e.target.value)}
            placeholder="Add a note for this range…"
            rows={3}
            style={{ borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`, color: accentDark } as React.CSSProperties}
          />
        </div>
      )}
    </aside>
  );
}

// ─── Shared day-grid renderer ─────────────────────────────────────────────────
function DaysContent({
  cells, title, accent, effectiveStart, effectiveEnd,
  onDayClick, onDayHover,
}: {
  cells: ReturnType<typeof buildMonthGrid>;
  title: string;
  accent: string;
  effectiveStart: DateKey | null;
  effectiveEnd: DateKey | null;
  onDayClick: (k: DateKey) => void;
  onDayHover: (k: DateKey | null) => void;
}) {
  function cellClass(cell: ReturnType<typeof buildMonthGrid>[0]): string {
    const c: string[] = [styles.dayCell];
    if (!cell.isCurrentMonth) c.push(styles.otherMonth);
    if (cell.isToday) c.push(styles.today);
    if (cell.isWeekend && cell.isCurrentMonth) c.push(styles.weekend);
    if (cell.holiday && cell.isCurrentMonth) c.push(styles.holiday);
    if (effectiveStart && effectiveEnd) {
      if (cell.key === effectiveStart) c.push(styles.rangeStart);
      if (cell.key === effectiveEnd)   c.push(styles.rangeEnd);
      if (cell.key === effectiveStart && cell.key === effectiveEnd) c.push(styles.rangeSingle);
      if (cmpKeys(cell.key, effectiveStart) > 0 && cmpKeys(cell.key, effectiveEnd) < 0) c.push(styles.inRange);
    } else if (effectiveStart && cell.key === effectiveStart) {
      c.push(styles.rangeStart, styles.rangeSingle);
    }
    return c.join(' ');
  }

  const holidays = cells.filter(c => c.isCurrentMonth && c.holiday).slice(0, 3);

  return (
    <>
      <div
        className={styles.daysGrid}
        role="grid"
        aria-label={`Calendar for ${title}`}
        onMouseLeave={() => onDayHover(null)}
        style={{ '--range-bg': `color-mix(in srgb, ${accent} 12%, transparent)`, '--accent': accent } as React.CSSProperties}
      >
        {cells.map(cell => (
          <div
            key={cell.key}
            className={cellClass(cell)}
            role="gridcell"
            aria-label={`${cell.day} ${MONTH_NAMES[cell.month]} ${cell.year}${cell.isToday ? ', today' : ''}${cell.holiday ? ', ' + cell.holiday.name : ''}`}
            tabIndex={cell.isCurrentMonth ? 0 : -1}
            onClick={() => onDayClick(cell.key)}
            onMouseEnter={() => onDayHover(cell.key)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDayClick(cell.key); }
            }}
          >
            <span className={styles.dayNum}>{cell.day}</span>
            {cell.holiday && cell.isCurrentMonth && (
              <span className={styles.holidayDot} title={cell.holiday.name} aria-hidden="true">
                {cell.holiday.emoji}
              </span>
            )}
          </div>
        ))}
      </div>
      {holidays.length > 0 && (
        <div className={styles.holidayLegend}>
          {holidays.map(c => (
            <span key={c.key} className={styles.holidayLegendItem}>
              {c.holiday!.emoji} {c.day} — {c.holiday!.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
type GhostState = { cells: ReturnType<typeof buildMonthGrid>; title: string; id: number };

function Grid({
  viewYear, viewMonth, effectiveStart, effectiveEnd,
  onDayClick, onDayHover, onPrevMonth, onNextMonth,
  accent, accentLight, accentDark,
}: {
  viewYear: number;
  viewMonth: number;
  effectiveStart: DateKey | null;
  effectiveEnd: DateKey | null;
  onDayClick: (k: DateKey) => void;
  onDayHover: (k: DateKey | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  accent: string;
  accentLight: string;
  accentDark: string;
}) {
  const cells = buildMonthGrid(viewYear, viewMonth);
  const monthTitle = MONTH_NAMES[viewMonth].charAt(0) + MONTH_NAMES[viewMonth].slice(1).toLowerCase() + ' ' + viewYear;
  const monthKey = viewYear * 12 + viewMonth;

  // ── Page-flip animation state ──────────────────────────────────────────────
  const [ghost, setGhost]       = useState<GhostState | null>(null);
  const [flipDir, setFlipDir]   = useState<'left' | 'right'>('left');
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function triggerNav(dir: 'left' | 'right', navFn: () => void) {
    // Cancel any in-progress animation
    if (timerRef.current) clearTimeout(timerRef.current);

    // Snapshot current month data for the ghost overlay
    const snapCells = buildMonthGrid(viewYear, viewMonth);
    const snapTitle = monthTitle;
    const ghostId   = Date.now();

    // Fire the navigation (updates viewYear/viewMonth in parent)
    navFn();

    setFlipDir(dir);
    setGhost({ cells: snapCells, title: snapTitle, id: ghostId });

    // Remove ghost after animation finishes
    timerRef.current = setTimeout(() => setGhost(null), 440);
  }

  return (
    <div className={styles.gridSection}>
      {/* ── Static nav row ── */}
      <div className={styles.monthNav}>
        <button
          className={styles.navBtn}
          onClick={() => triggerNav('right', onPrevMonth)}
          aria-label="Previous month"
          style={{ '--nav-hover-bg': accentLight, '--nav-hover-color': accentDark } as React.CSSProperties}
        >‹</button>

        {/* Month title fades on change via key */}
        <span key={monthKey} className={`${styles.monthNavTitle} ${styles.titleFadeIn}`}>
          {monthTitle}
        </span>

        <button
          className={styles.navBtn}
          onClick={() => triggerNav('left', onNextMonth)}
          aria-label="Next month"
          style={{ '--nav-hover-bg': accentLight, '--nav-hover-color': accentDark } as React.CSSProperties}
        >›</button>
      </div>

      {/* ── Static weekday headers ── */}
      <div className={styles.weekdayRow} role="row">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`${styles.weekdayLabel}${i >= 5 ? ' ' + styles.weekend : ''}`}
            role="columnheader"
            style={i >= 5 ? { color: accent } : undefined}
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Flip container ── */}
      <div className={styles.flipContainer}>

        {/* Ghost: old month exits */}
        {ghost && (
          <div
            key={ghost.id}
            className={`${styles.flipPage} ${styles.flipGhost} ${
              flipDir === 'left' ? styles.flipExitLeft : styles.flipExitRight
            }`}
            aria-hidden="true"
          >
            <DaysContent
              cells={ghost.cells}
              title={ghost.title}
              accent={accent}
              effectiveStart={effectiveStart}
              effectiveEnd={effectiveEnd}
              onDayClick={() => {}}
              onDayHover={() => {}}
            />
          </div>
        )}

        {/* New month enters */}
        <div
          key={monthKey}
          className={`${styles.flipPage} ${
            ghost
              ? flipDir === 'left'
                ? styles.flipEnterRight
                : styles.flipEnterLeft
              : ''
          }`}
        >
          <DaysContent
            cells={cells}
            title={monthTitle}
            accent={accent}
            effectiveStart={effectiveStart}
            effectiveEnd={effectiveEnd}
            onDayClick={onDayClick}
            onDayHover={onDayHover}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ isSelecting, rangeStart, rangeEnd, accent }: {
  isSelecting: boolean;
  rangeStart: DateKey | null;
  rangeEnd: DateKey | null;
  accent: string;
}) {
  const hint = !rangeStart
    ? 'Click a date to start selecting a range'
    : isSelecting
    ? 'Hover to preview — click to confirm end date'
    : 'Click any date to begin a new selection';

  const info = (() => {
    if (!rangeStart || !rangeEnd) return null;
    const { month: m1, day: d1 } = fromKey(rangeStart);
    const { month: m2, day: d2 } = fromKey(rangeEnd);
    const count = daysBetween(rangeStart, rangeEnd);
    return `${d1} ${MONTH_NAMES[m1].slice(0, 3)} – ${d2} ${MONTH_NAMES[m2].slice(0, 3)} · ${count} day${count > 1 ? 's' : ''}`;
  })();

  return (
    <footer className={styles.footer}>
      <span className={styles.footerHint}>{hint}</span>
      {info && <span className={styles.footerRange} style={{ color: accent }}>{info}</span>}
    </footer>
  );
}

// ─── Root WallCalendar ────────────────────────────────────────────────────────
export default function WallCalendar() {
  const {
    viewYear, viewMonth, changeMonth,
    range, setHoverKey, handleDayClick, clearRange,
    notes, updateLine, updateRangeNote,
    effectiveStart, effectiveEnd,
    isHydrated,
  } = useCalendarState();

  const theme = MONTH_THEMES[viewMonth];

  // Skeleton shimmer while localStorage hydrates
  if (!isHydrated) {
    return (
      <div className={styles.wrapper}>
        <Rings />
        <div className={styles.card}>
          <div className={`${styles.hero} ${styles.heroSkeleton}`} />
          <div className={styles.body}>
            <div className={styles.skeletonPanel} />
            <div className={styles.skeletonPanel} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        '--blue':        theme.accent,
        '--blue-dark':   theme.accentDark,
        '--blue-light':  theme.accentLight,
        '--blue-xlight': theme.accentXLight,
      } as React.CSSProperties}
    >
      <Rings />
      <div className={styles.card}>
        <Hero monthName={MONTH_NAMES[viewMonth]} year={viewYear} accent={theme.accent} />

        <div className={styles.body}>
          <Notes
            lines={notes.lines}
            rangeNote={notes.rangeNote}
            rangeStart={range.start}
            rangeEnd={range.end}
            onLineChange={updateLine}
            onRangeNoteChange={updateRangeNote}
            onClearRange={clearRange}
            accent={theme.accent}
            accentDark={theme.accentDark}
            accentLight={theme.accentLight}
            accentXLight={theme.accentXLight}
          />
          <Grid
            viewYear={viewYear}
            viewMonth={viewMonth}
            effectiveStart={effectiveStart}
            effectiveEnd={effectiveEnd}
            onDayClick={handleDayClick}
            onDayHover={setHoverKey}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            accent={theme.accent}
            accentLight={theme.accentLight}
            accentDark={theme.accentDark}
          />
        </div>

        <Footer
          isSelecting={range.selecting}
          rangeStart={range.start}
          rangeEnd={range.end}
          accent={theme.accent}
        />
      </div>
    </div>
  );
}
