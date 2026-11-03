import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {liveHarness,actors as a} from './live-harness';
test('solo practice: five real loops, authoritative grading, private persistence and idempotency',async()=>{
 const h=await liveHarness(true,true);
 try{
 await h.exec(await readFile(new URL('../migrations/20261103000500_solo_practice.sql',import.meta.url),'utf8'));
 for(const uid of [a.guest,a.outsider]){if(uid===a.guest)await assert.rejects(h.rpc(uid,'practice_begin',['quiz',randomUUID()]),/REGISTERED_REQUIRED/);}
 const attempts:Record<string,string>={};
 for(const kind of ['quiz','matching','ordering','map','classification']){
 const request=randomUUID(); const draft=await h.rpc<any>(a.player,'practice_begin',[kind,request]);attempts[kind]=draft.id;
 assert.equal(draft.score,null);assert(draft.items.every((q:any)=>!('correct'in q)&&!('explanation'in q)&&!('sources'in q)));
 assert.equal((await h.rpc<any>(a.player,'practice_begin',[kind,request])).id,draft.id);
 assert.equal((await h.rpc<any>(a.player,'practice_begin',[kind,randomUUID()])).id,draft.id,'cross-device active attempt reused');
 await assert.rejects(h.rpc(a.outsider,'practice_state',[draft.id]),/PRACTICE_NOT_FOUND/);
 await assert.rejects(h.rpc(a.guest,'practice_state',[draft.id]),/REGISTERED_REQUIRED/);
 const items=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[draft.id])).rows[0].items;
 const answers=kind==='ordering'?{order:items[0].correct.split('>')}:Object.fromEntries(items.map(q=>[q.id,q.correct]));
 await h.rpc(a.player,'practice_save',[draft.id,JSON.stringify(answers)]);
 assert.deepEqual((await h.rpc<any>(a.player,'practice_state',[draft.id])).answers,answers,'refresh/new device restores draft');
 await assert.rejects(h.rpc(a.player,'practice_submit',[draft.id,JSON.stringify({score:20})]),/INVALID_ANSWERS/);
 const result=await h.rpc<any>(a.player,'practice_submit',[draft.id,JSON.stringify(answers)]);
 assert.equal(result.score,20);assert(result.completed_at);assert(result.items.every((q:any)=>q.correct&&q.sources.length));
 assert.equal((await h.rpc<any>(a.player,'practice_submit',[draft.id,'{}'])).score,20,'retry cannot rescore completed attempt');
 assert.equal((await h.rpc<any>(a.player,'practice_state',[draft.id])).score,20);
 }
 assert.equal((await h.asUser(a.player,q=>q<{total:number}>('select sum(score)::int total from public.practice_results'))).rows[0].total,100);
 assert.equal((await h.asUser(a.outsider,q=>q('select * from public.practice_results'))).rows.length,0);
 await assert.rejects(h.asUser(a.player,q=>q("update public.practice_results set score=20")),/permission denied/);
 await assert.rejects(h.asUser(a.player,q=>q('select * from el_zhady_private.practice_sets')),/permission denied/);
 // Partial ordering gives position credit, never fabricated completion points.
 const retry=await h.rpc<any>(a.player,'practice_begin',['ordering',randomUUID()]);
 const key=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[retry.id])).rows[0].items[0].correct.split('>');
 [key[0],key[1]]=[key[1],key[0]];
 assert.equal((await h.rpc<any>(a.player,'practice_submit',[retry.id,JSON.stringify({order:key})])).score,12);
 assert.equal((await h.query<{score:number}>("select score from public.practice_results where user_id=$1 and activity_id='ordering'",[a.player])).rows[0].score,20,'best score preserved');
 const other=await h.rpc<any>(a.outsider,'practice_begin',['quiz',randomUUID()]);
 const otherItems=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[other.id])).rows[0].items;
 await h.rpc(a.outsider,'practice_submit',[other.id,JSON.stringify(Object.fromEntries(otherItems.map(q=>[q.id,q.correct])))]);
 await h.rpc(a.player,'practice_reset');
 assert.equal((await h.query('select * from public.practice_results where user_id=$1',[a.player])).rows.length,0);
 assert.equal((await h.query('select * from public.practice_results where user_id=$1',[a.outsider])).rows.length,1);
 assert.equal((await h.query('select count(*) n from public.live_quiz_results')).rows[0].n,0);
 }finally{await h.close();}
});
