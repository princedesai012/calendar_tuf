'use client';

import { useState, useCallback } from 'react';
import { DateKey, RangeState, NotesState, cmpKeys } from '../components/WallCalendar/calendarUtils';
import { useLocalStorage } from './useLocalStorage';

export type Point = { x: number; y: number };
export type Stroke = Point[];

const today = new Date();

export function useCalendarState() {
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Persist range & notes in localStorage
  const [range, setRange, rangeHydrated] = useLocalStorage<RangeState>('wcal-range', {
    start: null,
    end: null,
    selecting: false,
  });
  const [notes, setNotes, notesHydrated] = useLocalStorage<NotesState>('wcal-notes', {
    lines: Array(6).fill(''),
    rangeNote: '',
  });
  const [strokes, setStrokes, strokesHydrated] = useLocalStorage<Stroke[]>('wcal-strokes', []);

  /** Key that is being hovered during selection — used for preview */
  const [hoverKey, setHoverKey] = useState<DateKey | null>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const changeMonth = useCallback((delta: number) => {
    setViewMonth(prev => {
      let m = prev + delta;
      if (m > 11) { m = 0; setViewYear(y => y + 1); }
      else if (m < 0) { m = 11; setViewYear(y => y - 1); }
      return m;
    });
  }, []);

  // ── Date selection ──────────────────────────────────────────────────────────
  const handleDayClick = useCallback((key: DateKey) => {
    setRange(prev => {
      if (!prev.selecting || !prev.start) {
        // First click → set start
        return { start: key, end: null, selecting: true };
      }
      // Second click → set end (ensure start ≤ end)
      const [lo, hi] = cmpKeys(key, prev.start) >= 0
        ? [prev.start, key]
        : [key, prev.start];
      return { start: lo, end: hi, selecting: false };
    });
    setHoverKey(null);
  }, [setRange]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null, selecting: false });
    setHoverKey(null);
    setNotes(n => ({ ...n, rangeNote: '' }));
  }, [setRange, setNotes]);

  // ── Notes ───────────────────────────────────────────────────────────────────
  const updateLine = useCallback((idx: number, value: string) => {
    setNotes(n => {
      const lines = [...n.lines];
      lines[idx] = value;
      return { ...n, lines };
    });
  }, [setNotes]);

  const updateRangeNote = useCallback((value: string) => {
    setNotes(n => ({ ...n, rangeNote: value }));
  }, [setNotes]);

  // ── Derived range for preview during hover ─────────────────────────────────
  const previewEnd: DateKey | null =
    range.selecting && range.start && hoverKey
      ? (cmpKeys(hoverKey, range.start) >= 0 ? hoverKey : range.start)
      : null;

  const previewStart: DateKey | null =
    range.selecting && range.start && hoverKey
      ? (cmpKeys(hoverKey, range.start) >= 0 ? range.start : hoverKey)
      : null;

  const effectiveStart = range.selecting ? (previewStart ?? range.start) : range.start;
  const effectiveEnd   = range.selecting ? previewEnd : range.end;

  // ── Drawing ─────────────────────────────────────────────────────────────────
  const pushStroke = useCallback((stroke: Stroke) => setStrokes(prev => [...prev, stroke]), [setStrokes]);
  const clearStrokes = useCallback(() => setStrokes([]), [setStrokes]);

  return {
    viewYear,
    viewMonth,
    changeMonth,
    range,
    hoverKey,
    setHoverKey,
    handleDayClick,
    clearRange,
    notes,
    updateLine,
    updateRangeNote,
    effectiveStart,
    effectiveEnd,
    strokes,
    pushStroke,
    clearStrokes,
    isHydrated: rangeHydrated && notesHydrated && strokesHydrated,
  };
}
