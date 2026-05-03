const CACHE_NAME = "trailkeeper-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/icon.svg"];
const isAppShellRequest = request => {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return APP_SHELL.includes(url.pathname) || url.pathname.startsWith("/assets/");
};

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (!isAppShellRequest(event.request)) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
