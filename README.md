# Pulseon — Fitness Tracker

A modern, fully responsive fitness tracking app: log workouts and sets, track water
intake and calories, browse an exercise library, and visualize weekly/monthly progress.
Built with React, React Router, and IndexedDB (offline-first local storage). Includes
a light/dark theme toggle and a responsive layout (sidebar nav on desktop, bottom tab
bar on mobile).

## Getting started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

The production build is output to the `dist/` folder — you can deploy that folder to
any static host (Vercel, Netlify, GitHub Pages, S3, etc.).

## Tech stack

- **React 18** + **React Router 6** — UI and client-side routing
- **idb** — a small Promise-based wrapper around IndexedDB for local data storage
  (workouts, sets, water logs, calorie logs)
- **react-icons** (Lucide set) — iconography
- **recharts** — weekly/monthly progress charts
- **Vite** — dev server and build tool

## Project structure

```
src/
  components/   Reusable UI pieces (TopBar, SideNav, BottomNav, cards, modal, etc.)
  pages/        One folder per route (Dashboard, Water, Workout, Exercises, Progress, Calories)
  routes/       AppRoutes (route table) and AppLayout (shell: top bar + nav + content)
  services/     db.js (IndexedDB access) and exerciseApi.js (ExerciseDB API client)
  context/      ThemeContext (light/dark theme, persisted to localStorage)
  styles/       tokens.css — the design system (colors, spacing, radii, shadows)
```

## Notes

- All workout, water, and calorie data is stored **locally in the browser** via
  IndexedDB — nothing is sent to a server, so data is private to that browser/device.
- The exercise library pulls from the public ExerciseDB API
  (`https://oss.exercisedb.dev`), so an internet connection is needed for the
  Exercises page and exercise GIFs.
- Theme preference is remembered across visits using `localStorage`.
"# pulseon" 
"# pulseon" 
"# pulseon" 
