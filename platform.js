// The only boundary that knows about portal SDKs. Other portals can implement this API.
export class PlatformAdapter {
  constructor(){this.sdk=null;this.blocked=true;this.active=false;this.portalMute=false;this.onMute=()=>{};this.onAd=()=>{};}
  async init(){
    // The standalone test build intentionally uses offline/local mode.
    if(window.SLING_HEIST_STANDALONE)return;
    try {
      if(!window.CrazyGames?.SDK) await Promise.race([new Promise(r=>{const s=document.getElementById('crazy-sdk');s.addEventListener('load',r,{once:true});s.addEventListener('error',r,{once:true});}),new Promise(r=>setTimeout(r,1800))]);
      const sdk=window.CrazyGames?.SDK;if(!sdk)return;
      await Promise.race([sdk.init(),new Promise((_,reject)=>setTimeout(()=>reject(Error('SDK timeout')),3000))]);
      this.sdk=sdk;this.call('game','loadingStart');if(this.active)this.call('game','gameplayStart');
      this.portalMute=!!sdk.game.settings?.muteAudio;
      sdk.game.addSettingsChangeListener?.(s=>{this.portalMute=!!s.muteAudio;this.onMute();});
      try{this.blocked=await sdk.ad.hasAdblock();}catch{this.blocked=true;}
    }catch(e){console.info('Platform unavailable; using local mode.');this.sdk=null;}
  }
  call(module,method,...args){try{return this.sdk?.[module]?.[method]?.(...args);}catch(e){console.info('Platform call unavailable:',method);}}
  ready(){this.call('game','loadingStop');}
  start(){if(!this.active){this.active=true;this.call('game','gameplayStart');}}
  stop(){if(this.active){this.active=false;this.call('game','gameplayStop');}}
  happy(){this.call('game','happytime');}
  get(key){try{return (this.sdk?.data||localStorage).getItem(key);}catch{return null;}}
  set(key,value){try{(this.sdk?.data||localStorage).setItem(key,value);}catch(e){console.info('Save unavailable');}}
  async profile(){try{return this.sdk?.user?.isUserAccountAvailable?await this.sdk.user.getUser():null;}catch{return null;}}
  async auth(){try{if(this.sdk?.user?.isUserAccountAvailable)return await this.sdk.user.showAuthPrompt();}catch{}return null;}
  invite(params){try{return this.sdk?.game?.inviteLink(params)||null;}catch{return null;}}
  param(key){try{return this.sdk?.game?.getInviteParam(key)||new URLSearchParams(location.search).get(key);}catch{return null;}}
  banner(show){const wrap=document.getElementById('banner-wrap');if(!show||!this.sdk){wrap.classList.add('hidden');this.call('banner','clearAllBanners');return;}wrap.classList.remove('hidden');Promise.resolve(this.call('banner','requestResponsiveBanner','banner')).catch(()=>wrap.classList.add('hidden'));}
  ad(type){
    if(!this.sdk || (type==='rewarded'&&this.blocked))return Promise.resolve(false);
    this.event('ad_requested',{type});
    return new Promise(resolve=>{let done=false,started=false;const finish=(ok,error)=>{if(done)return;done=true;clearTimeout(timer);if(started)this.onAd(false);this.event(ok?'ad_filled':'ad_errored',{type,error});resolve(ok);};const timer=setTimeout(()=>finish(false,'timeout'),5000);
      try{this.sdk.ad.requestAd(type,{adStarted:()=>{if(done)return;clearTimeout(timer);started=true;this.onAd(true);},adFinished:()=>finish(true),adError:e=>finish(false,String(e?.code||e))});}catch(e){finish(false,String(e));}
    });
  }
  event(name,data={}){console.info('[analytics]',name,data);window.dispatchEvent(new CustomEvent('slingheist:analytics',{detail:{name,...data}}));}
}
// Future portal builds should implement the same methods, without exposing their SDK to game code.
export class PokiAdapter extends PlatformAdapter {}
export class GameDistributionAdapter extends PlatformAdapter {}
export class ItchAdapter extends PlatformAdapter {}
