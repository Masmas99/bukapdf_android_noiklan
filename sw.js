const CACHE_NAME = 'docuview-android-v7';
const APP_FILES_TO_CACHE = [
    './',
    'index.html',
    'manifest.json',
    'sw.js?v=7',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'assets/share.png'
];
const EXTERNAL_FILES_TO_CACHE = [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                const appFiles = APP_FILES_TO_CACHE.map((file) => new URL(file, self.registration.scope).toString());
                await cache.addAll(appFiles);
                await Promise.all(EXTERNAL_FILES_TO_CACHE.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (error) {
                        console.warn('Aset offline gagal disimpan:', url, error);
                    }
                }));
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'POST') {
        event.respondWith(handleSharedPdf(event.request));
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request)
                    .then((response) => response || caches.match(new URL('index.html', self.registration.scope).toString())))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((fetchResponse) => {
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }
                    const responseToCache = fetchResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return fetchResponse;
                }).catch(() => {
                    if (event.request.destination === 'document') {
                        return caches.match(new URL('index.html', self.registration.scope).toString());
                    }
                });
            })
    );
});

async function handleSharedPdf(request) {
    const formData = await request.formData();
    const sharedFiles = [...formData.values()];
    const pdf = sharedFiles.find((file) => file && typeof file.arrayBuffer === 'function' &&
        (/\.pdf$/i.test(file.name || '') || file.type === 'application/pdf' || file.type === 'application/octet-stream'));
    const sharedPdfUrl = new URL('__shared_pdf__', self.registration.scope).toString();
    const isPdf = Boolean(pdf);

    if (isPdf) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(sharedPdfUrl, new Response(pdf, {
            headers: { 'Content-Type': 'application/pdf' }
        }));
    }

    return Response.redirect(new URL('./index.html', request.url), 303);
}

self.addEventListener('message', (event) => {
    if (event.data === 'clear-shared-pdf') {
        const sharedPdfUrl = new URL('__shared_pdf__', self.registration.scope).toString();
        caches.open(CACHE_NAME).then((cache) => cache.delete(sharedPdfUrl));
    }
});