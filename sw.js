/* Service worker: guarda la app entera para que funcione en modo avión. */
const CACHE = "ryukyu-v2";
const BASE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./iconos/icono-180.png", "./iconos/icono-192.png", "./iconos/icono-512.png", "./iconos/icono-512-maskable.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // Tipografías: se guardan la primera vez y luego salen de la caché.
  if(url.hostname.includes("fonts.g")){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      const copia = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copia));
      return res;
    }).catch(()=>r)));
    return;
  }

  // Todo lo demás: caché primero, y si hay red se refresca por detrás.
  e.respondWith(caches.match(e.request).then(cacheada=>{
    const red = fetch(e.request).then(res=>{
      if(res && res.status===200 && res.type==="basic"){
        const copia = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copia));
      }
      return res;
    }).catch(()=>cacheada);
    return cacheada || red;
  }));
});
