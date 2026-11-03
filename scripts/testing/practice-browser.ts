/** Local integration only: real isolated SQL/RLS with fixture Auth and routed HTTP.
 * No fixture transport, identity issuer or clock override is included in src/dist.
 */
import { createServer } from 'vite';
import { chromium,webkit } from 'playwright';
import type { BrowserContext, Page } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,readFile } from 'node:fs/promises';
import { existsSync,realpathSync } from 'node:fs';
import { actors, liveHarness } from '../../supabase/tests/live-harness';
const h = await liveHarness(true,true);
await h.exec(await readFile('supabase/migrations/20261103000500_solo_practice.sql','utf8'));
process.env.VITE_SUPABASE_URL='https://quiz-test.invalid';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY='sb_publishable_local_fixture_only';
process.env.VITE_PUBLIC_SITE_URL='https://owen1night.github.io/el-zhady-playtest/';
process.env.VITE_TURNSTILE_SITE_KEY='';
const vite = await createServer({server:{host:'127.0.0.1',port:4181,strictPort:true,fs:{allow:[process.cwd(),realpathSync('node_modules')]}}});
await vite.listen();
const engine=process.env.BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit.launch({headless:true}):chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),args:['--no-sandbox']}));
const contexts:BrowserContext[]=[]; const errors:string[]=[];
const tokens=new Map<string,string>(); const unreachable=new Set<string>();let loseSubmit=false;let rejectSave=false;
const evidenceSuffix=engine==='webkit'?'-webkit':'';
const root='http://127.0.0.1:4181/el-zhady-playtest/';
async function session(uid:string,mobile=false) {
  const context=await browser.newContext(mobile?{viewport:{width:360,height:800},isMobile:true,hasTouch:true,deviceScaleFactor:1}:{viewport:{width:1920,height:1080}});contexts.push(context);
  const user={id:uid,aud:'authenticated',role:'authenticated',is_anonymous:uid===actors.guest,app_metadata:{provider:uid===actors.guest?'anonymous':'google'},user_metadata:{},identities:[],created_at:'2026-01-01T00:00:00Z'};
  const token=`${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({sub:uid,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600,is_anonymous:user.is_anonymous})).toString('base64url')}.local_test_signature`;
  tokens.set(token,uid);
  await context.addInitScript(({token,user})=>localStorage.setItem('el-zhady:auth:v1',JSON.stringify({access_token:token,refresh_token:'local-fixture-refresh',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user})),{token,user});
  await context.routeWebSocket('wss://quiz-test.invalid/**',socket=>socket.close());
  await context.route('https://quiz-test.invalid/**',async route=>{
    try {
      const request=route.request(); const url=new URL(request.url());const identity=tokens.get((request.headers().authorization||'').replace(/^Bearer /,''));
      if(identity && unreachable.has(identity)) {await route.abort('internetdisconnected');return;}
      if(!identity) {await route.fulfill({status:401,json:{message:'AUTH_REQUIRED'}});return;}
      if(url.pathname==='/auth/v1/user') {await route.fulfill({json:user});return;}
      if(url.pathname.startsWith('/rest/v1/rpc/')) {
        const name=url.pathname.split('/').at(-1)!;
        const allowed=['practice_begin','practice_state','practice_save','practice_submit','practice_reset','my_access','save_profile','admin_create_room','get_lobby','join_room','lobby_heartbeat','available_live_quizzes','configure_live_quiz','configure_competition','start_competition_round','reveal_competition_results','admin_delete_room','admin_competition_round_review','start_live_quiz','live_quiz_state','submit_live_quiz_answer','admin_live_quiz_review','end_live_question','cancel_live_quiz','admin_room_action','my_competition_history'];
        assert(allowed.includes(name));
        const names=(await h.query<{proargnames:string[]|null}>("select proargnames from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname=$1",[name])).rows[0].proargnames || [];
        if(name==='practice_save'&&rejectSave){rejectSave=false;await route.fulfill({status:503,json:{message:'Test failed save before commit'}});return;}
        const body=request.postDataJSON()||{};const payload=await h.rpc(identity,name,names.map(n=>n==='p_answers'?JSON.stringify(body[n]):body[n]));
        if(name==='practice_submit'&&loseSubmit){loseSubmit=false;await route.fulfill({status:503,json:{message:'Test response lost after database commit'}});return;}
        await route.fulfill({json:payload??null});return;
      }
      const table=url.pathname.split('/').at(-1)!;
      assert(['profiles','rooms','practice_results'].includes(table));
      const rows=(await h.asUser(identity,q=>q(`select * from public.${table}`))).rows;
      await route.fulfill({json:rows});
    } catch(e) {await route.fulfill({status:400,json:{message:(e as Error).message,code:'P0001'}});}
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  return {context,page};
}
async function saved(page:Page){await page.getByText('Жауаптар серверде сақталды.',{exact:true}).waitFor();}
async function noOverflow(page:Page,label:string){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label);}
try{
 await mkdir('work/practice-browser',{recursive:true});
 await h.rpc(actors.player,'save_profile',['Сынақшы']);
 const mobile=await session(actors.player,true);const page=mobile.page;
 const kinds=['quiz','matching','ordering','map','classification'];
 for(const kind of kinds){
  console.log(engine+': checking '+kind);
  await page.goto(root+'#/games?activity='+kind);await page.locator('.solo-game').waitFor();
  await saved(page);
  const draft=(await h.query<{id:string;items:import('../../src/practice/api').PracticeItem[]}>('select id,items from el_zhady_private.practice_attempts where user_id=$1 and activity_id=$2 and completed_at is null',[actors.player,kind])).rows[0];
  assert(draft);
  if(kind==='ordering'){
   const item=draft.items[0],target=item.correct!.split('>');
   for(let pos=0;pos<target.length;pos++){
    const text=item.options.find(o=>o.id===target[pos])!.text;
    let at=(await page.locator('.order-list>li>strong').allTextContents()).indexOf(text);
    while(at>pos){await page.locator('.order-list>li').nth(at).getByRole('button',{name:/жоғары/}).focus();await page.keyboard.press('Enter');at--;}
   }
   await saved(page);await page.reload();await saved(page);
   assert.deepEqual(await page.locator('.order-list>li>strong').allTextContents(),target.map(id=>item.options.find(o=>o.id===id)!.text));
  }else if(kind==='matching'){
   for(const item of draft.items){
    await page.locator('.matching-grid>div').first().getByRole('button',{name:new RegExp(item.prompt)}).click();
    await page.locator('.matching-grid>div').nth(1).getByRole('button',{name:item.options.find(o=>o.id===item.correct)!.text,exact:true}).click();
   }
   await saved(page);await page.reload();await saved(page);assert.equal(await page.locator('.matched-achievement').count(),5);
  }else{
   for(let i=0;i<5;i++){
    const item=draft.items[i];
    if(kind==='map'){
     const option=page.locator(`[data-option-id="${item.correct}"]`);await option.focus();await page.keyboard.press('Enter');
    }else{
     if(kind==='quiz'&&i===0){rejectSave=true;await page.getByRole('button',{name:item.options.find(o=>o.id!==item.correct)!.text,exact:true}).click();}
     const option=page.getByRole('button',{name:item.options.find(o=>o.id===item.correct)!.text,exact:true});await option.focus();await page.keyboard.press('Enter');
     if(kind==='quiz'&&i===0){await page.locator('.service-error').waitFor();await page.getByRole('button',{name:'Қайта көру',exact:true}).click();}
    }
    await saved(page);
    if(i===0){await page.reload();await saved(page);assert.equal(await page.locator(kind==='map'?`[data-option-id="${item.correct}"][aria-pressed=true]`:`.quiz-option[aria-pressed=true]`).count(),1);}
    await noOverflow(page,`${kind} at 360px`);
    if(i<4)await page.getByRole('button',{name:'Келесі',exact:true}).click();
   }
  }
  await page.screenshot({path:`work/practice-browser/${kind}-360${evidenceSuffix}.png`,fullPage:true});
  if(kind==='quiz')loseSubmit=true;
  await page.locator('.practice-submit').click();
  if(kind==='quiz'){
   await page.locator('.service-error').waitFor();await page.getByRole('button',{name:'Қайта көру',exact:true}).click();
  }
  await page.locator('.practice-result').waitFor();assert((await page.locator('.practice-result').innerText()).includes('20 / 20'));
  for(const ref of await page.locator('.practice-review a').all())assert((await ref.getAttribute('href'))?.startsWith('https://'));
  await page.reload();await page.locator('.practice-result').waitFor();
  assert((await page.locator('.practice-result').innerText()).includes('20 / 20'));
  await noOverflow(page,`${kind} completed at 360px`);
  await page.screenshot({path:`work/practice-browser/${kind}-result-360${evidenceSuffix}.png`,fullPage:true});
 }
 const desktop=await session(actors.player);
 await desktop.page.goto(root+'#/profile');await desktop.page.getByText('100 / 100',{exact:true}).waitFor();
 assert.equal(await desktop.page.locator('.score-slots strong').filter({hasText:'20 / 20'}).count(),5);
 await noOverflow(desktop.page,'profile 1920px');
 await desktop.page.screenshot({path:`work/practice-browser/profile-1920${evidenceSuffix}.png`,fullPage:true});
 // Independent browser storage: all scores came from the owner SQL records, never local scores.
 await desktop.page.goto(root+'#/games');await desktop.page.locator('.practice-total').filter({hasText:'100 / 100'}).waitFor();
 await desktop.page.screenshot({path:`work/practice-browser/games-1920${evidenceSuffix}.png`,fullPage:true});
 const guest=await session(actors.guest,true);await guest.page.goto(root+'#/games');await guest.page.locator('.account-gate').waitFor();assert.equal(await guest.page.locator('.solo-game').count(),0);
 await guest.page.getByRole('link',{name:'Сайысқа қонақ ретінде қосылу',exact:true}).click();await guest.page.locator('#room-code').waitFor();
 // Reset deliberately affects only the fixture owner's practice results.
 await desktop.page.getByRole('button',{name:'Жаттығу нәтижелерін тазарту',exact:true}).click();await desktop.page.getByRole('button',{name:'Тазартуды растау',exact:true}).click();
 await desktop.page.locator('.practice-total').filter({hasText:'0 / 5 ойын'}).waitFor();
 assert.equal((await h.query('select * from public.practice_results where user_id=$1',[actors.player])).rows.length,0);
 assert.deepEqual(errors,[]);
 console.log(engine+': PASS: all five real SQL-scored practice games, refresh/draft restoration in each, lost-submit retry, sources after grading, 100/100 in independent desktop context, guest gate plus room-code entry, owner reset, 360px/1920px layouts. Fixture Auth, not Google or hosted Supabase.');
}finally{for(const context of contexts)await context.close();await browser.close();await vite.close();await h.close();}
