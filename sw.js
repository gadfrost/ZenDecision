const CACHE_NAME = 'zendecision-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  // Fichiers audio - Nature
  './assets/sounds/rain.mp3',
  './assets/sounds/wind.mp3',
  './assets/sounds/forest.mp3',
  './assets/sounds/birds.mp3',
  './assets/sounds/thunder.mp3',
  './assets/sounds/waves.mp3',
  './assets/sounds/stream.mp3',
  // Fichiers audio - Ambiance
  './assets/sounds/cafe.mp3',
  './assets/sounds/library.mp3',
  './assets/sounds/office.mp3',
  './assets/sounds/restaurant.mp3',
  './assets/sounds/fireplace.mp3',
  './assets/sounds/market.mp3',
  // Fichiers audio - Urbain
  './assets/sounds/city.mp3',
  './assets/sounds/traffic.mp3',
  './assets/sounds/rain-city.mp3',
  './assets/sounds/metro.mp3',
  './assets/sounds/station.mp3',
  // Fichiers audio - Relaxation
  './assets/sounds/meditation.mp3',
  './assets/sounds/spa.mp3',
  './assets/sounds/tibetan.mp3',
  './assets/sounds/singing-bowl.mp3',
  './assets/sounds/white-noise.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
