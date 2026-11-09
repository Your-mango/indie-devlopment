// Original, light-hearted fourth-wall lines. These are cosmetic and never affect gameplay.
export const DIALOGUE={
 ready:["You pull the strings. Literally.","No rush. This vault isn't going anywhere.","You handle the rope. I'll handle looking cool."],
 perfect:["Did you see that? I definitely meant to do that.","We make a pretty good getaway team.","That was dangerously smooth."],
 near:["I meant to do that. Mostly.","Let's keep that between us and the laser.","Okay, that was a little close."],
 death:["Well, that was practice. We've got this.","Same team. New plan. Less floor.","The vault won that round. It won't win them all.","Good news: we can try that again."]
};
export function chooseDialogue(kind,random=Math.random){const lines=DIALOGUE[kind]||[];if(!lines.length)return '';return lines[Math.min(lines.length-1,Math.floor(random()*lines.length))];}
