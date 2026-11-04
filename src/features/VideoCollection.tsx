import {useEffect,useRef,useState} from 'react';
import {ExternalLink,Play,RotateCcw,X} from 'lucide-react';
import {learningVideos,type LearningVideo} from '../data/videos';
import {loadYouTubeApi,type YouTubePlayer} from '../lib/youtube-api';
import {youtubeErrorMessage} from '../lib/youtube';
function VideoCard({video,index}:{video:LearningVideo;index:number}){
 const [attempt,setAttempt]=useState(0);const [phase,setPhase]=useState<'idle'|'loading'|'ready'|'error'>('idle');const [error,setError]=useState('');
 const mount=useRef<HTMLDivElement>(null);const openButton=useRef<HTMLButtonElement>(null);const closeButton=useRef<HTMLButtonElement>(null);
 const open=()=>{setError('');setPhase('loading');setAttempt(n=>n+1);requestAnimationFrame(()=>closeButton.current?.focus());};
 const close=()=>{setAttempt(0);setPhase('idle');setError('');requestAnimationFrame(()=>openButton.current?.focus());};
 useEffect(()=>{
  if(!attempt)return;
  let active=true;let player:YouTubePlayer|undefined;
  const holder=document.createElement('div');mount.current!.replaceChildren(holder);
  const dispose=()=>{player?.destroy();player=undefined;mount.current?.replaceChildren();};
  const fail=(code?:number)=>{if(!active)return;active=false;clearTimeout(timeout);dispose();setError(youtubeErrorMessage(code));setPhase('error');};
  const timeout=setTimeout(()=>fail(),15000);
  void loadYouTubeApi().then(api=>{
   if(!active)return;
   player=new api.Player(holder,{host:'https://www.youtube-nocookie.com',videoId:video.videoId,width:'100%',height:'100%',playerVars:{autoplay:0,controls:1,playsinline:1,rel:0,hl:'kk',origin:window.location.origin},events:{
    onReady:({target})=>{if(!active)return;clearTimeout(timeout);const frame=target.getIframe();frame.title=video.title;frame.referrerPolicy='strict-origin-when-cross-origin';frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;setPhase('ready');},
    onError:({data})=>fail(data),
   }});
   if(!active)dispose();
  }).catch(()=>fail());
  return()=>{active=false;clearTimeout(timeout);dispose();};
 },[attempt,video.videoId,video.title]);
 return <article className="video-card" data-video-slot={video.id} data-video-scope={video.scope}>
  <div className="video-media">
   <div className="video-stage" aria-busy={phase==='loading'}>
    <div ref={mount} className="youtube-mount" hidden={phase==='idle'||phase==='error'}/>
    {(phase==='idle'||phase==='error')&&<div className="video-cover"><span className="eyebrow">{video.scope==='core'?`БЕЙНЕ ${String(index).padStart(2,'0')}`:'ҚОСЫМША'} · YOUTUBE</span><span className="video-period">{video.periodLabel}</span><button ref={openButton} type="button" className="button primary" aria-label={`Ойнатқышты ашу: ${video.title}`} onClick={open}>{phase==='error'?<RotateCcw size={18}/>:<Play size={18}/>} {phase==='error'?'Қайта көру':'Осы бетте ашу'}</button></div>}
    {phase==='loading'&&<p className="video-loading" role="status">Ойнатқыш жүктелуде…</p>}
   </div>
   {attempt>0&&(phase==='loading'||phase==='ready')&&<button ref={closeButton} type="button" className="button secondary video-close" onClick={close}><X size={16}/> Ойнатқышты жабу</button>}
   {phase==='ready'&&<p className="video-status" role="status">Ойнатқыш дайын. Бастау үшін бейненің ойнату батырмасын басыңыз.</p>}
   {phase==='error'&&<p className="video-error" role="alert">{error}</p>}
  </div>
  <div className="video-copy"><span className="archive-stamp">{video.scope==='background'?'ҚОСЫМША КОНТЕКСТ':'НЕГІЗГІ ТАҚЫРЫП'}</span><h2>{video.title}</h2><p>{video.description}</p>{video.companionUrl&&<a className="video-source" href={video.companionUrl} target="_blank" rel="noopener noreferrer">Qazaqstan tarihy · бағдарлама дерегі <ExternalLink size={14}/></a>}<a className="button secondary video-youtube-link" href={video.url} target="_blank" rel="noopener noreferrer">YouTube-де ашу <ExternalLink size={17}/><span className="sr-only"> — {video.title} (жаңа бет)</span></a><p className="video-credit">Түпнұсқа атауы: «{video.originalTitle}». {video.creator?`Арна: ${video.creator}. `:''}Арна мәліметі мен қолжетімді субтитрлерді YouTube бетінен қараңыз.</p></div>
 </article>;
}
export function VideoCollection(){const core=learningVideos.filter(v=>v.scope==='core');const background=learningVideos.filter(v=>v.scope==='background');return <section className="video-collection" aria-label="Тақырыптық бейнелер"><p className="editorial-status">Ойнатқышты ашқанда YouTube қызметіне қосыласыз. Автоматты ойнату жоқ; бейне ашылмаса, әр карточкадағы YouTube сілтемесін пайдаланыңыз.</p><section aria-labelledby="core-videos"><div className="section-heading"><div><span className="eyebrow">МАЙДАН · МӘДЕНИЕТ · ҚАЛПЫНА КЕЛТІРУ</span><h2 id="core-videos">Негізгі тақырып: 3 бейне</h2></div></div><div className="video-grid">{core.map((video,i)=><VideoCard video={video} index={i+1} key={video.id}/>)}</div></section><section className="video-background" aria-labelledby="background-videos"><div className="section-heading"><div><span className="eyebrow">ҚОСЫМША МАТЕРИАЛ</span><h2 id="background-videos">Тарихи алғышарт: Алаш</h2></div></div><p>Бұл қосымша бейне негізгі үш бейненің санына кірмейді.</p><div className="video-grid">{background.map((video,i)=><VideoCard video={video} index={i+1} key={video.id}/>)}</div></section><p className="caption video-catalogue-note">4 бейнеге сілтеме: 3 негізгі тақырып, 1 тарихи алғышарт. Субтитр мен транскрипт толық тексерілмеген. ЖИ мұғалімімен сұхбат пен көшедегі сұхбат — бөлек материалдар.</p></section>;}
