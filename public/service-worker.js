const CACHE_NAME = 'waggle-pwa-v1';

const FILES_TO_CACHE = [
  '/offline.html',
  '/favicon.ico',
  '/stylesheets/offline.css',
  '/stylessheets/woff2/PretendardVariable.woff2',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/status/js/bundle.js',
  '/index.html',
  '/main',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('offline.html');
      });
    })
  );
});
