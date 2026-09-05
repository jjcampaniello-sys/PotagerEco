const CACHE_NAME = "potager-cache-v1";
const FICHIERS_A_METTRE_EN_CACHE = [
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FICHIERS_A_METTRE_EN_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((noms) =>
            Promise.all(noms.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Réseau d'abord pour la météo (Open-Meteo) : jamais de cache pour des données qui changent.
    if (event.request.url.includes("open-meteo.com")) {
        event.respondWith(fetch(event.request).catch(() => new Response("{}", { headers: { "Content-Type": "application/json" } })));
        return;
    }
    // Cache d'abord pour les fichiers de l'app, avec repli réseau.
    event.respondWith(
        caches.match(event.request).then((reponseCache) => reponseCache || fetch(event.request))
    );
});
