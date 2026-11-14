/** Remember the most recent fixed simulation step for smooth rendering. */
export function snapshotRenderState(run){
  const previous=run.renderPrevious;
  previous.x=run.p.x;previous.y=run.p.y;
  previous.camera=run.camera;previous.time=run.time;previous.floor=run.floor;
}

/** Interpolate visuals only; physics, collisions, scores and input use real state. */
export function interpolatedRenderState(run,alpha=1){
  const previous=run.renderPrevious;
  const t=Math.max(0,Math.min(1,Number.isFinite(alpha)?alpha:1));
  const mix=(a,b)=>a+(b-a)*t;
  return {x:mix(previous.x,run.p.x),y:mix(previous.y,run.p.y),
    camera:mix(previous.camera,run.camera),time:mix(previous.time,run.time),
    floor:mix(previous.floor,run.floor)};
}
