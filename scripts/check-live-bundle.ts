import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const seed=await readFile('supabase/migrations/20261101000300_live_quiz_content_v1.sql','utf8');
const prompts=[...seed.matchAll(/\('30000000-[^']+','[^']+',\d+,'((?:[^']|'')*)'/g)].map(m=>m[1].replaceAll("''","'"));
assert.equal(prompts.length,10,'all original private prompts must be checked');
const bank=await readFile('supabase/migrations/20261103000200_question_bank_v2.sql','utf8');
const extra=[...bank.matchAll(/\('31000000-[^']+','[^']+',\d+,'((?:[^']|'')*)'/g)].map(m=>m[1].replaceAll("''","'"));
assert.equal(extra.length,10,'all new private prompts must be checked');

const files=await readdir('dist/assets');
const payload=(await Promise.all(files.filter(f=>f.endsWith('.js')).map(f=>readFile(`dist/assets/${f}`,'utf8')))).join('\n');
for(const value of ['LIVE_QUIZ_PRIVATE_CONTENT_V1','30000000-0000-4000-8000-','31000000-0000-4000-8000-','LIVE_QUIZ_PRIVATE_BANK_V2',...prompts,...extra]) assert(!payload.includes(value),`Private quiz content entered the browser bundle`);
console.log('Bundle checked: private seed marker, stable question IDs and all twenty prompts absent. Reveal field names are intentionally allowed.');
const mixed=await readFile('supabase/migrations/20261103000400_mixed_bank_v3.sql','utf8');
const mixedPrompts=[...mixed.matchAll(/\('34000000-[^']+','[^']+',\d+,'((?:[^']|'')*)'/g)].map(m=>m[1].replaceAll("''","'"));
assert.equal(mixedPrompts.length,30);
for(const value of ['LIVE_PRIVATE_MIXED_V3','34000000-0000-4000-8000-',...mixedPrompts])assert(!payload.includes(value),'Private mixed question/seed entered browser JS');
console.log('Mixed bundle guard: all 30 new authored prompts and private seed IDs/marker absent.');

const solo=JSON.parse(await readFile('supabase/content/solo-v1.json','utf8'));
for(const value of ['practice_sets','role-auezov','role-bekmakhanov','event-1952>'])assert(!payload.includes(value),'Private solo bank entered browser JS');
for(const items of Object.values(solo) as {sources:{url:string}[]}[][])for(const item of items)assert(item.sources.length&&item.sources.every(s=>s.url.startsWith('https://')),'Solo answers require original source references');
console.log('Solo bundle/source guard: private matching keys and practice bank absent; all additional answers have source references.');
