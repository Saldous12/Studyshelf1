// ─────────────────────────────────────────────────────────────────────────
// StudyShelf activity library
// ─────────────────────────────────────────────────────────────────────────
// This is the ONE file you edit to add an activity to the app. There is no
// build step, no registry, and nothing else to touch — search, Home,
// Discover, Recent, and Favorites all read from this single array.
//
// HOW TO ADD A NEW ACTIVITY
//
//  1. Build (or drop in) your activity as a self-contained folder here:
//
//         public/activities/<your-id>/index.html
//
//     It can be a single HTML file, or a small bundle of HTML/CSS/JS/images
//     — just keep every reference inside that folder relative, since the
//     whole thing is served as static files and loaded in an <iframe>.
//
//  2. Add a thumbnail image here:
//
//         public/thumbnails/<your-id>.png
//
//     (SVG, JPG, and WebP all work too. Roughly a 16:10 aspect ratio looks
//     best, but it's not required.)
//
//  3. Copy the template below into the ACTIVITIES array and fill it in:
//
//     {
//       id: "my-activity",                 // unique, kebab-case — must match the folder name
//       title: "My Activity",
//       description: "A short description.",
//       thumbnail: "/thumbnails/my-activity.png",
//       url: "/activities/my-activity/index.html",
//       tags: ["arcade", "classic"],        // used for search + "More Like This"
//       featured: false,                    // true = show in the Featured row
//       dateAdded: "2026-08-28",            // ISO date ("YYYY-MM-DD") — drives "New" + "Recently Added" sorting
//     }
//
// That's the whole format. There is no "category" field — organize and find
// activities with `tags` instead (as many as you like, in any order).
//
// HOW TO REMOVE AN ACTIVITY
//   Delete its entry from the array below, then delete its folder from
//   public/activities/ and its thumbnail from public/thumbnails/. Any
//   favorites/recent/launch history saved for it in the browser is simply
//   ignored once the entry is gone.
//
// This app ships with ZERO activities by default — add your own below.
//
// Prefer not to hand-edit this file? Run the CLI instead — it does all
// three steps above for you (folder, thumbnail, and this entry):
//
//     npm run activity
//
// See scripts/add-activity.mjs for the full usage (non-interactive flags,
// --remove, --list).
// ─────────────────────────────────────────────────────────────────────────

export const ACTIVITIES = [

  {
    id: "1v1lol",
    title: "1v1lol",
    description: "Play 1v1lol in the browser.",
    thumbnail: "/thumbnails/1v1lol.png",
    url: "/activities/1v1lol/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: "basketball-stars",
    title: "Basketball Stars",
    description: "Play Basketball Stars in the browser.",
    thumbnail: "/thumbnails/Basketball.png",
    url: "/activities/basketball-stars/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  {
    id: "bitlife",
    title: "Bitlife",
    description: "Play Bitlife in the browser.",
    thumbnail: "/thumbnails/bitlife.png",
    url: "/activities/bitlife/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: "drive-mad",
    title: "Drive Mad",
    description: "Play Drive Mad in the browser.",
    thumbnail: "/thumbnails/drive-mad.png",
    url: "/activities/drive-mad/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "drivemad",
    title: "Drivemad",
    description: "Play Drivemad in the browser.",
    thumbnail: "/thumbnails/drive-mad.png",
    url: "/activities/drivemad/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  {
    id: "escape-rush",
    title: "Escape Rush",
    description: "Play Escape Rush in the browser.",
    thumbnail: "/thumbnails/escape-road.png",
    url: "/activities/escape-rush/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: "fnaf",
    title: "Fnaf",
    description: "Play Fnaf in the browser.",
    thumbnail: "/thumbnails/Fnaf.png",
    url: "/activities/fnaf/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "fnaf2",
    title: "Fnaf2",
    description: "Play Fnaf2 in the browser.",
    thumbnail: "/thumbnails/fnaf2.png",
    url: "/activities/fnaf2/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "fnaf3",
    title: "Fnaf3",
    description: "Play Fnaf3 in the browser.",
    thumbnail: "/thumbnails/Fnaf3.png",
    url: "/activities/fnaf3/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "fnaf4",
    title: "Fnaf4",
    description: "Play Fnaf4 in the browser.",
    thumbnail: "/thumbnails/Fnaf4.png",
    url: "/activities/fnaf4/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  {
    id: "fruitninja",
    title: "Fruitninja",
    description: "Play Fruitninja in the browser.",
    thumbnail: "/thumbnails/fruitninja.png",
    url: "/activities/fruitninja/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  {
    id: "gdlite",
    title: "Gdlite",
    description: "Play Gdlite in the browser.",
    thumbnail: "/thumbnails/gdlite.png",
    url: "/activities/gdlite/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "geometrydash",
    title: "Geometrydash",
    description: "Play Geometrydash in the browser.",
    thumbnail: "/thumbnails/geometrydash.png",
    url: "/activities/geometrydash/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: "retrobowl",
    title: "Retrobowl",
    description: "Play Retrobowl in the browser.",
    thumbnail: "/thumbnails/retrobowl.png",
    url: "/activities/retrobowl/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "retrobowlcollege",
    title: "Retrobowlcollege",
    description: "Play Retrobowlcollege in the browser.",
    thumbnail: "/thumbnails/RetroBowlCollege.png",
    url: "/activities/retrobowlcollege/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  {
    id: "rocketleague",
    title: "Rocketleague",
    description: "Play Rocketleague in the browser.",
    thumbnail: "/thumbnails/rocketleague.png",
    url: "/activities/rocketleague/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: "slope",
    title: "Slope",
    description: "Play Slope in the browser.",
    thumbnail: "/thumbnails/slope.png",
    url: "/activities/slope/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  {
    id: "slope2",
    title: "Slope2",
    description: "Play Slope2 in the browser.",
    thumbnail: "/thumbnails/slope2.png",
    url: "/activities/slope2/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  
  {
    id: "Speed-Stars",
    title: "Speed Stars",
    description: "Play Speed Stars in the browser.",
    thumbnail: "/thumbnails/speed-stars.png",
    url: "/activities/Speed-Stars/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  {
    id: "stack",
    title: "Stack",
    description: "Play Stack in the browser.",
    thumbnail: "/thumbnails/stack.png",
    url: "/activities/stack/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  {
    id: "StickHook",
    title: "Stick Hook",
    description: "Play Stick Hook in the browser.",
    thumbnail: "/thumbnails/stickman-hook.png",
    url: "/activities/StickHook/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  {
    id: "stickman-hook",
    title: "Stickman Hook",
    description: "Play Stickman Hook in the browser.",
    thumbnail: "/thumbnails/stickman-hook.png",
    url: "/activities/stickman-hook/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  {
    id: "subwaysurfer",
    title: "Subwaysurfer",
    description: "Play Subwaysurfer in the browser.",
    thumbnail: "/thumbnails/Subway.png",
    url: "/activities/subwaysurfer/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  {
    id: "cookieclicker",
    title: "Cookie Clicker",
    description: "Play Cookie Clicker in the browser.",
    thumbnail: "/thumbnails/Cookie-Clicker.png",
    url: "/activities/cookieclicker/index.html",
    tags: ["arcade", "browser", "fun"],
    featured: false,
    dateAdded: "2026-08-30",
  },
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
];
