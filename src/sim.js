/* ================= SOFT MAGIC — simulation core ================= */
const W=72,H=54,TURNS=100,CX=36,CY=28;
const TR={OCEAN:0,MOUNTAIN:1,HILLS:2,FOREST:3,WOODS:4,FIELDS:5,MARSH:6,BARRENS:7,GRAVE:8,MIST:9,DEEPS:10,LAKE:11};
const TINFO=[
 {name:'Sea',col:'#0e2c4f',col2:'#12365e',glyph:'≈',gcol:'#2c5f92'},
 {name:'Mountains',col:'#4a4a5e',col2:'#5c5c72',glyph:'▲',gcol:'#c4c4d8'},
 {name:'Hills',col:'#66723f',col2:'#74804a',glyph:'∩',gcol:'#aab164'},
 {name:'Old-growth forest',col:'#0e3a2a',col2:'#144a36',glyph:'♠',gcol:'#2f9463'},
 {name:'Woods',col:'#2a5a29',col2:'#346a32',glyph:'♣',gcol:'#78bd62'},
 {name:'Fields',col:'#7f8d38',col2:'#95a246',glyph:'"',gcol:'#d5dc86'},
 {name:'Marsh',col:'#3c5340',col2:'#4a624b',glyph:'~',gcol:'#93b47e'},
 {name:'Barrens',col:'#4b403d',col2:'#594c48',glyph:'·',gcol:'#8f7e74'},
 {name:'Swamp barrow',col:'#3b2f3e',col2:'#483b4c',glyph:'†',gcol:'#cdbbdb'},
 {name:'Grey mist',col:'#8b8fa5',col2:'#9b9fb5',glyph:'≋',gcol:'#e2e5f5'},
 {name:'The Sealed Deeps',col:'#23102f',col2:'#2e153f',glyph:'☠',gcol:'#a862d8'},
 {name:'Lake',col:'#15456c',col2:'#1a507c',glyph:'≈',gcol:'#4a95c8'}];
const COST=[99,3,2,2,2,1,3,1,1,99,99,99];
const REGION_NAMES=['North','West','Vale','East','South'];
const FACTIONS={
 dwarves:{name:'the Dwarves of the North',short:'Dwarves',color:'#e6a24a',race:'dwarf'},
 elves:{name:'the High Elves of the West',short:'High Elves',color:'#8fe0ff',race:'highelf'},
 vale:{name:'the Vale',short:'the Vale',color:'#c6d874',race:'human'},
 city:{name:'the Great City of the East',short:'Great City',color:'#f2d264',race:'human'},
 orcs:{name:'the Orcs of the South',short:'Orcs',color:'#d9432c',race:'orc'},
 goblins:{name:'the Goblins of the Deep',short:'Goblins',color:'#b56fe0',race:'goblin'}};
const RACE_NAMES={dwarf:'dwarf',highelf:'high elf',woodelf:'wood elf',human:'human',orc:'orc',goblin:'goblin'};
const LIFE={human:76,dwarf:245,orc:56,goblin:38,highelf:Infinity,woodelf:Infinity};
const STR={leader:6,hero:9,captain:7,warrior:5,ranger:5,sailor:3,merchant:1,farmer:1,smith:2,priest:1,scholar:0,elder:1,reeve:3,miner:2,chieftain:7,orc:4,shaman:3,darklord:16,general:8,goblin:3,goblinking:10,envoy:1,settler:1};
const ROLE_LABEL={leader:'leader',hero:'hero',captain:'captain',warrior:'warrior',ranger:'ranger',sailor:'sailor',merchant:'merchant',farmer:'farmer',smith:'smith',priest:'priest',scholar:'scholar',elder:'elder',reeve:'reeve',miner:'miner',chieftain:'chieftain',orc:'orc warrior',shaman:'shaman',darklord:'Dark Lord',general:'warlord',goblin:'goblin',goblinking:'goblin king',envoy:'envoy',settler:'settler'};
const POP_SPEC={capital:['leader','hero','captain','captain','warrior','warrior','warrior','priest','smith','scholar','merchant','farmer'],town:['leader','captain','warrior','warrior','merchant','smith','farmer','priest','scholar','farmer'],village:['elder','warrior','farmer','farmer'],hold:['captain','warrior','warrior','smith','miner','miner'],haven:['captain','sailor','sailor','warrior','scholar','merchant'],glade:['captain','ranger','ranger','ranger','priest','farmer'],camp:['chieftain','orc','orc','orc','shaman'],fortress:['general','orc','orc','orc','shaman','orc'],dcamp:['captain','warrior','smith','miner','farmer','priest','warrior','farmer'],rhaven:['captain','sailor','warrior','scholar','priest','merchant']};
const BIRTH_ROLES={capital:['warrior','warrior','warrior','captain','priest','smith','scholar','merchant','farmer','farmer'],town:['warrior','warrior','merchant','smith','farmer','farmer','priest','scholar'],village:['farmer','farmer','warrior','farmer'],hold:['warrior','miner','smith','warrior'],haven:['sailor','sailor','warrior','scholar','merchant'],glade:['ranger','ranger','farmer','priest'],camp:['orc','orc','orc','shaman'],fortress:['orc','orc','orc','general','shaman'],dcamp:['warrior','farmer','smith','miner'],rhaven:['sailor','warrior','scholar']};
const NAMES={
 dwarf:{first:['Bal','Thr','Dur','Gim','Kaz','Nor','Brok','Hild','Vor','Grun','Mor','Tor','Ald','Sig','Bryn','Orm'],end:['in','ok','und','ar','rim','gard','vi','ra','nir','dis','a','rik','unn','bur','wen','di'],sur:['Ironbrow','Stonehewer','Deepdelve','Coppervein','Anvilheart','Grimtooth','Emberbeard','Hollowpick','Silverhame','Rockward','Brightaxe','Coalhand','Fellhammer','Oreson','Gravelbeard']},
 highelf:{first:['Ael','Cael','Sil','Thal','Ith','Lor','Ery','Vael','Nim','Cir','Ela','Fae','Aer','Mael','Ondr'],end:['ar','ion','iel','wen','andr','ith','oril','ael','ys','ora','uin','anna','ethe','ir'],sur:['of the Silver Tide','Moonwake','Starharbour','of the Deep Roots','Tidesinger','Fairwind','Dawnrigger','Saltbright','of the First Sail','Evenstrand','of the Long Shore','Gullsong']},
 woodelf:{first:['Fen','Wyn','Bry','Tam','Ilv','Rhos','Ash','Haze','Mer','Tal','Bri','Cor'],end:['wick','ael','lin','dra','ith','ryn','ow','ise','y','en','iel','ath'],sur:['Thornsong','Greenmantle','Leafwhistle','Brackenshade','Mossfoot','Dapplewood','Hollybright','Fernhollow','Rushlight','Alderkin']},
 human:{first:['Bram','Tam','Wend','Hal','Rowan','Mab','Ede','Cor','Aur','Cas','Ser','Val','Mar','Oct','Lyd','Tib','Jon','Isol','Pell','Gwen','Osk','Elin','Rand','Hest'],end:['','','','','ius','ian','ella','ora','en','ric','wyn','et','a','o'],sur:['Miller','Reed','Fallow','Ashby','Valerian','Corvane','Ostrell','Harrow','Fenwick','Marrow','Draycott','Sallow','Kesteven','Oakes','Marlow','Thatcher','Vane','Crane','Weir']},
 goblin:{first:['Snik','Grub','Nag','Vix','Krel','Zit','Mok','Fizz','Skab','Tib','Wurm','Glim'],end:['it','ok','ash','le','zik','nak','rat','ug','ip','ek'],sur:['the Biter','Cave-Eye','Sixfingers','of the Low Tunnels','Rat-Rider','the Small','Candle-Thief','of the Sunless Stair']},
 orc:{first:['Gor','Ur','Mog','Zag','Thruk','Vaur','Skar','Brag','Dru','Khar','Ogh','Ruz','Gnash','Yag'],end:['gash','uk','thak','rok','zug','nar','mog','ash','gul','dak','ok','ath','ra','ur'],sur:['the Flayer','Bonebreaker','of the Red Hand','Skullsplitter','the Cruel','Ironjaw','Nightgore','of the Ash Tribes','the Wide','Two-Blades','Gravemaw','the Unburied']}};
const SETNAMES={dwarf:['Thrundahal','Karak Vorn','Grimhold','Azgar Deep','Kholvar','Barazhal','Norrimund',"Durgan's Rest",'Embervault','Kazad Morn','Ironreach','Hammerdeep','Stonevale'],elf:['Syl Aerath','Ithilmar','Nimrathel','Ethelyn','Saelith','Vaeloria','Thalys','Caer Ondril','Lirewood','Evenhaven','Tideglass','Silverbough'],vale:['Merrowvale','Ashby','Reedmoor','Fallowmere','Hollin','Bramblewick','Weirford','Sallowden'],glade:['Thornlight Glade','Hazelmere','the Green Hollow','Alderthorn'],city:['Aurelis','Vandermere','Corvane','Sallowgate','Kesteven','Marrowport','Ostrakal','Millford','Greyharrow','Coldwater','Ashenbrook','Fenmarch'],orc:['Gash-Kul','Skarrog','Uzgul Mire','Bragh-Dum','the Hollow Teeth','Vrakh','Gorrum','Ashpit']};
const FORT_NAMES=['the Barrow Throne','Blackfane','the Ashen Keep','the Unburied Gate','Gravemount'];
const DL_TITLES=['the Ashen King','the Unburied','the Crowned Dark','the Barrow-Lord','the Night That Walks','the Hollow King'];
const SWORD_NAMES=['Dawnwhisper','Quietfire','Oathlight','Morrowblade','Vigil','Emberline','Hushbrand','Starfall','Softsong','Kindling','Lanternedge','Sorrowless','Riversong'];
const AGE_NAMES=['Age of Embers','Age of Quiet Rivers','Age of the Long Thaw','Age of Lanterns','Age of the Low Stars','Age of Salt and Iron','Age of the Turning Tide'];
const LIKES=['the smell of rain on stone','strong ale','old songs','tall ships','quiet mornings','maps of far places','the sound of hammers','honey cakes','the first snow','riddles','fine cloth','fresh-turned earth','the river at dusk','the stars','a good argument','moss','warm bread','a well-oiled blade','wolfhounds','being alone','festivals','the smell of pine','cold water','fireside stories','the colour blue'];
const FEARS=['the deep dark','drowning','being forgotten','the open sea','fire','the shadow in the South','growing old','the grey mist','spiders','a quiet death','heights','the wrath of the gods','crowds','omens','losing their name','the hollow places under the hills','a bad harvest','oaths'];
const RFEARS={goblin:['sunlight','dwarves with lanterns'],dwarf:['what sleeps beneath the roots of the mountain','the sound of digging in the dark','goblins in the walls'],highelf:['the ending of things','the sea going silent'],woodelf:['axes','the fields being ploughed under'],human:['the plague','being poor'],orc:['the Dark Lord','being forgotten by the tribe','sunlight on open ground']};
const AMBITIONS=['to see the western sea','to be remembered in song','to keep the valley safe','to outlive the age','to rule','to be wealthy','to raise a family in peace','to slay a chieftain','to sail every river','to read every book in the Great City','to hold the sword of the river','to build a bridge that lasts','to die well','to be left alone','to find a lost friend','to see the Great City once'];
const RAMB={goblin:['to steal a crown','to eat a candle'],dwarf:['to forge a masterwork','to delve deeper than any before','to find the lost halls'],highelf:['to remember everything','to sail beyond the mist'],woodelf:['to plant a forest','to walk every path in the Vale'],human:['to own a mill','to be knighted','to invent something'],orc:['to burn the Great City','to lead a tribe','to take the sword']};

/* ---------- helpers ---------- */
function rnd(S){S.rng=(S.rng+0x6D2B79F5)|0;let t=S.rng;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
function ri(S,a,b){return a+Math.floor(rnd(S)*(b-a+1));}
function pick(S,a){return a[Math.floor(rnd(S)*a.length)];}
function chance(S,p){return rnd(S)<p;}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function idx(x,y){return y*W+x;}
function inb(x,y){return x>=0&&y>=0&&x<W&&y<H;}
function mdist(ax,ay,bx,by){return Math.abs(ax-bx)+Math.abs(ay-by);}
function C(S,id){return S.chars[id-1];}
function party(S,id){if(!id)return null;for(const p of S.parties)if(p.id===id)return p;return null;}
function setById(S,id){return S.settlements[id-1]||null;}
function settlementAt(S,x,y){for(const s of S.settlements)if(s.x===x&&s.y===y)return s;return null;}
function charsAt(S,x,y){const r=[];for(const c of S.chars)if(c.alive&&c.x===x&&c.y===y)r.push(c);return r;}
const MONSTER={orcs:1,goblins:1};
function hostile(S,fa,fb){if(fa===fb)return false;const ma=MONSTER[fa],mb=MONSTER[fb];if(ma&&mb)return!S.goblinsAllied;if(ma||mb)return true;if(fa==='vale'||fb==='vale')return false;return atWar(S,fa,fb);}
function relKey(a,b){return a<b?a+'|'+b:b+'|'+a;}
function rel(S,a,b){const v=S.diplo.rel[relKey(a,b)];return v==null?0:v;}
function addRel(S,a,b,d){const k=relKey(a,b);S.diplo.rel[k]=clamp((S.diplo.rel[k]||0)+d,-100,100);}
function atWar(S,a,b){return!!S.diplo.war[relKey(a,b)];}
function relWord(v){return v>=60?'warm':v>=25?'cordial':v>=0?'civil':v>=-30?'cool':v>=-60?'cold':'hostile';}
function kingdomOf(S,f){return S.kingdoms[f]||null;}
function ageOf(S,c){return S.year-c.born;}
function firstName(c){return c.name.split(' ')[0];}
function pn(c){return c.sex==='f'?{s:'she',o:'her',p:'her',S:'She'}:{s:'he',o:'him',p:'his',S:'He'};}
function roleName(c){return c.role==='leader'&&c.title?c.title:ROLE_LABEL[c.role]||c.role;}
function listNames(arr){const n=arr.map(c=>c.name);if(n.length<=1)return n.join('');return n.slice(0,-1).join(', ')+' and '+n[n.length-1];}
function isFree(f){return!MONSTER[f];}
function log(S,kind,text,x,y,chars){S.chronicle.push({turn:S.turn,year:S.year,kind,text,x:x==null?null:x,y:y==null?null:y,chars:chars||[]});}
function story(S,c,text){c.story.push({year:S.year,text});if(c.story.length>60)c.story.splice(0,c.story.length-60);}
function takeName(S,list){const used=S.usedNames;const free=SETNAMES[list].filter(n=>!used[n]);const n=free.length?pick(S,free):pick(S,SETNAMES[list])+' the Younger';used[n]=1;return n;}
function genName(S,race){const t=NAMES[race];const base=cap(pick(S,t.first)+pick(S,t.end));const withSur=race==='orc'?chance(S,0.45):chance(S,0.85);return withSur?base+' '+pick(S,t.sur):base;}
function isAt(a,b){return a.x===b.x&&a.y===b.y;}
function standing(s){return s.status==='standing'||s.status==='besieged';}
function terrainName(S,x,y){return TINFO[S.terrain[idx(x,y)]].name;}
function nearestSettlement(S,x,y,filter){let best=null,bd=1e9;for(const s of S.settlements){if(filter&&!filter(s))continue;const d=mdist(s.x,s.y,x,y);if(d<bd){bd=d;best=s;}}return best;}
function landName(S,x,y){const s=settlementAt(S,x,y);if(s)return`at ${s.name}`;const n=nearestSettlement(S,x,y);const t=terrainName(S,x,y).toLowerCase();if(n&&mdist(n.x,n.y,x,y)<=8)return`in the ${t} near ${n.name}`;return`in the ${t} of the ${REGION_NAMES[S.region[idx(x,y)]]}`;}
function placeName(S,x,y){const s=settlementAt(S,x,y);if(s)return s.name;const n=nearestSettlement(S,x,y);const t=terrainName(S,x,y).toLowerCase();const i=idx(x,y);if(n&&mdist(n.x,n.y,x,y)<=8)return S.river[i]?`the river below ${n.name}`:`the ${t} near ${n.name}`;return S.river[i]?`the river in the ${REGION_NAMES[S.region[i]]}`:`the ${t} of the ${REGION_NAMES[S.region[i]]}`;}
function homeCapital(S,c){const K=kingdomOf(S,c.faction);if(K&&K.capital){const cs=setById(S,K.capital);if(cs&&standing(cs))return cs;}const h=c.home?setById(S,c.home):null;return h&&standing(h)?h:null;}
function leadChar(S,p){let best=null,bs=-1;for(const id of p.members){const c=C(S,id);if(!c.alive)continue;const s=c.strength+(c.hero?20:0)+(c.role==='darklord'?30:0)+(c.role==='leader'?8:0)+c.renown*0.1;if(s>bs){bs=s;best=c;}}return best;}
function leadRace(S,p){const l=leadChar(S,p);return l?l.race:'human';}
function combatKind(p){return p.kind==='army'||p.kind==='warband'||p.kind==='host'||p.kind==='company'||p.kind==='patrol';}
function kingdomKeys(){return['dwarves','elves','city'];}
function standingKingdom(S,k){const K=S.kingdoms[k];return K&&K.status==='standing'&&!(k==='city'&&K.vassal);}
function nearestThreat(S,x,y,faction,range){let best=null,bd=range+1;for(const p of S.parties){if(!hostile(S,p.faction,faction))continue;if(!combatKind(p))continue;const d=mdist(p.x,p.y,x,y);if(d<bd){bd=d;best=p;}}return best;}
function nearestSafe(S,c,threat){let best=null,bd=1e9;for(const s of S.settlements){if(!standing(s)||hostile(S,s.faction,c.faction))continue;const d=mdist(s.x,s.y,c.x,c.y);const dt=mdist(s.x,s.y,threat.x,threat.y);if(dt<=d+2)continue;if(d<bd){bd=d;best=s;}}return best;}
function vnoise(seed,x,y,scale){const fx=x/scale,fy=y/scale;const x0=Math.floor(fx),y0=Math.floor(fy);const tx=fx-x0,ty=fy-y0;const sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);const h=(ix,iy)=>{let n=(ix*374761393+iy*668265263+seed*1274126177)|0;n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;return(n>>>0)/4294967296;};const a=h(x0,y0),b=h(x0+1,y0),c=h(x0,y0+1),d=h(x0+1,y0+1);return(a+(b-a)*sx)*(1-sy)+(c+(d-c)*sx)*sy;}
function maxGarrison(s){return {capital:90,town:50,village:10,hold:25,haven:20,glade:16,camp:20,fortress:260,dcamp:20,rhaven:16}[s.type]||10;}
function gainWill(S){const sw=S.sword;if(sw.will<16){sw.will++;log(S,'sword',`${sw.name} drank in the deed. Its will deepened.`,sw.x,sw.y,[]);}}

/* ---------- world generation ---------- */
function genWorld(seed,opts){
  const S={hard:!!(opts&&opts.hard),seed,rng:(seed|0)||7,turn:0,year:0,terrain:new Array(W*H).fill(TR.FIELDS),river:new Array(W*H).fill(0),region:new Array(W*H).fill(2),
    settlements:[],chars:[],parties:[],nextParty:1,chronicle:[],kingdoms:{},sword:null,riseTurn:0,plague:0,ended:false,fates:null,ageName:'',usedNames:{},terrainVersion:0,fortressSite:null,owner:null,dev:null,diplo:{rel:{},war:{}},quests:[],questSeq:0,alliance:false,goblinsAllied:false,dlCandidate:null,candidateSlain:false};
  S.riseTurn=ri(S,44,54);S.ageName=pick(S,AGE_NAMES);
  genTerrain(S);genSettlements(S);genRivers(S);genKingdoms(S);initTerritory(S);initDiplo(S);genPeople(S);genSword(S);
  log(S,'realm',`The ${S.ageName} began. In the North the dwarves kept their halls; in the West the elves kept their ships; in the East the Great City kept its walls; and in the Vale between them, humans and wood elves shared the river. In the South, among the swamp barrows, the orc tribes quarrelled with one another and were not yet a danger to anyone but themselves.`,CX,CY,[]);
  return S;
}
function genTerrain(S){const seed=S.seed;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n1=vnoise(seed,x,y,9),n2=vnoise(seed+11,x,y,4),n3=vnoise(seed+23,x,y,2.2);let t=TR.FIELDS,reg=3;
    if(n2<0.28)t=TR.HILLS;else if(n2<0.5&&n3<0.55)t=TR.WOODS;
    const d=Math.hypot(x-CX,(y-CY)*1.15);
    if(d<7+3*n2){t=TR.FIELDS;reg=2;}else if(d<13+3*n2){t=n3<0.3?TR.HILLS:(n3<0.62?TR.WOODS:TR.FIELDS);reg=2;}
    if(x<48&&reg===3)reg=2;
    if(x<22+7*n1&&y>9+4*n1&&y<H-11+3*n1){t=TR.FOREST;reg=1;}
    if(y<15+4*n1){t=TR.HILLS;reg=0;}
    if(y<11+4*n1){t=TR.MOUNTAIN;reg=0;}
    if(y>H-13+4*n1){t=TR.BARRENS;reg=4;if(n3<0.3)t=TR.MARSH;else if(n3>0.78)t=TR.GRAVE;}
    if(x<3+4*n1)t=TR.OCEAN;if(x>W-4-3*n1)t=TR.OCEAN;
    S.terrain[idx(x,y)]=t;S.region[idx(x,y)]=reg;}
}
function findTile(S,px,py,ok,maxR){maxR=maxR||14;for(let r=0;r<=maxR;r++){const cands=[];for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=px+dx,y=py+dy;if(x<1||y<1||x>=W-1||y>=H-1)continue;if(ok(x,y))cands.push([x,y]);}if(cands.length)return pick(S,cands);}return[clamp(px,1,W-2),clamp(py,1,H-2)];}
function addSet(S,o){const s={id:S.settlements.length+1,name:o.name,faction:o.faction,race:o.race,x:o.x,y:o.y,type:o.type,pop:o.pop||1000,prosperity:o.prosperity==null?50:o.prosperity,walls:o.walls==null?5:o.walls,garrison:o.garrison==null?8:o.garrison,status:'standing',target:o.target||4,besiegedBy:null,orcGarrison:0,fallTurn:null,region:S.region[idx(o.y,o.x)]!==undefined?S.region[idx(o.x,o.y)]:2,founded:S.turn};S.settlements.push(s);return s;}
function genSettlements(S){
  const isT=(x,y,...ts)=>ts.includes(S.terrain[idx(x,y)]);
  const free=(x,y)=>!S.settlements.some(s=>mdist(s.x,s.y,x,y)<4);
  const nearOcean=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inb(x+dx,y+dy)&&S.terrain[idx(x+dx,y+dy)]===TR.OCEAN);
  let x,y;
  [x,y]=findTile(S,CX+ri(S,-6,6),6+ri(S,0,3),(x,y)=>isT(x,y,TR.MOUNTAIN)&&free(x,y));
  addSet(S,{name:takeName(S,'dwarf'),faction:'dwarves',race:'dwarf',x,y,type:'capital',pop:9000,walls:50,garrison:50,target:12,prosperity:60});
  const ey=24+ri(S,-5,5);let ex=1;while(ex<W-2&&S.terrain[idx(ex,ey)]===TR.OCEAN)ex++;
  [x,y]=findTile(S,ex,ey,(x,y)=>!isT(x,y,TR.OCEAN)&&nearOcean(x,y)&&free(x,y));
  addSet(S,{name:takeName(S,'elf'),faction:'elves',race:'highelf',x,y,type:'capital',pop:6000,walls:30,garrison:45,target:12,prosperity:60});
  [x,y]=findTile(S,CX+ri(S,-2,2),CY+ri(S,-2,2),(x,y)=>isT(x,y,TR.FIELDS)&&free(x,y));
  addSet(S,{name:takeName(S,'vale'),faction:'vale',race:'human',x,y,type:'town',pop:4000,walls:20,garrison:35,target:12,prosperity:55});
  const cy=22+ri(S,-5,5);let cx=W-2;while(cx>2&&S.terrain[idx(cx,cy)]===TR.OCEAN)cx--;cx-=1;
  [x,y]=findTile(S,cx,cy,(x,y)=>!isT(x,y,TR.OCEAN,TR.MOUNTAIN)&&free(x,y));
  addSet(S,{name:takeName(S,'city'),faction:'city',race:'human',x,y,type:'capital',pop:30000,walls:45,garrison:70,target:14,prosperity:70});
  [x,y]=findTile(S,CX+ri(S,-8,8),H-5+ri(S,-2,1),(x,y)=>isT(x,y,TR.BARRENS,TR.GRAVE,TR.MARSH)&&free(x,y));S.fortressSite=[x,y];
  for(const[px,py]of[[CX-17,5],[CX+15,6]]){[x,y]=findTile(S,px+ri(S,-3,3),py+ri(S,-1,3),(x,y)=>isT(x,y,TR.MOUNTAIN,TR.HILLS)&&free(x,y));addSet(S,{name:takeName(S,'dwarf'),faction:'dwarves',race:'dwarf',x,y,type:'hold',pop:1500,walls:25,garrison:15,target:6,prosperity:50});}
  [x,y]=findTile(S,CX+ri(S,-9,9),17+ri(S,-1,2),(x,y)=>isT(x,y,TR.HILLS,TR.FIELDS)&&free(x,y));addSet(S,{name:takeName(S,'dwarf'),faction:'dwarves',race:'dwarf',x,y,type:'hold',pop:1200,walls:15,garrison:10,target:5,prosperity:50});
  for(const[px,py]of[[13,15],[16,38]]){[x,y]=findTile(S,px+ri(S,-3,3),py+ri(S,-3,3),(x,y)=>isT(x,y,TR.FOREST)&&free(x,y)&&!nearOcean(x,y));addSet(S,{name:takeName(S,'elf'),faction:'elves',race:'highelf',x,y,type:'haven',pop:1500,walls:15,garrison:12,target:6,prosperity:50});}
  for(let k=0;k<3;k++){const ang=k*2.1+rnd(S)*0.9;const r=6+ri(S,0,3);const px=Math.round(CX+Math.cos(ang)*r),py=Math.round(CY+Math.sin(ang)*r*0.8);[x,y]=findTile(S,px,py,(x,y)=>isT(x,y,TR.FIELDS,TR.WOODS)&&free(x,y));addSet(S,{name:takeName(S,'vale'),faction:'vale',race:'human',x,y,type:'village',pop:600,walls:5,garrison:6,target:4,prosperity:50});}
  {const ang=rnd(S)*6.28;const px=Math.round(CX+Math.cos(ang)*11),py=Math.round(CY+Math.sin(ang)*9);[x,y]=findTile(S,px,py,(x,y)=>isT(x,y,TR.WOODS,TR.FOREST)&&free(x,y));addSet(S,{name:takeName(S,'glade'),faction:'vale',race:'woodelf',x,y,type:'glade',pop:900,walls:8,garrison:10,target:6,prosperity:50});}
  for(const[px,py]of[[W-14,13],[W-15,35]]){[x,y]=findTile(S,px+ri(S,-2,2),py+ri(S,-3,3),(x,y)=>!isT(x,y,TR.OCEAN,TR.MOUNTAIN)&&free(x,y));addSet(S,{name:takeName(S,'city'),faction:'city',race:'human',x,y,type:'town',pop:3000,walls:15,garrison:18,target:6,prosperity:55});}
  for(const[px,py]of[[12,H-6],[25,H-9],[50,H-7],[62,H-10]]){[x,y]=findTile(S,px+ri(S,-3,3),py+ri(S,-2,2),(x,y)=>isT(x,y,TR.BARRENS,TR.MARSH,TR.GRAVE)&&free(x,y)&&mdist(x,y,S.fortressSite[0],S.fortressSite[1])>4);addSet(S,{name:takeName(S,'orc'),faction:'orcs',race:'orc',x,y,type:'camp',pop:800,walls:3,garrison:10,target:5,prosperity:30});}
  for(const s of S.settlements)s.region=S.region[idx(s.x,s.y)];
}
function carve(S,ax,ay,bx,by){let x=ax,y=ay,steps=0;S.river[idx(x,y)]=1;
  while((x!==bx||y!==by)&&steps++<700){const dx=bx-x,dy=by-y;const mainX=Math.abs(dx)>=Math.abs(dy);const opts=[];
    if(mainX){if(dx)opts.push([x+Math.sign(dx),y,5]);if(dy)opts.push([x,y+Math.sign(dy),2]);if(!dy||chance(S,0.5))opts.push([x,y+(dy?-Math.sign(dy):(chance(S,0.5)?1:-1)),1]);}
    else{if(dy)opts.push([x,y+Math.sign(dy),5]);if(dx)opts.push([x+Math.sign(dx),y,2]);if(!dx||chance(S,0.5))opts.push([x+(dx?-Math.sign(dx):(chance(S,0.5)?1:-1)),y,1]);}
    const valid=opts.filter(([nx,ny])=>inb(nx,ny)&&nx>0&&ny>0&&nx<W-1&&ny<H-1&&(S.terrain[idx(nx,ny)]!==TR.OCEAN||(nx===bx&&ny===by)));
    if(!valid.length){x+=Math.sign(dx);y+=Math.sign(dy);S.river[idx(x,y)]=1;continue;}
    let tot=0;for(const v of valid)tot+=v[2];let r=rnd(S)*tot;let ch=valid[0];for(const v of valid){r-=v[2];if(r<=0){ch=v;break;}}
    x=ch[0];y=ch[1];S.river[idx(x,y)]=1;}
  S.river[idx(bx,by)]=1;
}
function nearestRiverTile(S,x,y){let best=null,bd=1e9;for(let i=0;i<W*H;i++){if(!S.river[i])continue;const rx=i%W,ry=(i/W)|0;if(S.terrain[i]===TR.OCEAN)continue;const d=mdist(rx,ry,x,y);if(d<bd){bd=d;best=[rx,ry];}}return best;}
function genRivers(S){const f=(fa,t)=>S.settlements.find(s=>s.faction===fa&&s.type===t);const dw=f('dwarves','capital'),el=f('elves','capital'),va=f('vale','town'),ci=f('city','capital');
  carve(S,dw.x,dw.y,va.x,va.y);carve(S,el.x,el.y,va.x,va.y);carve(S,va.x,va.y,ci.x,ci.y);carve(S,va.x,va.y,S.fortressSite[0],S.fortressSite[1]);
  genLake(S,dw);
  for(const s of S.settlements){if(S.river[idx(s.x,s.y)])continue;const t=nearestRiverTile(S,s.x,s.y);if(t)carve(S,s.x,s.y,t[0],t[1]);}
}
function genLake(S,dw){let best=null,bs=-1;for(let t=0;t<60;t++){const cx=CX-9+ri(S,-4,4),cy=CY-7+ri(S,-3,2);if(!inb(cx-4,cy-3)||!inb(cx+4,cy+3))continue;let ok=true,sc=0;for(let dy=-3;dy<=3;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy;const i=idx(x,y);const tt=S.terrain[i];if(tt===TR.OCEAN||tt===TR.MOUNTAIN||tt===TR.MIST||tt===TR.DEEPS)ok=false;if(S.settlements.some(s=>mdist(s.x,s.y,x,y)<=1))ok=false;if(tt===TR.FIELDS||tt===TR.MARSH)sc++;}if(ok&&sc+rnd(S)*6>bs){bs=sc+rnd(S)*6;best=[cx,cy];}}
  if(!best)return;const[cx,cy]=best;S.lake={x:cx,y:cy};const rx=3+rnd(S),ry=2+rnd(S)*0.6;for(let dy=-3;dy<=3;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy;if(((dx*dx)/(rx*rx)+(dy*dy)/(ry*ry))<=1+ (rnd(S)-0.5)*0.25){S.terrain[idx(x,y)]=TR.LAKE;S.river[idx(x,y)]=1;}}
  let oc=null,od=1e9;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(S.terrain[idx(x,y)]!==TR.OCEAN)continue;const d=Math.abs(x-cx)*1.0+Math.abs(y-cy)*1.6;if(d<od){od=d;oc=[x,y];}}
  const edge=(tx,ty)=>{let e=null,ed=1e9;for(let dy=-4;dy<=4;dy++)for(let dx=-5;dx<=5;dx++){const x=cx+dx,y=cy+dy;if(!inb(x,y)||S.terrain[idx(x,y)]!==TR.LAKE)continue;const d=mdist(x,y,tx,ty);if(d<ed){ed=d;e=[x,y];}}return e;};
  if(oc){const e=edge(oc[0],oc[1]);carve(S,e[0],e[1],oc[0],oc[1]);}{const e=edge(dw.x,dw.y);carve(S,e[0],e[1],dw.x,dw.y);}}
function genKingdoms(S){const capOf=fa=>S.settlements.find(s=>s.faction===fa&&(s.type==='capital'||(fa==='vale'&&s.type==='town'))).id;
  S.kingdoms={
   dwarves:{key:'dwarves',name:FACTIONS.dwarves.name,adj:'dwarven',capital:capOf('dwarves'),leader:null,hero:null,status:'standing',mistake:false,omen:{label:'Greed',val:15+ri(S,0,10)},leaderTitle:'Under-King',lossesRecent:0,need:5,dev:0,hunger:0,envoyFails:{},landCooldown:0,machines:0,devCount:0,grudge:null},
   elves:{key:'elves',name:FACTIONS.elves.name,adj:'elven',capital:capOf('elves'),leader:null,hero:null,status:'standing',mistake:false,omen:{label:'Weariness',val:10+ri(S,0,10)},leaderTitle:'Tide-Lord',lossesRecent:0,need:5,dev:0,hunger:0,envoyFails:{},landCooldown:0,machines:0,devCount:0,grudge:null},
   vale:{key:'vale',name:FACTIONS.vale.name,adj:'Vale',capital:capOf('vale'),leader:null,hero:null,status:'standing',mistake:false,omen:null,leaderTitle:'Warden',lossesRecent:0},
   city:{key:'city',name:FACTIONS.city.name,adj:'eastern',capital:capOf('city'),leader:null,hero:null,status:'standing',mistake:false,omen:{label:'Industry',val:15+ri(S,0,10)},leaderTitle:'Sovereign',lossesRecent:0,vassal:false,folded:false,need:5,dev:0,hunger:0,envoyFails:{},landCooldown:0,machines:0,devCount:0,grudge:null},
   orcs:{key:'orcs',name:FACTIONS.orcs.name,adj:'orcish',capital:null,leader:null,hero:null,status:'scattered',mistake:false,omen:null,leaderTitle:'Dark Lord',lossesRecent:0,risen:false,broken:false,darklord:null,fortress:null,riseTurn:null,armiesSent:0}};
}
function leaderTitle(K,c){if(K.key==='dwarves')return c.sex==='f'?'Under-Queen':'Under-King';if(K.key==='elves')return c.sex==='f'?'Tide-Lady':'Tide-Lord';if(K.key==='vale')return 'Warden of the Vale';if(K.key==='city')return 'Sovereign of the East';return 'chieftain';}
function newChar(S,o){const role=o.role;const st=STR[role]==null?1:STR[role];const sex=o.sex||(o.race==='orc'?(chance(S,0.8)?'m':'f'):(chance(S,0.5)?'m':'f'));const life=LIFE[o.race]===Infinity?Infinity:LIFE[o.race]+ri(S,-10,12);
  const c={id:S.chars.length+1,name:o.name||genName(S,o.race),race:o.race,faction:o.faction,sex,born:S.year-(o.age==null?ri(S,16,45):o.age),birthplace:o.birthplace||o.home,home:o.home,role,title:o.title||'',
   traits:{valor:ri(S,1,9),prudence:ri(S,1,9),ambition:ri(S,1,9),wanderlust:ri(S,1,9),loyalty:ri(S,1,9)},like:pick(S,LIKES),fear:pick(S,FEARS.concat(RFEARS[o.race]||[])),goal:pick(S,AMBITIONS.concat(RAMB[o.race]||[])),
   x:o.x,y:o.y,party:null,alive:true,sick:0,strength:Math.max(0,st+ri(S,-1,1)),renown:0,kills:0,story:[],hero:!!o.hero,life,deathYear:null,deathCause:null,parent:o.parent||null,departed:false,quest:null,want:null};
  c.want=assignWant(S,c,o.role);
  if(c.hero){c.strength=9+ri(S,0,2);c.life=Infinity;c.traits.valor=Math.max(c.traits.valor,6);}
  S.chars.push(c);return c;}
function newParty(S,o){const p={id:S.nextParty++,name:o.name,kind:o.kind,faction:o.faction,members:[],x:o.x,y:o.y,goal:null,mp:o.mp||8,mode:o.mode||'land',might:o.might||0,trail:[],drive:null,home:o.home||null,rest:0,idle:0,stuck:0,retreating:false};for(const c of(o.members||[]))joinParty(S,p,c);S.parties.push(p);return p;}
function joinParty(S,p,c){if(c.party)leaveParty(S,c);c.party=p.id;p.members.push(c.id);c.x=p.x;c.y=p.y;}
function leaveParty(S,c){const p=party(S,c.party);if(p){const i=p.members.indexOf(c.id);if(i>=0)p.members.splice(i,1);}c.party=null;}
function removeParty(S,p){for(const id of p.members){const c=C(S,id);c.party=null;}const i=S.parties.indexOf(p);if(i>=0)S.parties.splice(i,1);}
function cleanupParty(S,p){p.members=p.members.filter(id=>C(S,id).alive);if(!p.members.length)removeParty(S,p);}
function settleParty(S,p,s){for(const id of p.members){const c=C(S,id);c.home=s.id;c.x=s.x;c.y=s.y;}removeParty(S,p);}
function populate(S,s,specKey){const K=kingdomOf(S,s.faction);const spec=POP_SPEC[specKey||s.type]||POP_SPEC.village;const made=[];
  for(let role of spec){if(role==='leader'&&!(K&&K.capital===s.id))role='reeve';if(role==='hero'&&!(K&&K.capital===s.id&&K.key!=='vale'))role='captain';const isHero=role==='hero';if(isHero&&S.hard)role='captain';
    const race=raceFor(S,s);const c=newChar(S,{race,faction:s.faction,home:s.id,role,x:s.x,y:s.y,age:isHero?ri(S,19,30):role==='leader'?ri(S,30,55):undefined,hero:isHero&&!S.hard});
    if(role==='leader'){c.title=leaderTitle(K,c);K.leader=c.id;}if(isHero){K.hero=c.id;c.title=S.hard?'':heroEpithet(S,c);if(S.hard)story(S,c,`Named champion of ${s.name}: not chosen by any prophecy, only the best sword in the hall.`);}made.push(c);}
  return made;}
function heroEpithet(S,c){return pick(S,{dwarf:['the Unbowed','Deepward','Stonefast','of the Nine Doors'],highelf:['Starborne','of the Last Tide','Mistwalker','Evenbright'],human:['the Marked','Oathbound','the Riverborn','Dawnsworn'],woodelf:['Greenward'],orc:['the Unburied']}[c.race]||['the Marked']);}
function raceFor(S,s){if(s.faction==='vale')return s.type==='glade'?'woodelf':(chance(S,0.35)?'woodelf':'human');return s.race;}
function genPeople(S){
  for(const s of S.settlements)populate(S,s);
  for(const K of[S.kingdoms.dwarves,S.kingdoms.elves,S.kingdoms.city]){const h=C(S,K.hero);const cs=setById(S,K.capital);const p=newParty(S,{name:`the company of ${firstName(h)}`,kind:'company',faction:K.key,x:cs.x,y:cs.y,mp:8,might:8,home:cs.id});joinParty(S,p,h);recruit(S,p,2);story(S,h,`Born under a strange star in ${cs.name}. The priests said ${pn(h).s} would see the end of the age.`);}
  for(const s of S.settlements){if(s.type==='camp'){const chief=S.chars.find(c=>c.alive&&c.home===s.id&&c.role==='chieftain');const p=newParty(S,{name:`the warband of ${firstName(chief)}`,kind:'warband',faction:'orcs',x:s.x,y:s.y,mp:9,might:18,home:s.id});joinParty(S,p,chief);recruit(S,p,3);}}
  spawnShip(S);spawnShip(S);spawnCaravan(S);spawnCaravan(S);
}
function recruit(S,p,n){if(p.members.length>=5)return;const s=settlementAt(S,p.x,p.y);if(!s)return;const cands=S.chars.filter(c=>c.alive&&!c.party&&c.x===p.x&&c.y===p.y&&c.faction===p.faction&&['warrior','ranger','captain','orc','sailor','miner'].includes(c.role)&&c.role!=='leader');cands.sort((a,b)=>wantScore(S,b,p)-wantScore(S,a,p));for(let i=0;i<n&&cands.length&&p.members.length<5;i++){const j=cands.length>1&&chance(S,0.35)?Math.floor(rnd(S)*cands.length):0;const c=cands.splice(j,1)[0];joinParty(S,p,c);story(S,c,`Joined ${p.name} at ${s.name}.`);}}
function spawnShip(S){const K=S.kingdoms.elves;if(K.status!=='standing')return null;const cs=setById(S,K.capital);const sailors=S.chars.filter(c=>c.alive&&!c.party&&c.home===cs.id&&['sailor','merchant','warrior','scholar'].includes(c.role));if(sailors.length<2)return null;const lead=sailors[0];const p=newParty(S,{name:`the ship ${pick(S,['Gullwing','Farlight','Tidemother','Whitefoam','Evenkeel','Lanternmast','Saltmoon'])}`,kind:'ship',faction:'elves',x:cs.x,y:cs.y,mp:16,mode:'ship',might:6,home:cs.id});for(const c of sailors.slice(0,ri(S,2,3)))joinParty(S,p,c);story(S,lead,`Took command of ${p.name}.`);return p;}
function spawnCaravan(S){const towns=S.settlements.filter(s=>standing(s)&&isFree(s.faction)&&(s.type==='capital'||s.type==='town'||s.type==='hold'||s.type==='dcamp'));const cands=[];for(const s of towns){const m=S.chars.filter(c=>c.alive&&!c.party&&c.home===s.id&&c.role==='merchant');if(m.length)cands.push({s,m:m[0]});}if(!cands.length)return null;const{s,m}=pick(S,cands);const p=newParty(S,{name:`the caravan of ${firstName(m)}`,kind:'caravan',faction:s.faction,x:s.x,y:s.y,mp:8,might:2,home:s.id});joinParty(S,p,m);recruit(S,p,1);story(S,m,`Set out with a caravan from ${s.name}.`);return p;}
function genSword(S){const va=setById(S,S.kingdoms.vale.capital);const cands=S.chars.filter(c=>c.alive&&c.home===va.id&&!c.hero&&c.role!=='leader'&&!c.party);const h=pick(S,cands);S.sword={name:pick(S,SWORD_NAMES),holder:h.id,x:h.x,y:h.y,stats:{keen:1,ward:1,valor:0,glory:0,call:0,counsel:0},will:8,seek:'none',renown:0,history:[],deeds:0,lostTurns:0,slayer:null};
  log(S,'sword',`${h.name}, a ${roleName(h)} of ${va.name}, drew a sword from the river mud. It was old, and it was not rusted, and it hummed faintly in ${pn(h).p} hand. ${pn(h).S} named it ${S.sword.name}.`,h.x,h.y,[h.id]);story(S,h,`Pulled ${S.sword.name} from the river mud.`);S.sword.history.push({year:0,holder:h.id,name:h.name,text:'drawn from the river'});}

/* ---------- pathfinding & movement ---------- */
function passable(S,x,y,mode,race){const i=idx(x,y),t=S.terrain[i];if(t===TR.MIST||t===TR.DEEPS)return false;if(mode==='ship')return S.river[i]===1||t===TR.OCEAN||t===TR.LAKE;if(t===TR.OCEAN||t===TR.LAKE)return false;if(t===TR.MOUNTAIN)return race==='dwarf'||S.river[i]===1;return true;}
function stepCost(S,x,y,mode){const i=idx(x,y);if(mode==='ship')return 1;if(S.river[i])return 1;return COST[S.terrain[i]];}
const PF_N=W*H,PF_dist=new Int32Array(PF_N),PF_prev=new Int32Array(PF_N),PF_gen=new Int32Array(PF_N);let pfGen=0;
function dangerSet(S,faction){const d=new Set();for(const p of S.parties){if(!hostile(S,p.faction,faction)||!combatKind(p))continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=p.x+dx,y=p.y+dy;if(inb(x,y))d.add(idx(x,y));}}return d;}
function findPath(S,sx,sy,tx,ty,mode,race,avoid){pfGen++;if(pfGen>2000000000){PF_gen.fill(0);pfGen=1;}const g=pfGen;const start=idx(sx,sy),goal=idx(tx,ty);PF_dist[start]=0;PF_gen[start]=g;PF_prev[start]=-1;const buckets=[[start]];
  for(let d=0;d<buckets.length;d++){const b=buckets[d];if(!b)continue;for(let k=0;k<b.length;k++){const i=b[k];if(PF_dist[i]!==d)continue;if(i===goal){const path=[];let cur=i;while(cur!==start){path.push([cur%W,(cur/W)|0]);cur=PF_prev[cur];}path.reverse();return path;}
      const x=i%W,y=(i/W)|0;
      for(let n=0;n<4;n++){const nx=n===0?x+1:n===1?x-1:x,ny=n===2?y+1:n===3?y-1:y;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(j!==goal&&!passable(S,nx,ny,mode,race))continue;const nd=d+(j===goal?1:stepCost(S,nx,ny,mode))+(avoid&&avoid.has(j)?12:0);if(PF_gen[j]!==g||nd<PF_dist[j]){PF_gen[j]=g;PF_dist[j]=nd;PF_prev[j]=i;(buckets[nd]||(buckets[nd]=[])).push(j);}}}}
  return null;}
function goalPos(S,g){if(!g)return null;if(g.type==='settlement'){const s=setById(S,g.id);return s?[s.x,s.y]:null;}if(g.type==='party'){const p=party(S,g.id);return p?[p.x,p.y]:null;}if(g.type==='char'){const c=C(S,g.id);return c&&c.alive?[c.x,c.y]:null;}if(g.type==='tile')return[g.x,g.y];return null;}
function hostilePartyAt(S,p,x,y){for(const q of S.parties)if(q!==p&&q.x===x&&q.y===y&&hostile(S,q.faction,p.faction)&&combatKind(q))return q;return null;}
function moveParty(S,p){p.trail=[[p.x,p.y]];if(p.rest>0){p.rest--;return;}if(!p.goal)return;const gp=goalPos(S,p.goal);if(!gp){p.goal=null;return;}const[tx,ty]=gp;
  if(p.x===tx&&p.y===ty){arrive(S,p);return;}
  const civ=p.kind==='envoy'||p.kind==='settlers'||p.kind==='caravan'||p.kind==='refugees'||p.kind==='ship';
  const path=findPath(S,p.x,p.y,tx,ty,p.mode,leadRace(S,p),civ?dangerSet(S,p.faction):null);if(!path){p.stuck++;if(p.kind==='envoy'&&p.mode==='ship'){p.mode='land';p.mp=9;}if(p.stuck>1){p.goal=null;p.stuck=0;}return;}p.stuck=0;
  let mp=p.mp,i=0;while(i<path.length){const[nx,ny]=path[i];const c=(nx===tx&&ny===ty)?1:stepCost(S,nx,ny,p.mode);if(c>mp)break;mp-=c;p.x=nx;p.y=ny;p.trail.push([nx,ny]);i++;if(hostilePartyAt(S,p,nx,ny))break;}
  for(const id of p.members){const c=C(S,id);c.x=p.x;c.y=p.y;}
  if(p.x===tx&&p.y===ty)arrive(S,p);}
function arrive(S,p){const g=p.goal;p.goal=null;p.drive=null;if(!g)return;
  if(g.type==='settlement'){const s=setById(S,g.id);if(!s)return;
    if(p.kind==='envoy'){envoyArrive(S,p,s);return;}
    if(hostile(S,s.faction,p.faction)){if(s.status==='fallen'&&isFree(p.faction))liberate(S,p,s);return;}
    if(s.status==='fallen'){return;}
    if(p.kind==='caravan'||p.kind==='ship'){if(standing(s)){s.prosperity=clamp(s.prosperity+3,5,100);const h=setById(S,p.home);if(h&&standing(h))h.prosperity=clamp(h.prosperity+2,5,100);if(kingdomKeys().includes(s.faction)&&kingdomKeys().includes(p.faction)&&s.faction!==p.faction)addRel(S,s.faction,p.faction,1.5);}p.rest=1;
      if(p.kind==='caravan'&&chance(S,0.3)){settleParty(S,p,s);}else if(p.kind==='ship'&&chance(S,0.12)&&s.faction!=='elves'){for(const id of p.members)story(S,C(S,id),`Left the ship and settled in ${s.name}.`);settleParty(S,p,s);}return;}
    if(p.kind==='host'){if(p.retreating||(p.home===s.id&&!nearestThreat(S,s.x,s.y,p.faction,10))){s.garrison=Math.min(maxGarrison(s)+30,s.garrison+p.might);log(S,'realm',`${cap(p.name)} stood down at ${s.name}.`,s.x,s.y,[]);settleParty(S,p,s);return;}p.rest=1;return;}
    if(p.kind==='refugees'||p.kind==='settlers'||p.kind==='defectors'){for(const id of p.members){const c=C(S,id);story(S,c,p.kind==='defectors'?`Came to ${s.name} to serve the South.`:`Found shelter in ${s.name}.`);}settleParty(S,p,s);return;}
    if(p.kind==='wanderer'){const h=C(S,S.sword.holder);if(h&&p.members.includes(h.id)&&p.drive==='glory'){h.renown+=2;}p.rest=1;if(p.members.length===1&&chance(S,0.5)){settleParty(S,p,s);}return;}
    if(p.kind==='army'||p.kind==='warband'){p.rest=1;return;}
    p.rest=1;if(p.kind==='company')recruit(S,p,1);return;}
  if(g.type==='tile'){if(p.kind==='settlers'){foundSettlement(S,p,g);return;}if(g.wreck&&p.faction==='goblins'){wreckDelving(S,p,g);return;}if(p.expedition){seizeLand(S,p);return;}if(!S.sword.holder&&S.sword.x===p.x&&S.sword.y===p.y)return;if(p.kind==='warband'||p.kind==='army')p.rest=1;}
}

/* ---------- war ---------- */
function partyStrength(S,p){let s=p.might;for(const id of p.members){const c=C(S,id);if(!c.alive)continue;s+=c.strength+(c.hero?3:0)+(c.role==='darklord'?10:0);}if(S.sword.holder&&p.members.includes(S.sword.holder))s+=S.sword.stats.keen*3+2;return s;}
function encounters(S){const ps=S.parties.slice();const fought=new Set();
  for(let i=0;i<ps.length;i++){const a=ps[i];if(!S.parties.includes(a)||fought.has(a.id))continue;
    for(let j=i+1;j<ps.length;j++){const b=ps[j];if(!S.parties.includes(b)||fought.has(b.id))continue;if(!hostile(S,a.faction,b.faction))continue;if(!combatKind(a)&&!combatKind(b))continue;if(mdist(a.x,a.y,b.x,b.y)>1)continue;
      if(evades(S,a,b)||evades(S,b,a))continue;
      const sideA=[],sideB=[];for(const q of S.parties){if(fought.has(q.id))continue;if(q!==a&&q!==b){if(!combatKind(q))continue;if(mdist(q.x,q.y,a.x,a.y)>1&&mdist(q.x,q.y,b.x,b.y)>1)continue;}if(hostile(S,q.faction,a.faction))sideB.push(q);else sideA.push(q);}
      for(const q of sideA)fought.add(q.id);for(const q of sideB)fought.add(q.id);battle(S,sideA,sideB);break;}}}
function evades(S,p,other){if(mdist(p.x,p.y,other.x,other.y)===0)return false;const sw=S.sword;const hasHolder=sw.holder&&p.members.includes(sw.holder);let pe=0;if(p.kind==='caravan'||p.kind==='ship'||p.kind==='refugees')pe=0.35;if(p.kind==='envoy'||p.kind==='settlers')pe=0.5;if(hasHolder&&sw.stats.ward>=2)pe=Math.max(pe,0.15+0.12*sw.stats.ward);if(p.drive==='ward')pe=Math.max(pe,0.7);if(hasHolder&&sw.stats.valor>=3)pe=0;if(pe>0&&chance(S,pe)){if(hasHolder)story(S,C(S,sw.holder),`${sw.name} shivered a warning; ${p.name} slipped past ${other.name} unseen.`);return true;}return false;}
function casualties(S,p,lost,otherMembers,bname,rate){const dead=[];const sw=S.sword;const dl=S.kingdoms.orcs.darklord;
  for(const id of p.members.slice()){const c=C(S,id);if(!c.alive)continue;let pd=rate!=null?rate:(lost?0.34:0.07);if((STR[c.role]||0)<=2)pd*=lost?1.4:1.5;
    if(c.id===sw.holder){pd*=(1-0.12*sw.stats.valor)*(1-0.15*sw.stats.ward);if(dl&&otherMembers.includes(dl))pd*=1.6;}else if(sw.holder&&p.members.includes(sw.holder))pd*=(1-0.08*sw.stats.ward);
    if(c.hero){if(chance(S,pd))story(S,c,`Was wounded at ${bname}, but fate held ${pn(c).o} up.`);continue;}
    if(c.role==='darklord')continue;
    if(chance(S,pd)){kill(S,c,`fell at ${bname}`);dead.push(c);}}
  return dead;}
function sideName(S,side){if(side.length===1)return side[0].name;const l=side.slice().sort((a,b)=>partyStrength(S,b)-partyStrength(S,a));return `${l[0].name} and ${side.length===2?l[1].name:'its allies'}`;}
function battle(S,A,B){const sA=A.reduce((t,p)=>t+partyStrength(S,p),0),sB=B.reduce((t,p)=>t+partyStrength(S,p),0);const pa=Math.pow(sA,1.6)/(Math.pow(sA,1.6)+Math.pow(sB,1.6));const aWins=rnd(S)<pa;const win=aWins?A:B,lose=aWins?B:A;const sw=S.sword;
  const x=A[0].x,y=A[0].y;const place=placeName(S,x,y);const big=(sA+sB)>=70;const bname=big?`the Battle of ${place}`:`the skirmish at ${place}`;
  const winM=[].concat(...win.map(p=>p.members)),loseM=[].concat(...lose.map(p=>p.members));const holderIn=m=>sw.holder&&m.includes(sw.holder);
  const deadL=[],deadW=[];for(const p of lose)deadL.push(...casualties(S,p,true,winM,bname));for(const p of win)deadW.push(...casualties(S,p,false,loseM,bname));
  for(const p of lose)p.might=Math.floor(p.might*0.4);for(const p of win)p.might=Math.floor(p.might*0.85);
  let wl=null,ws=-1;for(const p of win){const l=leadChar(S,p);if(l){const s=l.strength+(l.hero?20:0);if(s>ws){ws=s;wl=l;}}}if(wl){wl.renown+=big?3:1;wl.kills+=Math.min(deadL.length,3);}
  if(holderIn(winM)){const h=C(S,sw.holder);if(h.alive){h.renown+=2;h.kills+=Math.min(deadL.length,2);}sw.renown+=big?2:1;sw.deeds++;if(big)gainWill(S);}
  const dl=S.kingdoms.orcs.darklord?C(S,S.kingdoms.orcs.darklord):null;let dlText='';
  if(dl&&dl.alive&&loseM.includes(dl.id)&&sw.holder===dl.id){const heroW=winM.map(id=>C(S,id)).find(c=>c.hero);if(heroW&&chance(S,0.3+sw.stats.keen*0.06)){sw.holder=null;sw.x=x;sw.y=y;sw.lostTurns=0;log(S,'sword',`${heroW.name} struck ${sw.name} from the hand of ${dl.name} at ${bname}. It fell in the mud, singing.`,x,y,[heroW.id,dl.id]);story(S,heroW,`Struck ${sw.name} from the Dark Lord's hand.`);}}
  if(dl&&dl.alive&&loseM.includes(dl.id)){const dlp=lose.find(p=>p.members.includes(dl.id));if(holderIn(winM)&&C(S,sw.holder).alive){const h=C(S,sw.holder);const pr=0.22+sw.stats.keen*0.09+(h.hero?0.22:0)+(h.strength>=9?0.08:0)+(sA+sB>120?0.05:0);if(chance(S,pr)){killDarkLord(S,dl,h,bname);}else{dlText=` ${dl.name} was driven from the field and fled south with a wound that did not heal.`;dlFlee(S,dl,dlp);}}else{dlText=` ${dl.name} withdrew into the dark, unhurt.`;dlFlee(S,dl,dlp);}}
  const kinds=[...new Set(win.map(p=>p.faction).filter(f=>kingdomKeys().includes(f)))];if(kinds.length>=2)for(let i=0;i<kinds.length;i++)for(let j=i+1;j<kinds.length;j++)addRel(S,kinds[i],kinds[j],3);
  S.lastKiller=win[0].faction;
  const wn=sideName(S,win),ln=sideName(S,lose);
  const txt=`${cap(wn)} broke ${ln} at ${bname}.`+(deadL.length?` ${listNames(deadL.slice(0,6))}${deadL.length>6?' and others':''} fell.`:'')+(deadW.length?` The victors lost ${listNames(deadW.slice(0,5))}${deadW.length>5?' and others':''}.`:'')+dlText;
  log(S,'battle',txt,x,y,[...winM,...loseM].slice(0,8));
  for(const id of winM){const c=C(S,id);if(c.alive)story(S,c,`Fought at ${bname} and prevailed.`);}for(const id of loseM){const c=C(S,id);if(c.alive)story(S,c,`Fought at ${bname} and was beaten.`);}
  for(const p of lose.concat(win))cleanupParty(S,p);
  for(const p of lose){if(!S.parties.includes(p))continue;if((p.kind==='army'||p.kind==='warband'||p.kind==='host')&&p.might<10){p.retreating=true;const h=p.home?setById(S,p.home):null;p.goal=h&&standing(h)&&!hostile(S,h.faction,p.faction)?{type:'settlement',id:h.id}:null;if(!p.goal)removeParty(S,p);}else if(p.kind==='company'||p.kind==='patrol'||p.kind==='wanderer'){const safe=nearestSettlement(S,p.x,p.y,s=>standing(s)&&!hostile(S,s.faction,p.faction));if(safe){p.goal={type:'settlement',id:safe.id};p.drive=null;}}}
  for(const p of win){if(!S.parties.includes(p))continue;if(p.goal&&p.goal.type==='party'&&!party(S,p.goal.id))p.goal=null;}}
function dlFlee(S,dl,p){leaveParty(S,dl);const K=S.kingdoms.orcs;const f=K.fortress?setById(S,K.fortress):null;const g=newParty(S,{name:`the guard of ${dl.name}`,kind:'army',faction:'orcs',x:dl.x,y:dl.y,mp:8,might:14,home:K.fortress});joinParty(S,g,dl);g.retreating=true;g.goal=f&&standing(f)?{type:'settlement',id:f.id}:null;}
function killDarkLord(S,dl,h,bname){dl.alive=false;dl.deathYear=S.year;dl.deathCause=`slain at ${bname} by ${h.name}, wielding ${S.sword.name}`;story(S,dl,`Slain at ${bname} by ${h.name}.`);leaveParty(S,dl);
  h.renown+=20;h.kills++;h.slewDarkLord=true;S.sword.slayer=h.id;S.sword.renown+=10;S.sword.deeds+=5;story(S,h,`Struck down ${dl.name} ${dl.title} at ${bname} with ${S.sword.name}.`);gainWill(S);gainWill(S);
  const K=S.kingdoms.orcs;K.broken=true;K.status='broken';const f=K.fortress?setById(S,K.fortress):null;if(f){f.status='ruined';f.garrison=0;}
  for(const p of S.parties.slice()){if(p.faction!=='orcs')continue;p.might=Math.floor(p.might*0.3);p.kind='warband';p.name=`the remnant of ${p.name.replace(/^the /,'')}`;const camp=nearestSettlement(S,p.x,p.y,s=>s.faction==='orcs'&&s.type==='camp'&&standing(s));p.goal=camp?{type:'settlement',id:camp.id}:null;p.retreating=true;p.home=camp?camp.id:null;}
  for(const s of S.settlements)if(s.status==='fallen')s.orcGarrison=Math.floor(s.orcGarrison*0.5);
  log(S,'hero',`${h.name} struck down ${dl.name} ${dl.title} at ${bname} with ${S.sword.name}. The Host broke like a wave on stone, and the tribes fled south into their swamp barrows.`,h.x,h.y,[h.id,dl.id]);
  for(const q of S.quests)if(q.status==='active'&&(q.kind==='strike'||q.kind==='siege'))endQuest(S,q,true,`${dl.name} is dead.`);}
function sieges(S){for(const p of S.parties.slice()){if(!S.parties.includes(p))continue;if(p.kind!=='army'&&p.kind!=='warband')continue;if(p.retreating)continue;const s=settlementAt(S,p.x,p.y);if(!s||!hostile(S,p.faction,s.faction)||!standing(s))continue;
    if(p.faction==='goblins'||(p.kind==='warband'&&(!S.kingdoms.orcs.risen||S.kingdoms.orcs.broken))){raid(S,p,s);continue;}assault(S,p,s);}}
function defenders(S,s,p){return S.parties.filter(q=>q!==p&&q.x===s.x&&q.y===s.y&&!hostile(S,q.faction,s.faction)&&combatKind(q));}
function raid(S,p,s){const defs=defenders(S,s,p);let def=s.garrison+s.walls*0.6;for(const q of defs)def+=partyStrength(S,q);const sw=S.sword;if(sw.holder){const h=C(S,sw.holder);if(h.alive&&h.x===s.x&&h.y===s.y&&!h.party)def+=sw.stats.keen*3+h.strength;}
  const atk=partyStrength(S,p);const home=p.home?setById(S,p.home):null;
  if(atk>def*(0.8+rnd(S)*0.6)){s.prosperity=clamp(s.prosperity-15,5,100);s.garrison=Math.max(0,Math.floor(s.garrison*0.6));const res=charsAt(S,s.x,s.y).filter(c=>isFree(c.faction)&&!c.hero&&!c.party);const dead=[];for(const c of res)if(chance(S,0.15)){kill(S,c,`was killed in an orc raid on ${s.name}`);dead.push(c);}
    p.might=Math.min(30,p.might+4);log(S,'battle',`${cap(p.name)} raided ${s.name} and carried off what it could.${dead.length?' '+listNames(dead)+' died.':''}`,s.x,s.y,dead.map(c=>c.id));for(const q of defs)casualties(S,q,true,p.members,`the raid on ${s.name}`);}
  else{p.might=Math.floor(p.might*0.55);casualties(S,p,true,[].concat(...defs.map(q=>q.members)),`the raid on ${s.name}`);log(S,'battle',`${cap(p.name)} was thrown back from the walls of ${s.name}.`,s.x,s.y,[]);for(const q of defs){const l=leadChar(S,q);if(l)l.renown+=1;}if(sw.holder&&C(S,sw.holder).x===s.x&&C(S,sw.holder).y===s.y){sw.renown+=1;C(S,sw.holder).renown+=1;}}
  cleanupParty(S,p);if(S.parties.includes(p)){p.goal=home&&standing(home)?{type:'settlement',id:home.id}:null;p.retreating=true;}}
function assault(S,p,s){const defs=defenders(S,s,p);let def=s.garrison+s.walls;for(const q of defs)def+=partyStrength(S,q)*1.2;const sw=S.sword;let holderHere=false;if(sw.holder){const h=C(S,sw.holder);if(h.alive&&h.x===s.x&&h.y===s.y){holderHere=true;if(!h.party)def+=sw.stats.keen*3+h.strength+4;}}
  const heroHere=charsAt(S,s.x,s.y).some(c=>c.hero&&isFree(c.faction));if(heroHere)def+=12;
  const atk=partyStrength(S,p);
  if(s.status!=='besieged'){s.status='besieged';s.besiegedBy=p.id;log(S,'battle',`${cap(p.name)} laid siege to ${s.name}.`,s.x,s.y,[]);}
  if(atk>def*(0.9+rnd(S)*0.55)){fallSettlement(S,s,p,defs);return;}
  s.garrison=Math.max(0,Math.floor(s.garrison-atk*0.12));p.might=Math.max(0,Math.floor(p.might-def*0.2));
  const dead=[];const deadA=casualties(S,p,false,[].concat(...defs.map(q=>q.members)),`the siege of ${s.name}`,0.05);
  const dl=S.kingdoms.orcs.darklord?C(S,S.kingdoms.orcs.darklord):null;
  if(holderHere&&dl&&dl.alive&&p.members.includes(dl.id)&&sw.stats.valor>=2){const h=C(S,sw.holder);const pr=0.08+sw.stats.keen*0.05+(h.hero?0.1:0);if(chance(S,pr)){killDarkLord(S,dl,h,`the siege of ${s.name}`);return;}}
  if(p.might<12){log(S,'battle',`The siege of ${s.name} broke. ${cap(p.name)} withdrew, much diminished.`,s.x,s.y,[]);s.status='standing';s.besiegedBy=null;p.retreating=true;const home=p.home?setById(S,p.home):null;p.goal=home&&standing(home)?{type:'settlement',id:home.id}:null;const l=defs.length?leadChar(S,defs[0]):null;if(l)l.renown+=3;if(holderHere){sw.renown+=2;sw.deeds++;C(S,sw.holder).renown+=3;gainWill(S);}}
  else log(S,'battle',`The siege of ${s.name} ground on.${dead.length?' '+listNames(dead)+' fell on the walls.':''}${deadA.length?' The besiegers lost '+listNames(deadA)+'.':''}`,s.x,s.y,[]);
  cleanupParty(S,p);for(const q of defs)cleanupParty(S,q);}
function fallSettlement(S,s,p,defs){s.status='fallen';s.fallTurn=S.turn;s.garrison=0;s.besiegedBy=null;s.orcGarrison=25+Math.floor(p.might*0.25);p.might=Math.floor(p.might*0.75);p.rest=1;p.goal=null;
  const K=kingdomOf(S,s.faction);const isCap=K&&K.capital===s.id;
  const here=charsAt(S,s.x,s.y).filter(c=>isFree(c.faction));const dead=[],fled=[];
  const dest=nearestSettlement(S,s.x,s.y,q=>q.id!==s.id&&standing(q)&&isFree(q.faction));
  for(const c of here){if(c.hero){story(S,c,`Escaped the fall of ${s.name} by a hair; fate had further use for ${pn(c).o}.`);fled.push(c);continue;}
    let pd=0.45;if(c.role==='leader')pd=0.55;if(c.party&&party(S,c.party)&&party(S,c.party).kind==='host')pd=0.5;
    if(chance(S,pd)){kill(S,c,`was slain when ${s.name} fell`);dead.push(c);}else fled.push(c);}
  for(const q of defs)cleanupParty(S,q);
  for(const q of S.parties.slice())if(q.x===s.x&&q.y===s.y&&isFree(q.faction))removeParty(S,q);
  const alive=fled.filter(c=>c.alive);if(alive.length){if(dest){const r=newParty(S,{name:`the survivors of ${s.name}`,kind:'refugees',faction:s.faction,x:s.x,y:s.y,mp:7,might:0,home:dest.id});for(const c of alive)joinParty(S,r,c);r.goal={type:'settlement',id:dest.id};for(const c of alive)story(S,c,`Fled the burning of ${s.name}.`);}else{for(const c of alive){kill(S,c,`was lost in the sack of ${s.name}`);dead.push(c);}}}
  let txt=`${cap(s.name)} fell to ${p.name}.`;if(dead.length)txt+=` ${listNames(dead.slice(0,6))}${dead.length>6?' and others':''} died.`;
  if(isCap&&K.status==='standing'){K.status='fallen';txt+=` ${cap(K.name)} had no capital.`;}
  log(S,'doom',txt,s.x,s.y,dead.slice(0,6).map(c=>c.id));}
function liberate(S,p,s){const str=partyStrength(S,p);if(str>s.orcGarrison*(0.8+rnd(S)*0.6)){s.status='standing';s.orcGarrison=0;s.garrison=10;s.prosperity=Math.max(15,s.prosperity-10);s.fallTurn=null;p.might=Math.floor(p.might*0.8);const K=kingdomOf(S,s.faction);if(K&&K.capital===s.id&&K.status==='fallen'){K.status='standing';}
    const l=leadChar(S,p);if(l){l.renown+=6;story(S,l,`Retook ${s.name} from the orcs.`);}if(S.sword.holder&&p.members.includes(S.sword.holder)){S.sword.renown+=3;S.sword.deeds+=2;gainWill(S);}
    log(S,'hero',`${cap(p.name)} stormed ${s.name} and threw the orc garrison out of it. Fires were lit in its windows again.`,s.x,s.y,l?[l.id]:[]);casualties(S,p,false,[],`the retaking of ${s.name}`);cleanupParty(S,p);}
  else{casualties(S,p,true,[],`the assault on ${s.name}`);p.might=Math.floor(p.might*0.6);s.orcGarrison=Math.max(5,Math.floor(s.orcGarrison*0.8));log(S,'battle',`${cap(p.name)} tried the walls of fallen ${s.name} and was driven back.`,s.x,s.y,[]);cleanupParty(S,p);if(S.parties.includes(p)){p.goal=null;p.rest=1;}}}

/* ---------- orcs and the dark lord ---------- */
function raidTarget(S,p){const home=p.home?setById(S,p.home):null;const hx=home?home.x:p.x,hy=home?home.y:p.y;const cands=S.settlements.filter(s=>isFree(s.faction)&&standing(s)&&mdist(s.x,s.y,hx,hy)<=26);if(!cands.length)return null;const w=cands.map(s=>s.type==='village'?3:s.type==='glade'?2:s.type==='town'?2:s.type==='dcamp'||s.type==='rhaven'?2:0.4);let tot=0;for(const v of w)tot+=v;let r=rnd(S)*tot;for(let i=0;i<cands.length;i++){r-=w[i];if(r<=0)return cands[i];}return cands[0];}
function orcTarget(S){const K=S.kingdoms;const cands=S.settlements.filter(s=>isFree(s.faction)&&standing(s)&&!(K.city.vassal&&s.faction==='city'));if(!cands.length)return null;
  const w=cands.map(s=>{let v=s.type==='village'?0.4:s.type==='town'?(s.faction==='vale'?5:1.5):s.type==='capital'?4:1;v*=1+40/(s.walls+s.garrison+10);return v;});let tot=0;for(const v of w)tot+=v;let r=rnd(S)*tot;for(let i=0;i<cands.length;i++){r-=w[i];if(r<=0)return cands[i];}return cands[0];}
function riseDarkLord(S){const K=S.kingdoms.orcs;K.risen=true;K.riseTurn=S.turn;const[fx,fy]=S.fortressSite;
  const fort=addSet(S,{name:pick(S,FORT_NAMES),faction:'orcs',race:'orc',x:fx,y:fy,type:'fortress',pop:5000,walls:40,garrison:S.candidateSlain?45:70,target:6,prosperity:40});K.fortress=fort.id;K.capital=fort.id;populate(S,fort,'fortress');
  const chiefs=S.chars.filter(c=>c.alive&&c.faction==='orcs'&&(c.role==='chieftain'||c.role==='general')).sort((a,b)=>(b.strength+b.renown)-(a.strength+a.renown));
  let dl=(S.dlCandidate&&C(S,S.dlCandidate).alive)?C(S,S.dlCandidate):chiefs[0];if(!dl)dl=newChar(S,{race:'orc',faction:'orcs',home:fort.id,role:'darklord',x:fx,y:fy,age:40});
  leaveParty(S,dl);dl.role='darklord';dl.title=pick(S,DL_TITLES);dl.hero=true;dl.strength=S.candidateSlain?14:16;dl.life=Infinity;dl.x=fx;dl.y=fy;dl.home=fort.id;dl.goal='to put every crown in the world under one heel';dl.fear='nothing that walks';K.darklord=dl.id;K.leader=dl.id;
  story(S,dl,`Rose as ${dl.title} and raised ${fort.name} from the barrow-earth.`);
  for(const p of S.parties){if(p.faction!=='orcs')continue;p.kind='army';p.might+=25;p.goal=null;p.retreating=false;const l=leadChar(S,p);p.name=l?`the horde of ${firstName(l)}`:'the horde';}
  for(const s of S.settlements)if(s.faction==='orcs'&&s.type==='camp')s.garrison+=10;
  log(S,'doom',`In the year ${S.year}, ${dl.name} ${dl.title} raised ${fort.name} from the barrow-earth of the South and called the scattered tribes to one banner. The orcs, who had been a rumour of the borders, became a Host.${S.candidateSlain?' The tribes had lost a decade choosing a new dreamer, and the one they chose was not the one they had wanted.':''}`,fx,fy,[dl.id]);
  S.goblinsAllied=true;if(S.chars.some(c=>c.alive&&c.faction==='goblins'))log(S,'doom',`The goblins of the deep heard the horns in the South and came down to answer them.`,fx,fy,[]);
  const ks=kingdomKeys();for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){addRel(S,ks[i],ks[j],20);const k=relKey(ks[i],ks[j]);if(S.diplo.war[k]){S.diplo.war[k]=false;S.diplo.rel[k]=Math.max(S.diplo.rel[k],-30);log(S,'realm',`${cap(FACTIONS[ks[i]].name)} and ${FACTIONS[ks[j]].name} made peace in the shadow of the South.`,CX,CY,[]);}}
  if(S.kingdoms.city.folded)foldCity(S);}
function foldCity(S){const K=S.kingdoms.city;if(K.vassal)return;K.vassal=true;const cs=setById(S,K.capital);const l=K.leader?C(S,K.leader):null;const dl=S.kingdoms.orcs.darklord?C(S,S.kingdoms.orcs.darklord):null;cs.status='vassal';
  log(S,'doom',`${l?l.name+', '+l.title+',':'The Sovereign of the East'} sent envoys south and bent the knee to ${dl?dl.name:'the Dark Lord'}. The gates of ${cs.name} would open to the Host without a fight. The eastern hero ${C(S,K.hero).name} denounced the crown and rode west.`,cs.x,cs.y,l?[l.id]:[]);
  if(l)story(S,l,`Bent the knee to the Dark Lord to spare the City.`);const h=C(S,K.hero);story(S,h,`Denounced the Sovereign and left ${cs.name} for the Vale.`);const p=party(S,h.party);const va=setById(S,S.kingdoms.vale.capital);if(p&&standing(va))p.goal={type:'settlement',id:va.id};}
function orcActs(S){const K=S.kingdoms.orcs;
  for(const s of S.settlements){if(s.faction!=='orcs'||s.type!=='camp'||!standing(s))continue;if(S.chars.some(c=>c.alive&&c.role==='chieftain'&&c.home===s.id))continue;const cands=S.chars.filter(c=>c.alive&&c.home===s.id&&c.role==='orc').sort((a,b)=>b.strength-a.strength);let ch=cands[0];if(!ch)ch=newChar(S,{race:'orc',faction:'orcs',home:s.id,role:'chieftain',x:s.x,y:s.y,age:ri(S,22,35)});ch.role='chieftain';ch.strength=Math.max(ch.strength,7);story(S,ch,`Took the chieftain's seat at ${s.name}.`);
    if(!S.parties.some(p=>p.faction==='orcs'&&p.home===s.id&&p.kind==='warband')&&!ch.party){const p=newParty(S,{name:`the warband of ${firstName(ch)}`,kind:'warband',faction:'orcs',x:s.x,y:s.y,mp:9,might:14,home:s.id});joinParty(S,p,ch);recruit(S,p,2);}}
  {const sw=S.sword;const hd=sw.holder?C(S,sw.holder):null;const dl=K.darklord?C(S,K.darklord):null;
   for(const p of S.parties){if(!p.swordHunter)continue;if(hd&&isFree(hd.faction))p.goal={type:'char',id:hd.id};else if(!sw.holder)p.goal={type:'tile',x:sw.x,y:sw.y};else if(hd&&p.members.includes(hd.id)){const f=K.fortress?setById(S,K.fortress):null;p.goal=f&&standing(f)?{type:'settlement',id:f.id}:null;}p.retreating=false;}
   if(hd&&hd.alive&&hd.faction==='orcs'&&hd.role!=='darklord'&&dl&&dl.alive&&isAt(hd,dl)&&hd.party!==dl.party&&chance(S,0.7)){sw.holder=dl.id;sw.x=dl.x;sw.y=dl.y;sw.lastTransfer=S.turn;sw.history.push({year:S.year,holder:dl.id,name:dl.name,text:`${hd.name} laid ${sw.name} at the feet of ${dl.name}.`});story(S,hd,`Gave ${sw.name} to ${dl.name}.`);story(S,dl,`Took ${sw.name}. It screamed in ${pn(dl).p} hand and ${pn(dl).s} did not care.`);log(S,'doom',`${hd.name} laid ${sw.name} at the feet of ${dl.name} ${dl.title}. ${cap(pn(dl).s)} took it up, and it screamed, and ${pn(dl).s} did not care.`,dl.x,dl.y,[hd.id,dl.id]);}}
  if(!K.risen||K.broken){for(const p of S.parties){if(p.faction!=='orcs'||p.kind!=='warband'||p.goal||p.rest>0)continue;const home=p.home?setById(S,p.home):null;if(home&&isAt(p,home)){p.might=Math.min(25,p.might+4);p.retreating=false;}
      if(p.might<10)continue;if(chance(S,K.broken?0.2:0.55)){const t=raidTarget(S,p);if(t){p.goal={type:'settlement',id:t.id};p.retreating=false;}}else if(chance(S,0.3)){const[x,y]=findTile(S,p.x+ri(S,-6,6),p.y+ri(S,-4,4),(x,y)=>S.region[idx(x,y)]===4&&passable(S,x,y,'land','orc'),6);p.goal={type:'tile',x,y};}}
    if(!K.risen)return;}
  if(K.broken)return;
  const fort=setById(S,K.fortress);const since=S.turn-K.riseTurn;let bold=0;if(S.kingdoms.dwarves.mistake)bold+=5;if(S.kingdoms.elves.mistake)bold+=5;if(S.kingdoms.city.mistake)bold+=3;
  if(standing(fort))fort.garrison=Math.min(260,fort.garrison+12+ri(S,0,8)+Math.floor(since*0.45)+bold);
  const armies=S.parties.filter(p=>p.faction==='orcs'&&p.kind==='army'&&!p.retreating);const dl=K.darklord?C(S,K.darklord):null;
  if(standing(fort)&&fort.garrison>=100&&armies.length<(since>25?3:2)&&chance(S,0.8)){const might=Math.min(120,38+Math.floor(since*1.6)+ri(S,0,15)+bold*2);fort.garrison-=Math.min(fort.garrison-20,Math.floor(might*0.6));
    const gen=newChar(S,{race:'orc',faction:'orcs',home:fort.id,role:'general',x:fort.x,y:fort.y,age:ri(S,22,40)});const p=newParty(S,{name:`the horde of ${firstName(gen)}`,kind:'army',faction:'orcs',x:fort.x,y:fort.y,mp:6,might,home:fort.id});joinParty(S,p,gen);for(let i=0;i<3;i++)joinParty(S,p,newChar(S,{race:'orc',faction:'orcs',home:fort.id,role:'orc',x:fort.x,y:fort.y,age:ri(S,18,35)}));
    story(S,gen,`Given a horde by ${dl?dl.name:'the Dark Lord'} and sent north.`);let rides='';if(dl&&dl.alive&&!dl.party&&isAt(dl,fort)&&chance(S,0.45)){joinParty(S,p,dl);p.might+=40;rides=` ${dl.name} ${dl.title} rode with it in person.`;story(S,dl,`Rode north with ${p.name}.`);}
    K.armiesSent++;const t=orcTarget(S);if(t){p.goal={type:'settlement',id:t.id};log(S,'march',`${cap(p.name)} marched out of ${fort.name} toward ${t.name}.${rides}`,fort.x,fort.y,gen?[gen.id]:[]);}}
  for(const p of S.parties){if(p.faction!=='orcs'||p.kind!=='army')continue;if(p.retreating){const home=p.home?setById(S,p.home):null;if(home&&isAt(p,home)){if(standing(home)){home.garrison=Math.min(maxGarrison(home),home.garrison+p.might);if(dl&&p.members.includes(dl.id)){leaveParty(S,dl);dl.x=home.x;dl.y=home.y;}settleParty(S,p,home);continue;}}if(!p.goal){p.retreating=false;}continue;}
    if(!p.goal&&p.rest<=0){const t=orcTarget(S);if(t){p.goal={type:'settlement',id:t.id};log(S,'march',`${cap(p.name)} turned toward ${t.name}.${dl&&p.members.includes(dl.id)?' The Dark Lord rode at its head.':''}`,p.x,p.y,[]);}else{p.goal=standing(fort)?{type:'settlement',id:fort.id}:null;p.retreating=true;}}}
  if(dl&&dl.alive&&!dl.party&&!isAt(dl,fort)&&standing(fort)){const g=newParty(S,{name:`the guard of ${dl.name}`,kind:'army',faction:'orcs',x:dl.x,y:dl.y,mp:8,might:14,home:fort.id});joinParty(S,g,dl);g.retreating=true;g.goal={type:'settlement',id:fort.id};}}

/* ---------- kingdoms ---------- */
function counselAt(S,fkey){const K=S.kingdoms[fkey];if(!K||!K.capital)return 0;const cs=setById(S,K.capital);const sw=S.sword;if(!cs||!sw.holder)return 0;const h=C(S,sw.holder);if(!h.alive||h.x!==cs.x||h.y!==cs.y)return 0;return sw.stats.counsel*heedOf(S,h,fkey);}
function heedOf(S,h,fkey){if(h.role==='leader')return h.faction===fkey?1.6:0.9;if(h.hero)return h.faction===fkey?1.3:1;if(h.role==='captain'||h.role==='priest'||h.role==='scholar'||h.role==='general')return Math.min(1.2,0.8+h.renown*0.04);return clamp(0.3+h.renown*0.07,0.3,1.1);}
function updateOmens(S){const K=S.kingdoms;for(const k of kingdomKeys()){const kk=K[k];const l=kk.leader?C(S,kk.leader):null;if(l&&l.want&&!kk.mistake&&kk.status==='standing'&&((k==='dwarves'&&l.want.kind==='deep')||(k==='elves'&&l.want.kind==='mist')||(k==='city'&&l.want.kind==='engine')))kk.omen.val=clamp(kk.omen.val+0.25,0,100);}
  if(!K.dwarves.mistake&&K.dwarves.status==='standing'){let g=0.45+rnd(S)*0.7;const cs=setById(S,K.dwarves.capital);if(cs.prosperity>65)g+=0.4;if(K.orcs.risen)g-=0.3;g=g*Math.max(0,1-0.16*counselAt(S,'dwarves'))-0.45*counselAt(S,'dwarves');K.dwarves.omen.val=clamp(K.dwarves.omen.val+g,0,100);}
  if(!K.elves.mistake&&K.elves.status==='standing'){let g=0.15+rnd(S)*0.35+K.elves.lossesRecent*0.8+(K.orcs.risen&&!K.orcs.broken?0.3:0)+(K.dwarves.mistake?0.25:0)+(K.city.mistake?0.25:0);const cs=setById(S,K.elves.capital);if(cs.status==='besieged')g+=3;g=g*Math.max(0,1-0.16*counselAt(S,'elves'))-0.45*counselAt(S,'elves');K.elves.omen.val=clamp(K.elves.omen.val+g,0,100);}
  if(!K.city.mistake&&K.city.status==='standing'){let g=0.45+rnd(S)*0.65;const cs=setById(S,K.city.capital);if(cs.prosperity>65)g+=0.3;g+=Math.min(0.4,0.08*S.chars.filter(c=>c.alive&&c.home===cs.id&&c.role==='scholar').length);g=g*Math.max(0,1-0.16*counselAt(S,'city'))-0.45*counselAt(S,'city');K.city.omen.val=clamp(K.city.omen.val+g,0,100);}
  K.elves.lossesRecent*=0.5;}
function omenText(K){const v=K.omen?K.omen.val:0;if(K.mistake)return{dwarves:'The deep is opened and will not close.',elves:'The West has gone into the mist.',city:'The gods have answered the forges.'}[K.key];
  if(K.key==='dwarves')return v<30?'The delvers work the upper seams.':v<55?'Star-iron is found deeper each decade.':v<80?'The deep-priests speak of a door that should stay shut.':'Picks ring in the roots of the mountain, day and night.';
  if(K.key==='elves')return v<30?'The Tide-Court sings and builds ships.':v<45?'The old songs grow sadder.':v<70?'Some captains speak of sailing beyond the mist.':'Half the court would leave the world tonight.';
  return v<30?'Mills turn on the river.':v<60?'Chimneys rise above the walls.':v<80?'The sky over the City is brown at noon.':'The engineers say the gods are a story for children.';}
function checkMistakes(S){const K=S.kingdoms;const cf=f=>Math.max(0.08,1-0.17*counselAt(S,f));
  const pr=(v,thr,div,f)=>{if(v>=100)return 1;let p=v>thr?(v-thr)/div*cf(f):0;if(v>88)p=Math.max(p,(v-88)/12*0.2*cf(f));return p;};
  if(!K.dwarves.mistake&&K.dwarves.status==='standing'&&chance(S,pr(K.dwarves.omen.val,55,1700,'dwarves')))doomDwarves(S);
  if(!K.elves.mistake&&K.elves.status==='standing'&&chance(S,pr(K.elves.omen.val,45,3200,'elves')))sunderElves(S);
  if(!K.city.mistake&&K.city.status==='standing'&&chance(S,pr(K.city.omen.val,60,2100,'city')))wrathOfGods(S);}
function makeRefugees(S,chars,from,dest,label){const alive=chars.filter(c=>c.alive);if(!alive.length||!dest)return;const r=newParty(S,{name:label,kind:'refugees',faction:alive[0].faction,x:from.x,y:from.y,mp:7,might:0,home:dest.id});for(const c of alive){leaveParty(S,c);joinParty(S,r,c);}r.goal={type:'settlement',id:dest.id};}
function doomDwarves(S){const K=S.kingdoms.dwarves;K.mistake=true;K.status='sealed';const cs=setById(S,K.capital);S.terrainVersion++;
  for(let y=cs.y-3;y<=cs.y+3;y++)for(let x=cs.x-3;x<=cs.x+3;x++){if(!inb(x,y))continue;const t=S.terrain[idx(x,y)];if(t===TR.MOUNTAIN||t===TR.HILLS)S.terrain[idx(x,y)]=TR.DEEPS;}
  const[cx,cy]=findTile(S,CX+ri(S,-6,6),CY-9+ri(S,-2,2),(x,y)=>[TR.FIELDS,TR.HILLS,TR.WOODS].includes(S.terrain[idx(x,y)])&&!S.settlements.some(s=>mdist(s.x,s.y,x,y)<4));
  const camp=addSet(S,{name:'the Camp of the Lost Halls',faction:'dwarves',race:'dwarf',x:cx,y:cy,type:'dcamp',pop:2000,walls:6,garrison:12,target:8,prosperity:30});K.capital=camp.id;
  const north=S.settlements.filter(s=>s.faction==='dwarves'&&s.region===0);const dead=[];
  for(const s of north){s.status=s.id===cs.id?'sealed':'ruined';s.garrison=0;const here=charsAt(S,s.x,s.y);const fled=[];
    for(const c of here){if(c.hero){story(S,c,`Climbed out of the dark through the wind-shafts when the Deeps opened. ${pn(c).S} did not speak of what ${pn(c).s} saw.`);fled.push(c);continue;}
      if(c.role==='leader'||chance(S,0.6)){kill(S,c,`was lost when the Deeps opened beneath ${s.name}`);dead.push(c);}else{story(S,c,`Fled ${s.name} as the mountain woke.`);fled.push(c);}}
    for(const p of S.parties.slice())if(p.x===s.x&&p.y===s.y)removeParty(S,p);
    makeRefugees(S,fled,s,camp,`the survivors of ${s.name}`);}
  for(const c of S.chars)if(c.alive&&c.faction==='dwarves'&&north.some(s=>s.id===c.home))c.home=camp.id;
  K.leader=null;for(let i=0;i<W*H;i++)if(S.owner[i]===1){if(S.terrain[i]===TR.DEEPS)S.dev[i]=0;if(S.region[i]===0){S.owner[i]=0;}}
  for(const p of S.parties.slice())if(p.faction==='goblins'&&S.region[idx(p.x,p.y)]===0)removeParty(S,p);
  log(S,'doom',`The dwarves of ${cs.name} delved too deep. Something old and patient woke beneath the roots of the mountain, and the halls of the North went silent in a single night. ${dead.length} of the named were lost, among them the ${K.leaderTitle}. The survivors came down into the fields and made a camp they called the Camp of the Lost Halls, and would not say what they had seen.`,cs.x,cs.y,dead.slice(0,6).map(c=>c.id));}
function sunderElves(S){const K=S.kingdoms.elves;K.mistake=true;K.status='sundered';const cs=setById(S,K.capital);S.terrainVersion++;
  for(let i=0;i<W*H;i++)if(S.region[i]===1&&S.terrain[i]!==TR.OCEAN)S.terrain[i]=TR.MIST;
  const[hx,hy]=findTile(S,CX+ri(S,-4,4),CY+ri(S,-9,9),(x,y)=>[TR.WOODS,TR.FOREST].includes(S.terrain[idx(x,y)])&&S.region[idx(x,y)]!==1&&!S.settlements.some(s=>mdist(s.x,s.y,x,y)<4));
  const haven=addSet(S,{name:'the Haven of the Remnant',faction:'elves',race:'highelf',x:hx,y:hy,type:'rhaven',pop:900,walls:8,garrison:10,target:6,prosperity:35});K.capital=haven.id;
  let gone=0;const hero=C(S,K.hero);
  for(const c of S.chars){if(!c.alive)continue;const inWest=S.region[idx(c.x,c.y)]===1;if(inWest){if(c.hero&&isFree(c.faction)){leaveParty(S,c);c.x=haven.x;c.y=haven.y;c.home=haven.id;story(S,c,`Refused the summons of the Tide-Court and walked out through the mist alone.`);continue;}
      c.alive=false;c.departed=true;c.deathYear=S.year;c.deathCause=c.faction==='elves'?'passed beyond the mist with the West':'was lost in the grey mist';story(S,c,cap(c.deathCause)+'.');if(c.faction==='elves')gone++;leaveParty(S,c);}
    else if(c.faction==='elves')c.home=haven.id;}
  for(const p of S.parties.slice()){if(S.region[idx(p.x,p.y)]===1)removeParty(S,p);}
  for(const s of S.settlements)if(s.region===1){s.status='sundered';s.garrison=0;}
  K.leader=null;for(let i=0;i<W*H;i++)if(S.owner[i]===2&&S.region[i]===1){S.owner[i]=0;S.dev[i]=0;}
  log(S,'doom',`The High Elves of ${cs.name} sundered their realm from the world. A grey mist came up off the western sea and swallowed the old-growth coast, the havens, the ships at anchor and every high elf within it — ${gone} of the named, and all their unnamed kin. The elves who were abroad that day could not go home; they gathered in the woods of the Vale in a place they called the Haven of the Remnant. No elven fleet would come up the rivers again.`,cs.x,cs.y,hero?[hero.id]:[]);
  if(hero)story(S,hero,`Became the last of the High Elves in the world.`);}
function wrathOfGods(S){const K=S.kingdoms.city;K.mistake=true;K.folded=true;const cs=setById(S,K.capital);S.terrainVersion++;
  for(let y=cs.y-6;y<=cs.y+6;y++)for(let x=cs.x-8;x<=cs.x+4;x++){if(!inb(x,y))continue;const t=S.terrain[idx(x,y)];if((t===TR.FIELDS||t===TR.WOODS)&&chance(S,0.45))S.terrain[idx(x,y)]=TR.BARRENS;}
  S.plague=3;cs.prosperity=clamp(cs.prosperity-30,5,100);cs.walls=Math.floor(cs.walls*0.6);cs.garrison=Math.floor(cs.garrison*0.5);
  for(const s of S.settlements){if(!isFree(s.faction)||s.id===cs.id)continue;s.prosperity=clamp(s.prosperity-15,5,100);s.garrison=Math.floor(s.garrison*0.8);}
  let sick=0;for(const c of S.chars){if(!c.alive||c.faction==='orcs')continue;const p=c.faction==='city'?0.4:0.18;if(chance(S,p)){c.sick=2;sick++;}}
  log(S,'doom',`The engineers of ${cs.name} lit the Great Forge, and the river ran black to the sea and the fields for a day's ride went grey. The gods answered as gods do: a plague came out of the East on the wind, and the sky did not clear for a decade. The ${K.leaderTitle} lost ${pn(C(S,K.leader||K.hero)).p} nerve, and the court began to speak of terms with the South.`,cs.x,cs.y,K.leader?[K.leader]:[]);
  if(S.kingdoms.orcs.risen)foldCity(S);}
function threatsFor(S,K){const sets=S.settlements.filter(s=>s.faction===K.key&&standing(s));const out=[];for(const p of S.parties){if(p.faction!=='orcs'||!combatKind(p)||p.retreating)continue;const pre=p.kind==='warband';for(const s of sets){const d=mdist(p.x,p.y,s.x,s.y);const heading=p.goal&&p.goal.type==='settlement'&&p.goal.id===s.id;if((pre&&(d<=5||(heading&&d<=12)))||(!pre&&(d<=12||heading))||s.besiegedBy===p.id){out.push({p,s,d});break;}}}out.sort((a,b)=>a.d-b.d);return out;}
function goalName(S,g){if(!g)return'the field';if(g.type==='settlement'){const s=setById(S,g.id);return s?s.name:'the field';}if(g.type==='party'){const p=party(S,g.id);return p?p.name:'the enemy';}if(g.type==='char'){const c=C(S,g.id);return c?c.name:'the enemy';}return placeName(S,g.x,g.y);}
function musterHost(S,K,target,why,extra){const cs=setById(S,K.capital);if(!cs||!standing(cs))return null;const counsel=counselAt(S,K.key);if(cs.garrison<25)return null;
  const tgtPos=goalPos(S,target);const byShip=K.key==='elves'&&S.river[idx(cs.x,cs.y)]&&tgtPos&&S.river[idx(tgtPos[0],tgtPos[1])];
  const might=Math.floor(cs.garrison*(0.5+0.07*counsel)*(S.alliance?1.2:1)*(byShip?1.25:1))+(extra||0);cs.garrison-=Math.min(cs.garrison-8,might);
  const here=S.chars.filter(c=>c.alive&&!c.party&&c.x===cs.x&&c.y===cs.y&&c.faction===K.key);let lead=here.filter(c=>c.role==='captain').sort((a,b)=>b.strength-a.strength)[0]||here.filter(c=>c.role==='warrior'||c.role==='ranger'||c.role==='sailor')[0];
  const l=K.leader?C(S,K.leader):null;if(l&&l.alive&&!l.party&&isAt(l,cs)&&l.traits.valor>=7&&chance(S,0.35))lead=l;
  if(!lead)lead=newChar(S,{race:cs.race,faction:K.key,home:cs.id,role:'captain',x:cs.x,y:cs.y,age:ri(S,25,40)});
  const ship=K.key==='elves';const p=newParty(S,{name:`the ${K.adj} host`,kind:'host',faction:K.key,x:cs.x,y:cs.y,mp:ship?14:7,mode:ship?'ship':'land',might,home:cs.id});joinParty(S,p,lead);recruit(S,p,3);p.goal=target;
  const s=target.type==='settlement'?setById(S,target.id):null;story(S,lead,`Led ${p.name} out of ${cs.name}${s?' toward '+s.name:''}.`);
  log(S,'march',`${byShip?'The grey ships of '+cs.name+' went down the river '+(target.type==='party'?'to meet ':'to '+why+' ')+goalName(S,target)+', under '+lead.name+'.':`${cap(p.name)} marched out of ${cs.name} under ${lead.name}${s?' to '+why+' '+s.name:''}.${counsel?' '+S.sword.name+' was there when the horns were sounded, and more answered them than would have otherwise.':''}${ship?' Grey ships went down the river.':''}`}`,cs.x,cs.y,[lead.id]);return p;}
function kingdomActs(S){const K=S.kingdoms;
  for(const key of['dwarves','elves','vale','city']){const k=K[key];if(k.status!=='standing'||(key==='city'&&k.vassal))continue;const hasHost=S.parties.some(p=>p.kind==='host'&&p.faction===key);
    const th=threatsFor(S,k);if(th.length&&!hasHost&&chance(S,0.55+0.1*counselAt(S,key))){const t=th[0];musterHost(S,k,t.s.besiegedBy===t.p.id?{type:'settlement',id:t.s.id}:{type:'party',id:t.p.id},'relieve');continue;}
    if(!hasHost&&chance(S,0.3+0.1*counselAt(S,key)+(S.alliance?0.25:0))){const bes=S.settlements.filter(s=>s.status==='besieged'&&isFree(s.faction)&&s.faction!==key&&s.type!=='village'&&(s.faction==='vale'||!kingdomKeys().includes(key)||!kingdomKeys().includes(s.faction)||rel(S,key,s.faction)>-20));if(bes.length){const s=pick(S,bes);const cs=setById(S,k.capital);if(cs.garrison>=40)musterHost(S,k,{type:'settlement',id:s.id},'relieve');}}}
  for(const key of['dwarves','elves','city']){const k=K[key];if(k.status!=='fallen'||!k.capital)continue;const cs=setById(S,k.capital);if(cs.status!=='fallen')continue;const hasHost=S.parties.some(p=>p.kind==='host'&&p.faction===key);if(!hasHost&&chance(S,0.15)){const exile=nearestSettlement(S,cs.x,cs.y,s=>standing(s)&&isFree(s.faction));if(exile&&exile.garrison>=30){const l=S.chars.filter(c=>c.alive&&!c.party&&c.faction===key&&isAt(c,exile)&&['captain','warrior'].includes(c.role))[0];if(l){const might=Math.floor(exile.garrison*0.4);exile.garrison-=might;const p=newParty(S,{name:`the ${k.adj} exiles`,kind:'host',faction:key,x:exile.x,y:exile.y,mp:7,might,home:exile.id});joinParty(S,p,l);recruit(S,p,2);p.goal={type:'settlement',id:cs.id};log(S,'march',`${cap(p.name)} set out from ${exile.name} to retake ${cs.name}.`,exile.x,exile.y,[l.id]);}}}}
  for(const c of S.chars)if(c.alive&&c.hero&&isFree(c.faction))heroAct(S,c);}
function questById(S,id){if(!id)return null;for(const q of S.quests)if(q.id===id)return q;return null;}
function questGoal(S,q,h){const K=S.kingdoms;switch(q.kind){
  case 'hunt':{if(q.targetChar){const c=C(S,q.targetChar);if(c&&c.alive)return c.party&&party(S,c.party)?{type:'party',id:c.party}:{type:'char',id:c.id};}if(q.targetParty&&party(S,q.targetParty))return{type:'party',id:q.targetParty};return null;}
  case 'scout':if(q.stage==='out')return{type:'tile',x:q.x,y:q.y};{const home=homeCapital(S,h);return home?{type:'settlement',id:home.id}:null;}
  case 'defend':case 'siege':case 'council':return{type:'settlement',id:q.settlement};
  case 'recover':return S.sword.holder?null:{type:'tile',x:S.sword.x,y:S.sword.y};
  case 'foulhands':{const hd=S.sword.holder?C(S,S.sword.holder):null;return hd&&hd.alive&&!isFree(hd.faction)?{type:'char',id:hd.id}:null;}
  case 'omen':return{type:'settlement',id:q.settlement};
  case 'errand':{if(h.id===q.target)return q.site;return null;}
  case 'strike':{const dl=K.orcs.darklord?C(S,K.orcs.darklord):null;if(!dl||!dl.alive)return null;const tp=dl.party?party(S,dl.party):null;if(!tp)return{type:'char',id:dl.id};const mine=party(S,h.party);const sw=S.sword;const bold=mine&&sw.holder&&mine.members.includes(sw.holder)&&sw.stats.valor>=3;let allied=0;for(const p of S.parties){if(!isFree(p.faction)||!combatKind(p))continue;if(mdist(p.x,p.y,dl.x,dl.y)<=3||(mine&&mdist(p.x,p.y,mine.x,mine.y)<=1))allied+=partyStrength(S,p);}const d=mdist(h.x,h.y,dl.x,dl.y);if(bold||allied>=partyStrength(S,tp)*0.5||d>4)return{type:'char',id:dl.id};if(d>=3)return null;const dx=Math.sign(h.x-dl.x)||1,dy=Math.sign(h.y-dl.y);const[x,y]=findTile(S,h.x+dx*3,h.y+dy*2,(x,y)=>passable(S,x,y,'land',h.race)&&mdist(x,y,dl.x,dl.y)>=3,4);return{type:'tile',x,y};}
  default:return null;}}
function heroAct(S,h){let p=party(S,h.party);if(p&&p.kind!=='company'&&p.kind!=='wanderer'&&p.kind!=='host')return;
  if(!p){p=newParty(S,{name:`the company of ${firstName(h)}`,kind:'company',faction:h.faction,x:h.x,y:h.y,mp:8,might:8});joinParty(S,p,h);recruit(S,p,2);}
  const q=questById(S,h.quest);if(h.quest&&(!q||q.status!=='active'))h.quest=null;
  if(q&&q.status==='active'){const g=questGoal(S,q,h);if(g){const same=p.goal&&p.goal.type===g.type&&p.goal.id===g.id&&p.goal.x===g.x&&p.goal.y===g.y;if(!same&&p.drive!=='seek'&&p.drive!=='glory'){p.goal=g;p.rest=0;}if(settlementAt(S,h.x,h.y)&&p.members.length<4)recruit(S,p,1);return;}}
  if(p.goal||p.rest>0)return;
  const threat=nearestThreat(S,h.x,h.y,h.faction,10);
  if(threat&&chance(S,0.35+h.traits.valor*0.05+(h.want&&(h.want.kind==='glory'||h.want.kind==='avenge')?0.3:0))&&partyStrength(S,p)*1.3>partyStrength(S,threat)){p.goal={type:'party',id:threat.id};return;}
  const home=homeCapital(S,h);const r=rnd(S);
  if(home&&mdist(home.x,home.y,h.x,h.y)>9&&r<(h.want&&h.want.kind==='home'?0.85:0.6)){p.goal={type:'settlement',id:home.id};}
  else if(r<0.55){const cx=home?home.x:h.x,cy=home?home.y:h.y;const[x,y]=findTile(S,cx+ri(S,-7,7),cy+ri(S,-5,5),(x,y)=>passable(S,x,y,'land',h.race),6);p.goal={type:'tile',x,y};}
  else if(r<0.75){const cands=S.settlements.filter(s=>standing(s)&&!hostile(S,s.faction,h.faction)&&!isAt(s,h)&&s.type!=='village'&&mdist(s.x,s.y,h.x,h.y)<=18);if(cands.length)p.goal={type:'settlement',id:pick(S,cands).id};}
  else p.rest=1;
  if(settlementAt(S,h.x,h.y)&&p.members.length<4)recruit(S,p,1);}
function hostsReturn(S){for(const p of S.parties.slice()){if(p.kind!=='host')continue;if(p.goal){const g=p.goal;if(g.type==='party'&&!party(S,g.id))p.goal=null;else if(g.type==='settlement'){const s=setById(S,g.id);if(s&&s.status!=='besieged'&&!hostile(S,s.faction,p.faction)&&!isAt(p,s)&&p.home!==s.id&&!nearestThreat(S,s.x,s.y,p.faction,8))p.goal=null;}}
    if(!p.goal){p.idle++;if(p.idle>=2){const home=p.home?setById(S,p.home):null;if(home&&standing(home)&&!hostile(S,home.faction,p.faction)){p.retreating=true;p.goal={type:'settlement',id:home.id};}else{const alt=nearestSettlement(S,p.x,p.y,s=>standing(s)&&s.faction===p.faction);if(alt){p.retreating=true;p.home=alt.id;p.goal={type:'settlement',id:alt.id};}}}}else p.idle=0;}}

/* ---------- civilians ---------- */
function civilianActs(S){const K=S.kingdoms;
  for(const p of S.parties){if(p.goal||p.rest>0)continue;
    if(p.kind==='ship'){const cands=S.settlements.filter(s=>standing(s)&&isFree(s.faction)&&!isAt(s,p)&&S.river[idx(s.x,s.y)]);if(!cands.length)continue;const w=cands.map(s=>s.type==='capital'?3:s.type==='town'?2:1);let tot=0;for(const v of w)tot+=v;let q=rnd(S)*tot;let ch=cands[0];for(let i=0;i<cands.length;i++){q-=w[i];if(q<=0){ch=cands[i];break;}}p.goal={type:'settlement',id:ch.id};}
    else if(p.kind==='caravan'){const cands=S.settlements.filter(s=>standing(s)&&isFree(s.faction)&&!isAt(s,p)&&s.type!=='village'&&mdist(s.x,s.y,p.x,p.y)<=34);if(cands.length)p.goal={type:'settlement',id:pick(S,cands).id};}
    else if(p.kind==='patrol'&&p.mode==='ship'){const home=p.home?setById(S,p.home):null;if(!home||!standing(home)){removeParty(S,p);continue;}let th=null,bd=7;for(const q of S.parties){if(!hostile(S,q.faction,p.faction)||!combatKind(q))continue;const i=idx(q.x,q.y);if(!(S.river[i]||S.terrain[i]===TR.OCEAN||S.terrain[i]===TR.LAKE))continue;const d=mdist(q.x,q.y,p.x,p.y);if(d<bd&&partyStrength(S,p)>partyStrength(S,q)*0.8){bd=d;th=q;}}if(th)p.goal={type:'party',id:th.id};else if(chance(S,0.6)){const[x,y]=findTile(S,p.x+ri(S,-12,12),p.y+ri(S,-8,8),(x,y)=>passable(S,x,y,'ship','highelf'),10);p.goal={type:'tile',x,y};}else p.goal={type:'settlement',id:home.id};}
    else if(p.kind==='patrol'){const home=p.home?setById(S,p.home):null;if(!home||!standing(home)){removeParty(S,p);continue;}const th=nearestThreat(S,p.x,p.y,p.faction,10);if(th&&partyStrength(S,p)>partyStrength(S,th)*0.8){p.goal={type:'party',id:th.id};}else if(chance(S,0.5)){const[x,y]=findTile(S,home.x+ri(S,-9,9),home.y+ri(S,-7,7),(x,y)=>passable(S,x,y,'land','woodelf')&&S.terrain[idx(x,y)]!==TR.MOUNTAIN,6);p.goal={type:'tile',x,y};}else p.goal={type:'settlement',id:home.id};}
    else if(p.kind==='refugees'){const dest=nearestSettlement(S,p.x,p.y,s=>standing(s)&&isFree(s.faction)&&!isAt(s,p));if(dest)p.goal={type:'settlement',id:dest.id};}
    else if(p.kind==='defectors'){const dest=nearestSettlement(S,p.x,p.y,s=>standing(s)&&s.faction==='orcs'&&!isAt(s,p));if(dest)p.goal={type:'settlement',id:dest.id};else removeParty(S,p);}
    else if(p.kind==='wanderer'){const h=S.sword.holder?C(S,S.sword.holder):null;if(!h||!p.members.includes(h.id)){const s=nearestSettlement(S,p.x,p.y,s=>standing(s)&&isFree(s.faction));if(s)p.goal={type:'settlement',id:s.id};p.kind='refugees';}else if(chance(S,0.5)){const s=nearestSettlement(S,p.x,p.y,s=>standing(s)&&!hostile(S,s.faction,p.faction)&&!isAt(s,p));if(s)p.goal={type:'settlement',id:s.id};}}}
  desireActs(S);
  const ships=S.parties.filter(p=>p.kind==='ship').length;if(K.elves.status==='standing'&&ships<3&&chance(S,0.3))spawnShip(S);
  const cars=S.parties.filter(p=>p.kind==='caravan').length;if(cars<5&&chance(S,0.35))spawnCaravan(S);
  if(K.elves.status==='standing'&&!S.parties.some(p=>p.kind==='patrol'&&p.mode==='ship')&&chance(S,0.35)){const cs=setById(S,K.elves.capital);const crew=S.chars.filter(c=>c.alive&&!c.party&&isAt(c,cs)&&c.faction==='elves'&&(c.role==='warrior'||c.role==='sailor'||c.role==='captain'));if(crew.length>=2){const p=newParty(S,{name:`the grey ship ${pick(S,['Swanroad','Kestrel','Moonwake','Sheerwater','Longsong','Ashkeel'])}`,kind:'patrol',faction:'elves',x:cs.x,y:cs.y,mp:14,mode:'ship',might:24,home:cs.id});for(const c of crew.slice(0,3))joinParty(S,p,c);log(S,'march',`${cap(p.name)} put out from ${cs.name} to keep the rivers.`,cs.x,cs.y,[crew[0].id]);}}
  const glade=S.settlements.find(s=>s.type==='glade');if(glade&&standing(glade)&&!S.parties.some(p=>p.kind==='patrol')&&chance(S,0.4)){const r=S.chars.filter(c=>c.alive&&!c.party&&c.home===glade.id&&isAt(c,glade)&&(c.role==='ranger'||c.role==='captain'));if(r.length>=2){const p=newParty(S,{name:`the rangers of ${glade.name}`,kind:'patrol',faction:'vale',x:glade.x,y:glade.y,mp:9,might:8,home:glade.id});for(const c of r.slice(0,3))joinParty(S,p,c);}}
  for(const s of S.settlements){if(!isFree(s.faction)||!standing(s)||s.type==='village')continue;if(s.garrison<8&&chance(S,0.3))continue;const idle=S.chars.filter(c=>c.alive&&!c.party&&isAt(c,s)&&c.faction===s.faction&&(c.role==='warrior'||c.role==='captain')&&c.traits.wanderlust>=7);if(idle.length&&chance(S,0.12)){const l=idle[0];const cands=S.settlements.filter(q=>standing(q)&&isFree(q.faction)&&!isAt(q,s)&&mdist(q.x,q.y,s.x,s.y)<=30&&q.type!=='village');if(cands.length){const p=newParty(S,{name:`${firstName(l)}'s riders`,kind:'company',faction:s.faction,x:s.x,y:s.y,mp:8,might:4,home:s.id});joinParty(S,p,l);recruit(S,p,1);p.goal={type:'settlement',id:pick(S,cands).id};story(S,l,`Grew restless in ${s.name} and rode out.`);}}}
  for(const p of S.parties.slice()){if(p.kind==='company'&&!p.members.some(id=>C(S,id).hero)){p.idle=p.goal?0:p.idle+1;if(p.idle>=2){const s=settlementAt(S,p.x,p.y);if(s&&standing(s)&&!hostile(S,s.faction,p.faction))settleParty(S,p,s);else{const d=nearestSettlement(S,p.x,p.y,s=>standing(s)&&!hostile(S,s.faction,p.faction));if(d)p.goal={type:'settlement',id:d.id};}}}}}
function settlementEvents(S){const K=S.kingdoms;
  for(const s of S.settlements){if(!standing(s))continue;if(s.status==='besieged'){s.prosperity=clamp(s.prosperity-5,5,100);continue;}
    s.prosperity=clamp(s.prosperity+(55-s.prosperity)*0.08+ri(S,-6,6),5,100);s.garrison=Math.min(maxGarrison(s),s.garrison+2+Math.floor(s.prosperity/25));
    const r=rnd(S);const notable=s.type==='capital'||s.type==='town';
    if(r<0.025){let sick=0;for(const c of charsAt(S,s.x,s.y))if(!c.party&&chance(S,0.35)){c.sick=2;sick++;}if(sick)log(S,'life',`A fever went through ${s.name}.`,s.x,s.y,[]);}
    else if(r<0.055&&notable){s.prosperity=clamp(s.prosperity+10,5,100);log(S,'life',pick(S,[`A good harvest filled the granaries of ${s.name}.`,`${s.name} held a festival that people talked about for a generation.`,`A new bridge was raised at ${s.name}.`,`Traders came to ${s.name} from far away and paid in silver.`]),s.x,s.y,[]);}
    else if(r>=0.055&&r<0.075&&s.faction==='dwarves'&&s.type==='capital'&&!K.dwarves.mistake){K.dwarves.omen.val=clamp(K.dwarves.omen.val+6,0,100);s.prosperity=clamp(s.prosperity+8,5,100);log(S,'omen',`Miners at ${s.name} struck a new seam of star-iron, deeper than any before.`,s.x,s.y,[]);}
    else if(r>=0.075&&r<0.095&&s.faction==='city'&&s.type==='capital'&&!K.city.mistake){K.city.omen.val=clamp(K.city.omen.val+6,0,100);log(S,'omen',pick(S,[`An engine of brass and steam was unveiled in the square of ${s.name}.`,`The guilds of ${s.name} dammed the river for a mill-race a mile long.`,`A tower of iron went up in ${s.name} taller than the temple.`]),s.x,s.y,[]);}
    else if(r>=0.095&&r<0.115&&s.faction==='elves'&&s.type==='capital'&&!K.elves.mistake){K.elves.omen.val=clamp(K.elves.omen.val+6,0,100);log(S,'omen',pick(S,[`The Tide-Court of ${s.name} sang the Lament of the First Shore, and did not stop for a year.`,`Three grey ships sailed west out of ${s.name} and did not come back.`]),s.x,s.y,[]);}
    else if(r<0.135&&s.faction==='dwarves'&&s.type==='capital'&&!K.dwarves.mistake){K.dwarves.omen.val=clamp(K.dwarves.omen.val-9,0,100);log(S,'omen',`The deep-priests of ${s.name} sealed a shaft and forbade the lower seams for a decade.`,s.x,s.y,[]);}
    else if(r<0.15&&s.faction==='city'&&s.type==='capital'&&!K.city.mistake){K.city.omen.val=clamp(K.city.omen.val-8,0,100);log(S,'omen',`The temple of ${s.name} won a quarrel with the guilds; the mills were quiet on feast days again.`,s.x,s.y,[]);}}
  if(S.plague>0){S.plague--;let n=0;for(const c of S.chars){if(!c.alive||c.faction==='orcs'||c.sick)continue;if(chance(S,0.22)){c.sick=2;n++;}}}}

/* ---------- the sword ---------- */
function resolvedSeek(S){const sw=S.sword;if(sw.seek!=='nearest'&&sw.seek!=='boldest'){sw.seekLock=null;return seekTarget(S);}const h=sw.holder?C(S,sw.holder):null;
  if(sw.seekLock&&sw.seekLockFor===sw.seek){const c=C(S,sw.seekLock);const cp=c&&c.party?party(S,c.party):null;if(c&&c.alive&&isFree(c.faction)&&c.id!==sw.holder&&(!h||mdist(c.x,c.y,h.x,h.y)<=30)&&!(cp&&cp.mode==='ship')&&S.turn-(sw.seekLockTurn||0)<=8)return c;}
  const t=seekTarget(S);sw.seekLock=t?t.id:null;sw.seekLockFor=sw.seek;sw.seekLockTurn=S.turn;return t;}
function seekTarget(S){const sw=S.sword;const K=S.kingdoms;const h=sw.holder?C(S,sw.holder):null;const hx=h?h.x:sw.x,hy=h?h.y:sw.y;
  if(sw.seek==='dwarfhero')return C(S,K.dwarves.hero);if(sw.seek==='elfhero')return C(S,K.elves.hero);if(sw.seek==='humanhero')return C(S,K.city.hero);
  const LK={dwarfleader:'dwarves',elfleader:'elves',valeleader:'vale',cityleader:'city'};if(LK[sw.seek]){const k=K[LK[sw.seek]];if(!k.leader)return null;const c=C(S,k.leader);return c.alive?c:null;}
  if(sw.seek==='leader'){let best=null,bd=1e9;for(const key of['dwarves','elves','vale','city']){const k=K[key];if(!k.leader)continue;const c=C(S,k.leader);if(!c.alive||(h&&c.id===h.id))continue;const d=mdist(c.x,c.y,hx,hy);if(d<bd){bd=d;best=c;}}return best;}
  if(sw.seek==='boldest'){let best=null,bs=-1;for(const c of S.chars){if(!c.alive||!isFree(c.faction)||(h&&c.id===h.id))continue;if(mdist(c.x,c.y,hx,hy)>16)continue;const s=c.traits.valor*2+c.strength+(c.hero?6:0);if(s>bs){bs=s;best=c;}}return best;}
  if(sw.seek==='nearest'){const recent=sw.history.slice(-4).map(e=>e.holder);let best=null,bd=1e9;for(const c of S.chars){if(!c.alive||!isFree(c.faction)||recent.includes(c.id)||(h&&(c.id===h.id||(c.x===h.x&&c.y===h.y))))continue;{const cp=c.party?party(S,c.party):null;if(cp&&cp.mode==='ship')continue;}const d=mdist(c.x,c.y,hx,hy);if(d>0&&d<bd){bd=d;best=c;}}return best;}
  return null;}
function swordDrive(S){const sw=S.sword;if(!sw.holder)return;const h=C(S,sw.holder);if(!h.alive)return;const st=sw.stats;const drives=[];
  const tgt=resolvedSeek(S);if(st.call>0&&tgt&&tgt.alive&&(tgt.x!==h.x||tgt.y!==h.y)){const q=errandFor(S,h,tgt);const g=q?errandGoal(S,q):null;if(g&&!(g.type==='settlement'&&isAt(setById(S,g.id),h))&&!(g.type==='tile'&&g.x===h.x&&g.y===h.y))drives.push({k:'seek',score:st.call*2.2+1,goal:g});}
  else{const eq=activeQuest(S,'errand');if(eq&&(st.call===0||!tgt||tgt.id===sw.holder))endQuest(S,eq,tgt&&tgt.id===sw.holder,tgt&&tgt.id===sw.holder?`${sw.name} rests in the hand it sought.`:'The song changed, and the errand was forgotten.');}
  if(st.valor>0){const K=S.kingdoms.orcs;const dl=K.darklord?C(S,K.darklord):null;const f=K.fortress?setById(S,K.fortress):null;if(dl&&dl.alive&&!K.broken&&dl.party&&party(S,dl.party)&&!(f&&isAt(dl,f))&&mdist(dl.x,dl.y,h.x,h.y)<=8+st.valor*7)drives.push({k:'valor',score:st.valor*2.6+1.5,goal:{type:'party',id:dl.party}});
    const t=nearestThreat(S,h.x,h.y,h.faction,16);if(t)drives.push({k:'valor',score:st.valor*2+h.traits.valor*0.15,goal:{type:'party',id:t.id}});else{const bes=S.settlements.filter(s=>s.status==='besieged'&&!hostile(S,s.faction,h.faction)&&mdist(s.x,s.y,h.x,h.y)<=24);if(bes.length)drives.push({k:'valor',score:st.valor*2,goal:{type:'settlement',id:bes[0].id}});}}
  if(st.glory>0){const cs=homeCapital(S,h);if(cs&&!isAt(cs,h))drives.push({k:'glory',score:st.glory*2+0.5,goal:{type:'settlement',id:cs.id}});}
  if(st.ward>=3){const t=nearestThreat(S,h.x,h.y,h.faction,7);const hp1=party(S,h.party);if(t&&(!hp1||partyStrength(S,t)>partyStrength(S,hp1)*1.1)){const safe=nearestSafe(S,h,t);if(safe)drives.push({k:'ward',score:st.ward*1.6+1,goal:{type:'settlement',id:safe.id}});}}
  if(!drives.length){const p0=party(S,h.party);if(p0&&p0.drive&&p0.drive!=='seek')p0.drive=null;return;}drives.sort((a,b)=>b.score-a.score);const d=drives[0];
  let p=party(S,h.party);let threshold=p?2.5:4.5;if(h.role==='leader')threshold+=3;if(h.role==='darklord')threshold+=6;if(p&&(p.kind==='army'||p.kind==='host')&&p.might>30)threshold+=5;
  const hq=questById(S,h.quest);if(hq&&hq.status==='active'&&d.k==='seek')threshold+=hq.main?3:1;
  if(hq&&hq.status==='active'&&d.k!=='seek'&&!(d.k==='valor'&&d.goal.type==='party'&&(()=>{const dp=party(S,d.goal.id);const dl=S.kingdoms.orcs.darklord;return dp&&dl&&dp.members.includes(dl);})()))threshold+=4;
  if(d.score<threshold){if(p&&p.drive&&p.drive!=='seek')p.drive=null;return;}
  if(!p){p=newParty(S,{name:`${firstName(h)}'s road`,kind:'wanderer',faction:h.faction,x:h.x,y:h.y,mp:8,might:2});joinParty(S,p,h);const s=settlementAt(S,h.x,h.y);story(S,h,`Left ${s?s.name:'home'} with ${sw.name} at ${pn(h).p} hip. It would not let ${pn(h).o} rest.`);log(S,'sword',`${h.name} left ${s?s.name:'the fields'} — ${sw.name} would not let ${pn(h).o} rest.`,h.x,h.y,[h.id]);recruit(S,p,1);}
  if(p.kind==='refugees'||p.kind==='caravan'||p.kind==='ship'){if(d.k==='valor'&&p.kind!=='ship')return;}
  p.goal=d.goal;p.drive=d.k;p.rest=0;}
function dropSword(S,x,y,who){const sw=S.sword;sw.holder=null;sw.x=x;sw.y=y;sw.lostTurns=0;if(who)log(S,'sword',`${sw.name} lay in ${placeName(S,x,y)} where ${who.name} fell.`,x,y,[who.id]);}
function candScore(S,c,h,old){const sw=S.sword;if(c.faction==='orcs')return-1;let s=0;const tgt=resolvedSeek(S);if(c.want){if(c.want.kind==='sword')s+=35;else if(c.want.kind==='avenge')s+=10;else if(c.want.kind==='home')s-=6;else if(c.want.kind==='dark'&&h&&h.hero)s-=10;}
  if(tgt&&c.id===tgt.id)return 100;
  if(sw.seek==='leader'&&(c.role==='leader'||c.role==='captain'))s=60;if(sw.seek==='boldest')s=c.traits.valor*8;if(sw.seek==='nearest')s=30;
  if(tgt&&c.faction===tgt.faction)s=Math.max(s,25);if(c.hero)s=Math.max(s,35);if(c.party&&h&&c.party!==h.party)s+=5;
  if(old){if(h&&c.parent===h.name)s+=40;else s+=10;}return s;}
function transfer(S,h,c,how){const sw=S.sword;const p=pn(h);let txt;
  if(how==='bequeathed')txt=`${h.name}, grown old, laid ${sw.name} in the hands of ${c.name}.`;
  else if(how==='cast')txt=`${h.name} could not bear ${sw.name}'s singing and cast it down; ${c.name} took it up.`;
  else if(c.hero)txt=pick(S,[`${c.name} took up ${sw.name} from ${h.name}, and it rang like a bell.`,`${h.name} knelt and offered ${sw.name} to ${c.name}. It had, ${p.s} said, been asking for ${c.name} by name.`]);
  else txt=pick(S,[`${h.name} gave ${sw.name} to ${c.name}.`,`${sw.name} sang, and ${h.name} could not keep it; ${c.name} took it up.`,`${c.name} won ${sw.name} from ${h.name} at dice, and both of them felt it had been decided elsewhere.`,`${h.name} pressed ${sw.name} into the hands of ${c.name} and would not say why.`]);
  sw.holder=c.id;sw.x=c.x;sw.y=c.y;sw.lastTransfer=S.turn;sw.history.push({year:S.year,holder:c.id,name:c.name,text:txt});if(c.want&&c.want.kind==='sword'){c.want={kind:'keep',target:null};story(S,c,`Found the sword ${pn(c).s} had wanted all ${pn(c).p} life.`);}story(S,h,`Gave up ${sw.name} to ${c.name}.`);story(S,c,`Took up ${sw.name} from ${h.name}.`);log(S,'sword',txt,c.x,c.y,[h.id,c.id]);}
function swordTurn(S){const sw=S.sword;const st=sw.stats;const tgt5=st.call>=5?resolvedSeek(S):null;
  if(sw.holder){const h=C(S,sw.holder);if(!h.alive)dropSword(S,h.x,h.y,null);else if(tgt5&&tgt5.id!==h.id&&tgt5.alive){const why=pick(S,[`it had grown too heavy to lift`,`it burned ${pn(h).p} hand`,`it would not be held`]);sw.holder=null;sw.x=h.x;sw.y=h.y;sw.lostTurns=0;sw.lastTransfer=S.turn;story(S,h,`Let ${sw.name} fall: ${why}.`);log(S,'sword',`${h.name} let ${sw.name} fall in ${placeName(S,h.x,h.y)}: ${why}. It wants ${tgt5.name}, and no other.`,h.x,h.y,[h.id,tgt5.id]);}}
  if(!sw.holder){sw.lostTurns++;const here0=charsAt(S,sw.x,sw.y);const here=tgt5?here0.filter(c=>c.id===tgt5.id):here0;
    if(tgt5&&!here.length&&here0.length&&chance(S,0.35)){const c=here0[0];log(S,'sword',`${c.name} reached for ${sw.name} and could not lift it. It is waiting for ${tgt5.name}.`,sw.x,sw.y,[c.id]);}
    if(!here.length&&st.call>=3){const tg=resolvedSeek(S);if(tg&&tg.alive&&isFree(tg.faction)){if(tg.hero){const q=activeQuest(S,'recover');if(q){if(!q.heroes.includes(tg.id))assignHero(S,q,tg);}else{const q2=addQuest(S,{kind:'recover',title:'The Lost Sword',x:sw.x,y:sw.y,chars:[tg.id],expires:S.turn+10,text:`${sw.name} lay in ${placeName(S,sw.x,sw.y)} and sang for ${tg.name}. ${pn(tg).S} went to answer it.`});assignHero(S,q2,tg);}}else if(!tg.party&&!S.parties.some(p=>p.seeker)){const p=newParty(S,{name:`${firstName(tg)}, who heard the sword`,kind:'wanderer',faction:tg.faction,x:tg.x,y:tg.y,mp:8,might:1,home:tg.home});joinParty(S,p,tg);p.goal={type:'tile',x:sw.x,y:sw.y};p.seeker=true;story(S,tg,`Heard ${sw.name} calling from ${placeName(S,sw.x,sw.y)} and went.`);}}}
    if(here.length){const free=here.filter(c=>isFree(c.faction));const pool=free.length?free:here;let best=null,bs=-9;for(const c of pool){let s=free.length?candScore(S,c,null,false):1;s+=c.strength*0.5+(c.hero?10:0);if(s>bs){bs=s;best=c;}}
      if(best&&chance(S,0.85)){sw.holder=best.id;sw.x=best.x;sw.y=best.y;const txt=best.faction==='orcs'?`${best.name} found ${sw.name} among the dead and kept it, though it burned ${pn(best).p} hand.`:`${best.name} found ${sw.name} in ${placeName(S,sw.x,sw.y)} and took it up.`;sw.history.push({year:S.year,holder:best.id,name:best.name,text:txt});story(S,best,`Found ${sw.name}.`);log(S,'sword',txt,sw.x,sw.y,[best.id]);}}
    else if(!tgt5){let near=null,bd=st.call>0?9:3;for(const p of S.parties){if(p.faction==='orcs'&&st.call>0)continue;const d=mdist(p.x,p.y,sw.x,sw.y);if(d<bd){bd=d;near=p;}}if(near&&chance(S,(st.call>0?0.2:0.3)+st.call*0.15)){near.goal={type:'tile',x:sw.x,y:sw.y};near.rest=0;const l=leadChar(S,near);log(S,'sword',`${cap(near.name)} heard a song in the wind and turned toward ${placeName(S,sw.x,sw.y)}.`,near.x,near.y,l?[l.id]:[]);}}
    return;}
  const h=C(S,sw.holder);sw.x=h.x;sw.y=h.y;
  if(st.glory>0){const cs=homeCapital(S,h);if(cs&&isAt(cs,h)&&standing(cs)){h.renown+=st.glory*2;cs.prosperity=clamp(cs.prosperity+4,5,100);sw.renown+=1;log(S,'sword',`${h.name} came home to ${cs.name} with ${sw.name} and was received with honour: a feast, a song, ${pn(h).p} name cut into the hall-post. The sword's longing for glory was spent.`,h.x,h.y,[h.id]);story(S,h,`Honoured in ${cs.name} for bearing ${sw.name}.`);st.glory=0;const p=party(S,h.party);if(p&&p.drive==='glory'){p.drive=null;p.goal=null;}}}
  if(S.turn-(sw.lastTransfer==null?-9:sw.lastTransfer)<2)return;
  const age=ageOf(S,h);const old=isFinite(h.life)&&age>h.life-16;const recent=sw.history.slice(-4).map(e=>e.holder);
  const here=charsAt(S,h.x,h.y).filter(c=>c.id!==h.id);if(!here.length)return;
  if(h.faction==='orcs'){const free=here.filter(c=>isFree(c.faction));if(free.length&&chance(S,0.15+st.call*0.15)){transfer(S,h,free[0],'cast');return;}if(st.call>=2&&chance(S,0.08*st.call)){story(S,h,`Threw ${sw.name} away; it would not stop singing.`);log(S,'sword',`${h.name} flung ${sw.name} into ${placeName(S,h.x,h.y)}. It would not stop singing.`,h.x,h.y,[h.id]);dropSword(S,h.x,h.y,null);}return;}
  if(h.role==='darklord')return;
  let best=null,bs=-9;for(const c of here){let s=candScore(S,c,h,old);if(s<100&&recent.includes(c.id))s=-1;if(s<100&&h.hero&&s<50)s=-1;if(s>bs){bs=s;best=c;}}if(!best||bs<=0)return;
  let p=0;if(st.call>0)p=(st.call/5)*(bs>=100?0.92:bs>=50?0.55:bs>=20?0.3:0.12);if(old&&!h.hero)p=Math.max(p,0.35);
  if(p>0&&chance(S,p))transfer(S,h,best,old&&bs<100?'bequeathed':null);}

/* ---------- life ---------- */
function kill(S,c,cause){if(!c.alive)return;c.alive=false;c.deathYear=S.year;c.deathCause=cause;story(S,c,cap(cause)+'.');leaveParty(S,c);
  if(/fell at|died in|slain|killed|raid|battle|storming|siege/.test(cause)&&(c.renown>=2||c.role==='leader'||c.hero)){for(const k of S.chars){if(!k.alive||k.parent!==c.name||k.hero||!k.want||k.want.kind==='dark'||k.want.kind==='avenge')continue;if(chance(S,0.5)){k.want={kind:'avenge',target:c.name,foe:S.lastKiller||'orcs'};story(S,k,`Swore to avenge ${c.name}.`);}}}
  if(S.sword.holder===c.id)dropSword(S,c.x,c.y,c);
  const K=kingdomOf(S,c.faction);
  if(c.role==='leader'&&K)log(S,'realm',`${c.name}, ${c.title||K.leaderTitle}, ${cause}.`,c.x,c.y,[c.id]);
  else if(c.renown>=5||((c.role==='chieftain'||c.role==='general')&&cause.indexOf('old age')<0))log(S,'life',`${c.name} ${cause}.`,c.x,c.y,[c.id]);
  if(c.faction==='elves')S.kingdoms.elves.lossesRecent+=1;}
function succession(S,K){if(K.status!=='standing'||!K.capital)return;const cs=setById(S,K.capital);if(!cs||!standing(cs))return;const old=K.leader?C(S,K.leader):null;
  const cands=S.chars.filter(c=>c.alive&&c.faction===K.key&&!c.hero&&c.role!=='leader'&&isAt(c,cs)&&(c.role!=='orc'));
  let next=null;if(old){const heirs=cands.filter(c=>c.parent===old.name);if(heirs.length)next=heirs[0];}
  if(!next&&cands.length){cands.sort((a,b)=>((b.role==='captain'?3:0)+b.renown*0.3+b.traits.ambition*0.2)-((a.role==='captain'?3:0)+a.renown*0.3+a.traits.ambition*0.2));next=cands[0];}
  if(!next)next=newChar(S,{race:cs.race,faction:K.key,home:cs.id,role:'leader',x:cs.x,y:cs.y,age:ri(S,22,40)});
  if(next.party)leaveParty(S,next);next.role='leader';next.title=leaderTitle(K,next);next.strength=Math.max(next.strength,6);K.leader=next.id;
  const how=(old&&next.parent===old.name?`, child of ${old.name},`:'')+` was ${K.key==='vale'?'named':'crowned'} ${next.title} in ${cs.name}`;
  story(S,next,`Became ${next.title}.`);log(S,'realm',`${next.name}${how}.`,cs.x,cs.y,[next.id]);}
function lifeAndDeath(S){for(const c of S.chars){if(!c.alive)continue;const age=S.year-c.born;
    if(c.sick>0){const p=c.hero?0:(c.race==='human'?0.4:c.race==='dwarf'?0.3:c.race==='orc'?0.35:0.12);if(chance(S,p)){kill(S,c,'died of the fever');continue;}c.sick--;if(c.sick===0)story(S,c,c.hero?'Survived the fever; fate held.':'Recovered from the fever.');}
    if(!c.hero&&isFinite(c.life)&&age>c.life){kill(S,c,'died of old age');continue;}}
  for(const key of['dwarves','elves','vale','city']){const K=S.kingdoms[key];if(K.leader){const l=C(S,K.leader);if(!l.alive){K.leader=null;succession(S,K);}}else if(K.status==='standing')succession(S,K);}
  if(S.hard)championTurn(S);
  for(const p of S.parties.slice())cleanupParty(S,p);}
function births(S){const byHome={};for(const c of S.chars){if(!c.alive)continue;(byHome[c.home]||(byHome[c.home]=[])).push(c);}for(const s of S.settlements){if(!standing(s))continue;const residents=byHome[s.id]||[];if(residents.length>=s.target)continue;const n=residents.length<s.target-3?2:(chance(S,0.7)?1:0);
    for(let k=0;k<n;k++){const race=raceFor(S,s);const roles=BIRTH_ROLES[s.type]||BIRTH_ROLES.village;const role=pick(S,roles);let parent=null;const same=residents.filter(c=>c.race===race&&S.year-c.born>=30);if(same.length&&chance(S,0.6)){const K=kingdomOf(S,s.faction);const lead=same.find(c=>K&&K.leader===c.id);parent=(lead&&chance(S,0.5))?lead.name:pick(S,same).name;}
      const c=newChar(S,{race,faction:s.faction,home:s.id,role,x:s.x,y:s.y,age:ri(S,16,24),parent});story(S,c,`Came of age in ${s.name}${parent?', child of '+parent:''}.`);residents.push(c);}}}

/* ---------- turn ---------- */
function simulateTurn(S){if(S.ended)return;S.turn++;S.year+=10;
  if(!S.swordTrail)S.swordTrail=[];S.swordTrail.push([S.sword.x,S.sword.y]);
  updateOmens(S);if(S.turn===S.riseTurn)riseDarkLord(S);settlementEvents(S);checkMistakes(S);landTurn(S);diploTurn(S);goblinActs(S);orcActs(S);questsTurn(S);kingdomActs(S);civilianActs(S);swordDrive(S);
  for(const p of S.parties.slice())if(S.parties.includes(p))moveParty(S,p);
  encounters(S);sieges(S);questsResolve(S);swordTurn(S);lifeAndDeath(S);births(S);hostsReturn(S);
  for(const s of S.settlements){if(s.status==='besieged'){const b=s.besiegedBy?party(S,s.besiegedBy):null;if(!b||!isAt(b,s)||b.retreating){s.status='standing';s.besiegedBy=null;}}}
  if(S.turn>=TURNS){S.ended=true;S.fates=computeFates(S);}}

/* ---------- projections ---------- */
function liteClone(S){const lite=Object.assign({},S,{chronicle:[],chars:S.chars.map(c=>Object.assign({},c,{story:[]}))});return structuredClone(lite);}
function project(S,block,seek,turns,runs,salt){const K=S.kingdoms;const seek0=S.sword.seek;S.sword.seek=seek;const tgt=seekTarget(S);S.sword.seek=seek0;const targetId=(tgt&&['dwarfhero','elfhero','humanhero','dwarfleader','elfleader','valeleader','cityleader'].includes(seek))?tgt.id:null;
  const caps=()=>['dwarves','elves','vale','city'].filter(k=>{const s=S.kingdoms[k].capital?setById(S,S.kingdoms[k].capital):null;return s&&standing(s);}).length;
  const base={reach:0,survive:0,holds:0,noMistake:0,dlDead:0,runs};const h0=S.sword.holder;const caps0=caps();const m0=['dwarves','elves','city'].filter(k=>K[k].mistake).length;
  for(let r=0;r<runs;r++){const Cl=liteClone(S);Cl.rng=((S.rng^((r+1)*2654435761))^(salt*40503))|0||1;Object.assign(Cl.sword.stats,block);Cl.sword.seek=seek;let reached=false;
    for(let t=0;t<turns&&!Cl.ended;t++){simulateTurn(Cl);if(targetId&&Cl.sword.holder===targetId)reached=true;}
    if(reached)base.reach++;if(h0&&Cl.sword.holder===h0&&C(Cl,h0).alive)base.survive++;
    const capsN=['dwarves','elves','vale','city'].filter(k=>{const s=Cl.kingdoms[k].capital?Cl.settlements[Cl.kingdoms[k].capital-1]:null;return s&&(s.status==='standing'||s.status==='besieged');}).length;
    if(capsN>=caps0)base.holds++;const m1=['dwarves','elves','city'].filter(k=>Cl.kingdoms[k].mistake).length;if(m1<=m0)base.noMistake++;const dl=Cl.kingdoms.orcs.darklord?C(Cl,Cl.kingdoms.orcs.darklord):null;if(dl&&!dl.alive)base.dlDead++;}
  return base;}

/* ---------- fates ---------- */
function computeFates(S){const K=S.kingdoms;const dl=K.orcs.darklord?C(S,K.orcs.darklord):null;const dlDead=!!(dl&&!dl.alive);const sw=S.sword;
  const capStanding=k=>{const s=K[k].capital?setById(S,K[k].capital):null;return!!(s&&standing(s)&&K[k].status==='standing'&&!(k==='city'&&K.city.vassal));};
  const st=['dwarves','elves','vale','city'].filter(capStanding).length;const mistakes=['dwarves','elves','city'].filter(k=>K[k].mistake).length;
  let tier,title,text;
  if(dlDead&&st>=3){tier='dawn';title='The Dawn';text=`${dl.name} ${dl.title} is dead, and the free kingdoms stand. The Host has gone back into the swamp barrows of the South, and the children born this decade will grow up thinking of orcs as a story their grandmothers tell.`;}
  else if(dlDead){tier='ember';title='An Ember Kept';text=`${dl.name} ${dl.title} is dead, but the world that killed ${pn(dl).o} is a poorer one. ${st===0?'No capital stands as it stood at the beginning of the age.':st===1?'Only one of the old capitals stands.':'Two of the old capitals stand.'} What was lost was lost for good; what remains, remains.`;}
  else if(!K.orcs.risen){tier='quiet';title='The Quiet Age';text='The Dark Lord never rose. Nobody knows why.';}
  else if(st===0){tier='night';title='The Long Night';text=`${dl.name} ${dl.title} rules from ${(K.orcs.fortress?setById(S,K.orcs.fortress):{name:'the South'}).name}, and every crown in the world lies under one heel. The sword ${sw.name} ${sw.holder?'is still in the world, somewhere':'lies where it fell'}, and the age that comes after this one will begin in the dark.`;}
  else if(st<=2){tier='twilight';title='The Twilight';text=`${dl.name} ${dl.title} lives, and ${st===1?'one capital stands':'two capitals stand'} against ${pn(dl).o}. The war is not over; it has only outlived the age. Somewhere the sword ${sw.name} is waiting for a better hand, or a better hour.`;}
  else{tier='uneasy';title='An Uneasy Peace';text=`${dl.name} ${dl.title} lives, but the free kingdoms held. The Host went back to the South to lick its wounds and the rivers ran with ships again. Everyone knows it will come back. Nobody knows when.`;}
  const fates=[];const heroFate=(k)=>{const h=C(S,K[k].hero);if(!h)return;const kk=K[k];const held=sw.history.some(e=>e.holder===h.id);const holds=sw.holder===h.id;let f='';
    if(!h.alive)f=`${cap(h.deathCause)}. ${kk.name.replace(/^the /,'The ')} had no hero to replace ${pn(h).o}, and did without.`;
    else if(h.slewDarkLord)f=`slew ${dl.name} with ${sw.name}, and was ${k==='dwarves'?'crowned Under-King of a kingdom that had to be rebuilt from the fields':k==='elves'?'the last of the High Elves to be sung of in the world':'given a crown and refused it, and given it again'}.`;
    else if(tier==='night')f=k==='dwarves'?`was taken alive at the end and chained in the pits of ${(K.orcs.fortress?setById(S,K.orcs.fortress):{name:'the South'}).name}, singing the names of the doors that would not open again.`:k==='elves'?`walked into the grey mist at the end of the age and was not seen again on any shore.`:`led the last free company in the hills of the Vale until the end of the age, and after it.`;
    else if(kk.mistake&&k==='dwarves')f=`led the diaspora of the Lost Halls; every winter ${pn(h).s} sang the names of the doors that would not open again, and every spring ${pn(h).s} went back up the mountain to look.`;
    else if(kk.mistake&&k==='elves')f=`became the last High Elf in the world, and kept the Haven of the Remnant as a lamp is kept, so that someone would remember how the ships were built.`;
    else if(kk.mistake&&k==='city')f=`never went back to the Great City after the Sovereign bent the knee; ${pn(h).s} was the Vale's captain until the end of the age, and the Vale did not forget it.`;
    else if(kk.status==='fallen')f=`kept the court of ${kk.name.replace(/^the /,'')} in exile, and swore an oath at every turning of the year to go home.`;
    else if(tier==='dawn'||tier==='ember')f=held?`carried ${sw.name} for a time, and put it down again, and lived. That is a rarer fate than it sounds.`:`lived to see the Host broken, and found ${pn(h).s} did not know what to do with the years after.`;
    else f=holds?`holds ${sw.name} still, and is waiting.`:held?`once carried ${sw.name}, and sometimes dreams of it.`:S.hard?`is still alive at the end of the age, which for a champion with no prophecy behind ${pn(h).o} is achievement enough.`:`is still in the world, still marked, still waiting for the hour the priests promised.`;
    fates.push({name:`${h.name}${h.title?' '+h.title:''}`,who:`${RACE_NAMES[h.race]} ${S.hard?'champion':'hero'} of ${kk.name}`,id:h.id,text:f});};
  heroFate('dwarves');heroFate('elves');heroFate('city');
  if(dl)fates.push({name:`${dl.name} ${dl.title}`,who:'the Dark Lord',id:dl.id,text:dlDead?`${dl.deathCause}. The tribes went back to quarrelling among the swamp barrows, which is what they were for.`:tier==='night'?'rules the world.':'sits in the South, counting.'});
  const kf=[];const kt=(k,t)=>kf.push({name:K[k].name,text:t});
  kt('dwarves',K.dwarves.mistake?'sealed in the Deeps; the survivors farm in the fields and do not dig.':K.dwarves.status==='fallen'?'its halls are held by orcs.':`stands, and the picks still ring in ${devCount(S,K.dwarves)} delvings.`);
  kt('elves',K.elves.mistake?'gone into the mist. The Haven of the Remnant keeps the memory.':K.elves.status==='fallen'?'its haven is held by orcs.':`stands, and the grey ships still sail past ${devCount(S,K.elves)} groves.`);
  kt('vale',K.vale.status==='fallen'?'burned; its people scattered.':'stands, as it always has, by the river.');
  kt('city',K.city.vassal?'a vassal of the South, its gates open, its chimneys cold.':K.city.status==='fallen'?'its walls are held by orcs.':`stands, and the lamps are lit at dusk over ${devCount(S,K.city)} engine-farms.`);
  const holder=sw.holder?C(S,sw.holder):null;const swordText=`${sw.name} passed through ${sw.history.length} pair${sw.history.length===1?'':'s'} of hands in a thousand years${sw.slayer?', and in the hands of '+C(S,sw.slayer).name+' it did what it was made for':''}. ${holder?'At the end of the age it hangs at the hip of '+holder.name+', '+roleName(holder)+' of '+(holder.home?setById(S,holder.home).name:'nowhere')+'.':'At the end of the age it lies in '+placeName(S,sw.x,sw.y)+', waiting.'}`;
  const qd=S.quests.filter(q=>q.status==='done').length,qf=S.quests.filter(q=>q.status==='failed').length;
  return{tier,title,text,fates,kingdoms:kf,sword:swordText,mistakes,standing:st,questsDone:qd,questsFailed:qf};}



/* ---------- champions (hard mode) ---------- */
function championTurn(S){const K=S.kingdoms;for(const k of kingdomKeys()){const kk=K[k];const old=kk.hero?C(S,kk.hero):null;if(old&&old.alive)continue;
    const cands=S.chars.filter(c=>c.alive&&c.faction===k&&c.role!=='leader'&&(c.role==='captain'||c.role==='warrior'||c.role==='ranger'||c.role==='sailor')&&(!isFinite(c.life)||ageOf(S,c)<c.life-25)).sort((a,b)=>(b.strength+b.renown*0.5+(b.role==='captain'?2:0))-(a.strength+a.renown*0.5+(a.role==='captain'?2:0)));
    let c=cands[0];if(!c){const cs=kk.capital?setById(S,kk.capital):null;if(!cs||!standing(cs))continue;c=newChar(S,{race:cs.race,faction:k,home:cs.id,role:'captain',x:cs.x,y:cs.y,age:ri(S,20,30)});}
    kk.hero=c.id;c.title='';c.quest=null;
    for(const q of S.quests){if(q.status!=='active'||!old)continue;const i=q.heroes.indexOf(old.id);if(i>=0){q.heroes.splice(i,1);assignHero(S,q,c);}}
    story(S,c,old?`Took up what ${old.name} had carried.`:`Named champion of ${FACTIONS[k].short}.`);
    log(S,'hero',old?`${old.name} was dead, and ${FACTIONS[k].short} had no heroes to spare, only whoever was left. ${c.name}, ${roleName(c)} of ${whereChar(S,c)}, took up what ${pn(old).s} had carried.`:`${c.name} was named champion of ${FACTIONS[k].short}; there was no prophecy about ${pn(c).o}, only a need.`,c.x,c.y,[c.id]);}}
/* ---------- the sword's errands ---------- */
function errandSite(S,h,tgt){const tq=questById(S,tgt.quest);const tp=tgt.party?party(S,tgt.party):null;let pos=null;
  if(tgt.role==='leader'){const cs=homeCapital(S,tgt);if(cs&&standing(cs))return{type:'settlement',id:cs.id};}
  if(tq&&tq.status==='active'&&tq.kind!=='errand'){const g=questGoal(S,tq,tgt);if(g)pos=goalPos(S,g);}
  if(!pos&&tp&&tp.goal)pos=goalPos(S,tp.goal);
  if(!pos)pos=[Math.round((h.x+tgt.x)/2),Math.round((h.y+tgt.y)/2)];
  const s=nearestSettlement(S,pos[0],pos[1],q=>standing(q)&&!hostile(S,q.faction,h.faction)&&!hostile(S,q.faction,tgt.faction));
  if(s&&mdist(s.x,s.y,pos[0],pos[1])<=7)return{type:'settlement',id:s.id};
  const[x,y]=findTile(S,pos[0],pos[1],(x,y)=>passable(S,x,y,'land',h.race)&&passable(S,x,y,'land',tgt.race),8);return{type:'tile',x,y};}
function errandFor(S,h,tgt){const sw=S.sword;let q=activeQuest(S,'errand');if(q&&q.holder!==h.id){const site=q.site.type==='settlement'?setById(S,q.site.id):null;const sName=site?site.name:placeName(S,q.site.x,q.site.y);if(h.id===q.target)endQuest(S,q,true,`At ${sName}, ${C(S,q.holder).name} put ${sw.name} into the hands of ${h.name}, and felt lighter for it.`);else endQuest(S,q,false,'The sword changed hands another way.');q=null;}
  if(q&&q.target!==tgt.id){endQuest(S,q,false,'The song changed, and the errand was forgotten.');q=null;}
  if(q)return q;const site=errandSite(S,h,tgt);const sName=site.type==='settlement'?setById(S,site.id).name:placeName(S,site.x,site.y);const sx=site.type==='settlement'?setById(S,site.id).x:site.x,sy=site.type==='settlement'?setById(S,site.id).y:site.y;
  q=addQuest(S,{kind:'errand',main:false,title:`An Errand to ${cap(sName)}`,holder:h.id,target:tgt.id,site,x:sx,y:sy,chars:[h.id,tgt.id],expires:S.turn+10,text:`${sw.name} sang of ${tgt.name}. ${h.name} dreamed of ${sName}; so, that same night, did ${tgt.name}. Neither knew why.`});
  if(tgt.hero)assignHero(S,q,tgt);else if(!tgt.party&&isFree(tgt.faction)&&tgt.role!=='leader'){const p=newParty(S,{name:`${firstName(tgt)}, who dreamed of a hill`,kind:'wanderer',faction:tgt.faction,x:tgt.x,y:tgt.y,mp:8,might:1,home:tgt.home});joinParty(S,p,tgt);p.goal=site;p.errand=q.id;story(S,tgt,`Dreamed of ${sName} and went there.`);}
  story(S,h,`Dreamed of ${sName}.`);return q;}
function errandGoal(S,q){return q.site;}

const WANT_PULL={sword:'toward the sword',dark:'toward the South',land:'toward the border',peace:'toward the council table',deep:'downward',mist:'westward, into the mist',engine:'toward the mills',glory:'toward the fighting',home:'homeward',crown:'toward the throne',gold:'along the river',avenge:'toward the enemy',keep:'nowhere; they have what they wanted'};
function assignWant(S,c,role){const t=c.traits;const r=rnd(S);const K=S.kingdoms;
  if(c.faction==='orcs')return{kind:r<0.55?'dark':r<0.8?'crown':'glory',target:null};
  if(c.faction==='goblins')return{kind:r<0.7?'gold':'dark',target:null};
  const w=[];const add=(k,v)=>{if(v>0)w.push([k,v]);};
  const fighter=['warrior','captain','ranger','general'].includes(role);const learned=['priest','scholar'].includes(role);const trade=['merchant','sailor'].includes(role);const worker=['farmer','miner','smith','settler'].includes(role);
  add('sword',(c.hero?1:2)+(t.ambition>=6?2:0)+(t.wanderlust>=6?1:0));
  add('glory',fighter?3+(t.valor>=6?3:0):(t.valor>=8?1:0));
  add('home',(worker?3:1)+(t.wanderlust<=3?3:0)-(c.hero?2:0));
  add('land',(worker||fighter?2:1)+(t.ambition>=6?2:0));
  add('peace',(learned?3:0)+(t.prudence>=6?2:0)+(c.faction==='vale'?2:0));
  add('gold',trade?5:(t.ambition>=5&&!c.hero?1:0));
  add('crown',(role==='captain'||role==='leader')?3:(t.ambition>=8?2:0));
  if(c.race==='dwarf')add('deep',(role==='miner'?4:1)+(t.ambition>=6?2:0));
  if(c.race==='highelf'||c.race==='woodelf')add('mist',(c.race==='highelf'?2:0)+(t.wanderlust>=6?2:0)+(t.prudence<=3?1:0));
  if(c.faction==='city')add('engine',(role==='smith'||role==='scholar'?3:1)+(t.ambition>=6?1:0));
  if(!c.hero&&role!=='leader'&&t.ambition>=7&&t.loyalty<=3&&c.race!=='highelf')add('dark',c.faction==='vale'||c.faction==='city'?4:1);
  let tot=0;for(const[,v]of w)tot+=v;let q=rnd(S)*tot;let kind=w[0][0];for(const[k,v]of w){q-=v;if(q<=0){kind=k;break;}}
  let target=null;if(kind==='land')target=landTargetName(S,c);if(kind==='home'){const s=c.home?setById(S,c.home):null;target=s?s.name:null;}
  return{kind,target};}
function landTargetName(S,c){const s=c.home?setById(S,c.home):null;if(!s||!S.owner)return null;const o=OWNID[c.faction];const cands=[];for(let i=0;i<W*H;i++){if(S.owner[i]===o||S.region[i]===4)continue;const x=i%W,y=(i/W)|0;if(mdist(x,y,s.x,s.y)>34)continue;const t=S.terrain[i];if(t===TR.OCEAN||t===TR.MIST||t===TR.DEEPS)continue;if(c.faction==='dwarves'&&!(t===TR.MOUNTAIN||t===TR.HILLS))continue;if((c.faction==='elves'||c.faction==='vale')&&!(t===TR.FOREST||t===TR.WOODS))continue;if(c.faction==='city'&&!(t===TR.FIELDS||t===TR.WOODS))continue;cands.push(i);}if(!cands.length)return null;const i=pick(S,cands);return placeName(S,i%W,(i/W)|0);}
function wantText(S,c){const w=c.want;if(!w)return c.goal||'nothing much';const p=pn(c);const K=S.kingdoms;const dl=K.orcs.darklord?C(S,K.orcs.darklord):null;switch(w.kind){
  case 'sword':return`to find the fabled sword the river gave up`;
  case 'dark':return dl&&dl.alive&&K.orcs.risen&&!K.orcs.broken?`to serve ${dl.name} and be rewarded for it`:`to serve whoever rises in the South, and be on the winning side`;
  case 'land':return`to take ${w.target||'good land across the border'} for ${p.p} family`;
  case 'peace':return`to keep the peace between the crowns`;
  case 'deep':return`to delve deeper than anyone has, and see what is there`;
  case 'mist':return`to sail west past the mist and not come back`;
  case 'engine':return`to build the great engine that will feed the East forever`;
  case 'glory':return`to die in a battle worth a song`;
  case 'home':return`to grow old in ${w.target||'the place '+p.s+' was born'}`;
  case 'crown':{const kk=kingdomOf(S,c.faction);return c.role==='leader'?`to keep the crown, whatever it costs`:`to wear the ${kk?kk.leaderTitle+"'s":''} crown one day`;}
  case 'gold':return`to make a fortune on the river`;
  case 'avenge':return`to avenge ${w.target} on the ${w.foe==='goblins'?'goblins':w.foe==='orcs'?'orcs':FACTIONS[w.foe]?FACTIONS[w.foe].short:'enemy'}`;
  case 'keep':return`nothing more; ${p.s} has the sword`;
  default:return c.goal||'nothing much';}}
function wantScore(S,c,p){const k=c.want?c.want.kind:null;if(!k)return 0;if(p.kind==='settlers')return k==='land'?3:k==='home'?-2:0;if(combatKind(p)){let s=k==='glory'||k==='avenge'?3:k==='home'?-2:0;if(S.sword&&S.sword.holder&&p.members.includes(S.sword.holder)&&k==='sword')s+=4;return s;}return 0;}
function desireActs(S){const K=S.kingdoms;const sw=S.sword;
  if(!sw.holder&&!S.parties.some(p=>p.seeker)){const cands=S.chars.filter(c=>c.alive&&!c.party&&c.want&&c.want.kind==='sword'&&isFree(c.faction)&&mdist(c.x,c.y,sw.x,sw.y)<=16&&mdist(c.x,c.y,sw.x,sw.y)>0);if(cands.length){const c=pick(S,cands);const p=newParty(S,{name:`${firstName(c)}, who went looking for the sword`,kind:'wanderer',faction:c.faction,x:c.x,y:c.y,mp:8,might:1,home:c.home});joinParty(S,p,c);p.goal={type:'tile',x:sw.x,y:sw.y};p.seeker=true;story(S,c,`Went looking for the sword in ${placeName(S,sw.x,sw.y)}.`);}}
  if(K.orcs.risen&&!K.orcs.broken&&chance(S,0.5)){const f=K.orcs.fortress?setById(S,K.orcs.fortress):null;if(!f||!standing(f))return;const cands=S.chars.filter(c=>c.alive&&c.want&&c.want.kind==='dark'&&isFree(c.faction)&&!c.hero&&c.role!=='leader'&&(!c.party||c.id===sw.holder));if(!cands.length)return;const c=pick(S,cands);const home=c.home?setById(S,c.home):null;let pr=0.05+(home&&home.status==='fallen'?0.15:0)+(home&&home.status==='besieged'?0.08:0);
    if(c.id===sw.holder){pr+=sw.stats.glory*0.03-sw.stats.counsel*0.03;if(sw.stats.counsel>=3)pr=0;}
    if(!chance(S,pr))return;leaveParty(S,c);c.faction='orcs';c.want={kind:'crown',target:null};const p=newParty(S,{name:`${firstName(c)}, gone south`,kind:'defectors',faction:'orcs',x:c.x,y:c.y,mp:8,might:1,home:f.id});joinParty(S,p,c);p.goal={type:'settlement',id:f.id};
    if(c.id===sw.holder){log(S,'doom',`${c.name} slipped away in the night and went south to offer ${sw.name} to the Dark Lord. The sword screamed the whole way.`,c.x,c.y,[c.id]);story(S,c,`Went south to give ${sw.name} to the Dark Lord.`);}else{log(S,'doom',`${c.name}, who had always meant to be on the winning side, went south to serve the Dark Lord.`,c.x,c.y,[c.id]);story(S,c,'Went south to serve the Dark Lord.');}}}
/* ---------- territory & land ---------- */
const OWN=[null,'dwarves','elves','city'],OWNID={dwarves:1,elves:2,city:3};
function claimAround(S,s,r){const o=OWNID[s.faction];if(!o)return;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=s.x+dx,y=s.y+dy;if(!inb(x,y))continue;const i=idx(x,y);const t=S.terrain[i];if(t===TR.OCEAN||t===TR.MIST||t===TR.DEEPS||S.region[i]===4)continue;if(S.owner[i]&&S.owner[i]!==o)continue;if(S.settlements.some(q=>q.faction==='vale'&&mdist(q.x,q.y,x,y)<=1))continue;S.owner[i]=o;}}
function initTerritory(S){S.owner=new Array(W*H).fill(0);S.dev=new Array(W*H).fill(0);const K=S.kingdoms;const caps={};for(const k of kingdomKeys())caps[k]=setById(S,K[k].capital);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=idx(x,y);const t=S.terrain[i],reg=S.region[i];if(t===TR.OCEAN||t===TR.LAKE||reg===4)continue;let best=0,bs=1e9;
    for(const k of kingdomKeys()){const c=caps[k];let s=Math.hypot(x-c.x,(y-c.y)*1.2);if(k==='dwarves'){if(t===TR.MOUNTAIN||t===TR.HILLS)s-=7;if(reg===0)s-=12;}if(k==='elves'){if(t===TR.FOREST)s-=7;if(t===TR.WOODS)s-=3;if(reg===1)s-=12;}if(k==='city'){if(t===TR.FIELDS)s-=3;if(reg===3)s-=12;}if(s<bs){bs=s;best=OWNID[k];}}
    S.owner[i]=best;}
  for(const s of S.settlements)if(s.faction==='vale'){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(inb(s.x+dx,s.y+dy))S.owner[idx(s.x+dx,s.y+dy)]=0;}
  for(const s of S.settlements){const o=OWNID[s.faction];if(o)S.owner[idx(s.x,s.y)]=o;}}
function devWord(k,plural){return k==='dwarves'?(plural?'delvings':'delving'):k==='elves'?(plural?'groves':'grove'):(plural?'engine-farms':'engine-farm');}
function suitable(S,k,i){const t=S.terrain[i];if(S.dev[i])return false;if(k==='dwarves')return t===TR.MOUNTAIN||t===TR.HILLS;if(k==='elves')return t===TR.FOREST||t===TR.WOODS;return t===TR.FIELDS;}
function wantsTile(S,k,i){const t=S.terrain[i];if(k==='dwarves')return t===TR.MOUNTAIN||t===TR.HILLS;if(k==='elves')return t===TR.FOREST||t===TR.WOODS;const K=S.kingdoms.city;if(K.wants==='forest')return t===TR.WOODS||t===TR.FOREST;return t===TR.FIELDS||t===TR.WOODS||t===TR.FOREST;}
function nearSettlement(S,k,x,y,r){for(const s of S.settlements){if(s.faction!==k||!standing(s))continue;if(Math.abs(s.x-x)<=r&&Math.abs(s.y-y)<=r)return true;}return false;}
function devCount(S,K){const o=OWNID[K.key];let n=0;for(let i=0;i<W*H;i++)if(S.owner[i]===o&&S.dev[i])n++;return n;}
function landCount(S,K){const o=OWNID[K.key];let n=0;for(let i=0;i<W*H;i++)if(S.owner[i]===o)n++;return n;}
function findDevTile(S,K){const o=OWNID[K.key];let best=-1,bd=1e9;const cs=setById(S,K.capital);for(let i=0;i<W*H;i++){if(S.owner[i]!==o||!suitable(S,K.key,i))continue;const x=i%W,y=(i/W)|0;if(settlementAt(S,x,y))continue;if(!nearSettlement(S,K.key,x,y,K.key==='elves'?3:4))continue;const d=mdist(x,y,cs.x,cs.y)+rnd(S)*4;if(d<bd){bd=d;best=i;}}return best;}
function findForestTile(S,K){const o=OWNID[K.key];const c=[];for(let i=0;i<W*H;i++){if(S.owner[i]!==o||S.dev[i])continue;const t=S.terrain[i];if(t!==TR.WOODS&&t!==TR.FOREST)continue;const x=i%W,y=(i/W)|0;if(settlementAt(S,x,y)||!nearSettlement(S,K.key,x,y,8))continue;c.push(i);}return c.length?pick(S,c):-1;}
function findClaimTile(S,K,any){let best=-1,bd=1e9;for(let i=0;i<W*H;i++){if(S.owner[i]!==0||S.region[i]===4)continue;const t=S.terrain[i];if(t===TR.OCEAN||t===TR.MIST||t===TR.DEEPS||(!any&&!wantsTile(S,K.key,i)))continue;const x=i%W,y=(i/W)|0;if(!nearSettlement(S,K.key,x,y,5))continue;if(S.settlements.some(s=>s.faction==='vale'&&mdist(s.x,s.y,x,y)<=2))continue;let d=1e9;for(const s of S.settlements){if(s.faction!==K.key||!standing(s))continue;d=Math.min(d,mdist(s.x,s.y,x,y));}if(d<bd){bd=d;best=i;}}return best;}
function findSettleSite(S,K){const o=OWNID[K.key];let best=null,bd=1e9;for(let i=0;i<W*H;i++){if(S.owner[i]!==o&&S.owner[i]!==0)continue;if(S.region[i]===4)continue;const x=i%W,y=(i/W)|0;const t=S.terrain[i];if(t===TR.OCEAN||t===TR.MIST||t===TR.DEEPS)continue;if(!passable(S,x,y,'land',FACTIONS[K.key].race))continue;if(S.settlements.some(s=>mdist(s.x,s.y,x,y)<5))continue;let dn=1e9;for(const s of S.settlements){if(s.faction!==K.key||!standing(s))continue;dn=Math.min(dn,mdist(s.x,s.y,x,y));}if(dn>13)continue;let good=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){if(!inb(x+dx,y+dy))continue;const j=idx(x+dx,y+dy);if((S.owner[j]===o||S.owner[j]===0)&&S.region[j]!==4&&wantsTile(S,K.key,j)&&!S.dev[j])good++;}if(good<5)continue;const sc=dn+rnd(S)*3+(S.owner[i]===0?-2:0);if(sc<bd){bd=sc;best=[x,y];}}return best;}
function develop(S,K,i){const x=i%W,y=(i/W)|0;S.dev[i]=1;S.terrainVersion++;K.devCount=(K.devCount||0)+1;const s=nearestSettlement(S,x,y,q=>q.faction===K.key&&standing(q));
  if(K.devCount<=3||chance(S,0.12))log(S,'land',K.key==='dwarves'?`The dwarves of ${s?s.name:'the North'} opened a new delving ${landName(S,x,y)}.`:K.key==='elves'?`The elves of ${s?s.name:'the West'} planted a grove ${landName(S,x,y)}; nothing was cut down to do it.`:`The mill-wrights of ${s?s.name:'the East'} raised an engine-farm ${landName(S,x,y)}.`,x,y,[]);
  if(K.key==='dwarves')K.omen.val=clamp(K.omen.val+0.08,0,100);if(K.key==='city')K.omen.val=clamp(K.omen.val+0.1,0,100);}
function cityRot(S,K){const o=OWNID[K.key];for(let i=0;i<W*H;i++){if(S.owner[i]!==o||!S.dev[i]||S.terrain[i]!==TR.FIELDS)continue;if(chance(S,0.009)){S.dev[i]=0;S.terrain[i]=TR.BARRENS;S.terrainVersion++;if(chance(S,0.5))log(S,'land',`An engine-farm ${landName(S,i%W,(i/W)|0)} went grey. Nothing would grow there again.`,i%W,(i/W)|0,[]);}}}
function spawnSettlers(S,K,site){const from=nearestSettlement(S,site[0],site[1],s=>s.faction===K.key&&standing(s));if(!from)return null;const civ=S.chars.filter(c=>c.alive&&!c.party&&c.home===from.id&&isAt(c,from)&&['farmer','miner','smith','sailor','scholar','merchant'].includes(c.role)).sort((a,b)=>((b.want&&b.want.kind==='land')?1:0)-((a.want&&a.want.kind==='land')?1:0));const war=S.chars.filter(c=>c.alive&&!c.party&&c.home===from.id&&isAt(c,from)&&(c.role==='warrior'||c.role==='ranger'));
  const members=civ.slice(0,2).concat(war.slice(0,1));if(members.length<2)members.push(newChar(S,{race:from.race,faction:K.key,home:from.id,role:'settler',x:from.x,y:from.y,age:ri(S,18,35)}));
  const p=newParty(S,{name:`the settlers out of ${from.name}`,kind:'settlers',faction:K.key,x:from.x,y:from.y,mp:7,might:2,home:from.id});for(const c of members)joinParty(S,p,c);p.goal={type:'tile',x:site[0],y:site[1]};for(const c of members)story(S,c,`Set out from ${from.name} to found a new settlement.`);
  log(S,'land',`Settlers went out from ${from.name} toward ${placeName(S,site[0],site[1])}, to make room.`,from.x,from.y,[members[0].id]);return p;}
function foundSettlement(S,p,g){if(settlementAt(S,g.x,g.y)||S.settlements.some(s=>mdist(s.x,s.y,g.x,g.y)<4)){const near=nearestSettlement(S,g.x,g.y,s=>standing(s)&&!hostile(S,s.faction,p.faction));if(near)settleParty(S,p,near);else removeParty(S,p);return;}
  const k=p.faction;const type=k==='dwarves'?'hold':k==='elves'?'haven':'village';const name=takeName(S,k==='dwarves'?'dwarf':k==='elves'?'elf':'city');
  const s=addSet(S,{name,faction:k,race:FACTIONS[k].race,x:g.x,y:g.y,type,pop:400,walls:type==='village'?5:12,garrison:6,target:type==='village'?4:5,prosperity:35});claimAround(S,s,3);S.terrainVersion++;
  for(const id of p.members){const c=C(S,id);story(S,c,`Founded ${name}.`);}const lead=C(S,p.members[0]);settleParty(S,p,s);lead.renown+=2;
  log(S,'land',`${cap(name)} was founded on ${terrainName(S,g.x,g.y).toLowerCase()} by settlers of ${FACTIONS[k].short}.`,g.x,g.y,[lead.id]);}
function landTurn(S){const K=S.kingdoms;
  for(const k of kingdomKeys()){const kk=K[k];if(!standingKingdom(S,k))continue;kk.need=8+Math.floor(S.turn*1.2);kk.dev=devCount(S,kk);
    if(k==='city')cityRot(S,kk);
    for(let c=0;c<3;c++){const fi=findClaimTile(S,kk,c===2);if(fi<0)break;S.owner[fi]=OWNID[k];S.terrainVersion++;}
    if(kk.dev>=kk.need){kk.hunger=0;continue;}
    const n=kk.dev<kk.need-4?3:kk.dev<kk.need-1?2:1;let made=0;kk.wants=null;
    for(let r=0;r<n;r++){const i=findDevTile(S,kk);if(i<0)break;if(k==='city'){let ok=true;for(let w=0;w<2;w++){const f=findForestTile(S,kk);if(f<0){ok=false;break;}S.terrain[f]=TR.FIELDS;S.terrainVersion++;kk.machines++;if(S.region[f]===1)K.elves.omen.val=clamp(K.elves.omen.val+0.3,0,100);else if(S.region[f]===2)K.elves.omen.val=clamp(K.elves.omen.val+0.08,0,100);if(S.region[f]!==3&&standingKingdom(S,'elves'))addRel(S,'city','elves',-0.2);if(kk.machines<=3||chance(S,0.04))log(S,'land',`Woods ${landName(S,f%W,(f/W)|0).replace(/^in the woods |^in the old-growth forest /,'')} were felled to feed the mills of ${setById(S,kk.capital).name}.`,f%W,(f/W)|0,[]);}if(!ok){kk.wants='forest';break;}}develop(S,kk,i);made++;}
    if(made){kk.hunger=0;continue;}
    if(kk.wants==='forest'){const own=S.settlements.filter(s=>s.faction===k&&standing(s)).length;if(own<14&&S.turn>=(kk.settleCooldown||0)&&!S.parties.some(p=>p.kind==='settlers'&&p.faction===k)){const site=findSettleSite(S,kk);if(site){spawnSettlers(S,kk,site);kk.settleCooldown=S.turn+2;continue;}}kk.hunger=(kk.hunger||0)+1;if(kk.hunger>=2&&!S.quests.some(q=>q.status==='active'&&(q.kind==='envoy'||q.kind==='expedition')&&q.from===k)&&S.turn>=(kk.landCooldown||0))makeLandQuest(S,kk);continue;}
    const own=S.settlements.filter(s=>s.faction===k&&standing(s)).length;
    if(own<14&&S.turn>=(kk.settleCooldown||0)&&!S.parties.some(p=>p.kind==='settlers'&&p.faction===k)){const site=findSettleSite(S,kk);if(site){spawnSettlers(S,kk,site);kk.settleCooldown=S.turn+2;kk.hunger=0;continue;}}
    kk.hunger=(kk.hunger||0)+1;{const cs=setById(S,kk.capital);cs.prosperity=clamp(cs.prosperity-2,5,100);}
    if(kk.hunger>=2&&!S.quests.some(q=>q.status==='active'&&(q.kind==='envoy'||q.kind==='expedition')&&q.from===k)&&S.turn>=(kk.landCooldown||0))makeLandQuest(S,kk);}
  for(const k of kingdomKeys()){const kk=K[k];if(kk.grudge&&standingKingdom(S,k)&&!S.quests.some(q=>q.status==='active'&&q.kind==='expedition'&&q.from===k)&&S.turn>=(kk.landCooldown||0)){const t=kk.grudge;kk.grudge=null;if(standingKingdom(S,t)&&rel(S,k,t)<=-20){const tiles=borderTiles(S,kk,t,8,true,16);if(tiles.length>=3)makeExpedition(S,kk,K[t],tiles,'in answer');}}}}
function borderTiles(S,K,b,n,any,range){const ob=OWNID[b];const cands=[];for(let i=0;i<W*H;i++){if(S.owner[i]!==ob)continue;const x=i%W,y=(i/W)|0;if(settlementAt(S,x,y))continue;if(!any&&!wantsTile(S,K.key,i))continue;const t=S.terrain[i];if(t===TR.OCEAN||t===TR.MIST||t===TR.DEEPS)continue;let d=1e9;for(const s of S.settlements){if(s.faction!==K.key||!standing(s))continue;d=Math.min(d,mdist(s.x,s.y,x,y));}if(d>(range||9))continue;cands.push([d+rnd(S)*2,i]);}cands.sort((p,q)=>p[0]-q[0]);return cands.slice(0,n).map(c=>c[1]);}
function makeLandQuest(S,K){let bestB=null,bestTiles=[];for(const range of[9,16,26]){for(const b of kingdomKeys()){if(b===K.key||!standingKingdom(S,b))continue;const tiles=borderTiles(S,K,b,9,false,range);if(tiles.length>bestTiles.length){bestTiles=tiles;bestB=b;}}if(bestTiles.length>=3)break;}
  if(!bestB||bestTiles.length<3){K.landCooldown=S.turn+3;const cs=setById(S,K.capital);cs.prosperity=clamp(cs.prosperity-4,5,100);return;}
  const B=S.kingdoms[bestB];const fails=K.envoyFails[bestB]||0;const ld=K.leader?C(S,K.leader):null;const lw=ld&&ld.want?ld.want.kind:null;
  const talk=lw==='peace'?(!atWar(S,K.key,bestB)&&fails<4):lw==='land'?(rel(S,K.key,bestB)>15&&fails<1):(rel(S,K.key,bestB)>-25&&fails<2&&!atWar(S,K.key,bestB));
  if(talk)makeEnvoy(S,K,B,bestTiles);else makeExpedition(S,K,B,bestTiles,lw==='land'&&ld?`, as ${ld.name} had always meant to`:'');}
function clusterName(S,tiles){const land=tiles.filter(i=>!S.river[i]);const i=(land.length?land:tiles)[Math.floor((land.length?land:tiles).length/2)];return placeName(S,i%W,(i/W)|0);}
function makeEnvoy(S,K,B,tiles){const cs=setById(S,K.capital),bs=setById(S,B.capital);const here=S.chars.filter(c=>c.alive&&!c.party&&isAt(c,cs)&&c.faction===K.key&&(!isFinite(c.life)||ageOf(S,c)<=c.life-45)).sort((a,b)=>ageOf(S,a)-ageOf(S,b));let lead=here.find(c=>c.role==='scholar')||here.find(c=>c.role==='priest')||here.find(c=>c.role==='merchant');if(!lead)lead=newChar(S,{race:cs.race,faction:K.key,home:cs.id,role:'envoy',x:cs.x,y:cs.y,age:ri(S,22,30)});const guard=here.find(c=>c.role==='warrior'&&c.id!==lead.id);
  const ship=!!(S.river[idx(cs.x,cs.y)]&&S.river[idx(bs.x,bs.y)]);const p=newParty(S,{name:`the envoys of ${cs.name}`,kind:'envoy',faction:K.key,x:cs.x,y:cs.y,mp:ship?16:9,mode:ship?'ship':'land',might:1,home:cs.id});joinParty(S,p,lead);if(guard)joinParty(S,p,guard);p.goal={type:'settlement',id:bs.id};
  const place=clusterName(S,tiles);const nth=S.quests.filter(x=>x.kind==='envoy'&&x.from===K.key&&x.to===B.key).length;const q=addQuest(S,{kind:'envoy',title:nth===0?`The Envoys to ${bs.name}`:`The ${['Second','Third','Fourth','Fifth','Sixth','Seventh','Last'][Math.min(nth-1,6)]} Embassy to ${bs.name}`,from:K.key,to:B.key,tiles,party:p.id,lead:lead.id,heroes:[],x:cs.x,y:cs.y,chars:[lead.id],expires:S.turn+14,text:`${cap(K.name)} wanted ${devWord(K.key,true)} and had no room for them. ${lead.name} ${ship?'took ship down the river to':'was sent to'} ${bs.name} to ask ${B.name} for the land around ${place}.`});p.quest=q.id;story(S,lead,`Sent as envoy to ${bs.name}.`);K.landCooldown=S.turn+4;}
function makeExpedition(S,K,B,tiles,why){const byShip=false;const cs=setById(S,K.capital);if(cs.garrison<24){K.landCooldown=S.turn+2;return;}const might=Math.max(16,Math.floor(cs.garrison*0.35));cs.garrison-=might;const here=S.chars.filter(c=>c.alive&&!c.party&&isAt(c,cs)&&c.faction===K.key&&(!isFinite(c.life)||ageOf(S,c)<=c.life-35));let lead=here.filter(c=>c.role==='captain').sort((a,b)=>b.strength-a.strength)[0]||here.find(c=>c.role==='warrior');if(!lead)lead=newChar(S,{race:cs.race,faction:K.key,home:cs.id,role:'captain',x:cs.x,y:cs.y,age:ri(S,22,32)});
  const i=tiles[0];const p=newParty(S,{name:`the ${K.adj} expedition`,kind:'host',faction:K.key,x:cs.x,y:cs.y,mp:byShip?14:7,mode:byShip?'ship':'land',might,home:cs.id});joinParty(S,p,lead);recruit(S,p,2);p.expedition=true;p.goal={type:'tile',x:i%W,y:(i/W)|0};
  const place=clusterName(S,tiles);const q=addQuest(S,{kind:'expedition',title:`The Taking of ${place.replace(/^the /,'the ')}`,from:K.key,to:B.key,tiles,party:p.id,heroes:[],x:cs.x,y:cs.y,chars:[lead.id],expires:S.turn+14,text:`${cap(K.name)} would not ask again. ${lead.name} led a host out of ${cs.name} to take the land around ${place} from ${B.name}${why?(why.startsWith(',')?why:' '+why):''}.`});p.quest=q.id;story(S,lead,`Led the expedition to take ${place}.`);K.landCooldown=S.turn+5;}
function envoyArrive(S,p,s){const q=questById(S,p.quest);const home=p.home?setById(S,p.home):null;
  if(q&&q.status==='active'&&q.kind==='council'&&s.id===q.settlement){if(!q.arrived.includes(p.faction))q.arrived.push(p.faction);const l=leadChar(S,p);if(l)story(S,l,`Sat at the Council of Three in ${s.name}.`);settleParty(S,p,s);return;}
  if(q&&q.status==='active'&&q.kind==='envoy'&&s.id===S.kingdoms[q.to].capital){negotiate(S,q,p,s);}
  if(home&&standing(home)&&!isAt(home,p)){p.goal={type:'settlement',id:home.id};p.quest=null;p.rest=1;}else settleParty(S,p,s);}
function negotiate(S,q,p,s){const K=S.kingdoms[q.from],B=S.kingdoms[q.to];const lead=leadChar(S,p);if(!standing(s)){endQuest(S,q,false,`${lead?lead.name:'The envoy'} found the gates of ${s.name} burned.`);return;}
  let pr=0.35+rel(S,K.key,B.key)/150;const bcs=setById(S,B.capital);pr+=counselAt(S,B.key)*0.06+counselAt(S,K.key)*0.03;pr+=(B.dev>=B.need?0.15:-0.15);if(S.alliance)pr+=0.2;if(lead&&lead.role==='scholar')pr+=0.05;if(lead&&lead.want&&lead.want.kind==='peace')pr+=0.06;{const bl=B.leader?C(S,B.leader):null;if(bl&&bl.want){if(bl.want.kind==='peace')pr+=0.1;else if(bl.want.kind==='land')pr-=0.12;}}pr=clamp(pr,0.05,0.92);
  const place=clusterName(S,q.tiles);
  if(chance(S,pr)){let n=0;for(const i of q.tiles)if(S.owner[i]===OWNID[B.key]){S.owner[i]=OWNID[K.key];n++;}S.terrainVersion++;addRel(S,K.key,B.key,10);K.envoyFails[B.key]=0;endQuest(S,q,true,`${B.name.replace(/^the /,'The ')} ceded the land around ${place} in the Treaty of ${s.name}.`);if(lead){lead.renown+=4;story(S,lead,`Signed the Treaty of ${s.name}.`);}}
  else{addRel(S,K.key,B.key,-8);K.envoyFails[B.key]=(K.envoyFails[B.key]||0)+1;endQuest(S,q,false,`${B.name.replace(/^the /,'The ')} refused. ${lead?lead.name+' rode home with nothing.':''}`);}}
function seizeLand(S,p){p.expedition=false;const q=questById(S,p.quest);p.quest=null;const K=S.kingdoms[p.faction];if(!q||q.status!=='active'){p.retreating=true;p.goal=p.home?{type:'settlement',id:p.home}:null;return;}
  const B=S.kingdoms[q.to];let n=0;for(const i of q.tiles)if(S.owner[i]===OWNID[B.key]){S.owner[i]=OWNID[K.key];n++;}S.terrainVersion++;const place=clusterName(S,q.tiles);const lead=leadChar(S,p);
  addRel(S,K.key,B.key,-35);for(const o of kingdomKeys())if(o!==K.key&&o!==B.key)addRel(S,K.key,o,-8);B.grudge=K.key;B.landCooldown=0;if(S.alliance){S.alliance=false;log(S,'doom',`The oath of the Council was broken at ${place}. No one said so aloud; everyone knew.`,p.x,p.y,[]);}
  endQuest(S,q,true,`${cap(p.name)} took the land around ${place} by force. ${cap(B.name)} did not forget it.`);if(lead){lead.renown+=3;story(S,lead,`Took ${place} for ${K.name}.`);}
  p.retreating=true;p.goal=p.home?{type:'settlement',id:p.home}:null;}

/* ---------- diplomacy ---------- */
function initDiplo(S){S.diplo={rel:{'dwarves|elves':25+ri(S,-10,10),'city|dwarves':20+ri(S,-10,10),'city|elves':15+ri(S,-10,10)},war:{}};}
function diploTurn(S){const ks=kingdomKeys();for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const a=ks[i],b=ks[j];const k=relKey(a,b);let v=rel(S,a,b);v+=(10-v)*0.03;if(S.kingdoms.orcs.risen&&!S.kingdoms.orcs.broken)v+=0.6;if(S.alliance)v=Math.max(v,40);S.diplo.rel[k]=clamp(v,-100,100);
    if(!S.diplo.war[k]&&v<=-60&&standingKingdom(S,a)&&standingKingdom(S,b)){S.diplo.war[k]=true;log(S,'doom',`${cap(FACTIONS[a].name)} and ${FACTIONS[b].name} went to war over land.`,CX,CY,[]);}
    else if(S.diplo.war[k]&&(v>-40||!standingKingdom(S,a)||!standingKingdom(S,b))){S.diplo.war[k]=false;log(S,'realm',`${cap(FACTIONS[a].name)} and ${FACTIONS[b].name} made peace.`,CX,CY,[]);}}}

/* ---------- goblins ---------- */
function nearestDelving(S,x,y,r){let best=null,bd=r+1;for(let i=0;i<W*H;i++){if(!S.dev[i]||S.owner[i]!==1)continue;const d=mdist(i%W,(i/W)|0,x,y);if(d<bd&&d>0){bd=d;best=[i%W,(i/W)|0];}}return best;}
function spawnGoblins(S,dw,delvings){const tiles=[];for(let i=0;i<W*H;i++)if(S.dev[i]&&S.owner[i]===1&&S.terrain[i]===TR.MOUNTAIN)tiles.push(i);if(!tiles.length)for(let i=0;i<W*H;i++)if(S.dev[i]&&S.owner[i]===1)tiles.push(i);if(!tiles.length)return null;const i=pick(S,tiles);const x=i%W,y=(i/W)|0;
  const king=delvings>=20&&!S.chars.some(c=>c.alive&&c.role==='goblinking')&&S.turn>=(S.lastKing||0)+12&&chance(S,0.35);if(king)S.lastKing=S.turn;
  const p=newParty(S,{name:'',kind:'warband',faction:'goblins',x,y,mp:9,might:Math.floor(8+Math.min(delvings,22)*1.1+(king?16:0)),home:null});
  const lead=newChar(S,{race:'goblin',faction:'goblins',home:null,role:king?'goblinking':'goblin',x,y,age:ri(S,12,30)});if(king){lead.title=pick(S,['the Deep-Crowned','King Under the Roots','the Candle-Eater','of the Sixth Stair']);lead.strength=10;}joinParty(S,p,lead);for(let k=0;k<2;k++)joinParty(S,p,newChar(S,{race:'goblin',faction:'goblins',home:null,role:'goblin',x,y,age:ri(S,10,25)}));
  p.name=king?`the court of ${firstName(lead)}`:`the goblins of ${firstName(lead)}`;
  log(S,'battle',king?`Goblins came up out of the delving ${landName(S,x,y)} in numbers, and at their head a king: ${lead.name} ${lead.title}.`:`Goblins came up out of the delving ${landName(S,x,y)}.`,x,y,[lead.id]);
  if(king)story(S,lead,'Crowned in the dark by whatever lives below the goblins.');return p;}
function goblinActs(S){const K=S.kingdoms;const gob=S.parties.filter(p=>p.faction==='goblins');const dw=K.dwarves;
  if(dw.status==='standing'){const delv=dw.dev||0;if(gob.length<3&&delv>0&&chance(S,Math.min(0.3,0.012*delv)))spawnGoblins(S,dw,delv);}
  for(const p of gob){if(!S.parties.includes(p))continue;if(p.goal||p.rest>0)continue;if(p.might<6){removeParty(S,p);continue;}p.retreating=false;const r=rnd(S);
    if(r<0.45){const t=nearestSettlement(S,p.x,p.y,s=>(s.faction==='dwarves'||(S.goblinsAllied&&isFree(s.faction)))&&standing(s)&&mdist(s.x,s.y,p.x,p.y)<=18);if(t){p.goal={type:'settlement',id:t.id};continue;}}
    if(r<0.8){const d=nearestDelving(S,p.x,p.y,16);if(d){p.goal={type:'tile',x:d[0],y:d[1],wreck:true};continue;}}
    const[x,y]=findTile(S,p.x+ri(S,-5,5),p.y+ri(S,-3,3),(x,y)=>(S.terrain[idx(x,y)]===TR.MOUNTAIN||S.terrain[idx(x,y)]===TR.HILLS)&&passable(S,x,y,'land','dwarf'),6);p.goal={type:'tile',x,y};}}
function wreckDelving(S,p,g){const i=idx(g.x,g.y);if(S.dev[i]&&S.owner[i]===1){S.dev[i]=0;S.terrainVersion++;const l=leadChar(S,p);log(S,'battle',`${cap(p.name)} wrecked the delving ${landName(S,g.x,g.y)} and carried the miners off into the dark.`,g.x,g.y,l?[l.id]:[]);p.might=Math.min(40,p.might+4);}p.rest=1;}

/* ---------- quests ---------- */
const ACT_NAMES={1:'The Long Peace',2:'Omens',3:'The Rising',4:'The Reckoning'};
function actOf(S){const r=S.kingdoms.orcs.riseTurn;if(!r)return S.turn<26?1:2;return S.turn<r+25?3:4;}
function addQuest(S,o){const q=Object.assign({id:++S.questSeq,status:'active',start:S.turn,end:null,act:actOf(S),heroes:[],outcome:null,expires:null},o);if(q.main==null)q.main=!(['envoy','expedition','errand'].includes(q.kind)||q.goblins||q.goblinKing||q.raiders);S.quests.push(q);log(S,'quest',`${q.title}. ${q.text}`,q.x,q.y,q.chars||[]);return q;}
function endQuest(S,q,ok,text){if(q.status!=='active')return;q.status=ok?'done':'failed';q.end=S.turn;q.outcome=text;log(S,'quest',`${q.title}: ${ok?'fulfilled':'failed'}. ${text}`,q.x,q.y,q.chars||[]);for(const c of S.chars)if(c.quest===q.id)c.quest=null;}
const QPRI={strike:10,defend:8,dream:7,omen:6.5,foulhands:6,recover:6,council:5,siege:5,scout:4,hunt:3,errand:2};
function heroesOf(S){return kingdomKeys().map(k=>C(S,S.kingdoms[k].hero)).filter(h=>h&&h.alive);}
function assignHero(S,q,h){const cur=questById(S,h.quest);if(cur&&cur.status==='active'&&(QPRI[cur.kind]||0)>=(QPRI[q.kind]||0))return false;if(cur){const i=cur.heroes.indexOf(h.id);if(i>=0)cur.heroes.splice(i,1);}h.quest=q.id;if(!q.heroes.includes(h.id))q.heroes.push(h.id);const p=party(S,h.party);if(p&&p.drive!=='seek'&&p.drive!=='glory'){p.goal=null;p.rest=0;}return true;}
function activeQuest(S,kind,pred){return S.quests.find(q=>q.status==='active'&&q.kind===kind&&(!pred||pred(q)));}
function questsTurn(S){const K=S.kingdoms;const T=S.turn;const hs=heroesOf(S);const valeTown=setById(S,K.vale.capital);const dl=K.orcs.darklord?C(S,K.orcs.darklord):null;
  if(T===1){const q=addQuest(S,{kind:'prologue',title:'A Sword from the River',x:S.sword.x,y:S.sword.y,text:`The seers of every people agree on one thing: the age will turn on a sword that was never forged for it. Where it goes, the story goes.`});q.status='done';q.end=T;}
  if(T===2)for(const k of kingdomKeys()){const kk=K[k];const cs=setById(S,kk.capital);addQuest(S,{kind:'develop',title:k==='dwarves'?'The Deep Seam':k==='elves'?'The Sea-Groves':'The Great Mill',faction:k,target:6,x:cs.x,y:cs.y,text:k==='dwarves'?`The ${kk.leaderTitle} of ${cs.name} commanded six new delvings. The mountain was to be made room in.`:k==='elves'?`The Tide-Court of ${cs.name} set the young to planting: six groves, and not one axe.`:`The guilds of ${cs.name} promised the Sovereign six engine-farms, and asked only for timber.`});}
  if(T===18&&standingKingdom(S,'elves')){const h=C(S,K.elves.hero);const cs=setById(S,K.elves.capital);let[x,y]=findTile(S,cs.x+ri(S,-2,4),cs.y+(chance(S,0.5)?8:-8),(x,y)=>S.terrain[idx(x,y)]===TR.FOREST&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inb(x+dx,y+dy)&&S.terrain[idx(x+dx,y+dy)]===TR.OCEAN),8);for(let k=0;k<8&&!findPath(S,h.x,h.y,x,y,'land',h.race);k++){[x,y]=findTile(S,cs.x+ri(S,-4,6),cs.y+ri(S,-9,9),(x,y)=>passable(S,x,y,'land',h.race),8);}const q=addQuest(S,{kind:'scout',title:'The Grey Ships',faction:'elves',stage:'out',x,y,chars:[h.id],expires:T+14,text:`Three grey ships had sailed west and not come back. ${h.name} went down the coast to ${placeName(S,x,y)} to see what they had seen.`});assignHero(S,q,h);}
  if(T===26&&standingKingdom(S,'city')){const h=C(S,K.city.hero);const[fx,fy]=S.fortressSite;let[x,y]=findTile(S,fx+ri(S,-3,3),fy-3,(x,y)=>(S.terrain[idx(x,y)]===TR.GRAVE||S.terrain[idx(x,y)]===TR.BARRENS)&&passable(S,x,y,'land','human'),6);for(let k=0;k<8&&!findPath(S,h.x,h.y,x,y,'land',h.race);k++){[x,y]=findTile(S,fx+ri(S,-6,6),fy-2-k,(x,y)=>passable(S,x,y,'land','human'),8);}const q=addQuest(S,{kind:'scout',title:'What Gathers in the Barrows',faction:'city',stage:'out',x,y,chars:[h.id],expires:T+14,text:`Traders would no longer go south of the river. ${h.name} rode down into the swamp barrows at ${placeName(S,x,y)} to learn why.`});assignHero(S,q,h);}
  if(K.orcs.risen&&K.orcs.riseTurn===T){
    const site=standing(valeTown)?valeTown:nearestSettlement(S,CX,CY,s=>standing(s)&&isFree(s.faction)&&s.type!=='village');const expected=kingdomKeys().filter(k=>standingKingdom(S,k));
    if(site&&expected.length>=2){const q=addQuest(S,{kind:'council',title:'The Council of Three',settlement:site.id,arrived:[],expected,x:site.x,y:site.y,expires:T+6,text:`Word went out from ${site.name}: the crowns of the free peoples would meet there within sixty years, or not at all.`});
      for(const k of expected){const kk=K[k];const cs=setById(S,kk.capital);const here=S.chars.filter(c=>c.alive&&!c.party&&isAt(c,cs)&&c.faction===k&&(!isFinite(c.life)||ageOf(S,c)<=c.life-40)).sort((a,b)=>ageOf(S,a)-ageOf(S,b));let lead=here.find(c=>c.role==='scholar')||here.find(c=>c.role==='priest')||here.find(c=>c.role==='captain');if(!lead)lead=newChar(S,{race:cs.race,faction:k,home:cs.id,role:'envoy',x:cs.x,y:cs.y,age:ri(S,22,30)});const ship=!!(S.river[idx(cs.x,cs.y)]&&S.river[idx(site.x,site.y)]);const p=newParty(S,{name:`the envoys of ${cs.name}`,kind:'envoy',faction:k,x:cs.x,y:cs.y,mp:ship?16:9,mode:ship?'ship':'land',might:1,home:cs.id});joinParty(S,p,lead);const g=here.find(c=>c.role==='warrior'&&c.id!==lead.id);if(g)joinParty(S,p,g);p.goal={type:'settlement',id:site.id};p.quest=q.id;story(S,lead,`Sent to the Council of Three at ${site.name}.`);}}
    if(standing(valeTown)){const q=addQuest(S,{kind:'defend',title:'Hold the Vale',settlement:valeTown.id,x:valeTown.x,y:valeTown.y,expires:T+9,text:`Everyone knew where the Host would strike first. The heroes of the free peoples were asked to stand at ${valeTown.name}.`});for(const h of hs)assignHero(S,q,h);}}
  if(K.orcs.risen&&!K.orcs.broken&&K.orcs.riseTurn===T-3&&dl&&dl.alive){const f=setById(S,K.orcs.fortress);const hunter=newChar(S,{race:'orc',faction:'orcs',home:f.id,role:'general',x:f.x,y:f.y,age:ri(S,22,40)});hunter.title='the Sword-Hunter';const p=newParty(S,{name:`the hunters of ${firstName(hunter)}`,kind:'warband',faction:'orcs',x:f.x,y:f.y,mp:9,might:26,home:f.id});joinParty(S,p,hunter);for(let i=0;i<2;i++)joinParty(S,p,newChar(S,{race:'orc',faction:'orcs',home:f.id,role:'orc',x:f.x,y:f.y,age:ri(S,18,35)}));p.swordHunter=true;
    const q=addQuest(S,{kind:'hunt',swordHunter:true,targetChar:hunter.id,title:'The Hunt for the Sword',targetParty:p.id,x:f.x,y:f.y,chars:[hunter.id],expires:T+16,text:`${dl.name} had heard of ${S.sword.name}. ${hunter.name} the Sword-Hunter was sent north with orders to bring it back, and the hand that held it.`});let best=null,bd=1e9;for(const h of hs){const d=mdist(h.x,h.y,S.sword.x,S.sword.y);if(d<bd){bd=d;best=h;}}if(best)assignHero(S,q,best);}
  if(dl&&dl.alive&&!K.orcs.broken&&!activeQuest(S,'strike')){const p=dl.party?party(S,dl.party):null;const f=setById(S,K.orcs.fortress);if(p&&!(f&&isAt(dl,f))){const near=hs.filter(h=>mdist(h.x,h.y,dl.x,dl.y)<=26);if(near.length){const n=S.quests.filter(q=>q.kind==='strike').length;const q=addQuest(S,{kind:'strike',title:n?`Strike the Crowned Dark ${['II','III','IV','V','VI','VII','VIII'][Math.min(n-1,6)]}`:'Strike the Crowned Dark',x:dl.x,y:dl.y,chars:[dl.id],expires:T+8,text:`${dl.name} ${dl.title} was in the field with ${p.name}, and only the sword could end ${pn(dl).o}. ${listNames(near)} turned toward ${pn(dl).o}.`});for(const h of near)assignHero(S,q,h);for(const k of kingdomKeys().concat(['vale'])){const kk=K[k];if(!kk.capital||(k==='city'&&kk.vassal)||kk.status!=='standing')continue;const cs=setById(S,kk.capital);if(mdist(cs.x,cs.y,dl.x,dl.y)>30||cs.garrison<30)continue;if(S.parties.some(pp=>pp.kind==='host'&&pp.faction===k))continue;musterHost(S,kk,{type:'party',id:p.id},'ride against');}}}}
  if(K.orcs.risen&&!K.orcs.broken&&!activeQuest(S,'siege')&&T>=K.orcs.riseTurn+(S.alliance?10:18)&&!S.quests.some(q=>q.kind==='siege')){const f=setById(S,K.orcs.fortress);const ks=kingdomKeys().filter(k=>standingKingdom(S,k));if(f&&standing(f)&&ks.length>=2){const q=addQuest(S,{kind:'siege',title:'The Last Alliance',settlement:f.id,x:f.x,y:f.y,expires:T+16,text:`The free peoples agreed to end it at its root. Every host that could be spared marched south on ${f.name}.`});for(const k of ks)musterHost(S,K[k],{type:'settlement',id:f.id},'march on',10);for(const h of hs)assignHero(S,q,h);}}
  for(const k of['dwarves','elves','city','vale']){const kk=K[k];if(!kk.capital)continue;const cs=setById(S,kk.capital);if(cs.status==='besieged'&&!activeQuest(S,'defend',q=>q.settlement===cs.id)&&!(k==='city'&&kk.vassal)){const q=addQuest(S,{kind:'defend',title:`The Relief of ${cs.name}`,settlement:cs.id,x:cs.x,y:cs.y,expires:T+8,text:`${cs.name} was under siege. Whoever could ride was asked to ride.`});for(const h of hs)if(mdist(h.x,h.y,cs.x,cs.y)<=34)assignHero(S,q,h);}}
  if(!S.sword.holder&&S.sword.lostTurns>=1&&!activeQuest(S,'recover')){let best=null,bd=1e9;for(const h of hs){const d=mdist(h.x,h.y,S.sword.x,S.sword.y);if(d<bd){bd=d;best=h;}}if(best&&bd<=36){const q=addQuest(S,{kind:'recover',title:'The Lost Sword',x:S.sword.x,y:S.sword.y,chars:[best.id],expires:T+10,text:`${S.sword.name} lay in ${placeName(S,S.sword.x,S.sword.y)} with no hand on it. ${best.name} went to find it before someone worse did.`});assignHero(S,q,best);}}
  {const hd=S.sword.holder?C(S,S.sword.holder):null;if(hd&&hd.alive&&!isFree(hd.faction)&&hd.role!=='darklord'&&!activeQuest(S,'foulhands')){let best=null,bd=1e9;for(const h of hs){const d=mdist(h.x,h.y,hd.x,hd.y);if(d<bd){bd=d;best=h;}}if(best){const q=addQuest(S,{kind:'foulhands',title:'A Blade in Foul Hands',x:hd.x,y:hd.y,chars:[hd.id,best.id],expires:T+15,text:`${hd.name} carried ${S.sword.name} now, and it burned ${pn(hd).o}. ${best.name} swore to take it back.`});assignHero(S,q,best);}}}
  if(standingKingdom(S,'dwarves')){const king=S.chars.find(c=>c.alive&&c.role==='goblinking');const dh=C(S,K.dwarves.hero);if(king&&king.party&&!activeQuest(S,'hunt',q=>q.goblinKing)){const q=addQuest(S,{kind:'hunt',goblinKing:true,targetChar:king.id,title:`The Goblin King`,targetParty:king.party,x:king.x,y:king.y,chars:[king.id,dh.id],expires:T+12,text:`${king.name} ${king.title} had come up out of the delvings with a court behind ${pn(king).o}. ${dh.name} was sent to put ${pn(king).o} back.`});assignHero(S,q,dh);}
    else if(!king&&dh.alive&&!dh.quest&&!activeQuest(S,'hunt',q=>q.goblins)&&T>=(S.lastGoblinQuest||0)+6){const g=S.parties.find(p=>p.faction==='goblins'&&p.might>=16&&S.settlements.some(s=>s.faction==='dwarves'&&standing(s)&&mdist(s.x,s.y,p.x,p.y)<=8));if(g){S.lastGoblinQuest=T;const near=nearestSettlement(S,g.x,g.y,s=>s.faction==='dwarves'&&standing(s));const q=addQuest(S,{kind:'hunt',goblins:true,targetName:cap(g.name),title:`Goblins at ${near.name}`,targetParty:g.id,x:g.x,y:g.y,chars:[dh.id],expires:T+6,text:`${cap(g.name)} were loose in the tunnels near ${near.name}. ${dh.name} went down after them.`});assignHero(S,q,dh);}}}
  if(!K.orcs.risen&&!activeQuest(S,'hunt',q=>q.raiders)){const wb=S.parties.find(p=>p.faction==='orcs'&&p.kind==='warband'&&p.goal&&p.goal.type==='settlement'&&!p.retreating);if(wb){const tgt=setById(S,wb.goal.id);let best=null,bd=1e9;for(const h of hs){if(h.quest)continue;const d=mdist(h.x,h.y,wb.x,wb.y);if(d<bd){bd=d;best=h;}}if(best&&bd<=22&&chance(S,0.7)){const q=addQuest(S,{kind:'hunt',raiders:true,targetName:cap(wb.name),title:`Raiders on the Road to ${tgt.name}`,targetParty:wb.id,x:wb.x,y:wb.y,chars:[best.id],expires:T+6,text:`${cap(wb.name)} was moving on ${tgt.name}. ${best.name} rode to cut it off.`});assignHero(S,q,best);}}}
  for(const k of kingdomKeys()){const kk=K[k];if(!standingKingdom(S,k)||kk.mistake||kk.omen.val<75||activeQuest(S,'omen',q=>q.faction===k)||S.turn<(kk.omenQuestCooldown||0))continue;kk.omenQuestCooldown=S.turn+8;const hh=C(S,kk.hero);if(!hh||!hh.alive)continue;const cs=setById(S,kk.capital);const ld=kk.leader?C(S,kk.leader):null;const ln=ld?ld.name:'the crown';const q=addQuest(S,{kind:'omen',faction:k,settlement:cs.id,x:cs.x,y:cs.y,chars:[hh.id].concat(ld?[ld.id]:[]),expires:T+10,title:k==='dwarves'?'The Door Below':k==='elves'?'The Lament of the First Shore':'The Iron Tower',text:k==='dwarves'?`The deep-priests of ${cs.name} say the seam below the lowest hall has begun to sing. ${ln} will not stop the digging unless someone the crown trusts stands beside it. ${hh.name} was called home.`:k==='elves'?`Half the court of ${cs.name} has stopped speaking of anything but the sea. ${ln} has had the grey ships provisioned. ${hh.name} was called home to argue for the world.`:`The guilds of ${cs.name} have raised an iron tower taller than the temple, and ${ln} means to build a greater one. ${hh.name} was called home to say what the gods would say.`});assignHero(S,q,hh);}
  if(T===TURNS-4){addQuest(S,{kind:'epilogue',title:'The Ending of the Age',x:CX,y:CY,text:`The seers say the age ends in forty years, and that what stands then will stand for a thousand more. Every crown in the world is counting.`});}}
function questsResolve(S){const K=S.kingdoms;const T=S.turn;const dl=K.orcs.darklord?C(S,K.orcs.darklord):null;
  for(const q of S.quests){if(q.status!=='active')continue;
    if(q.expires&&T>=q.expires&&!['develop','epilogue','council','defend','siege'].includes(q.kind)){const hn=q.heroes.length?listNames(q.heroes.map(id=>C(S,id)).filter(Boolean)):'the heroes';const tc=q.targetChar?C(S,q.targetChar):null;const tp=q.targetParty?party(S,q.targetParty):null;const l=q.lead?C(S,q.lead):null;const dl2=K.orcs.darklord?C(S,K.orcs.darklord):null;
      endQuest(S,q,false,q.kind==='scout'?`${hn} never reached ${placeName(S,q.x,q.y)}.`:q.kind==='envoy'?`${l?l.name:'The envoys'} never reached ${setById(S,K[q.to].capital).name}.`:q.kind==='expedition'?`${l?l.name+"'s host":'The expedition'} never reached ${clusterName(S,q.tiles)}.`:q.kind==='strike'?`${dl2?dl2.name:'The Dark Lord'} kept his horde between himself and ${hn}, and the chance passed.`:q.kind==='errand'?'Their paths did not cross.':q.kind==='recover'?`No one found ${S.sword.name}.`:q.kind==='foulhands'?`The orc who carried ${S.sword.name} could not be caught.`:`${tc?tc.name:tp?cap(tp.name):'The quarry'} slipped away before ${hn} could catch ${tc?pn(tc).o:'them'}.`);continue;}
    switch(q.kind){
      case 'develop':{const kk=K[q.faction];if(!standingKingdom(S,q.faction)){endQuest(S,q,false,'The kingdom fell before the work was done.');break;}if(kk.dev>=q.target)endQuest(S,q,true,q.faction==='dwarves'?`The Deep Seam was opened; the mountain rang with picks, and something below heard them.`:q.faction==='elves'?`The groves were planted. In a hundred years no one would remember they had been planted at all.`:`The engine-farms turned. The river below the mills ran a little browner.`);break;}
      case 'hunt':{const tp=q.targetParty?party(S,q.targetParty):null;const tc=q.targetChar?C(S,q.targetChar):null;const gone=tc?!tc.alive:(q.targetParty&&!tp);if(gone){const h=q.heroes.length?C(S,q.heroes[0]):null;if(q.dream){S.candidateSlain=true;S.riseTurn+=6;S.dlCandidate=null;}const tn=tc?tc.name:(q.targetName||'the quarry');endQuest(S,q,true,q.dream?`${tn}, who dreamed of a crown, died before ${tc?pn(tc).s:'he'} could wear it. The tribes fell to quarrelling over the dream.`:q.goblinKing?`${tn} was put back under the mountain${h?' by '+h.name:''}.`:q.swordHunter?`${tn} was found dead on the road, and the sword was not with him.`:`${tn} ${q.targetParty&&!tc?'were':'was'} hunted down${h?' by '+h.name:''}.`);break;}
        if(q.dream&&K.orcs.risen){endQuest(S,q,false,`He wears a crown now.`);}break;}
      case 'scout':{const h=q.heroes.length?C(S,q.heroes[0]):null;if(!h||!h.alive){endQuest(S,q,false,'No one came back.');break;}
        if(q.stage==='out'&&mdist(h.x,h.y,q.x,q.y)<=1){q.stage='back';if(q.title==='The Grey Ships'){K.elves.omen.val=clamp(K.elves.omen.val-10,0,100);log(S,'hero',`${h.name} stood on the strand at ${placeName(S,q.x,q.y)} and heard, a long way out, the grey ships singing. ${pn(h).S} came back with a song no one had heard in a thousand years, and for a while the court forgot about leaving.`,q.x,q.y,[h.id]);story(S,h,'Heard the grey ships singing beyond the mist.');}
          else{const chiefs=S.chars.filter(c=>c.alive&&c.faction==='orcs'&&(c.role==='chieftain'||c.role==='orc')&&ageOf(S,c)<40).sort((a,b)=>(b.strength+b.renown+b.traits.ambition*2)-(a.strength+a.renown+a.traits.ambition*2));const cand=chiefs[0];if(cand){S.dlCandidate=cand.id;cand.title='the Dreamer';cand.role='chieftain';cand.strength=Math.max(cand.strength,9);cand.life=Infinity;{const cp=cand.party?party(S,cand.party):null;if(cp)cp.might+=14;}story(S,cand,'Began to dream of a crown, and stopped growing old.');log(S,'hero',`${h.name} lay in the swamp barrows at ${placeName(S,q.x,q.y)} and watched the tribes come, one by one, to sit at the fire of ${cand.name}. Every shaman in the South was dreaming the same crown, and it was on ${pn(cand).p} head.`,q.x,q.y,[h.id,cand.id]);story(S,h,`Saw ${cand.name} in the swamp barrows and understood what was coming.`);
            {const hs2=heroesOf(S);const q2=addQuest(S,{kind:'hunt',dream:true,title:"The Chieftain's Dream",targetChar:cand.id,targetParty:cand.party||null,x:cand.x,y:cand.y,chars:[cand.id],expires:S.riseTurn+40,text:`${cand.name} was gathering the tribes at ${whereChar(S,cand)}. If ${pn(cand).s} died before ${pn(cand).s} was crowned, the South would lose a generation choosing another. Word went to the heroes of three peoples: go south and kill one orc.`});for(const hh of hs2)if(hh.id!==h.id)assignHero(S,q2,hh);}}}}
        else if(q.stage==='back'){const home=homeCapital(S,h);if(!home||mdist(h.x,h.y,home.x,home.y)<=1){if(q.title==='The Grey Ships')endQuest(S,q,true,`${h.name} came home singing.`);else{endQuest(S,q,true,`${h.name} came home and told the Sovereign what ${pn(h).s} had seen. Nobody wanted to believe ${pn(h).o}.`);const q2=activeQuest(S,'hunt',x=>x.dream);if(q2)assignHero(S,q2,h);}}}break;}
      case 'defend':{const s=setById(S,q.settlement);if(s.status==='fallen'){endQuest(S,q,false,`${s.name} fell.`);break;}const th=nearestThreat(S,s.x,s.y,s.faction,8);if(T>=q.start+2&&s.status!=='besieged'&&!th)q.calm=(q.calm||0)+1;else q.calm=0;if(q.calm>=2){endQuest(S,q,true,`${s.name} held, and the enemy drew off.`);}else if(q.expires&&T>=q.expires){endQuest(S,q,true,`${s.name} stood through the decade.`);}break;}
      case 'recover':{if(S.sword.holder){const h=C(S,S.sword.holder);endQuest(S,q,isFree(h.faction),isFree(h.faction)?`${h.name} took it up.`:`${h.name} got there first.`);}break;}
      case 'foulhands':{const hd=S.sword.holder?C(S,S.sword.holder):null;if(!hd||isFree(hd.faction))endQuest(S,q,true,hd?`${hd.name} holds it now.`:'It was struck from the orc\'s hand and lies in the grass.');break;}
      case 'council':{const lost=q.expected.filter(k=>!q.arrived.includes(k)&&!S.parties.some(p=>p.quest===q.id&&p.faction===k));if(q.arrived.length>=q.expected.length||T>=q.expires||lost.length+q.arrived.length>=q.expected.length){const all=q.arrived.length>=q.expected.length;if(all){S.alliance=true;const ks=kingdomKeys();for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){addRel(S,ks[i],ks[j],25);S.diplo.war[relKey(ks[i],ks[j])]=false;}const h=S.sword.holder?C(S,S.sword.holder):null;const site=setById(S,q.settlement);const swordThere=h&&h.alive&&isAt(h,site);if(swordThere){h.renown+=5;S.sword.renown+=3;story(S,h,`Named the Marked Blade by the Council of Three.`);}endQuest(S,q,true,`The crowns swore the Oath of ${site.name}: one war, one host, no separate peace.${swordThere?' '+S.sword.name+' lay on the table while they swore it.':''}`);}
          else if(q.arrived.length>0){const ks=q.arrived;for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++)addRel(S,ks[i],ks[j],10);endQuest(S,q,false,`Only ${q.arrived.map(k=>FACTIONS[k].short).join(' and ')} came. The chairs stood empty and everyone noticed.`);}
          else endQuest(S,q,false,'No one came.');}break;}
      case 'strike':{if(dl&&!dl.alive){endQuest(S,q,true,`${dl.name} is dead.`);break;}const f=setById(S,K.orcs.fortress);if(!dl||!dl.party||(f&&isAt(dl,f))){endQuest(S,q,false,`${dl?dl.name:'The Dark Lord'} went back behind the walls of ${f?f.name:'his fortress'} before anyone reached him.`);}break;}
      case 'siege':{const f=setById(S,q.settlement);if(!standing(f)){endQuest(S,q,true,`${f.name} is a ruin.`);break;}q.musters=q.musters||{};for(const k of kingdomKeys().concat(['vale'])){const kk=K[k];if(!standingKingdom(S,k)&&!(k==='vale'&&kk.status==='standing'))continue;if((q.musters[k]||0)>=2)continue;if(S.parties.some(p=>p.kind==='host'&&p.faction===k))continue;const cs=setById(S,kk.capital);if(cs&&standing(cs)&&cs.garrison>=45&&chance(S,0.6)){musterHost(S,kk,{type:'settlement',id:f.id},'march on',6);q.musters[k]=(q.musters[k]||0)+1;}}const hosts=S.parties.filter(p=>p.kind==='host'&&isFree(p.faction)&&p.goal&&p.goal.type==='settlement'&&p.goal.id===f.id);const there=S.parties.filter(p=>isFree(p.faction)&&combatKind(p)&&isAt(p,f));if(there.length)stormFortress(S,q,f,there);if(q.status!=='active')break;if(T>=q.expires)endQuest(S,q,false,`${f.name} did not fall.`);break;}
      case 'epilogue':if(T>=TURNS)endQuest(S,q,true,'The age ended.');break;
      case 'errand':{const hd=S.sword.holder?C(S,S.sword.holder):null;const tg=C(S,q.target);const site=q.site.type==='settlement'?setById(S,q.site.id):null;const sName=site?site.name:placeName(S,q.site.x,q.site.y);if(hd&&hd.id===q.target){endQuest(S,q,true,`At ${sName}, ${C(S,q.holder).name} put ${S.sword.name} into the hands of ${tg.name}, and felt lighter for it.`);break;}if(!tg||!tg.alive){endQuest(S,q,false,`${tg?tg.name:'The one it sought'} died before the paths crossed.`);break;}if(!hd||hd.id!==q.holder){endQuest(S,q,false,'The sword changed hands another way.');break;}break;}
      case 'omen':{const kk=K[q.faction];if(kk.mistake||kk.status!=='standing'){endQuest(S,q,false,'Too late.');break;}const cs=setById(S,q.settlement);let there=0;for(const id of q.heroes){const hh=C(S,id);if(hh&&hh.alive&&isAt(cs,hh))there++;}if(there){kk.omen.val=clamp(kk.omen.val-1.5*there,0,100);}if(kk.omen.val<=50){const hh=q.heroes.length?C(S,q.heroes[0]):null;endQuest(S,q,true,`${hh?hh.name:'The crown'} talked ${kk.leaderTitle==='Sovereign'?'the Sovereign':'the '+kk.leaderTitle} down from the edge, for now.`);}else if(T>=q.expires)endQuest(S,q,false,`${q.heroes.length?C(S,q.heroes[0]).name+' could not stay, and':'No one stayed, and'} the crown's mind was made up.`);break;}
      case 'envoy':case 'expedition':{const p=party(S,q.party);if(!p){const l=q.lead?C(S,q.lead):null;endQuest(S,q,false,q.kind==='envoy'?(l&&l.deathCause&&/old age|fever/.test(l.deathCause)?`${l.name} ${l.deathCause} on the road, and the question was never asked.`:'The envoys were killed on the road.'):'The expedition was destroyed on the road.');}break;}}}}
function whereChar(S,c){const s=settlementAt(S,c.x,c.y);return s?s.name:placeName(S,c.x,c.y);}
function stormFortress(S,q,f,there){let atk=0;for(const p of there)atk+=partyStrength(S,p);const heroHere=there.some(p=>p.members.some(id=>C(S,id).hero));if(heroHere)atk+=10;const def=f.garrison+f.walls;const sw=S.sword;const holderHere=sw.holder&&there.some(p=>p.members.includes(sw.holder));if(holderHere)atk+=sw.stats.keen*3;
  const K=S.kingdoms.orcs;const dl=K.darklord?C(S,K.darklord):null;const dlHere=dl&&dl.alive&&isAt(dl,f);
  if(atk>def*(0.9+rnd(S)*0.5)){f.status='ruined';f.garrison=0;S.terrainVersion++;let txt=`${f.name} fell to the Last Alliance. Its gates were thrown down and its barrows opened to the sun.`;
    if(dlHere){if(holderHere){const h=C(S,sw.holder);const pr=0.3+sw.stats.keen*0.09+(h.hero?0.2:0);if(chance(S,pr)){killDarkLord(S,dl,h,`the storming of ${f.name}`);return;}}const camp=nearestSettlement(S,f.x,f.y,s=>s.faction==='orcs'&&s.type==='camp'&&standing(s));leaveParty(S,dl);if(camp){dl.x=camp.x;dl.y=camp.y;dl.home=camp.id;K.fortress=camp.id;K.capital=camp.id;camp.walls=20;camp.garrison=30;camp.type='fortress';camp.name=`the second ${f.name.replace(/^the /,'')}`;txt+=` ${dl.name} fled to ${camp.name} with a handful of guards.`;}else{dl.x=f.x;dl.y=f.y;}}
    K.shaken=true;for(const p of S.parties)if(p.faction==='orcs'&&p.kind==='army')p.might=Math.floor(p.might*0.5);
    log(S,'hero',txt,f.x,f.y,[]);endQuest(S,q,true,`${f.name} is a ruin.`);for(const p of there)casualties(S,p,false,[],`the storming of ${f.name}`);}
  else{f.garrison=Math.max(0,Math.floor(f.garrison-atk*0.15));for(const p of there){p.might=Math.max(0,Math.floor(p.might-def*0.12));casualties(S,p,false,[],`the siege of ${f.name}`,0.06);}log(S,'battle',`The Last Alliance sat before the gates of ${f.name}. The walls held, that decade.`,f.x,f.y,[]);}}
if(typeof module!=='undefined')module.exports={resolvedSeek,heedOf,landName,wantText,WANT_PULL,liteClone,devCount,landCount,rel,relWord,atWar,ACT_NAMES,OWN,OWNID,devWord,genWorld,simulateTurn,project,computeFates,C,party,setById,settlementAt,charsAt,placeName,ageOf,roleName,omenText,seekTarget,partyStrength,W,H,TURNS,TR,TINFO,FACTIONS,RACE_NAMES,REGION_NAMES,rnd,hashStr,leadChar};
