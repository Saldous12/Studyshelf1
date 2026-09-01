#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// StudyShelf activity CLI
// ─────────────────────────────────────────────────────────────────────────
// Adds, removes, and lists entries in src/data/activities.js so you don't
// have to hand-edit the array (or copy files into place) yourself.
//
// USAGE
//
//   Interactive (just answer the prompts):
//     node scripts/add-activity.mjs
//
//   Non-interactive (all in one command):
//     node scripts/add-activity.mjs \
//       --title "Fireboy and Watergirl" \
//       --description "Co-op puzzle platformer." \
//       --tags "puzzle,platformer,coop" \
//       --source ./my-local-game/          (a folder OR a single .html file)
//       --thumbnail ./shot.png             (optional — a placeholder is made if omitted)
//       --featured                          (optional flag)
//
//   Remove an activity by id:
//     node scripts/add-activity.mjs --remove fireboy-and-watergirl
//
//   List everything currently registered:
//     node scripts/add-activity.mjs --list
//
// What it actually does, step by step:
//   1. Creates public/activities/<id>/ and copies your game files into it
//      (or writes a small starter index.html if you don't pass --source).
//   2. Copies your thumbnail into public/thumbnails/<id>.<ext>, or generates
//      a simple placeholder gradient thumbnail if you don't pass --thumbnail.
//   3. Inserts a matching entry into the ACTIVITIES array in
//      src/data/activities.js.
// You can still edit any of it by hand afterwards — this is just a shortcut.
// ─────────────────────────────────────────────────────────────────────────

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ACTIVITIES_FILE = path.join(ROOT, "src/data/activities.js");
const ACTIVITIES_DIR = path.join(ROOT, "public/activities");
const THUMBS_DIR = path.join(ROOT, "public/thumbnails");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true; // boolean flag, e.g. --featured
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

async function loadCurrentActivities() {
  // Bust the module cache with a cache-busting query so repeated CLI runs
  // in the same process (unlikely, but safe) always see the latest file.
  const mod = await import(`${pathToFileURL(ACTIVITIES_FILE).href}?t=${Date.now()}`);
  return mod.ACTIVITIES;
}

// Wraps the readline interface's async iterator (rather than calling
// rl.question() repeatedly) so answers piped in all at once — e.g. via a
// heredoc or `printf ... | node scripts/add-activity.mjs` — aren't lost.
// (Node's rl.question() only attaches its listener right when it's called,
// so lines that arrive before that get silently dropped; the async
// iterator instead pulls from a proper internal queue.)
function makeAsker(rl) {
  const lines = rl[Symbol.asyncIterator]();
  return async function ask(question, fallback = "") {
    process.stdout.write(question);
    const { value, done } = await lines.next();
    if (done) return fallback;
    const answer = value.trim();
    return answer || fallback;
  };
}

// ── Add ─────────────────────────────────────────────────────────────────

async function copySource(source, id) {
  const destDir = path.join(ACTIVITIES_DIR, id);
  await fs.mkdir(destDir, { recursive: true });

  if (!source) {
    await fs.writeFile(path.join(destDir, "index.html"), STARTER_HTML(id), "utf8");
    return { kind: "placeholder", destDir };
  }

  const resolved = path.resolve(process.cwd(), source);
  if (!existsSync(resolved)) {
    throw new Error(`--source path does not exist: ${resolved}`);
  }
  const stat = await fs.stat(resolved);

  if (stat.isDirectory()) {
    await fs.cp(resolved, destDir, { recursive: true });
    if (!existsSync(path.join(destDir, "index.html"))) {
      console.warn(
        `  ! Warning: no index.html found inside ${resolved} — make sure one exists so the activity can load.`
      );
    }
    return { kind: "folder", destDir };
  }

  // Single file — copy it in as index.html regardless of its original name.
  await fs.copyFile(resolved, path.join(destDir, "index.html"));
  return { kind: "file", destDir };
}

async function copyThumbnail(thumbnail, id, title) {
  await fs.mkdir(THUMBS_DIR, { recursive: true });

  if (!thumbnail) {
    const dest = path.join(THUMBS_DIR, `${id}.svg`);
    await fs.writeFile(dest, PLACEHOLDER_THUMBNAIL_SVG(title), "utf8");
    return `/thumbnails/${id}.svg`;
  }

  const resolved = path.resolve(process.cwd(), thumbnail);
  if (!existsSync(resolved)) {
    throw new Error(`--thumbnail path does not exist: ${resolved}`);
  }
  const ext = path.extname(resolved) || ".png";
  const dest = path.join(THUMBS_DIR, `${id}${ext}`);
  await fs.copyFile(resolved, dest);
  return `/thumbnails/${id}${ext}`;
}

function formatEntry({ id, title, description, thumbnail, url, tags, featured }) {
  const tagList = tags.length ? tags.map((t) => JSON.stringify(t)).join(", ") : "";
  const today = new Date().toISOString().slice(0, 10);
  return [
    `  {`,
    `    id: ${JSON.stringify(id)},`,
    `    title: ${JSON.stringify(title)},`,
    `    description: ${JSON.stringify(description)},`,
    `    thumbnail: ${JSON.stringify(thumbnail)},`,
    `    url: ${JSON.stringify(url)},`,
    `    tags: [${tagList}],`,
    `    featured: ${featured ? "true" : "false"},`,
    `    dateAdded: ${JSON.stringify(today)},`,
    `  },`,
  ].join("\n");
}

async function insertEntry(entryText) {
  const source = await fs.readFile(ACTIVITIES_FILE, "utf8");
  const marker = "export const ACTIVITIES = [";
  const startIdx = source.indexOf(marker);
  if (startIdx === -1) {
    throw new Error(`Couldn't find "${marker}" in ${ACTIVITIES_FILE} — has the file been renamed?`);
  }
  // Find the matching closing "];" by counting bracket depth from the "["
  // right after the marker, so this works no matter what's already inside.
  const bracketOpenIdx = startIdx + marker.length - 1; // index of "["
  let depth = 0;
  let closeIdx = -1;
  for (let i = bracketOpenIdx; i < source.length; i++) {
    if (source[i] === "[") depth++;
    else if (source[i] === "]") {
      depth--;
      if (depth === 0) {
        closeIdx = i;
        break;
      }
    }
  }
  if (closeIdx === -1) {
    throw new Error(`Couldn't find the closing "]" for ACTIVITIES in ${ACTIVITIES_FILE}.`);
  }

  const before = source.slice(0, closeIdx);
  const after = source.slice(closeIdx);
  const needsNewline = !before.endsWith("\n");
  const updated = `${before}${needsNewline ? "\n" : ""}${entryText}\n${after}`;
  await fs.writeFile(ACTIVITIES_FILE, updated, "utf8");
}

async function runAdd(args) {
  const nonInteractive = Boolean(args.title);
  let title, description, tagsInput, source, thumbnail, featured, id;

  if (nonInteractive) {
    title = args.title;
    description = args.description || "";
    tagsInput = args.tags || "";
    source = typeof args.source === "string" ? args.source : "";
    thumbnail = typeof args.thumbnail === "string" ? args.thumbnail : "";
    featured = Boolean(args.featured);
    id = args.id ? slugify(args.id) : slugify(title);
  } else {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = makeAsker(rl);
    console.log("Add a new activity — press Enter to skip any optional field.\n");
    title = await ask("Title: ");
    while (!title) title = await ask("Title (required): ");
    const suggestedId = slugify(title);
    id = slugify((await ask(`ID [${suggestedId}]: `, suggestedId)) || suggestedId);
    description = await ask("Description: ");
    tagsInput = await ask("Tags (comma-separated): ");
    source = await ask("Path to game file or folder (blank = starter placeholder): ");
    thumbnail = await ask("Path to thumbnail image (blank = auto-generated): ");
    const featuredAnswer = await ask("Feature on the home page? (y/N): ", "n");
    featured = /^y(es)?$/i.test(featuredAnswer);
    rl.close();
  }

  if (!title) throw new Error("A title is required.");
  if (!id) throw new Error("Could not derive a valid id from that title — pass --id explicitly.");

  const existing = await loadCurrentActivities();
  if (existing.some((a) => a.id === id)) {
    throw new Error(
      `An activity with id "${id}" already exists. Pick a different --id, or remove it first with --remove ${id}.`
    );
  }

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  console.log(`\nCreating "${title}" (${id})…`);
  const { destDir } = await copySource(source, id);
  console.log(`  ✓ Activity files → ${path.relative(ROOT, destDir)}/`);

  const thumbnailPath = await copyThumbnail(thumbnail, id, title);
  console.log(`  ✓ Thumbnail       → public${thumbnailPath}`);

  const entry = formatEntry({
    id,
    title,
    description,
    thumbnail: thumbnailPath,
    url: `/activities/${id}/index.html`,
    tags,
    featured,
  });
  await insertEntry(entry);
  console.log(`  ✓ Registered in   → src/data/activities.js`);

  console.log(`\nDone. Run "npm run dev" (if it's not already running) and open /activity/${id}.`);
  if (!source) {
    console.log(
      `Note: ${path.relative(ROOT, destDir)}/index.html is just a placeholder — replace it with your real game's files whenever you're ready.`
    );
  }
}

// ── Remove ──────────────────────────────────────────────────────────────

async function runRemove(id) {
  const source = await fs.readFile(ACTIVITIES_FILE, "utf8");
  const marker = "export const ACTIVITIES = [";
  const startIdx = source.indexOf(marker);
  if (startIdx === -1) throw new Error(`Couldn't find "${marker}" in ${ACTIVITIES_FILE}.`);

  const idNeedle = `id: ${JSON.stringify(id)},`;
  const idIdx = source.indexOf(idNeedle, startIdx);
  if (idIdx === -1) {
    throw new Error(`No activity with id "${id}" found in ${ACTIVITIES_FILE}.`);
  }

  // Walk backward to this entry's opening "{" and forward to its matching "}".
  let entryStart = source.lastIndexOf("{", idIdx);
  let depth = 1;
  let entryEnd = -1;
  for (let i = entryStart + 1; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        entryEnd = i + 1;
        break;
      }
    }
  }
  if (entryEnd === -1) throw new Error(`Couldn't find the end of the "${id}" entry — file may be malformed.`);

  // Consume a trailing comma/newline so we don't leave a blank line behind.
  let sliceEnd = entryEnd;
  if (source[sliceEnd] === ",") sliceEnd++;
  if (source[sliceEnd] === "\n") sliceEnd++;
  // Consume the line's leading whitespace too.
  let sliceStart = entryStart;
  while (sliceStart > 0 && /[ \t]/.test(source[sliceStart - 1])) sliceStart--;

  const updated = source.slice(0, sliceStart) + source.slice(sliceEnd);
  await fs.writeFile(ACTIVITIES_FILE, updated, "utf8");
  console.log(`✓ Removed "${id}" from src/data/activities.js`);

  const folder = path.join(ACTIVITIES_DIR, id);
  if (existsSync(folder)) {
    await fs.rm(folder, { recursive: true, force: true });
    console.log(`✓ Deleted public/activities/${id}/`);
  }

  if (existsSync(THUMBS_DIR)) {
    const files = await fs.readdir(THUMBS_DIR);
    const matches = files.filter((f) => path.parse(f).name === id);
    for (const f of matches) {
      await fs.rm(path.join(THUMBS_DIR, f));
      console.log(`✓ Deleted public/thumbnails/${f}`);
    }
  }

  console.log(`\nDone.`);
}

// ── List ────────────────────────────────────────────────────────────────

async function runList() {
  const activities = await loadCurrentActivities();
  if (activities.length === 0) {
    console.log("No activities registered yet. Add one with: node scripts/add-activity.mjs");
    return;
  }
  console.log(`${activities.length} activit${activities.length === 1 ? "y" : "ies"}:\n`);
  for (const a of activities) {
    const featuredTag = a.featured ? " ★ featured" : "";
    console.log(`  ${a.id}${featuredTag}`);
    console.log(`    ${a.title} — ${a.tags?.join(", ") || "no tags"}`);
  }
}

// ── Templates ───────────────────────────────────────────────────────────

function STARTER_HTML(id) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${id}</title>
<style>
  :root { color-scheme: dark; }
  html, body { height: 100%; margin: 0; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    background: #0a0a0f;
    color: #f4f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }
  h1 { font-size: 1.25rem; margin-bottom: 8px; }
  p { color: #9ca0b3; font-size: 0.9rem; max-width: 360px; }
  code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 6px; }
</style>
</head>
<body>
  <div>
    <h1>${id}</h1>
    <p>This is a placeholder. Replace this file at
      <code>public/activities/${id}/index.html</code> with your actual game.</p>
  </div>
</body>
</html>
`;
}

function PLACEHOLDER_THUMBNAIL_SVG(title) {
  const palettes = [
    ["#4f68fb", "#06b6d4"],
    ["#8b5cf6", "#ec4899"],
    ["#f59e0b", "#ef4444"],
    ["#10b981", "#0ea5e9"],
    ["#f43f5e", "#f97316"],
  ];
  const [from, to] = palettes[Math.abs(hashCode(title)) % palettes.length];
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect width="800" height="500" fill="black" opacity="0.15"/>
  <text x="400" y="270" font-size="120" font-weight="800" text-anchor="middle"
    fill="rgba(255,255,255,0.5)" font-family="ui-sans-serif,system-ui">${escapeXml(initials)}</text>
  <rect x="0" y="380" width="800" height="120" fill="black" opacity="0.3"/>
  <text x="40" y="450" font-size="34" font-weight="700" fill="white"
    font-family="ui-sans-serif,system-ui">${escapeXml(title)}</text>
</svg>
`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Entry point ─────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  try {
    if (args.list) {
      await runList();
    } else if (args.remove) {
      await runRemove(typeof args.remove === "string" ? args.remove : args._[0]);
    } else if (args.help || args.h) {
      console.log(
        `Usage:\n  node scripts/add-activity.mjs                 interactive add\n  node scripts/add-activity.mjs --title "..."   non-interactive add\n  node scripts/add-activity.mjs --remove <id>    remove an activity\n  node scripts/add-activity.mjs --list           list all activities`
      );
    } else {
      await runAdd(args);
    }
  } catch (err) {
    console.error(`\n✗ ${err.message}`);
    process.exitCode = 1;
  }
}

main();
