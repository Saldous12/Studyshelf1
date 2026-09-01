import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const activitiesDir = path.join(root, 'public/activities');
const thumbnailsDir = path.join(root, 'public/thumbnails');
const outputFile = path.join(root, 'src/data/activities.js');

const normalize = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^\d+/, '');

const humanize = (value) => {
  const raw = String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  if (!raw) return 'Game';
  return raw
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const baseMap = new Map();
for (const entry of fs.readdirSync(thumbnailsDir, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const fileName = entry.name;
  const ext = path.extname(fileName).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) continue;
  const base = path.basename(fileName, ext);
  baseMap.set(normalize(base), fileName);
}

const aliasMap = {
  '1on1soccer': '1on1soccer.png',
  '1v1lol': '1v1lol.png',
  'basketballstars': 'Basketball.png',
  'basketball-stars': 'Basketball.png',
  'bitlife': 'bitlife.png',
  'drivemad': 'drive-mad.png',
  'drive-mad': 'drive-mad.png',
  'escape-rush': 'escape-road.png',
  'fnaf': 'Fnaf.png',
  'fnaf2': 'fnaf2.png',
  'fnaf3': 'Fnaf3.png',
  'fnaf4': 'Fnaf4.png',
  'fruitninja': 'fruitninja.png',
  'geometrydash': 'geometrydash.png',
  'gdlite': 'gdlite.png',
  'retrobowl': 'retrobowl.png',
  'retrobowlcollege': 'RetroBowlCollege.png',
  'rocketleague': 'rocketleague.png',
  'slope': 'slope.png',
  'slope2': 'slope2.png',
  'stack': 'stack.png',
  'stickhook': 'stickman-hook.png',
  'stickmanhook': 'stickman-hook.png',
  'subwaysurfer': 'Subway.png',
  'speedstars': 'speed-stars.png',
  'speed-stars': 'speed-stars.png',
  'speedstars2': 'speed-stars.png',
};

const resolveThumbnail = (id) => {
  const byId = aliasMap[normalize(id)] ?? aliasMap[id];
  if (byId) return `/thumbnails/${byId}`;

  const normalized = normalize(id);
  if (baseMap.has(normalized)) return `/thumbnails/${baseMap.get(normalized)}`;

  return '/thumbnails/placeholder-game.svg';
};

const folders = fs
  .readdirSync(activitiesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(activitiesDir, name, 'index.html')))
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

const entries = folders.map((id) => {
  const title = humanize(id);
  const description = `Play ${title} in the browser.`;
  const thumbnail = resolveThumbnail(id);

  return [
    '  {',
    `    id: ${JSON.stringify(id)},`,
    `    title: ${JSON.stringify(title)},`,
    `    description: ${JSON.stringify(description)},`,
    `    thumbnail: ${JSON.stringify(thumbnail)},`,
    `    url: ${JSON.stringify(`/activities/${id}/index.html`)},`,
    '    tags: ["arcade", "browser", "fun"],',
    '    featured: false,',
    '    dateAdded: "2026-08-30",',
    '  },',
  ].join('\n');
});

const source = fs.readFileSync(outputFile, 'utf8');
const start = source.indexOf('export const ACTIVITIES = [');
const end = source.lastIndexOf('];');
if (start === -1 || end === -1) {
  throw new Error('Could not locate ACTIVITIES array in src/data/activities.js');
}

const keep = source.slice(0, start + 'export const ACTIVITIES = ['.length);
const tail = source.slice(end + 2);
const output = `${keep}\n${entries.join('\n')}\n];\n${tail}`;
fs.writeFileSync(outputFile, output, 'utf8');

console.log(`Generated ${entries.length} activity entries from public/activities.`);
console.log(`Placeholders used: ${entries.filter((entry) => entry.includes('/thumbnails/placeholder-game.svg')).length}`);
