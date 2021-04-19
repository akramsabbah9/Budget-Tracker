/* service-worker.js: service worker to cache important files for this application */
const APP_PREFIX = "BudgetTracker-";
const VERSION = "v01";
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = APP_PREFIX + "Data-" + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-512x512.png"
];

self.addEventListener("fetch", event => {
    console.log("fetch request: " + event.request.url);

    if (event.request.url.includes("/api/")) { // if api request
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
                .then(cache => {
                    // fetch data from backend
                    return fetch(event.request)
                        // if response is ok, store in cache
                        .then(response => {
                            if (response.status === 200) {
                                cache.put(event.request.url, response.clone());
                            }
                            return response;
                        })
                        // otherwise, attempt to get from cache
                        .catch(err => cache.match(event.request));
                })
                .catch(err => console.log(err))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/index.html");
                }
            });
        })
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