import {CONFIG as C} from './config.js';

/** Nearest anchor ahead of the player and inside the velocity cone. */
export function selectAnchor(player, anchors, step=C.STEP){
  let vx=(player.x-player.px)/step,vy=(player.y-player.py)/step;
  let speed=Math.hypot(vx,vy);
  if(speed<70){vx=1;vy=0;speed=1;}
  let target=null,best=C.REACH;
  for(const a of anchors){
    const dx=a.x-player.x,dy=a.y-player.y,d=Math.hypot(dx,dy);
    if(dx>0&&d>0&&d<=best&&(dx*vx+dy*vy)/(d*speed)>=Math.cos(C.CONE)){
      target=a;best=d;
    }
  }
  return target;
}

/** Remember the last valid aim briefly after it leaves the cone, but never extend reach. */
export function updateAimGrace(aim,player,anchors,dt,step=C.STEP){
  const target=selectAnchor(player,anchors,step);
  if(target){aim.target=target;aim.remaining=C.COYOTE;return target;}
  aim.remaining=Math.max(0,aim.remaining-dt);
  if(aim.remaining<=0||!anchors.includes(aim.target))aim.target=null;
  return null;
}
export function grappleTarget(aim,player,anchors,step=C.STEP){
  const current=selectAnchor(player,anchors,step);
  if(current){aim.target=current;aim.remaining=C.COYOTE;return current;}
  const a=aim.target;
  if(a&&aim.remaining>0&&anchors.includes(a)&&a.x>player.x&&Math.hypot(a.x-player.x,a.y-player.y)<=C.REACH)return a;
  return null;
}

/** Velocity-Verlet position update, including time-scaled drag and a unilateral rope constraint. */
export function integratePlayer(player,rope,dt,previousDt=C.STEP){
  const drag=Math.pow(C.DRAG,dt/C.STEP),ratio=dt/previousDt;
  const dx=(player.x-player.px)*ratio*drag,dy=(player.y-player.py)*ratio*drag;
  player.px=player.x;player.py=player.y;
  player.x+=dx;player.y+=dy+C.GRAVITY*dt*dt;
  if(rope){
    rope.length*=Math.pow(C.REEL,dt/C.STEP);
    const x=player.x-rope.anchor.x,y=player.y-rope.anchor.y,d=Math.hypot(x,y);
    if(d>rope.length){player.x=rope.anchor.x+x/d*rope.length;player.y=rope.anchor.y+y/d*rope.length;}
  }
}

/** Tangential release relative to the anchor. Speed is boosted only in the sweet spot. */
export function releaseVelocity(player,anchor){
  const x=player.x-anchor.x,y=player.y-anchor.y,len=Math.hypot(x,y)||1;
  let vx=player.x-player.px,vy=player.y-player.py;
  const dot=(vx*x+vy*y)/len;vx-=dot*x/len;vy-=dot*y/len;
  const angle=Math.abs(Math.atan2(x,y)*180/Math.PI);
  const perfect=angle>=C.PERFECT_MIN&&angle<=C.PERFECT_MAX&&vx>0;
  if(perfect){vx*=1.08;vy*=1.08;}
  return {vx,vy,angle,perfect};
}

function pointSegmentDistanceSquared(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;
  return (p.x-a.x-t*dx)**2+(p.y-a.y-t*dy)**2;
}
function cross(a,b,c){return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);}
function onSegment(p,a,b){return p.x>=Math.min(a.x,b.x)-1e-9&&p.x<=Math.max(a.x,b.x)+1e-9&&p.y>=Math.min(a.y,b.y)-1e-9&&p.y<=Math.max(a.y,b.y)+1e-9;}
function intersects(a,b,c,d){
  const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b),eps=1e-9;
  if(((x>eps&&y< -eps)||(x< -eps&&y>eps))&&((z>eps&&w< -eps)||(z< -eps&&w>eps)))return true;
  return (Math.abs(x)<=eps&&onSegment(c,a,b))||(Math.abs(y)<=eps&&onSegment(d,a,b))||(Math.abs(z)<=eps&&onSegment(a,c,d))||(Math.abs(w)<=eps&&onSegment(b,c,d));
}
export function segmentDistance(a,b,c,d){
  if(intersects(a,b,c,d))return 0;
  return Math.sqrt(Math.min(pointSegmentDistanceSquared(a,c,d),pointSegmentDistanceSquared(b,c,d),pointSegmentDistanceSquared(c,a,b),pointSegmentDistanceSquared(d,a,b)));
}
/** Swept collision avoids passing through a laser between physics frames. */
export function hazardProximity(hazard,from,to,time,previousTime=time){
  let distance,hitDistance;
  if(hazard.kind==='blade'){
    const currentY=hazard.y+Math.sin(time*2+hazard.phase)*70;
    const previousY=hazard.y+Math.sin(previousTime*2+hazard.phase)*70;
    distance=Math.sqrt(pointSegmentDistanceSquared({x:0,y:0},{x:from.x-hazard.x,y:from.y-previousY},{x:to.x-hazard.x,y:to.y-currentY}));
    hitDistance=C.PLAYER_RADIUS+25;
  }else{
    const horizontal=hazard.kind==='horizontal';
    const a={x:hazard.x-(horizontal?70:0),y:hazard.y-(horizontal?0:90)};
    const b={x:hazard.x+(horizontal?70:0),y:hazard.y+(horizontal?0:90)};
    distance=segmentDistance(from,to,a,b);hitDistance=C.PLAYER_RADIUS+2.5;
  }
  return {hit:distance<=hitDistance,near:distance>hitDistance&&distance<hitDistance+C.NEAR_MISS,distance};
}
