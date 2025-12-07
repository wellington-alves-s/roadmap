const CACHE_NAME = "roadmap-app-v1";
const urlsToCache = [
	"/",
	"/styles.css",
	"/app.js",
	"/manifest.json",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
];

// Install event
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		}),
	);
});

// Fetch event
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Return cached version or fetch from network
			if (response) {
				return response;
			}
			return fetch(event.request).then((response) => {
				// Check if we received a valid response
				if (!response || response.status !== 200 || response.type !== "basic") {
					return response;
				}

				// Clone the response
				const responseToCache = response.clone();

				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseToCache);
				});

				return response;
			});
		}),
	);
});

// Activate event
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log("Deleting old cache:", cacheName);
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
	if (event.tag === "background-sync") {
		event.waitUntil(doBackgroundSync());
	}
});

async function doBackgroundSync() {
	try {
		// Sync any pending data when connection is restored
		const pendingData = await getPendingData();
		if (pendingData.length > 0) {
			await syncPendingData(pendingData);
		}
	} catch (error) {
		console.error("Background sync failed:", error);
	}
}

async function getPendingData() {
	// Get any pending data from IndexedDB
	return [];
}

async function syncPendingData(data) {
	// Sync data with server
	for (const item of data) {
		try {
			await fetch("/api/v1/progress/complete/" + item.userId + "/" + item.topicId, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${item.token}`,
				},
				body: JSON.stringify(item.data),
			});
		} catch (error) {
			console.error("Failed to sync item:", error);
		}
	}
}
