/** Frozen authoring input stays outside src and is never shipped to browsers. */
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const bank=JSON.parse(await readFile('supabase/content/solo-v1.json','utf8'));
const sql=await readFile('supabase/migrations/20261103000500_solo_practice.sql','utf8');
for(const [kind,items] of Object.entries(bank) as [string,any[]][]){
 assert(['matching','ordering','classification'].includes(kind));
 assert.equal(items.length,kind==='ordering'?1:5);
 for(const q of items){
  assert(q.prompt&&q.explanation&&q.sources.length);
  assert(q.sources.every((s:any)=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.equal(new Set(q.options.map((o:any)=>o.id)).size,q.options.length);
  const correct=kind==='ordering'?q.correct.split('>'):[q.correct];
  assert(correct.every((id:string)=>q.options.some((o:any)=>o.id===id)));
 }
 assert(sql.includes("values('"+kind+"','solo-v1','"+JSON.stringify(items).replaceAll("'","''")+"'::jsonb)"),'Frozen solo seed and versioned SQL differ');
}
console.log('Solo seed checked: frozen sourced authoring input agrees with the pending migration; all answer IDs resolve.');
