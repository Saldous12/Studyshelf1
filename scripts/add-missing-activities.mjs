import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const activityFile = path.join(root, 'src/data/activities.js');
const activitiesDir = path.join(root, 'public/activities');

const source = fs.readFileSync(activityFile, 'utf8');
const currentIds = [...source.matchAll(/id:\s*["']([^"']+)["']/g)].map((match) => match[1]);

const folders = fs
  .readdirSync(activitiesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(activitiesDir, name, 'index.html')))
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

const missing = folders.filter((name) => !currentIds.includes(name));

function titleFromId(id) {
  const spaced = id.replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  const parts = spaced.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Game';
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

if (missing.length === 0) {
  console.log('No missing activities to add.');
  process.exit(0);
}

const entryBlock = missing
  .map((id) => {
    const title = titleFromId(id);
    return [
      '  {',
      `    id: ${JSON.stringify(id)},`,
      `    title: ${JSON.stringify(title)},`,
      `    description: ${JSON.stringify(`Play ${title} in the browser.`)},`,
      '    thumbnail: "/thumbnails/placeholder-game.svg",',
      `    url: ${JSON.stringify(`/activities/${id}/index.html`)},`,
      '    tags: ["arcade", "browser", "fun"],',
      '    featured: false,',
      '    dateAdded: "2026-08-30",',
      '  },',
    ].join('\n');
  })
  .join('\n');

const lastClosingIndex = source.lastIndexOf('];');
if (lastClosingIndex === -1) {
  throw new Error('Could not find closing ACTIVITIES array in src/data/activities.js');
}

const updated = source.slice(0, lastClosingIndex) + '\n' + entryBlock + '\n' + source.slice(lastClosingIndex);
fs.writeFileSync(activityFile, updated, 'utf8');

console.log(`Added ${missing.length} activities to src/data/activities.js`);
console.log(missing.slice(0, 15).join(', '));
