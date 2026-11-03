// Only the exact original files whose Commons identity/rights records were reviewed.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const registry=JSON.parse(await readFile('src/assets/archive/registry.json','utf8'));
for(const item of registry){
 const path='src/assets/archive/'+item.file;
 let bytes;try{bytes=await readFile(path);}catch{
  if(process.argv.includes('--check'))throw Error('Missing reviewed asset: '+item.file);
  for(let attempt=0;attempt<5;attempt++){
   await new Promise(resolve=>setTimeout(resolve,15000));
   const response=await fetch(item.url,{headers:{'User-Agent':'ElZhady/1.0 educational archive (https://github.com/Owen1night/el-zhady-playtest)'},signal:AbortSignal.timeout(30000)});
   if(response.ok){bytes=Buffer.from(await response.arrayBuffer());break;}
   if(![429,502,503].includes(response.status)||attempt===4)throw Error(`${item.id}: HTTP ${response.status}`);
   await new Promise(resolve=>setTimeout(resolve,Math.min(60000,15000*(attempt+1))));
  }

 }
 if(bytes.length<1000||bytes.length>2000000||!(bytes[0]===0xff&&bytes[1]===0xd8||bytes[0]===0x89&&bytes[1]===0x50))throw Error('Invalid reviewed image: '+item.id);
 const hash=createHash('sha256').update(bytes).digest('hex');
 if(process.argv.includes('--check')){if(hash!==item.sha256)throw Error('Reviewed hash mismatch: '+item.id);}else{await writeFile(path,bytes);item.sha256=hash;}
}
if(!process.argv.includes('--check'))await writeFile('src/assets/archive/registry.json',JSON.stringify(registry,null,2)+'\n');
console.log('Verified image bytes/signatures for '+registry.length+' reviewed original files; no backend or deployment access.');
