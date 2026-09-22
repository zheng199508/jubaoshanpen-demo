
const CACHE='jubaoshanpen-v5-7469a6bf0355';
const FILES=["/jubaoshanpen-demo/","/jubaoshanpen-demo/index.html","/jubaoshanpen-demo/art/v08-sample/characters/haoyun_walk.png","/jubaoshanpen-demo/art/v08-sample/characters/hero_walk.png","/jubaoshanpen-demo/art/v08-sample/characters/kumu_walk.png","/jubaoshanpen-demo/art/v08-sample/characters/outer_officer_walk.png","/jubaoshanpen-demo/art/v08-sample/characters/qingyi_senior_walk.png","/jubaoshanpen-demo/art/v08-sample/icons/teaching_note.png","/jubaoshanpen-demo/art/v08-sample/icons/wang_debt_note.png","/jubaoshanpen-demo/art/v08-sample/portraits/haoyun_portrait.png","/jubaoshanpen-demo/art/v08-sample/portraits/hero_portrait.png","/jubaoshanpen-demo/art/v08-sample/portraits/kumu_portrait.png","/jubaoshanpen-demo/art/v08-sample/portraits/outer_officer_portrait.png","/jubaoshanpen-demo/art/v08-sample/portraits/qingyi_senior_portrait.png","/jubaoshanpen-demo/art/v08-sample/scenes/courtyard_sample.png","/jubaoshanpen-demo/art/v08-sample/scenes/dorm_sample.png","/jubaoshanpen-demo/art/v08-sample/scenes/pond_sample.png","/jubaoshanpen-demo/art/v08-sample/tiles/environment_tiles.png","/jubaoshanpen-demo/favicon.svg","/jubaoshanpen-demo/icon-192.png","/jubaoshanpen-demo/icon-512.png","/jubaoshanpen-demo/manifest.webmanifest","/jubaoshanpen-demo/assets/index-DAaQ4ZPh.js","/jubaoshanpen-demo/assets/index-CgsXY0We.css"];
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
  try{const response=await fetch(event.request);if((u.pathname.includes('/audio/')||u.pathname.includes('/art/'))&&response.ok)event.waitUntil(cache.put(event.request,response.clone()));return response;}catch(error){
   if(event.request.mode==='navigate')return (await cache.match("/jubaoshanpen-demo/index.html"))||Response.error();
   throw error;
  }
 })());
});
