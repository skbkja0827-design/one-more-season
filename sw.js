/* 설치형 앱용 서비스 워커. 항상 네트워크를 먼저 쓰고, 끊겼을 때만 저장해 둔 사본을 쓴다(배포 직후 옛 화면이 남지 않게). */
const CACHE='oms-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./manifest.webmanifest','./icons/icon-192.png'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;})
  .catch(()=>caches.match(req).then(hit=>hit||(req.mode==='navigate'?caches.match('./'):Response.error()))));
});
