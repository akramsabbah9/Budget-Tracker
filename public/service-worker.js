/* service-worker.js: service worker to cache important files for this application */
const APP_PREFIX = "BudgetTracker-";
const VERSION = "v01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

self.addEventListener("fetch", event => {
    console.log("fetch request: " + event.request.url);
    event.respondWith(
        caches.match(event.request).then(request => request || fetch(event.request))
    );
});

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("installing cache: " + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            // filter out keys that has this app's prefix to create keeplist
            let cacheKeeplist = keyList.filter(key => key.indexOf(APP_PREFIX));

            // add current cache name to keeplist
            cacheKeeplist.push(CACHE_NAME);
    
            return Promise.all(keyList.map((key, i) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log("deleting cache : " + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});