const CACHE_NAME = 'story-app-cache-v1';
const urlsToCache = [
  '/', '/index.html', '/manifest.json', '/app.css',
  '/app.bundle.js', '/favicon.png', '/images/logo.png',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('activate', (e) => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin === location.origin && url.pathname.startsWith('/v1/stories')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          const res = await fetch(event.request);
          cache.put(event.request, res.clone());
          return res;
        } catch {
          return cache.match(event.request) || new Response('Offline', { status: 503 });
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'Story Baru!',
    options: {
      body: 'Ada story baru yang dibuat.',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
    },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});
