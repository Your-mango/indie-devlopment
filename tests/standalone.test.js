import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('single-file build has no external asset dependencies and starts a run in local mode',async()=>{
 const html=readFileSync('sling-heist-local.html','utf8');
 assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+href=|@import\s+url/i);
 assert.match(html,/data:image\/jpeg;base64,/);
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 assert.equal(scripts.length,2);
 const elements=new Map(),events={};
 const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function element(id){if(!elements.has(id))elements.set(id,{id,textContent:'',innerHTML:'',dataset:{},classList:{toggle(){},add(){},remove(){}},style:{},addEventListener(t,fn){(events[id+':'+t]||=[]).push(fn);},getContext(){return ctx;},getBoundingClientRect(){return {bottom:400};},setPointerCapture(){},click(){this.onclick?.({currentTarget:this});}});return elements.get(id);}
 let next,stored={};
 const sandbox={document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},createElement:element,hidden:false},innerWidth:1280,innerHeight:720,devicePixelRatio:1,location:{href:'file:///sling-heist-local.html',search:''},localStorage:{getItem:k=>stored[k]??null,setItem:(k,v)=>{stored[k]=v;}},Image:class{constructor(){this.complete=false;}},CustomEvent:class{},URL,URLSearchParams,performance:{now:()=>0},console:{info(){},log(){}},setTimeout(){return 1;},clearTimeout(){},requestAnimationFrame:fn=>{next=fn;},addEventListener(){},dispatchEvent(){}};
 sandbox.window=sandbox;vm.createContext(sandbox);for(const script of scripts)vm.runInContext(script,sandbox);await Promise.resolve();await Promise.resolve();
 assert.equal(typeof element('play').onclick,'function');element('play').click();
 for(let i=0;i<900;i++){next(i*16.667);if(i===2)events['game:pointerdown'][0]({preventDefault(){},pointerId:1});if(i===52)events['game:pointerup'][0]();}
 assert.equal(typeof element('retry').onclick,'function','a run reaches the game-over screen');
});
