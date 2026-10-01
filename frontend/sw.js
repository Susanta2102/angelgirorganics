/* Angel Organics service worker: makes the site installable and usable offline. */
const CACHE = 'angel-organics-v1';
const CORE = [
    './',
    'index.html',
    'css/site.css',
    'css/chatbot.css',
    'js/site.js',
    'js/api-config.js',
    'js/chatbot-frontend.js',
    'js/vendor/marked.min.js',
    'js/vendor/purify.min.js',
    'assets/images/1.jpg',
    'assets/images/11.jpg',
    'assets/images/chatbot-avatar.jpg',
    'assets/icons/icon-192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    // Only handle same-origin GETs; never the chatbot API, maps or videos (range requests)
    if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.endsWith('.mp4')) return;

    if (req.mode === 'navigate') {
        // Pages: fresh from the network, cached copy when offline
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put('index.html', copy));
                    return res;
                })
                .catch(() => caches.match('index.html'))
        );
        return;
    }

    // Files: serve from cache straight away, refresh it in the background
    event.respondWith(
        caches.match(req).then((cached) => {
            const network = fetch(req)
                .then((res) => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then((cache) => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
