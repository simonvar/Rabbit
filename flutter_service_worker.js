'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "461e269368d92882d228e92af8661c72",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "b002804ec094a2b3fb582dda29beca71",
"index.html": "27daea07c665472f638da95962dc72ec",
"/": "27daea07c665472f638da95962dc72ec",
"main.dart.js": "9377d7775537b238f98838a3afaf5aca",
"version.json": "559a7fe4b0dd8a5570c20abf635eb802",
"favicon.png": "da91bcb268ff13b7fc2acc9bc253d714",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.json": "d2de8f396e9ca343991870a2ea3ad520",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/read_me.txt": "6652df6ff6d442bd0d4bc54a9fd929d7",
"assets/assets/images/objects/paths.png": "edce181e71f6f4c18c4a67105ab7235c",
"assets/assets/images/objects/items_tools_materials.png": "206aa4ad8d32b34d3005ebdce7c5d502",
"assets/assets/images/objects/plants.png": "bd3d4451ebb4a9d9e5f93237a258d523",
"assets/assets/images/objects/furniture.png": "0c3e2a6244341a98d0e866a728f64dfc",
"assets/assets/images/objects/chest.png": "7fcaec2400170c2fddc318df4c7b6192",
"assets/assets/images/objects/bridge.png": "e5246b07d218753227d5addee22c3982",
"assets/assets/images/objects/items_milk_grass.png": "e1a8c3cb0eab64b423787996436dca1b",
"assets/assets/images/objects/biom_grass.png": "aed9324ef39151b6813e2a4532362b92",
"assets/assets/images/characters/rabbit_basic.png": "e6b85d02ac985049f390abf2e84c61fb",
"assets/assets/images/characters/tools.png": "3db9d267dd526bca1aaf4559097c5ba3",
"assets/assets/images/characters/rabbit_actions.png": "99571da736d6cde640d0190a96edfdb7",
"assets/assets/images/characters/cow.png": "ea42bd84fca6006d2af8bc05f9f88f9e",
"assets/assets/images/tiles/hills.png": "e8346e113daa8c7b22143ab80064d611",
"assets/assets/images/tiles/water.png": "78d1ad08e28c734e437b35e58f200560",
"assets/assets/images/tiles/fences.png": "bb214423fa26359af83d09dea553bcfb",
"assets/assets/images/tiles/house.png": "dd9452573747eca7654e8d851f6a6dae",
"assets/assets/images/tiles/dirt.png": "47d3662d02291040c198706e771aa27a",
"assets/assets/images/tiles/grass.png": "d37d8c67979a19be09ee0ab84f519a3e",
"assets/assets/audio/click_rabbit.wav": "3f88e1ca32d07078b7808ee308d1bf1a",
"assets/NOTICES": "a2e96a7350d6ef0a74edfb864b8b32e5",
"manifest.json": "b8bdf7dbbd1ff015df3e3abffa8491df"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
