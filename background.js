import {CONFIG as C} from './config.js';

/** Returns seamless, mirrored background tiles in screen pixels. */
export function backgroundTiles(width,height,imageWidth,imageHeight,camera=0,time=0,reducedMotion=false){
  if(width<=0||height<=0||imageWidth<=0||imageHeight<=0)return [];
  const scale=Math.max(width/imageWidth,height/imageHeight);
  const tileWidth=imageWidth*scale,tileHeight=imageHeight*scale;
  const worldScale=height/C.HEIGHT;
  const distance=reducedMotion?0:(camera*C.BACKGROUND_PARALLAX+time*C.BACKGROUND_DRIFT)*worldScale;
  const period=tileWidth*2,offset=((distance%period)+period)%period;
  const origin=(width-tileWidth)/2-offset;
  const first=Math.floor(-origin/tileWidth);
  const tiles=[];
  for(let index=first, x=origin+first*tileWidth;x<width;index++,x+=tileWidth){
    tiles.push({x,y:(height-tileHeight)/2,width:tileWidth,height:tileHeight,mirror:Math.abs(index%2)===1});
  }
  return tiles;
}

/** Position a repeating, slower-moving decorative layer without world-sized arrays. */
export function decorativeOffset(camera,time,reducedMotion=false){
  if(reducedMotion)return 0;
  const distance=camera*C.BACKGROUND_DETAIL_PARALLAX+time*C.BACKGROUND_DETAIL_DRIFT;
  return ((distance%C.BACKGROUND_DETAIL_SPACING)+C.BACKGROUND_DETAIL_SPACING)%C.BACKGROUND_DETAIL_SPACING;
}
