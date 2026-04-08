import React from 'react';
import { DateKey, fromKey, MONTH_NAMES, daysBetween } from './calendarUtils';

interface NotesSectionProps {
  lines: string[];
  rangeNote: string;
  rangeStart: DateKey | null;
  rangeEnd: DateKey | null;
  onLineChange: (idx: number, value: string) => void;
  onRangeNoteChange: (value: string) => void;
  onClearRange: () => void;
}

export default function NotesSection({
  lines,
  rangeNote,
  rangeStart,
  rangeEnd,
  onLineChange,
  onRangeNoteChange,
  onClearRange,
}: NotesSectionProps) {
  const hasRange = rangeStart && rangeEnd;

  const rangeLabel = (() => {
    if (!rangeStart || !rangeEnd) return null;
    const { month: m1, day: d1 } = fromKey(rangeStart);
    const { month: m2, day: d2 } = fromKey(rangeEnd);
    const count = daysBetween(rangeStart, rangeEnd);
    const sameMon = m1 === m2;
    return sameMon
      ? `${d1}–${d2} ${MONTH_NAMES[m1].charAt(0) + MONTH_NAMES[m1].slice(1).toLowerCase()} · ${count} day${count > 1 ? 's' : ''}`
      : `${d1} ${MONTH_NAMES[m1].slice(0, 3)} – ${d2} ${MONTH_NAMES[m2].slice(0, 3)} · ${count} day${count > 1 ? 's' : ''}`;
  })();

  return (
    <aside className="notes-section" aria-label="Notes">
      <span className="notes-label">Notes</span>

      <div className="notes-lines">
        {lines.map((val, i) => (
          <input
            key={i}
            className="note-line"
            type="text"
            value={val}
            onChange={e => onLineChange(i, e.target.value)}
            placeholder={i === 0 ? 'Write a note…' : ''}
            aria-label={`Note line ${i + 1}`}
            maxLength={60}
          />
        ))}
      </div>

      {hasRange && (
        <div className="range-note-block" role="region" aria-label="Range note">
          <div className="range-note-header">
            <div>
              <p className="range-note-meta">Selected range</p>
              <p className="range-note-label">{rangeLabel}</p>
            </div>
            <button
              className="clear-btn"
              onClick={onClearRange}
              title="Clear selection"
              aria-label="Clear date range"
            >
              ✕
            </button>
          </div>
          <textarea
            className="range-note-textarea"
            value={rangeNote}
            onChange={e => onRangeNoteChange(e.target.value)}
            placeholder="Add a note for this range…"
            rows={3}
            aria-label="Range note text"
          />
        </div>
      )}
    </aside>
  );
}
