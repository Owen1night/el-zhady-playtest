/** Offline UI lifecycle check. SDK/watch routes are fixtures, not proof of live YouTube playback. */
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {existsSync,realpathSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {learningVideos} from '../../src/data/videos';
process.env.VITE_SUPABASE_URL='';process.env.VITE_SUPABASE_PUBLISHABLE_KEY='';
process.env.VITE_PUBLIC_SITE_URL='https://owen1night.github.io/el-zhady-playtest/';
const vite=await createServer({server:{host:'127.0.0.1',port:4185,strictPort:true,fs:{allow:[process.cwd(),realpathSync('node_modules')]}}});await vite.listen();
const engine=process.env.BROWSER==='webkit'?'webkit':'chromium';
const browser=await(engine==='webkit'?webkit.launch():chromium.launch({...(existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),args:['--no-sandbox']}));
const root='http://127.0.0.1:4185/el-zhady-playtest/#/videos';
// Kept in the test harness only. No replacement transport enters src or the built application.
function sdkFixture(stall=false){return `window.__ytTest={created:[],destroyed:[]};window.YT={Player:class{
 constructor(element,options){this.options=options;const f=document.createElement('iframe');f.src=options.host+'/embed/'+options.videoId+'?'+new URLSearchParams(options.playerVars);f.title='YouTube test fixture';element.replaceWith(f);this.frame=f;window.__ytTest.created.push(options);window.__ytTest.error=code=>options.events.onError({data:code});${stall?'':"setTimeout(()=>options.events.onReady({target:this}),0);"}}
 getIframe(){return this.frame}destroy(){window.__ytTest.destroyed.push(this.options.videoId);this.frame.remove()}
}};window.onYouTubeIframeAPIReady();`;}
try{
 await mkdir('work/videos-browser',{recursive:true});
 for(const width of [360,768,1920]){
  const context=await browser.newContext({viewport:{width,height:width===360?800:1080},hasTouch:width===360,isMobile:width===360});
  let sdkRequests=0;const opened:string[]=[];
  await context.route('https://www.youtube.com/iframe_api',route=>{sdkRequests++;return route.fulfill({contentType:'application/javascript',body:sdkFixture()});});
  await context.route('https://www.youtube-nocookie.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'<button>Offline player fixture</button>'}));
  await context.route('https://www.youtube.com/watch?**',route=>{opened.push(route.request().url());return route.fulfill({contentType:'text/html',body:'<title>Outbound navigation fixture — not live YouTube</title>'});});
  const page=await context.newPage();const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(root);await page.locator('.video-card').last().waitFor();
  assert.equal(sdkRequests,0);assert.equal(await page.locator('iframe').count(),0);
  for(const video of learningVideos){
   const card=page.locator(`[data-video-slot="${video.id}"]`);const fallback=card.locator('.video-youtube-link');
   assert.equal(await fallback.getAttribute('href'),video.url);assert.match(await fallback.getAttribute('rel')||'',/noopener/);
   const popupPromise=context.waitForEvent('page');await fallback.click();const popup=await popupPromise;await popup.waitForURL(video.url);await popup.close();
   const opener=card.getByRole('button',{name:`Ойнатқышты ашу: ${video.title}`,exact:true});await opener.focus();await page.keyboard.press('Enter');
   await card.getByRole('status').filter({hasText:'Ойнатқыш дайын.'}).waitFor();
   const frame=card.locator('iframe');assert.equal(await frame.getAttribute('title'),video.title);const src=new URL((await frame.getAttribute('src'))!);
   assert.equal(src.origin,'https://www.youtube-nocookie.com');assert.equal(src.pathname,`/embed/${video.videoId}`);
   assert.equal(src.searchParams.get('autoplay'),'0');assert.equal(src.searchParams.get('playsinline'),'1');assert.equal(src.searchParams.get('controls'),'1');assert.equal(src.searchParams.get('origin'),'http://127.0.0.1:4185');assert(await frame.getAttribute('allowfullscreen')!==null);
   const bounds=await frame.boundingBox();assert(bounds&&bounds.width>=200&&bounds.height>=200);assert(await fallback.isVisible());
   assert(await page.evaluate(expected=>document.documentElement.scrollWidth<=expected,width));
   await card.screenshot({path:`work/videos-browser/${video.id}-${width}-${engine}.png`});
   if(video.number===1){
    await page.evaluate(()=>window.__ytTest!.error(150));await card.getByRole('alert').filter({hasText:'рұқсат'}).waitFor();assert.equal(await card.locator('iframe').count(),0);assert(await fallback.isVisible());assert(await page.evaluate(expected=>document.documentElement.scrollWidth<=expected,width));await card.screenshot({path:`work/videos-browser/refusal-${width}-${engine}.png`});
    await opener.click();await card.getByRole('status').filter({hasText:'Ойнатқыш дайын.'}).waitFor();
    await page.evaluate(()=>window.__ytTest!.error(100));await card.getByRole('alert').filter({hasText:'өшірілген'}).waitFor();
    await opener.click();await card.getByRole('status').filter({hasText:'Ойнатқыш дайын.'}).waitFor();
   }
   await card.getByRole('button',{name:'Ойнатқышты жабу',exact:true}).click();await opener.waitFor();assert.equal(await card.locator('iframe').count(),0);
  }
  assert.deepEqual(opened,learningVideos.map(v=>v.url));assert.equal(sdkRequests,1,'one official SDK request is shared; retries reuse it');assert.deepEqual(errors,[]);
  assert.equal(await page.locator('[data-video-scope=background]').count(),1);await page.goto(root.replace('#/videos','#/home'));assert.equal(await page.locator('iframe').count(),0);await context.close();
  console.log(`PASS ${engine} ${width}px: all 4 outbound links open the exact supplied IDs; lazy/inline/no-autoplay SDK configuration, background label, retry/removal/refusal states, close/cleanup, >=200px player, no overflow. External responses were fixtures, not live playback.`);
 }
 // Network failure must leave all four independent links available and retry finite.
 const failure=await browser.newContext({viewport:{width:360,height:800}});await failure.route('https://www.youtube.com/iframe_api',route=>route.abort('failed'));const p=await failure.newPage();await p.goto(root);await p.locator('.video-card').first().getByRole('button').click();await p.getByRole('alert').filter({hasText:'Ойнатқыш жүктелмеді'}).waitFor();assert.equal(await p.locator('.video-youtube-link').count(),4);await failure.unroute('https://www.youtube.com/iframe_api');await failure.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'application/javascript',body:sdkFixture()}));await failure.route('https://www.youtube-nocookie.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'Recovered offline player fixture'}));await p.locator('.video-card').first().getByRole('button').click();await p.getByRole('status').filter({hasText:'Ойнатқыш дайын.'}).waitFor();await failure.close();
 // A script that loads but never reports ready must not leave an endless spinner.
 const stalled=await browser.newContext({viewport:{width:360,height:800}});await stalled.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'application/javascript',body:sdkFixture(true)}));await stalled.route('https://www.youtube-nocookie.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'Player waiting fixture'}));const q=await stalled.newPage();await q.clock.install();await q.goto(root);await q.locator('.video-card').first().getByRole('button').click();await q.locator('iframe').waitFor();await q.clock.fastForward(16000);await q.getByRole('alert').filter({hasText:'Ойнатқыш жүктелмеді'}).waitFor();assert.equal(await q.locator('iframe').count(),0);await stalled.close();
 console.log(`PASS ${engine}: API network error and readiness timeout keep fallback links/retry available. No hosted backend or live YouTube test claimed.`);
}finally{await browser.close();await vite.close();}
declare global{interface Window{__ytTest?:{error:(code:number)=>void}}}
