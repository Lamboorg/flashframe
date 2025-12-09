const CACHE_NAME = 'flashframe-v16';

// Install - skip waiting immediately
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Activate - clear ALL old caches and take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete ALL caches to force fresh content
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch - ALWAYS go to network first, never serve stale cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        // Only use cache if completely offline
        return caches.match(event.request);
      })
  );
});

// Listen for messages to force update
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
