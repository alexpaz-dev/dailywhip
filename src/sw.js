// Service worker template. The build fills in the version and the file list
// (see vite.config.ts). Cache-first, so the app opens without a connection;
// each deploy changes the version and replaces the old cache.
// The prototype shares the origin with the app at /dailywhip/, so it only
// reads and deletes the caches under its own prefix.

const PREFIX = 'dailywhip-prototype-';
const CACHE = `${PREFIX}__VERSION__`;
const PRECACHE = /* __PRECACHE__ */ [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE))
      .then((old) => Promise.all(old.map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches
      .open(CACHE)
      .then((cache) => cache.match(event.request))
      .then((cached) => cached ?? fetch(event.request)),
  );
});
