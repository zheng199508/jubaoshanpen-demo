
const CACHE='jubaoshanpen-v4-fc4d79d67c60';
const FILES=["/jubaoshanpen-demo/","/jubaoshanpen-demo/index.html","/jubaoshanpen-demo/art/atlas-v05.png","/jubaoshanpen-demo/art/battle-scenes-v3.png","/jubaoshanpen-demo/art/hero-v06.png","/jubaoshanpen-demo/art/npc-v05.png","/jubaoshanpen-demo/art/portraits-v3.png","/jubaoshanpen-demo/favicon.svg","/jubaoshanpen-demo/icon-192.png","/jubaoshanpen-demo/icon-512.png","/jubaoshanpen-demo/manifest.webmanifest","/jubaoshanpen-demo/assets/index-C199BRMw.js","/jubaoshanpen-demo/assets/index-DUbm4yfE.css"];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await (await caches.open(CACHE)).addAll(FILES.map(url=>new Request(url,{cache:'reload'})));
 // v0.2 has no update UI: activate its first replacement, without reloading a playing page.
 // Newer updates wait until the player has explicitly saved and chosen to update.
 if(keys.some(k=>k.startsWith('jubaoshanpen-'))&&!keys.some(k=>/^jubaoshanpen-v[34]-/.test(k)))await self.skipWaiting();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('jubaoshanpen-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true,ignoreVary:true});
  if(cached)return cached;
  try{return await fetch(event.request);}catch(error){
   if(event.request.mode==='navigate')return (await cache.match("/jubaoshanpen-demo/index.html"))||Response.error();
   throw error;
  }
 })());
});
