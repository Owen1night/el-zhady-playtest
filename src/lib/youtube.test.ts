import test from 'node:test';
import assert from 'node:assert/strict';
import {youtubeWatchUrl,youtubeErrorMessage} from './youtube';
test('watch links preserve the exact case-sensitive supplied ID and strip tracking',()=>{
 assert.equal(youtubeWatchUrl('U_m3AiohJNI'),'https://www.youtube.com/watch?v=U_m3AiohJNI');
 for(const bad of ['','123','../iframe','javascript:alert(1)','8VoqgIjK-qw&autoplay=1'])assert.throws(()=>youtubeWatchUrl(bad));
});
test('provider refusal, removal and missing-referrer errors provide understandable fallback paths',()=>{
 for(const code of [100,101,150,153,undefined])assert.match(youtubeErrorMessage(code),/YouTube/);
 assert.equal(youtubeErrorMessage(101),youtubeErrorMessage(150));
 assert.match(youtubeErrorMessage(101),/рұқсат/);assert.match(youtubeErrorMessage(),/қайта/);
});
