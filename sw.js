
const CACHE="jubaoshanpen-v6-967805fe2712";
const CACHE_PREFIX='jubaoshanpen-';
const FILES=["/jubaoshanpen-demo/","/jubaoshanpen-demo/index.html","/jubaoshanpen-demo/art/v08-sample/characters/hero_walk.png","/jubaoshanpen-demo/art/v08-sample/characters/qingyi_senior_walk.png","/jubaoshanpen-demo/art/v08-sample/icons/teaching_note.png","/jubaoshanpen-demo/art/v08-sample/icons/wang_debt_note.png","/jubaoshanpen-demo/art/v08-sample/portraits/hero_portrait.png","/jubaoshanpen-demo/art/v08-sample/portraits/qingyi_senior_portrait.png","/jubaoshanpen-demo/art/v08-sample/scenes/courtyard_sample.png","/jubaoshanpen-demo/art/v08-sample/scenes/dorm_sample.png","/jubaoshanpen-demo/art/v08-sample/scenes/pond_sample.png","/jubaoshanpen-demo/art/v08-sample/tiles/environment_tiles.png","/jubaoshanpen-demo/art/v082/basin/basin_icon.png","/jubaoshanpen-demo/art/v082/basin/basin_interface.png","/jubaoshanpen-demo/art/v082/basin/basin_map.png","/jubaoshanpen-demo/art/v082/characters/haoyun_walk.png","/jubaoshanpen-demo/art/v082/characters/kumu_walk.png","/jubaoshanpen-demo/art/v082/characters/outer_officer_walk.png","/jubaoshanpen-demo/art/v082/characters/white_crane_walk.png","/jubaoshanpen-demo/art/v082/portraits/haoyun_portrait.png","/jubaoshanpen-demo/art/v082/portraits/kumu_portrait.png","/jubaoshanpen-demo/art/v082/portraits/outer_officer_portrait.png","/jubaoshanpen-demo/art/v082/portraits/white_crane_portrait.png","/jubaoshanpen-demo/favicon.svg","/jubaoshanpen-demo/icon-192.png","/jubaoshanpen-demo/icon-512.png","/jubaoshanpen-demo/manifest.webmanifest","/jubaoshanpen-demo/update.html","/jubaoshanpen-demo/assets/index-DsxAuZNc.js","/jubaoshanpen-demo/assets/index-AS-M__xd.css"];

self.addEventListener('install',event=>event.waitUntil((async()=>{
  await (await caches.open(CACHE)).addAll(FILES.map(url=>new Request(url,{cache:'reload'})));
  // Updates always remain waiting. Only an explicit page message may call skipWaiting.
})()));

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING'){event.waitUntil(self.skipWaiting());return;}
  if(event.data?.type==='CORE_READY')event.waitUntil((async()=>{
    for(const key of await caches.keys())if(key.startsWith(CACHE_PREFIX)&&key!==CACHE)await caches.delete(key);
  })());
});

self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(event.request,{ignoreSearch:true,ignoreVary:true});
    if(cached)return cached;
    try{
      const response=await fetch(event.request);
      if((u.pathname.includes('/audio/')||u.pathname.includes('/art/'))&&response.ok)event.waitUntil(cache.put(event.request,response.clone()));
      return response;
    }catch(error){
      if(event.request.mode==='navigate')return (await cache.match("/jubaoshanpen-demo/index.html"))||Response.error();
      throw error;
    }
  })());
});
