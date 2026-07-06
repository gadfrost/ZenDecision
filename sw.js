const CACHE_NAME = 'zendecision-v3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  // Fichiers audio - Sommeil
  './assets/sounds/pink_noise.mp3',
  './assets/sounds/brown_noise.mp3',
  './assets/sounds/rain_ambient.mp3',
  './assets/sounds/ocean_waves_night.mp3',
  // Fichiers audio - Étude
  './assets/sounds/lofi_study.mp3',
  './assets/sounds/forest_calm.mp3',
  './assets/sounds/rain_window.mp3',
  // Fichiers audio - Joie
  './assets/sounds/morning_birds.mp3',
  './assets/sounds/forest_spring.mp3',
  // Fichiers audio - Promenade
  './assets/sounds/ocean_waves.mp3',
  './assets/sounds/forest_walk.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((error) => {
        console.error('Cache installation failed:', error);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Pour les fichiers audio, utiliser une stratégie network-first
  if (event.request.url.includes('/assets/sounds/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mettre en cache la réponse
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Utiliser la version en cache si disponible
          return caches.match(event.request);
        })
    );
  } else {
    // Pour les autres ressources, utiliser cache-first
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
