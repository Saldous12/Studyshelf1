# StudyShelf

A premium, dark-mode-first browser platform for launching your own self-hosted
browser activities — built with React, Vite, Tailwind CSS, and Lucide icons.
No backend, no auth, no categories, no admin panel — just a clean shelf you
populate with your own activities.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

The app ships with **zero activities** — that's intentional. Add your own
using the format below and everything (Home, Discover, Search, Favorites,
Recent) picks them up automatically.

## Project structure

```
studyshelf/
├─ public/
│  ├─ activities/          ← each activity's playable files live here
│  │  └─ my-activity/
│  │     └─ index.html
│  └─ thumbnails/          ← activity thumbnail images (png/svg/jpg/webp)
├─ src/
│  ├─ data/
│  │  └─ activities.js     ← ⭐ THE central activity list — edit this to add activities
│  ├─ hooks/                 useActivities, useFavorites, useRecentlyPlayed,
│  │                         useLaunchStats, useSettings, useSearchHistory, ...
│  ├─ context/                Toast + Confirm dialog providers
│  ├─ components/              cards, search, layout, sections, ui
│  ├─ pages/                   Home, Discover, Favorites, Recent,
│  │                           ActivityPage, Settings, NotFound
│  ├─ utils/                   activity search/sort/relate logic, localStorage
│  │                           wrapper, date formatting
│  ├─ App.jsx                  routes + global search/shortcuts modals
│  └─ index.css                design tokens, dark/light theme, animations
└─ scripts/
   └─ add-activity.mjs       ← CLI for adding/removing/listing activities
```

## How to add a new activity

The fastest way is the built-in CLI — it does all three steps below for you:

```bash
npm run activity
```

It'll ask for a title, description, tags, and (optionally) the path to your
game's file/folder and a thumbnail image — then it creates the folder, adds
the thumbnail, and registers the entry, all in one go. Skip the prompts and
do it in one line instead:

```bash
npm run activity -- --title "Snake Classic" --tags "arcade,classic" \
  --source ./my-game --thumbnail ./shot.png --featured
```

Leave off `--source`/`--thumbnail` and it fills in a placeholder page and a
generated thumbnail you can swap out later. Two other things it can do:

```bash
npm run activity -- --list             # see everything currently registered
npm run activity -- --remove my-game   # remove an activity (deletes its files too)
```

Prefer doing it by hand? That's exactly the same three steps, just manual:

1. **Add your activity's files.** Create a folder here:

   ```
   public/activities/my-activity/index.html
   ```

   It can be a single HTML file, or a small bundle of HTML/CSS/JS/images —
   just keep every reference inside that folder relative, since the whole
   thing is served as static files and loaded in an `<iframe>`.

2. **Add a thumbnail.** Drop an image here:

   ```
   public/thumbnails/my-activity.png
   ```

   SVG, JPG, and WebP work too. Roughly a 16:10 aspect ratio looks best.

3. **Register it in `src/data/activities.js`.** Add one entry to the
   `ACTIVITIES` array:

   ```js
   {
     id: "my-activity",                     // unique, kebab-case — matches the folder name
     title: "My Activity",
     description: "A short description",
     thumbnail: "/thumbnails/my-activity.png",
     url: "/activities/my-activity/index.html",
     tags: ["arcade", "classic"],           // used for search + "More Like This" — as many as you like
     featured: false,                       // true = show in the Featured row
     dateAdded: "2026-08-28",               // ISO date ("YYYY-MM-DD") — drives "New" + sorting
   }
   ```

That's the whole format — no `category` field, no registry, no build step.
This same format scales to hundreds of activities; just keep adding entries.

## How to remove an activity

Run `npm run activity -- --remove <id>` and it deletes the entry, the
folder, and the thumbnail together. By hand, it's the same three deletions:
its entry from the `ACTIVITIES` array in `src/data/activities.js`, its
folder from `public/activities/`, and its thumbnail from
`public/thumbnails/`. Any favorites/recent/launch history saved for it in
the browser is simply ignored once the entry is gone.

## What's stored where (all client-side, via `localStorage`)

Every key is namespaced under `studyshelf:` — open devtools → Application →
Local Storage to inspect or clear it by hand.

| Data | Key | Hook |
|---|---|---|
| Favorites | `studyshelf:favorites` | `useFavorites` |
| Recently played | `studyshelf:recent` | `useRecentlyPlayed` |
| Launch counts | `studyshelf:launches` | `useLaunchStats` |
| Settings | `studyshelf:settings` | `useSettings` |
| Search history | `studyshelf:searchHistory` | `useSearchHistory` |

**Settings → Data → "Reset all local data"** wipes every one of these keys
at once (with a confirmation dialog first).

## Search

Search matches on **title, description, and tags** — type, don't tag-hunt.
Open it with the `/` key, `Ctrl`/`Cmd + K`, or the search button in the nav.

## Notes on the tech

- **React 19 + Vite** for the app shell, **React Router 7** for routing
  (pages are lazy-loaded with `React.lazy`).
- **Tailwind CSS v4** via `@tailwindcss/vite` — there's no
  `tailwind.config.js`; theme tokens and the dark-mode variant live in
  `src/index.css`.
- **Lucide React** for icons.
- No backend, no auth, no external API calls. Everything works fully
  offline once built.
