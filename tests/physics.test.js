import test from 'node:test';
import assert from 'node:assert/strict';
import {CONFIG as C} from '../config.js';
import {selectAnchor,updateAimGrace,grappleTarget,integratePlayer,releaseVelocity,segmentDistance,hazardProximity} from '../physics.js';
const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} ≠ ${expected}`);
test('aim selects the closest reachable anchor in the forward velocity cone',()=>{
 const p={x:0,y:0,px:-4,py:0}, valid={x:150,y:-80}, farther={x:250,y:-50};
 assert.equal(selectAnchor(p,[{x:-10,y:0},{x:451,y:0},{x:10,y:-100},farther,valid]),valid);
 assert.equal(selectAnchor(p,[{x:-10,y:0},{x:500,y:0}]),null);
});
test('grace allows a recently aimed anchor outside the cone but never beyond reach',()=>{
 const p={x:0,y:0,px:-4,py:0},a={x:200,y:0},aim={target:null,remaining:0};
 updateAimGrace(aim,p,[a],0);p.px=0;p.py=-4;
 assert.equal(grappleTarget(aim,p,[a]),a);
 updateAimGrace(aim,p,[a],C.COYOTE+.001);assert.equal(grappleTarget(aim,p,[a]),null);
 p.px=-4;p.py=0;updateAimGrace(aim,p,[a],0);a.x=451;assert.equal(grappleTarget(aim,p,[a]),null);
});
test('rope constraint reels and never exceeds the current length',()=>{
 const p={x:100,y:0,px:90,py:0},rope={anchor:{x:0,y:0},length:100};
 integratePlayer(p,rope,C.STEP);close(rope.length,99.5);close(Math.hypot(p.x,p.y),rope.length);
});
test('slow motion scales velocity without destroying it when the step changes',()=>{
 const p={x:0,y:0,px:-10,py:0};integratePlayer(p,null,C.STEP*.35,C.STEP);
 close(p.x,10*.35*Math.pow(C.DRAG,.35));const old=p.x;
 integratePlayer(p,null,C.STEP,C.STEP*.35);
 close(p.x-old,10*Math.pow(C.DRAG,1.35));
});
test('release is tangential, with the perfect bonus in the requested window',()=>{
 const p={x:50,y:86.602540378,px:40,py:91.602540378},a={x:0,y:0};
 const v=releaseVelocity(p,a);assert.equal(v.perfect,true);close(v.vx*50+v.vy*p.y,0,1e-7);close(v.angle,30,1e-7);
 const v2=releaseVelocity({x:0,y:100,px:-10,py:100},a);assert.equal(v2.perfect,false);close(v2.vx,10);
});
test('segment distance handles crossing, separated and degenerate paths',()=>{
 close(segmentDistance({x:-20,y:0},{x:20,y:0},{x:0,y:-10},{x:0,y:10}),0);
 close(segmentDistance({x:10,y:0},{x:10,y:0},{x:0,y:-5},{x:0,y:5}),10);
 close(segmentDistance({x:0,y:0},{x:10,y:0},{x:20,y:0},{x:30,y:0}),10);
});
test('swept laser collision catches fast movement and separates near misses',()=>{
 const h={kind:'vertical',x:100,y:300,phase:0};
 assert.equal(hazardProximity(h,{x:50,y:300},{x:150,y:300},0).hit,true);
 const near=hazardProximity(h,{x:120,y:300},{x:120,y:301},0);
 assert.equal(near.hit,false);assert.equal(near.near,true);
 assert.equal(hazardProximity(h,{x:150,y:300},{x:150,y:301},0).near,false);
});
test('moving blade sweep catches motion between frames',()=>{
 const h={kind:'blade',x:0,y:0,phase:0};
 assert.equal(hazardProximity(h,{x:0,y:80},{x:0,y:80},Math.PI/4,0).hit,true);
});
