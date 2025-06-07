const CACHE_NAME = "musiker-app-v2"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Füge hier weitere wichtige Assets hinzu
]

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache geöffnet")
      return cache.addAll(urlsToCache)
    }),
  )
  // Aktiviere den neuen Service Worker sofort
  self.skipWaiting()
})

// Fetch Event - Cache-First-Strategie für bessere Offline-Erfahrung
self.addEventListener("fetch", (event) => {
  // Nur GET-Requests cachen
  if (event.request.method !== "GET") {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Wenn im Cache gefunden, zurückgeben
      if (response) {
        return response
      }

      // Ansonsten vom Netzwerk laden
      return fetch(event.request)
        .then((response) => {
          // Prüfen ob gültige Response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Response klonen für Cache
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Bei Netzwerkfehlern
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html")
          }

          // Für Bilder eine Platzhalter-Grafik zurückgeben
          if (event.request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f4f6"/><text x="50%" y="50%" font-size="12" text-anchor="middle" alignment-baseline="middle" fill="#6b7280">Offline</text></svg>',
              {
                headers: { "Content-Type": "image/svg+xml" },
              },
            )
          }

          return new Response("Offline", { status: 503 })
        })
    }),
  )
})

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Alte Caches werden gelöscht:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker aktiviert")
        return self.clients.claim()
      }),
  )
})

// Background Sync für zukünftige Erweiterungen
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered")
    // Hier könntest du später Daten synchronisieren
  }
})

// Push Notifications für zukünftige Erweiterungen
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})
