const sim=require('../src/sim.js');
const seeds=parseInt(process.argv[2]||'30');
const tally={dawn:0,ember:0,quiet:0,night:0,twilight:0,uneasy:0};
let mistakes={dwarves:0,elves:0,city:0};let dlDead=0;let errors=0;let t0=Date.now();let totalTurns=0;
for(let s=1;s<=seeds;s++){
  let S;
  try{S=sim.genWorld(s*7919+13);while(!S.ended){sim.simulateTurn(S);totalTurns++;}}catch(e){errors++;console.log('seed',s,'ERR',e.stack.split('\n').slice(0,4).join('\n'));continue;}
  tally[S.fates.tier]++;
  for(const k of ['dwarves','elves','city']) if(S.kingdoms[k].mistake) mistakes[k]++;
  const dl=S.kingdoms.orcs.darklord?sim.C(S,S.kingdoms.orcs.darklord):null; if(dl&&!dl.alive) dlDead++;
  const alive=S.chars.filter(c=>c.alive).length;
  if(s<=5) console.log(`seed ${s}: ${S.fates.title} | alive ${alive}/${S.chars.length} | parties ${S.parties.length} | chron ${S.chronicle.length} | sword holder ${S.sword.holder?sim.C(S,S.sword.holder).name:'lost'} | hands ${S.sword.history.length} | will ${S.sword.will}`);
}
console.log('outcomes',tally,'mistakes',mistakes,'dlDead',dlDead,'errors',errors);
console.log('ms per turn',((Date.now()-t0)/totalTurns).toFixed(2));
