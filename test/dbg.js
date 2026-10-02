const sim=require('../src/sim.js');
const S=sim.genWorld(parseInt(process.argv[2]||'7932'));
while(!S.ended){sim.simulateTurn(S);}
const kinds=new Set((process.argv[3]||'doom,march,realm,hero').split(','));
for(const e of S.chronicle) if(kinds.has(e.kind)) console.log(`[${e.year}] (${e.kind}) ${e.text}`);
console.log('---');
for(const k of ['dwarves','elves','city']) console.log(k, S.kingdoms[k].omen.val.toFixed(0), S.kingdoms[k].mistake, S.kingdoms[k].status);
