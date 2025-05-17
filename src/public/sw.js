const CACHE_NAME = 'story-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.css',  
  '/app.bundle.js',  
  '/favicon.png',
  '/images/logo.png',    
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log(`Cached: ${url}`);
        } catch (err) {
          console.error(`Gagal cache: ${url}`, err);
        }
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Menggunakan NetworkFirst untuk API Stories
  if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/v1/stories')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch (error) {
          const cachedResponse = await cache.match(event.request);
          return cachedResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })
    );
    return;
  }

  // Cache First untuk file statis
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (!cacheWhitelist.includes(name)) {
          return caches.delete(name);
        }
      }))
    )
  );
});

// Push notification event
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

  sendPushSubscriptionToBackend(event);

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});

async function sendPushSubscriptionToBackend(event) {
  const subscription = await self.registration.pushManager.getSubscription();
  if (!subscription) return;

  const token = localStorage.getItem('auth_token');
  if (!token) return;

  const subscriptionPayload = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
    }
  };

  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(subscriptionPayload),
  });

  const result = await response.json();
  console.log('Push Subscription Sent:', result);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return btoa(binary);
}
