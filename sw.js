const CACHE_NAME = 'prayer-times-cache-v1';
const API_CACHE_NAME = 'prayer-times-api-cache-v1';
const FONT_CACHE_NAME = 'prayer-times-font-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
];

// Define hosts for different caching strategies
const API_HOSTS = [
    'api.aladhan.com',
    'api.alquran.cloud',
    'api.bigdatacloud.net'
];
const FONT_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // API requests: Network first, then cache for offline fallback
  if (API_HOSTS.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request);
          // Cache the new response for offline availability
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // Network failed, try to serve from cache
          console.log('Network request failed, trying cache.', error);
          return await cache.match(event.request);
        }
      })
    );
    return;
  }
  
  // Font requests: Cache first, then network
  if (FONT_HOSTS.includes(requestUrl.hostname)) {
     event.respondWith(
        caches.open(FONT_CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            const networkResponse = await fetch(event.request);
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
        })
     );
     return;
  }

  // Static assets: Cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
            (networkResponse) => {
                 // Optionally cache new assets on the fly
                return networkResponse;
            }
        );
      })
  );
});