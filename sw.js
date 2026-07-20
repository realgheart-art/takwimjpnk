/* Takwim JPN — Service Worker
   Naikkan nombor versi (v1 -> v2) setiap kali index.html dikemas kini,
   supaya pengguna dapat versi terbaharu. */
const CACHE = 'takwim-jpn-v17';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'logo.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return; // panggilan API GAS (POST) sentiasa ke rangkaian

  const url = new URL(req.url);
  // Jangan cache trafik Google Apps Script / data hidup
  if (url.hostname.includes('script.google') || url.hostname.includes('googleusercontent')) return;

  // Navigasi halaman: cuba rangkaian dulu, jika luar talian guna cache
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  // Silang-domain (CDN: FullCalendar, jsPDF, font): NETWORK-FIRST.
  // Ini elak menyajikan salinan cache yang rosak/tak lengkap.
  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Sama-domain (shell, ikon): cache-first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
