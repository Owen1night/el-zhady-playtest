import {useState} from 'react';
import registry from '../assets/archive/registry.json';
import type {SourceReference} from '../data/types';
import {learningFacts,learningTimeline} from '../data/learning';
const files=import.meta.glob('../assets/archive/*.{jpg,png}',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
export function ArchiveMedia({id,credit=true}:{id:string;credit?:boolean}){const [failed,setFailed]=useState(false);const media=registry.find(m=>m.id===id);if(!media)return null;const src=files['../assets/archive/'+media.file];return <figure className="archive-media">{src&&!failed?<img src={src} alt={media.alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>:<p className="media-missing">Бейне жүктелмеді. Төмендегі түпнұсқа дерегін ашыңыз.</p>}{credit&&<figcaption><strong>{media.caption}</strong><p>{media.kind==='commemorative portrait'?'Еске алу жәдігері; соғыс кезіндегі фотосурет емес.':'Мұрағаттық фотопортрет; Commons-тағы қиындысы.'}</p><a href={media.record} target="_blank" rel="noreferrer">Түпнұсқа және сипаттамасы</a> · {media.creator} · <a href={media.licenseUrl} target="_blank" rel="noreferrer">{media.license}</a></figcaption>}</figure>;}
const descriptions:Record<string,[string,string,string]>={
 'war-periods':['1939 → 1941','Екінші дүниежүзілік соғыс','КСРО-ға шабуыл'],
 'rear-oral':['1941','Ленинград','Орал · №231'],
 'rear-care':['1941–1945','Тылдағы еңбек','Балаларға қамқорлық'],
 'cinema-almaty':['1941–1944','Мосфильм · Ленфильм','Алматы · ЦОКС'],
 'victory-context':['1945','Мамыр · Еуропа','Қыркүйек · Жапония'],
 'recovery-plan':['1946–1950','Қалпына келтіру','Өнеркәсіп · ауыл'],
 'history-books':['1943 → 1947','Ұжымдық тарих','Монография'],
 'persecution-1952':['1952','Тарихи зерттеу','Саяси қудалау'],
 'semey-1949':['1949 · 29 тамыз','Семей полигоны','Алғашқы кеңестік сынақ']
};
export function EventVisual({id,title,date,refs}:{id:string;title:string;date?:string;refs:readonly SourceReference[]}){
 const fact=learningFacts.find(f=>f.id===id);const entry=learningTimeline.find(e=>e.id===id);
 const people=fact?.figureIds||[];
 if(people.length)return <ArchiveMedia id={people[0]}/>;
 if(id==='culture-1953'||entry?.date==='1953')return <ArchiveMedia id="stalin"/>;
 const details=descriptions[id]||[date||entry?.date||'1939–1953','Оқиға',title];
 return <figure className="event-diagram"><svg viewBox="0 0 560 175" role="img" aria-label={`${details[0]}: ${details[1]} — ${details[2]}. Дерекке негізделген оқу сызбасы.`}><rect width="560" height="175" fill="#eee8dc"/><path d="M28 24H530M28 148H530" stroke="#b4a380"/><text x="28" y="68" className="diagram-date">{details[0]}</text><circle cx="40" cy="113" r="7" fill="#74392f"/><path d="M54 113H290" stroke="#8a7046" strokeWidth="2"/><path d="m280 107 12 6-12 6" fill="none" stroke="#8a7046"/><text x="28" y="96" className="diagram-label">{details[1]}</text><text x="310" y="119" className="diagram-label" textLength={details[2].length>25?220:undefined} lengthAdjust="spacingAndGlyphs">{details[2]}</text></svg><figcaption>Дерекке негізделген оқу сызбасы · Ел жады. Мұрағаттық құжат емес. {refs.map(r=>r.sourceId).filter((x,i,a)=>a.indexOf(x)===i).join(' · ')}; нақты дереккөз төменде.</figcaption></figure>;
}
