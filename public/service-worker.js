const CACHE_NAME = "my-cache-v6";
const urlsToCache = ["/", "/offline.html"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).catch((error) => {
            console.error("Cache addAll failed:", error);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match("/offline.html"))
    );
});
self.addEventListener("push", (event) => {
    if (Notification.permission === "granted") {
        event.waitUntil(
            self.registration.showNotification("دکتر زوشا", {
                body: "درخواست پشتیبانی جدید",
                icon: "/logo.png",
                badge: "/logo.png",
                actions: [
                    { action: "open_app", title: "باز کردن اپ", icon: "/open.png" },
                    { action: "dismiss", title: "بستن", icon: "/close.png" }
                  ]
            })
        );
    } else {
        console.warn("🚫 اجازه نوتیفیکیشن داده نشده!");
    }
});