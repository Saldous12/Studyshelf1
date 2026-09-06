"use strict";

async function registerSW() {
  if (!navigator.serviceWorker) {
    throw new Error("Service workers are not supported in this browser.");
  }

  const oldScope = new URL("/uv/", location.origin).href;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) => registration.scope === oldScope)
      .map((registration) => registration.unregister())
  );
  await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;
}