// Tunable values use world pixels, seconds and fixed 60 Hz frames unless noted.
export const CONFIG = Object.freeze({
  WIDTH:1280, HEIGHT:720, STEP:1/60, GRAVITY:1800, DRAG:.995,
  REACH:450, CONE:Math.PI/3, REEL:.995, PERFECT_MIN:20, PERFECT_MAX:70,
  COYOTE:.09, BUFFER:.1, CHUNK:320, MAX_GAP:382.5,
  FLOOR_BASE:120, FLOOR_SCALE:18, FLOOR_CAP:520, FLOOR_VERTICAL_FACTOR:.08, PLAYER_RADIUS:15,
  TELEGRAPH:.6, INVULNERABILITY:2, NEAR_MISS:12, HIT_STOP:.06,
  SAMPLE_RATE:.1, DEATH_CAM:5, REVIVE_COST:150, DAILY_PAR:640,
  REWARD_COOLDOWN:180000, PIXELS_PER_METER:10
});
export const SKINS=[['Thief',0,'#efc55d'],['Ninja',500,'#8699b1'],['Robot',700,'#7ed1c7'],['Cat',900,'#e8a68e'],['Skeleton',1100,'#e9eee1'],['Ghost',1400,'#a6dae7'],['Fox',1700,'#e77e50'],['Royal',2000,'#bc9be4'],['Viper',2400,'#a5d78a'],['Crimson',2800,'#e87977'],['Gold',3300,'#f6d75f'],['Shadow',4000,'#a38eb6']];
export const TRAILS=[['Classic',0,'#dfc586'],['Mint',500,'#8ee3c1'],['Ruby',800,'#ed7775'],['Ice',1200,'#87d9f4'],['Violet',1800,'#b49aef'],['Gold',2500,'#ffdf6e']];
export const BAGS=[['Canvas',0,'#b78d5c'],['Mint',500,'#81b8a1'],['Ruby',1000,'#cc7775'],['Gold',1800,'#e6bd5b']];
