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

## Progressive Web App (offline support)

The app is a full PWA via `vite-plugin-pwa` (Workbox under the hood):

- **App shell precaching** — on first visit, the service worker caches the built
  HTML/JS/CSS/fonts/icons. After that, the UI itself loads with **zero network
  requests**, even with airplane mode on.
- **SPA offline routing** — a direct/refreshed load of any route (e.g. `/workout`)
  still resolves correctly offline via a navigation fallback to `index.html`,
  and React Router takes it from there.
- **IndexedDB for app data** — all workouts, sets, water logs, and calorie logs
  are read/written directly to IndexedDB (`src/services/db.js`), which has
  nothing to do with the network at all. This is why logging stays fully
  functional offline.
- **Runtime caching for the exercise API** — exercises you've already opened
  (list, search results, detail page, GIF) are cached so they're still viewable
  offline. A *brand-new* search while offline will correctly fail, since that
  data was never fetched — there's no way around that without a backend, and
  pretending otherwise would be misleading.
- **Install prompt + offline banner** — `src/components/InstallPrompt` surfaces
  the native "Add to Home Screen" prompt (Chrome/Edge/Android only — iOS Safari
  doesn't expose this event, so use Share → Add to Home Screen there instead).
  `src/components/OfflineBanner` tells the user when they've lost connection and
  confirms when they're back, so the offline behavior is visible, not silent.

### How to verify it actually works offline

The service worker only runs against a **production build** — `npm run dev`
does *not* exercise the same caching path Lighthouse/users will hit.

```bash
npm run build
npm run preview
```

1. Open the preview URL in Chrome.
2. Open DevTools → Application → Service Workers, confirm one is **activated**.
3. DevTools → Network tab → set throttling to **Offline** (or just turn off wifi).
4. Reload the page — the app shell should still load.
5. Navigate between pages, log a workout/water/calorie entry — it should all
   keep working and persist (it's writing to IndexedDB, not the network).
6. Go back online — the small "Back online" banner confirms reconnection.

You can also run a Lighthouse PWA audit (DevTools → Lighthouse → PWA category)
against the `preview` build to confirm installability + offline scores.

## Notes

- All workout, water, and calorie data is stored **locally in the browser** via
  IndexedDB — nothing is sent to a server, so data is private to that browser/device.
- The exercise library pulls from the public ExerciseDB API
  (`https://oss.exercisedb.dev`), so an internet connection is needed the
  *first* time you view a given exercise — after that, it's cached.
- Theme preference is remembered across visits using `localStorage`.

