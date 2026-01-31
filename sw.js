const CACHE_NAME = 'epsilon-hub-v1';
const ASSETS = [
    './',
    './index.html',
    './epsilon logo.png', // Don't forget your branding!
    './warren img.png',
    './ethan img.png',
    './richard img.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'
];

// Install Event - caching all the essentials
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Event - Network first, fallback to cache
// This ensures they see the latest updates if they have internet
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});