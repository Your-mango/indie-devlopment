// Builds a self-contained, offline gameplay-test file from the real source files.
// The generated file deliberately uses local mode; it is not a portal submission build.
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

let html=readFileSync('index.html','utf8');
let css=readFileSync('style.css','utf8').replace(/^@import\s+url\([^\n]+\);\s*/,'');
const image='data:image/jpeg;base64,'+readFileSync('assets/vault-bg.jpg').toString('base64');
let js=execFileSync('npx',['--yes','esbuild@0.25.12','game.js','--bundle','--format=iife','--target=es2020','--log-level=error'],{encoding:'utf8',maxBuffer:8*1024*1024});
function replaceOnce(text,needle,replacement){
  if(!text.includes(needle))throw new Error(`Build input not found: ${needle}`);
  return text.replace(needle,()=>replacement);
}
js=replaceOnce(js,'bg.src = "assets/vault-bg.jpg";',`bg.src = ${JSON.stringify(image)};`);
js=js.replace(/<\/script/gi,'<\\/script');
html=replaceOnce(html,'<link rel="stylesheet" href="style.css">',`<style>\n${css}\n</style>`);
html=replaceOnce(html,'<script id="crazy-sdk" async src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>','<script>window.SLING_HEIST_STANDALONE = true;</script>');
html=replaceOnce(html,'<script type="module" src="game.js"></script>',`<script>\n${js}\n</script>`);
writeFileSync('sling-heist-local.html',html);
console.log(`Created sling-heist-local.html (${(Buffer.byteLength(html)/1024).toFixed(0)} KB). Open it directly in a browser.`);
