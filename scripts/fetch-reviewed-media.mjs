// Only the exact original files whose Commons identity/rights records were reviewed.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const registry=JSON.parse(await readFile('src/assets/archive/registry.json','utf8'));
for(const item of registry){
 const path='src/assets/archive/'+item.file;
 let bytes;try{bytes=await readFile(path);}catch{
  const response=await fetch(item.url,{headers:{'User-Agent':'ElZhady educational archive review (GitHub Owen1night/el-zhady-playtest)'},signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`${item.id}: HTTP ${response.status}`);bytes=Buffer.from(await response.arrayBuffer());
 }
 if(bytes.length<1000||bytes.length>2000000||!(bytes[0]===0xff&&bytes[1]===0xd8||bytes[0]===0x89&&bytes[1]===0x50))throw Error('Invalid reviewed image: '+item.id);
 await writeFile(path,bytes);item.sha256=createHash('sha256').update(bytes).digest('hex');
}
await writeFile('src/assets/archive/registry.json',JSON.stringify(registry,null,2)+'\n');
console.log('Verified image bytes/signatures for '+registry.length+' reviewed original files; no backend or deployment access.');
