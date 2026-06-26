import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "autoUpdate" fetches a new service worker in the background and
      // activates it on the next load — no manual "update available" prompt to wire up.
      registerType: "autoUpdate",

      // Regenerate the service worker on `npm run dev` too, so offline behavior
      // can be tested locally and not only after a production build.
      devOptions: {
        enabled: true,
        type: "module",
      },

      manifest: {
        name: "Pulseon — Fitness Tracker",
        short_name: "Pulseon",
        description:
          "Track workouts, hydration, calories and progress — works fully offline.",
        theme_color: "#0e1414",
        background_color: "#0e1414",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },

      workbox: {
        // Precache the built app shell: index.html, JS/CSS bundles, fonts, icons.
        // This is what makes the UI itself load with zero network requests.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],

        // SPA fallback: any navigation that isn't a precached file (e.g. a deep
        // link straight to /workout while offline) still resolves to index.html,
        // and React Router takes over from there.
        navigateFallback: "/index.html",

        runtimeCaching: [
          {
            // ExerciseDB API — exercise list/search/detail JSON.
            // cache-first: an exercise you've already opened stays viewable
            // offline. A brand-new search while offline will still fail (there's
            // no data that was never fetched) — that's correct, honest behavior,
            // and the UI surfaces it via the offline banner instead of hanging.
            urlPattern: ({ url }) => url.hostname === "oss.exercisedb.dev",
            handler: "CacheFirst",
            options: {
              cacheName: "exercisedb-api-cache",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Exercise GIF/media assets.
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "exercise-media-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheet + font files.
            urlPattern: ({ url }) =>
              url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
