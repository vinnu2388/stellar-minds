// ═══════════════════════════════════════════════════════════
// LETZKOOL SERVICE WORKER — Offline-first PWA
// Caches all app assets so kids can learn without internet
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'letzkool-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/letzkool-logo.png',
  '/manifest.json',
];

// ── Install: cache all static assets ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[LetzSkool SW] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[LetzSkool SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API, cache-first for assets ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests (like Anthropic API)
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // For HTML — network first, fallback to cache (ensures fresh app)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For JS/CSS/images — cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

// ── Background sync for offline progress saving ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    console.log('[LetzSkool SW] Syncing progress data...');
  }
});

// ── Push notifications (for streak reminders) ──
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'LetzSkool';
  const options = {
    body: data.body || "Don't forget to keep your streak going! 🔥",
    icon: '/letzkool-logo.png',
    badge: '/letzkool-logo.png',
    tag: 'letzkool-reminder',
    renotify: true,
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
