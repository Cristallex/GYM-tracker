const CACHE = "gymtracker-v27";
const ASSETS = ["./", "./index.html", "./style.css", "./app.js", "./manifest.webmanifest"];
const TIMEOUT_MS = 4000; // сколько ждём сеть, прежде чем отдать кэш

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

/* Network-first: сначала сеть, при таймауте/ошибке/редиректе на портал — кэш.
   Редирект ловим, чтобы кэшировать и показывать не страницу логина Wi-Fi. */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // чужие запросы не трогаем

  e.respondWith((async () => {
    const cached = caches.match(e.request);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(e.request, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok && !res.redirected) {
        caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      }
      // редирект (каптивный портал Wi-Fi) или ошибка сервера — отдаём кэш
      return (await cached) || res;
    } catch {
      clearTimeout(timer);
      return (await cached) || Response.error();
    }
  })());
});
