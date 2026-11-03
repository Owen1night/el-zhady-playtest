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
 // Wrong answers earn zero for every type; no completion bonus or speed component.
 for(const kind of ['quiz','matching','ordering','map','classification']){
  const fresh=await h.rpc<any>(a.player2,'practice_begin',[kind,randomUUID()]);
  const items=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[fresh.id])).rows[0].items;
  let wrong:Record<string,string|string[]>;
  if(kind==='ordering'){const order=items[0].correct.split('>');wrong={order:[...order.slice(1),order[0]]};}
  else if(kind==='matching')wrong=Object.fromEntries(items.map((q,i)=>[q.id,items[(i+1)%5].correct]));
  else wrong=Object.fromEntries(items.map(q=>[q.id,q.options.find((o:any)=>o.id!==q.correct).id]));
  assert.equal((await h.rpc<any>(a.player2,'practice_submit',[fresh.id,JSON.stringify(wrong)])).score,0,kind+' wrong answers');
 }
 if(h.realPostgres){
  // Concurrent requests use separate connections/transactions in PostgreSQL.
  const request=randomUUID();
  const starts=await Promise.all(Array.from({length:4},()=>h.rpc<any>(a.player3,'practice_begin',['quiz',request])));
  assert.equal(new Set(starts.map(x=>x.id)).size,1,'racing begin requests create one attempt');
  const id=starts[0].id;
  const items=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[id])).rows[0].items;
  const answers=JSON.stringify(Object.fromEntries(items.map(q=>[q.id,q.correct])));
  const results=await Promise.all(Array.from({length:4},()=>h.rpc<any>(a.player3,'practice_submit',[id,answers])));
  assert(results.every(x=>x.score===20));
  assert.equal((await h.query<{n:number}>('select count(*)::int n from public.practice_results where user_id=$1',[a.player3])).rows[0].n,1);
 }
 for(const name of ['practice_save','practice_submit'])await assert.rejects(h.rpc(a.guest,name,[attempts.quiz,'{}']),/REGISTERED_REQUIRED/);
 await assert.rejects(h.rpc(a.guest,'practice_reset'),/REGISTERED_REQUIRED/);
 const other=await h.rpc<any>(a.outsider,'practice_begin',['quiz',randomUUID()]);
 const otherItems=(await h.query<{items:any[]}>('select items from el_zhady_private.practice_attempts where id=$1',[other.id])).rows[0].items;
 await h.rpc(a.outsider,'practice_submit',[other.id,JSON.stringify(Object.fromEntries(otherItems.map(q=>[q.id,q.correct])))]);
 const room=await h.createRoom();
 const member=await h.rpc<any>(a.player,'join_room',[room.code,'Сынақшы']);
 await h.query('insert into public.competition_results(participant_id,room_id,display_name_snapshot,display_suffix,score) values($1,$2,$3,1,73)',[member.participant_id,room.id,'Сынақшы']);
 await h.rpc(a.player,'practice_reset');
 assert.equal((await h.query('select * from public.practice_results where user_id=$1',[a.player])).rows.length,0);
 assert.equal((await h.query('select * from public.practice_results where user_id=$1',[a.outsider])).rows.length,1);
 assert.equal((await h.query<{score:number}>('select score from public.competition_results where participant_id=$1',[member.participant_id])).rows[0].score,73,'reset preserves earned competition scores');
 }finally{await h.close();}
});
