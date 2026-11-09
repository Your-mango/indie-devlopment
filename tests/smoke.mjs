import assert from 'node:assert/strict';
const elements=new Map(), events={};
const context=new Proxy({}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{id,textContent:'',innerHTML:'',dataset:{},classList:{toggle(){},add(){},remove(){}},style:{},addEventListener(type,fn){(events[id+':'+type]||=[]).push(fn)},getContext(){return context},getBoundingClientRect(){return {bottom:400}},setPointerCapture(){},click(){this.onclick?.({currentTarget:this})}});return elements.get(id)}
globalThis.document={getElementById:element,querySelectorAll:()=>[],addEventListener(){},createElement:element,hidden:false};
globalThis.window=globalThis;window.addEventListener=()=>{};window.dispatchEvent=()=>{};window.innerWidth=1280;window.innerHeight=720;window.devicePixelRatio=1;
globalThis.location={href:'https://example.test/',search:''};globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.Image=class {constructor(){this.complete=false}};globalThis.CustomEvent=class{};
let next;globalThis.requestAnimationFrame=fn=>{next=fn};
let starts=0,stops=0;window.CrazyGames={SDK:{init:async()=>{},game:{settings:{},loadingStart(){},loadingStop(){},gameplayStart(){starts++},gameplayStop(){stops++},addSettingsChangeListener(){},getInviteParam(){return null}},ad:{hasAdblock:async()=>true},data:{getItem:()=>null,setItem(){}},user:{isUserAccountAvailable:false},banner:{clearAllBanners(){}}}};
await import('../game.js');await new Promise(r=>setTimeout(r,0));
assert.equal(typeof element('play').onclick,'function');element('play').click();
assert.equal(starts,0,'gameplay waits for the player');
for(let i=0;i<600;i++)next(i*16.667);
assert.equal(starts,0,'waiting on the ready screen does not start gameplay');
assert.equal(stops,0,'waiting on the ready screen cannot kill the player');
events['game:pointerdown'][0]({preventDefault(){},pointerId:1});assert.equal(starts,1,'first input starts gameplay');
for(let i=600;i<1500;i++){next(i*16.667);if(i===650)events['game:pointerup'][0]();}
assert.ok(stops>=1,'a run reaches game over');assert.equal(typeof element('retry').onclick,'function');
await element('retry').onclick();assert.equal(starts,1,'retry does not start gameplay without input');
for(let i=1500;i<2100;i++)next(i*16.667);
assert.equal(starts,1,'retry remains ready even after waiting');
events['game:pointerdown'][0]({preventDefault(){},pointerId:1});assert.equal(starts,2,'retry starts on input');
element('pauseBtn').click();element('quit').click();assert.equal(typeof element('missionsBtn').onclick,'function');element('missionsBtn').click();assert.match(element('panel').innerHTML,/MISSIONS/);
console.log('Smoke test passed: safe ready screen, gameplay, input, death and missions.');
