# 🗓 Wall Calendar — Interactive React Component

A polished, interactive wall calendar built with **Next.js 14 + TypeScript**, pixel-matched to the provided reference image. Features date range selection, integrated notes, month-themed colors, holiday markers, smooth slide animations, and full responsive design — all persisted in `localStorage`.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Wall calendar aesthetic** | Spiral binding rings, mountain hero image, angled blue/white wave cutout, year+month badge — all matching the reference image |
| **Date range selector** | Click start → hover to **live preview** → click end. Full visual states: start pill, end pill, between fill, half-background edge transitions |
| **Integrated notes** | 6 editable lined inputs for general monthly memos |
| **Range note panel** | A note panel appears when a range is confirmed, with textarea + clear button |
| **localStorage persistence** | Notes and selected range survive page refresh (zero flicker, SSR-safe) |
| **Month theming** | Each month has a unique accent colour: sky blue (Apr), rose (Feb), amber (May), purple (Aug), etc. |
| **Holiday markers** | 13 national/cultural holidays are marked with emoji dots on their dates + mini legend below the grid |
| **Slide animation** | Month grid slides left/right when navigating months |
| **Skeleton loader** | Shimmer effect while localStorage data hydrates (avoids SSR mismatch) |
| **Month navigation** | ‹ › arrows update both the hero badge and the grid simultaneously |
| **Today marker** | Today's date receives a filled dark circle |
| **Keyboard accessible** | All day cells are focusable; Enter/Space triggers selection |
| **Fully responsive** | Desktop: two-column layout. Mobile (≤420px): stacked vertically, compacted cells, no overflow |

---

## 🏗 Architecture

```
src/
├── app/
│   ├── globals.css          # Font imports, body reset
│   ├── layout.tsx           # Root Next.js layout + metadata
│   └── page.tsx             # Renders <WallCalendar />
├── components/
│   └── WallCalendar/
│       ├── WallCalendar.tsx         # Root component — assembles Hero, Notes, Grid, Footer
│       ├── WallCalendar.module.css  # All styles — design tokens, responsive, animations
│       ├── calendarUtils.ts         # Grid builder, date helpers, holidays, month themes
│       └── index.ts                 # Barrel export
└── hooks/
    ├── useCalendarState.ts  # All state management (navigation, range, hover, notes)
    └── useLocalStorage.ts   # SSR-safe localStorage hook (no external deps)
```

### State design

`useCalendarState` is the single source of truth:

```ts
// Navigation
viewYear, viewMonth, changeMonth(delta)

// Range selection (persisted)
range: { start, end, selecting }
hoverKey                  // preview end during selection
effectiveStart / End      // derived: shows hover preview while selecting

// Notes (persisted)
notes: { lines: string[6], rangeNote: string }

// Hydration flag
isHydrated                // true once localStorage has been read
```

Date keys use `"YYYY-MM-DD"` strings — string comparison correctly determines ordering, avoiding timezone issues.

---

## 🚀 Getting started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Install & run

```bash
# Clone / unzip the project
cd wall-calendar

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build && npm start
```

---

## 🎨 Design decisions

### Visual fidelity to reference image
Every detail from the reference was reproduced:
- **Spiral rings** — 20 individual HTML elements with a `::before` stem, positioned above the card
- **Mountain hero** — fully SVG, includes diagonal bright rock slab, snow patch, and red-jacketed climber with ice axe
- **Wave cutout** — two overlapping SVG paths creating the angled white panel and blue diagonal accent
- **Badge** — `clip-path: polygon(...)` creates the angled top-left corner
- **Weekends in accent colour** — SAT/SUN column headers and day numbers

### Month theming
Each of the 12 months has a unique `accent`, `accentDark`, `accentLight`, and `accentXLight` colour, applied via CSS custom properties on the root `.wrapper`. All themed elements (wave, badge month name, range pills, weekend labels, footer range text, range note panel, nav hover) update simultaneously with a `0.4s` CSS transition.

### Holiday system
A static dictionary of `MM-DD → { name, emoji }` pairs covers 13 annual dates. Each relevant `DayCell` carries a `.holiday` field; the grid renders a small emoji above the number and a mini-legend at the bottom of the calendar.

### Slide animation on month change
`setSlideDir('left' | 'right')` is set before calling `changeMonth`, triggering a CSS slide-in animation on `.daysGrid` via a React class toggle with a 320ms timeout cleanup.

### localStorage persistence
A custom `useLocalStorage<T>` hook reads from `localStorage` in a `useEffect` (SSR-safe), exposes `isHydrated`, and updates storage synchronously on every write. During hydration, the calendar renders a shimmer skeleton to avoid layout shift.

### Hover preview
`onMouseEnter` now fires on **every** cell (not gated behind `isSelecting`). The `hoverKey` drives `effectiveStart/End` derivation in `useCalendarState`, which renders live range preview over the grid.

### CSS Modules + custom properties
Design tokens live as CSS variables on `.wrapper`, enabling per-month theming without touching component logic. `min-width: 0` on all grid children prevents overflow in flex/grid containers on mobile.

---

## 🔧 Extending the component

### Custom hero image
Replace the `<svg>` inside `<Hero>` with an `<img>` tag. The wave/badge overlay works with any background.

### Add more holidays
In `calendarUtils.ts`, extend `ANNUAL_HOLIDAYS` with any `MM-DD: { name, emoji }` entry.

### Year-specific holidays (e.g., Easter)
Add a `YEAR_HOLIDAYS: Record<string, ...>` map keyed by full `YYYY-MM-DD` string, and merge it in `getHoliday()`.

---

## 📦 Tech stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 14 | Framework, file-based routing |
| React | 18 | Component model, hooks |
| TypeScript | 5 | Type safety |
| CSS Modules | native | Scoped styles, zero runtime |
| localStorage | native | Client-side persistence |
| Google Fonts | CDN | Playfair Display + DM Sans |

No UI library. No CSS-in-JS. Zero unnecessary packages.
