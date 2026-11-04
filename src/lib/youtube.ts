export function youtubeWatchUrl(videoId:string):string{
 if(!/^[A-Za-z0-9_-]{11}$/.test(videoId))throw new Error('Invalid YouTube video ID');
 return `https://www.youtube.com/watch?v=${videoId}`;
}
export function youtubeErrorMessage(code?:number):string{
 if(code===101||code===150)return 'Автор осы сайтта ойнатуға рұқсат бермейді. Бейнені төмендегі YouTube сілтемесімен ашыңыз.';
 if(code===100)return 'Бейне өшірілген немесе қолжетімділігі шектелген болуы мүмкін. YouTube сілтемесі арқылы тексеріңіз.';
 if(code===153)return 'YouTube осы беттен ойнатуды растай алмады. Бейнені YouTube сілтемесімен ашыңыз.';
 return 'Ойнатқыш жүктелмеді. Байланысты тексеріп, қайта көріңіз немесе төмендегі YouTube сілтемесін ашыңыз.';
}
