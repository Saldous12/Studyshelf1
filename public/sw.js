importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
let scramjet = new ScramjetServiceWorker();

async function loadScramjetConfig() {
  try {
    await scramjet.loadConfig();
  } catch {
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("$scramjet");
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
    scramjet = new ScramjetServiceWorker();
    await scramjet.loadConfig();
  }
}

async function handleRequest(event) {
  if (!new URL(event.request.url).pathname.startsWith("/scramjet/")) {
    return fetch(event.request);
  }
  await loadScramjetConfig();
  if (!scramjet.route(event)) return fetch(event.request);
  return scramjet.fetch(event);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event).catch(() => {
    if (new URL(event.request.url).pathname.startsWith("/scramjet/")) {
      return new Response("The proxy could not load this page.", { status: 502, headers: { "Content-Type": "text/plain" } });
    }
    return fetch(event.request);
  }));
});
