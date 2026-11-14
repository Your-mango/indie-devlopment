import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshotRenderState,interpolatedRenderState} from '../rendering.js';

test('camera, player, floor and time interpolate together without changing physics state',()=>{
 const run={p:{x:100,y:300},camera:0,time:0,floor:720,renderPrevious:{}};
 snapshotRenderState(run);run.p.x=120;run.p.y=310;run.camera=10;run.time=1;run.floor=716;
 assert.deepEqual(interpolatedRenderState(run,0),{x:100,y:300,camera:0,time:0,floor:720});
 assert.deepEqual(interpolatedRenderState(run,.5),{x:110,y:305,camera:5,time:.5,floor:718});
 assert.deepEqual(interpolatedRenderState(run,1),{x:120,y:310,camera:10,time:1,floor:716});
 assert.equal(run.p.x,120);assert.equal(run.camera,10);
});
test('rendering clamps interpolation to the previous/current simulation steps',()=>{
 const run={p:{x:1,y:2},camera:3,time:4,floor:5,renderPrevious:{x:0,y:0,camera:0,time:0,floor:0}};
 assert.equal(interpolatedRenderState(run,-2).x,0);
 assert.equal(interpolatedRenderState(run,2).x,1);
 assert.equal(interpolatedRenderState(run,NaN).x,1);
});
