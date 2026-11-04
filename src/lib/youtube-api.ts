/** Official API is loaded only after an explicit visitor action, never on page entry. */
export type YouTubePlayer={destroy():void;getIframe():HTMLIFrameElement};
export type YouTubeApi={Player:new(element:HTMLElement,options:{
 host:string;videoId:string;width:string;height:string;
 playerVars:{autoplay:0;controls:1;playsinline:1;rel:0;hl:string;origin:string};
 events:{onReady:(event:{target:YouTubePlayer})=>void;onError:(event:{data:number})=>void};
})=>YouTubePlayer};
declare global{interface Window{YT?:YouTubeApi;onYouTubeIframeAPIReady?:()=>void}}
let pending:Promise<YouTubeApi>|undefined;
export function loadYouTubeApi():Promise<YouTubeApi>{
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(pending)return pending;
 pending=new Promise<YouTubeApi>((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  let settled=false;
  const cleanup=()=>{clearTimeout(timer);script.onerror=null;if(window.onYouTubeIframeAPIReady===ready)window.onYouTubeIframeAPIReady=previous;};
  const fail=()=>{if(settled)return;settled=true;cleanup();script.remove();pending=undefined;reject(new Error('YouTube API unavailable'));};
  const ready=()=>{if(settled)return;try{previous?.();}catch{/* An unrelated callback cannot hold this player's loading state. */}if(!window.YT?.Player){fail();return;}settled=true;cleanup();resolve(window.YT);};
  const timer=setTimeout(fail,12000);
  window.onYouTubeIframeAPIReady=ready;script.onerror=fail;document.head.append(script);
 });
 return pending;
}
