const sim=require('../src/sim.js');
const seeds=parseInt(process.argv[2]||'60');const mode=process.argv[3]||'hero';
const tally={};let dlDead=0,st=0,heroHeld=0;
for(let s=1;s<=seeds;s++){const S=sim.genWorld(s*7919+13);let gotHero=false;
  while(!S.ended){
    const sw=S.sword;const h=sw.holder?sim.C(S,sw.holder):null;const st_=sw.stats;
    if(mode==='hero'){
      if(h&&h.hero&&h.faction!=='orcs'){gotHero=true;Object.assign(st_,{keen:Math.min(5,sw.will-5),valor:3,ward:2,glory:0,call:0,counsel:0});sw.seek='none';}
      else{ // pick nearest hero
        const K=S.kingdoms;const hx=h?h.x:sw.x,hy=h?h.y:sw.y;let best=null,bd=1e9;for(const[k,key] of [['dwarves','dwarfhero'],['elves','elfhero'],['city','humanhero']]){const c=sim.C(S,K[k].hero);if(!c.alive)continue;const d=Math.abs(c.x-hx)+Math.abs(c.y-hy);if(d<bd){bd=d;best=key;}}
        Object.assign(st_,{keen:1,valor:0,ward:2,glory:0,call:5,counsel:0});sw.seek=best||'nearest';}
    }
    sim.simulateTurn(S);}
  if(gotHero)heroHeld++;
  tally[S.fates.tier]=(tally[S.fates.tier]||0)+1;st+=S.fates.standing;const dl=S.kingdoms.orcs.darklord?sim.C(S,S.kingdoms.orcs.darklord):null;if(dl&&!dl.alive)dlDead++;}
console.log(mode,'outcomes',tally,'dlDead',dlDead,'avg standing',(st/seeds).toFixed(2),'reached hero',heroHeld);
