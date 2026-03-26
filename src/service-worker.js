const CACHE_NAME = "homewatch-v1.1.5";

// Ressources statiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Installation : pré-charger les ressources critiques
self.addEventListener("install", (event) => {
  console.log("[SW] Installation du service worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(STATIC_ASSETS).then(() => self.skipWaiting()),
      ),
  );
});

// Activation : nettoyer les anciennes versions
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation du service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ).then(() => self.clients.claim()),
      ),
  );
});

// Fetch : stratégie hybride pour React + API TMDB
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Stratégie par type de ressource

  // 1. Ressources statiques (cache-first)
  if (url.pathname.startsWith("/")) {
    event.respondWith(
      caches.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((res) => {
            const cloned = res.clone();

            // Mettre en cache avec expiration de 7 jours pour les statiques
            return caches.open(CACHE_NAME).then((cache) =>
              cache.put(
                event.request,
                cloned.then((body) => body),
              ),
            );
          }),
      ),
    );
  }

  // 2. API TMDB (network-first avec fallback)
  else if (url.hostname.includes("api.themoviedb.org")) {
    event.respondWith(
      fetch(event.request).then((res) => {
        const cloned = res.clone();

        // Ne pas mettre en cache les réponses d'API volumineuses
        return cloned;
      }),
    );
  }

  // 3. Images (cache-first avec validation)
  else if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    event.respondWith(
      caches
        .match(event.request)
        .then(
          (response) =>
            response ||
            fetch(event.request).then((res) =>
              res
                .clone()
                .then((body) =>
                  caches
                    .open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, body)),
                ),
            ),
        ),
    );
  }

  // 4. Tout le reste : network-only (pas de cache)
  else {
    event.respondWith(fetch(event.request));
  }
});

// Gestion des erreurs d'offline
window.addEventListener("offline", () => {
  console.log("[SW] Application hors ligne");
});

window.addEventListener("online", () => {
  console.log("[SW] Connexion rétablie");
});
