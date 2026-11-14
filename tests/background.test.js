import test from 'node:test';
import assert from 'node:assert/strict';
import {backgroundTiles,decorativeOffset} from '../background.js';

test('tiles cover desktop and portrait screens without gaps as the camera moves',()=>{
 for(const [w,h] of [[1280,720],[390,844],[320,568],[844,390]]){
  for(const camera of [0,100,1000,10000,1e6]){
   const tiles=backgroundTiles(w,h,1536,1024,camera,12,false);
   assert.ok(tiles.length>=1&&tiles.length<=3);
   assert.ok(tiles[0].x<=0);
   assert.ok(tiles.at(-1).x+tiles.at(-1).width>=w-1e-6);
   for(let i=1;i<tiles.length;i++){
    assert.ok(Math.abs(tiles[i].x-(tiles[i-1].x+tiles[i-1].width))<1e-6);
    assert.notEqual(tiles[i].mirror,tiles[i-1].mirror);
   }
  }
 }
});
test('background moves with travel and time, but remains still in reduced motion',()=>{
 const initial=backgroundTiles(1280,720,1536,1024,0,0);
 assert.notDeepEqual(backgroundTiles(1280,720,1536,1024,200,1),initial);
 assert.deepEqual(backgroundTiles(1280,720,1536,1024,200,100,true),backgroundTiles(1280,720,1536,1024,0,0,true));
 assert.equal(decorativeOffset(200,10,true),0);
 assert.notEqual(decorativeOffset(200,10,false),0);
});
test('invalid image and viewport sizes produce no tiles',()=>{
 assert.deepEqual(backgroundTiles(0,720,1536,1024),[]);
 assert.deepEqual(backgroundTiles(1280,720,0,1024),[]);
});

test('mirrored image remains continuous as a tile boundary crosses the viewport',()=>{
 const width=1280,height=720,iw=1536,ih=1024;
 const sample=(camera,x)=>{
  const tile=backgroundTiles(width,height,iw,ih,camera,0,false).find(t=>x>=t.x&&x<=t.x+t.width);
  const u=(x-tile.x)/tile.width;
  return tile.mirror?1-u:u;
 };
 // Follow the same screen pixel through several wrap boundaries.
 for(let camera=0;camera<16000;camera+=5){
  const before=sample(camera,0),after=sample(camera+.01,0);
  assert.ok(Math.abs(after-before)<.001,`jump at camera ${camera}`);
 }
});
