// Thin, safe wrapper around localStorage with same-tab reactivity.
// Every StudyShelf key lives under the "studyshelf:" namespace so the whole
// app's local data is easy to find, inspect, and wipe from devtools.

const PREFIX = "studyshelf:";

function eventName(key) {
  return `studyshelf:storage:${key}`;
}

export function storageKey(name) {
  return `${PREFIX}${name}`;
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
    // Notify listeners in this same tab (native `storage` events only fire
    // in *other* tabs), so every hook instance stays in sync instantly.
    window.dispatchEvent(new CustomEvent(eventName(key), { detail: value }));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(storageKey(key));
    window.dispatchEvent(new CustomEvent(eventName(key), { detail: undefined }));
    return true;
  } catch {
    return false;
  }
}

export function subscribe(key, callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener(eventName(key), handler);
  return () => window.removeEventListener(eventName(key), handler);
}

// Wipe every studyshelf:* key. Used by "Reset all local data".
export function clearAllStudyShelfData() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
  keys.forEach((k) => {
    const short = k.slice(PREFIX.length);
    window.dispatchEvent(new CustomEvent(eventName(short), { detail: undefined }));
  });
}
