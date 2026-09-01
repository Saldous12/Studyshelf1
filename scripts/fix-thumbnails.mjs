import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const activitiesPath = path.join(root, 'src/data/activities.js');
const thumbsDir = path.join(root, 'public/thumbnails');

const aliasMap = {
  '1on1soccer': '1on1soccer.png',
  '1v1lol': '1v1lol.png',
  'basketball-stars': 'Basketball.png',
  'bitlife': 'bitlife.png',
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
  'Rocketleague': 'rocketleague.png',
  'slope': 'slope.png',
  'slope2': 'slope2.png',
  'stack': 'stack.png',
  'StickHook': 'stickman-hook.png',
  'stickhook': 'stickman-hook.png',
  'subwaysurfer': 'Subway.png',
  'speed-stars': 'speed-stars.png',
  'speedstars': 'speed-stars.png',
};

const text = fs.readFileSync(activitiesPath, 'utf8');
let patternCount = 0;
let updated = text;

for (const [id, filename] of Object.entries(aliasMap)) {
  const target = `/thumbnails/${filename}`;
  const regex = new RegExp(
    `(id:\\s*[\\"\\']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\"\\'][\\s\\S]*?thumbnail:\\s*[\\"\\'])(/thumbnails/[^\\"\\']+|/thumbnails/placeholder-game\\.svg)([\\"\\'])`,
    'm'
  );

  const next = updated.replace(regex, `$1${target}$3`);
  if (next !== updated) {
    patternCount += 1;
    updated = next;
  }
}

fs.writeFileSync(activitiesPath, updated, 'utf8');
console.log(`Updated ${patternCount} activity thumbnail entries.`);
console.log('Checked aliases:', Object.keys(aliasMap).length);
