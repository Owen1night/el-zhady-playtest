import test from 'node:test';
import assert from 'node:assert/strict';
import {rubricFacts,rubricTheses,videoSlots} from '../data/topic8';
import {learningFigures,contextFigures,learningSources} from '../data/learning';
import {facts,theses} from '../data/content';
import registry from '../assets/archive/registry.json';
import {validateContent} from './validate-content';
test('Topic 8 has ten actual theses and thirty unique numbered claims, independent of games and timeline',()=>{
 assert.equal(theses.length,10);assert.equal(facts.length,30);
 assert.deepEqual(rubricFacts.map(f=>f.number),Array.from({length:30},(_,i)=>i+1));
 assert.deepEqual(rubricTheses.map(t=>t.number),Array.from({length:10},(_,i)=>i+1));
 assert.equal(new Set(rubricFacts.map(f=>f.claimKey)).size,30);
 assert.equal(new Set(rubricFacts.map(f=>f.text)).size,30);
 assert.deepEqual(rubricTheses.flatMap(t=>t.factIds),rubricFacts.map(f=>f.id));
 assert(rubricTheses.every(t=>t.factIds.length===3&&t.text.length>100&&t.status==='sourced'));
 assert.deepEqual(validateContent({rubricFacts,rubricTheses,learningFigures,contextFigures},learningSources),[]);
 assert(rubricFacts.every(f=>f.status==='sourced'&&f.sourceRefs.length&&f.sourceRefs.every(r=>learningSources.find(s=>s.id===r.sourceId)?.url?.startsWith('https://'))));
});
test('eleven wartime profiles are separate from science/context and map to identified credited media',()=>{
 assert.equal(learningFigures.filter(p=>p.role==='hero').length,11);
 assert.equal(learningFigures.filter(p=>p.role==='postwar').length,3);
 assert.equal(contextFigures.length,2);assert(contextFigures.every(p=>p.role==='context'));
 for(const person of [...learningFigures,...contextFigures]){
  const media=registry.find(m=>m.id===(person.imageId||person.id));
  assert(media,person.name+' needs a portrait record');
  assert(media.caption&&media.alt&&media.creator&&media.license&&media.licenseUrl&&media.sha256);
  assert(media.record.startsWith('https://commons.wikimedia.org/wiki/File:'));
 }
 assert.equal(learningFigures.find(p=>p.id==='manshuk')?.imageId,'manshuk-photo');
 assert.equal(registry.find(m=>m.id==='manshuk')?.sha256,'4c526165b679a8d3210084b40aefd4180e3eaf060348053de8055c9ce4855f07');
 assert.equal(registry.find(m=>m.id==='manshuk')?.kind,'commemorative portrait');
 assert.equal(registry.find(m=>m.id==='tolegen')?.kind,'museum portrait sculpture');
});
test('the three requested video titles are honest unconfigured entries with no invented media URL',()=>{
 assert.deepEqual(videoSlots.map(v=>v.title),['Қазақстандықтардың Ұлы Отан соғысы шайқастарына қатысуы','Алаш қозғалысы және қазақ зиялылары','Соғыс жылдарындағы Қазақстан мәдениеті']);
 assert(videoSlots.every(v=>v.state==='awaiting-media'&&v.media===null));
});
