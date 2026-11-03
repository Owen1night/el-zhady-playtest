/** Browser emulation with local assets. Never contacts either Supabase project. */
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {existsSync,realpathSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
process.env.VITE_SUPABASE_URL='';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY='';
process.env.VITE_PUBLIC_SITE_URL='https://owen1night.github.io/el-zhady-playtest/';
const vite=await createServer({server:{host:'127.0.0.1',port:4180,strictPort:true,fs:{allow:[process.cwd(),realpathSync('node_modules')]}}});
await vite.listen();
const engine=process.env.BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit.launch({headless:true}):chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),args:['--no-sandbox']}));
const evidenceSuffix=engine==='webkit'?'-webkit':'';
const root='http://127.0.0.1:4180/el-zhady-playtest/';
try {
 await mkdir('work/learning-browser',{recursive:true});
 for(const width of [360,390,768,1366,1920]) {
  const page=await browser.newPage({viewport:{width,height:width<=760?800:1080},isMobile:width<=760,hasTouch:width<=760});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root+'#/home');
  if(width<=900){await page.getByRole('button',{name:'Бөлімдер',exact:true}).click();await page.getByRole('link',{name:'Ойынға қосылу',exact:true}).click();}
  else await page.getByRole('link',{name:'Ойынға қосылу',exact:true}).click();
  await page.getByRole('heading',{name:'Тарихи бөлімдер ашық.',exact:true}).waitFor();
  for(const section of ['front','heroes','homefront','postwar','facts','timeline','sources']) {
   await page.goto(root+'#/'+section);
   await page.locator(section==='timeline'?'.learning-timeline':section==='sources'?'.reading-sources':'.reading-card').first().waitFor();
   if(section==='front'){
    await page.locator('[data-option-id=oral]').focus();await page.keyboard.press('Enter');
    await page.getByRole('heading',{name:'Эвакуация: Оралдағы өндіріс'}).first().waitFor();
    assert.equal(await page.locator('.learning-atlas .chosen[data-option-id=oral]').count(),1);
   }
   if(section==='timeline'){
    assert.equal(await page.locator('.period-marker').count(),3);
    for(const [index,count] of [1,5,6].entries()){
     const marker=page.locator('.period-marker').nth(index);await marker.scrollIntoViewIfNeeded();
     const bounds=await marker.boundingBox();assert(bounds&&bounds.width>=44&&bounds.height>=44);
     if(width<=760)await marker.tap();else{await marker.focus();await page.keyboard.press('Enter');}
     assert.equal(await marker.getAttribute('aria-pressed'),'true');
     assert.equal(await page.locator('.period-marker[aria-pressed=true]').count(),1);
     assert.equal(await page.locator('.learning-timeline>ol>li').count(),count);
     if(index===2)await page.locator('.period-selector').screenshot({path:`work/learning-browser/period-controls-${width}${evidenceSuffix}.png`});
     assert(await marker.locator('.visible-marker').evaluate(el=>getComputedStyle(el).backgroundColor!=='rgb(255, 255, 255)'));
    }
    await page.getByRole('button',{name:'Барлығы',exact:true}).click();
    assert.equal(await page.locator('.learning-timeline>ol>li').count(),12);
   }
   if(section==='heroes'){
    assert.equal(await page.locator('.person-card').count(),7);
    for(const card of await page.locator('.person-card').all()){
     assert.equal(await card.locator(':scope>.archive-media').count(),1);
     assert(await card.locator('.person-copy h2').innerText());
     assert(await card.locator('.portrait-credit').innerText());
    }
   }
   for(const image of await page.locator('.archive-media img').all()){
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img=>new Promise<void>((resolve,reject)=>{const el=img as HTMLImageElement;if(el.complete){el.naturalWidth?resolve():reject(Error('Broken image'));}else{el.onload=()=>resolve();el.onerror=()=>reject(Error('Broken image'));}}));
    assert(await image.getAttribute('alt'));
   }
   if(section==='heroes')await page.locator('.person-card').first().screenshot({path:`work/learning-browser/portrait-card-${width}${evidenceSuffix}.png`});
   for(const card of await page.locator('.reading-card,.timeline-event-copy').all())assert.equal(await card.locator('figure').count(),1,'each historical card has a sourced visual');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${section}: no overflow`);
   if(['postwar','heroes','timeline'].includes(section)){
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`work/learning-browser/${section}-${width}${evidenceSuffix}.png`,fullPage:true});
   }
  }
  await page.goto(root+'#/home');
  const toggle=page.getByRole('button',{name:'Сыныпқа проекциялау режимі',exact:true});
  assert.equal(await toggle.isVisible(),width>760);
  await page.getByRole('button',{name:'Бөлімдер',exact:true}).click();
  await page.getByRole('button',{name:'Сыныпқа проекциялау: өшірулі',exact:true}).click();
  await page.keyboard.press('Escape');
  await page.locator('.presentation-banner').waitFor();
  await page.reload();await page.locator('.presentation-banner').waitFor();
  assert(await page.evaluate(()=>document.documentElement.classList.contains('presentation')));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} projection no overflow`);
  await page.screenshot({path:`work/learning-browser/projector-${width}${evidenceSuffix}.png`});
  await page.getByRole('button',{name:'Шығу',exact:true}).click();
  assert(!await page.evaluate(()=>document.documentElement.classList.contains('presentation')));
  assert.deepEqual(errors,[]);await page.close();
  console.log(`PASS ${engine} ${width}px: join navigation, seven public sections, seven portraits, all local images, three touch/keyboard period markers, projection menu/persistence/exit, no overflow or page errors`);
 }
}finally{await browser.close();await vite.close();}
