// ─── MathSci Stars Service Worker ────────────────────────────────
// Version bump this string whenever you deploy a new release
const CACHE_VERSION = 'mathsci-stars-v1.0.0';

const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const LESSON_CACHE  = `${CACHE_VERSION}-lessons`;

// Files to cache immediately on install (app shell)
const APP_SHELL = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Google Fonts (pre-cache for offline)
  'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap',
];

// API endpoints — never cache, always network-first
const NETWORK_ONLY = [
  'https://api.anthropic.com',   // StarBot AI calls
  'https://api.stripe.com',      // Payments
  'https://api.elevenlabs.io',   // TTS audio
];

// ── Install: cache the app shell ──────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing MathSci Stars PWA...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching app shell');
        // Add individually so one failure doesn't break everything
        return Promise.allSettled(
          APP_SHELL.map(url => cache.add(url).catch(err => 
            console.warn('[SW] Failed to cache:', url, err)
          ))
        );
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating new service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('mathsci-stars-') && 
                         !name.startsWith(CACHE_VERSION))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim()) // Take control of all open pages
  );
});

// ── Fetch: smart caching strategy ────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NETWORK ONLY — AI/payment APIs, never cache
  if (NETWORK_ONLY.some(api => request.url.startsWith(api))) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. CACHE FIRST — static assets (JS, CSS, fonts, icons)
  if (
    url.pathname.startsWith('/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // 3. STALE-WHILE-REVALIDATE — lesson content, curriculum data
  if (url.pathname.startsWith('/lessons/') || url.pathname.startsWith('/content/')) {
    event.respondWith(
      caches.open(LESSON_CACHE).then(cache => {
        return cache.match(request).then(cached => {
          const networkFetch = fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          });
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // 4. NETWORK FIRST with cache fallback — HTML pages, API data
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful GET responses
        if (request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // If HTML request fails offline, serve app shell
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          // Offline JSON fallback for API calls
          if (request.headers.get('accept')?.includes('application/json')) {
            return new Response(
              JSON.stringify({ offline: true, message: 'You are offline. Please reconnect to continue.' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          }
        });
      })
  );
});

// ── Push Notifications ────────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body || "Time to earn some Star Coins! ⭐",
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: { 
      url: data.url || '/',
      notificationId: data.id 
    },
    actions: [
      { action: 'open',    title: '🚀 Let\'s go!',    icon: '/icons/action-go.png' },
      { action: 'dismiss', title: '⏰ Later',          icon: '/icons/action-later.png' },
    ],
    requireInteraction: false,
    silent: false,
    tag: data.tag || 'mathsci-general', // Replaces previous notification with same tag
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'MathSci Stars 🌟',
      options
    )
  );
});

// ── Notification click handler ────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.postMessage({ type: 'NAVIGATE', url: targetUrl });
            return;
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ── Background Sync — retry failed API calls when back online ─────
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgressData());
  }
  if (event.tag === 'sync-coins') {
    event.waitUntil(syncCoinTransactions());
  }
});

async function syncProgressData() {
  // In production: read from IndexedDB, POST to your backend
  console.log('[SW] Syncing offline progress data...');
}

async function syncCoinTransactions() {
  // In production: retry any failed coin award API calls
  console.log('[SW] Syncing coin transactions...');
}

// ── Message handler — communicate with the React app ─────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CACHE_LESSON') {
    // Pre-cache a specific lesson on demand
    caches.open(LESSON_CACHE).then(cache => {
      cache.add(event.data.url);
    });
  }
});
