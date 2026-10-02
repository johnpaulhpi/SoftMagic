
/* ---------- tutorial: the pitchfork ---------- */
let Tut_doneMem=false;
const Tut=(()=>{
  const WILL=6;
  const ACTS=[['keen','◆','Become Sharper'],['ward','◉',"Enhance Holder's Senses"],['valor','⚔',"Magnify Holder's Obsession with Victory"],['glory','⌂',"Magnify Holder's Nostalgia for Home"],['call','♪','Seek New Holder'],['counsel','♛',"Intensify Holder's Charisma"]];
  const PEOPLE={
    bess:{name:'Bess Thornfield',label:'Bess',role:'farmhand',want:'to keep half of what she grows',look:[[1,1],[6,5],[19,0]]},
    tom:{label:'Tom',look:[[0,2],[7,0],[20,1]]},mags:{label:'Mags',look:[[1,0],[10,4],[25,0]]},wim:{label:'old Wim',look:[[0,0],[6,4],[19,4],[21,6]]},
    vell:{label:'Master Vell',look:[[0,0],[14,0],[30,8]],foe:true},stew:{label:'steward',look:[[0,1],[8,3],[29,2]],foe:true},
    g1:{label:'',look:[[0,2],[9,4],[28,0],[45,0]],foe:true},g2:{label:'',look:[[0,0],[9,4],[29,0],[44,6]],foe:true}};
  const START={bess:[3,6],tom:[4,7],mags:[2,7],wim:[5,6],vell:[7,2],stew:[6,2],g1:[8,2],g2:[9,2]};
  const STEPS=[
    {req:{call:1},target:[2,2],
     situation:'Master Vell owns every field you can see and takes half of every harvest. You are the quiet magic inside an old pitchfork leaning on the barn wall. No one holds you.',
     doThis:'Click <b>Seek New Holder</b> to call out to someone who might pick the fork up.',
     paths:{bess:[[3,6],[3,4],[2,3]],tom:[[4,7],[4,6],[4,7]]},
     outcome:'Bess Thornfield, a farmhand, heard a hum from the barn wall and came to look. She picked the fork up. She is your <b>holder</b> now.',
     lesson:'Seek New Holder calls a new hand to you. Once someone takes you up, the call is answered and that will comes back to you.',
     after(st){st.hold='bess';st.pts.call=0;}},
    {req:{keen:1},target:[3,6],
     situation:'The steward wants the whole south field forked into the barn by nightfall. With a blunt fork, that is three days\u2019 work.',
     doThis:'Click <b>Become Sharper</b>.',
     paths:{bess:[[2,3],[3,5],[4,6],[2,6],[3,2]]},
     outcome:'The fork bit into the hay like it was hungry. The field was in the barn by noon, and the others stopped to stare at Bess.',
     lesson:'Become Sharper makes the blade bite harder: work goes faster now, and fights go better later.',
     after(st){st.flags.harvested=true;}},
    {req:{counsel:1},target:[5,3],
     situation:'Everyone saw what Bess did. They are standing in the yard, waiting for someone to say something.',
     doThis:'Click <b>Intensify Holder\u2019s Charisma</b>.',
     paths:{bess:[[3,2],[4,3],[5,3]],tom:[[4,7],[4,5],[4,4]],mags:[[2,7],[3,5],[5,4]],wim:[[5,6],[6,5],[6,4]]},
     outcome:'Bess climbed onto the well and said what they had all been thinking: half a harvest is theft. Tom, Mags and old Wim put down their tools and stood beside her.',
     lesson:'Charisma makes people listen to your holder. In the age, a charismatic holder at a capital steadies the crown and sways treaties.',
     after(st){}},
    {req:{ward:1},target:[6,2],
     situation:'The steward heard every word. He is coming down from the manor with two guards and a cudgel.',
     doThis:'Click <b>Enhance Holder\u2019s Senses</b>.',
     paths:{bess:[[5,3],[3,3],[1,2],[0,1]],tom:[[4,4],[2,3],[0,3],[0,2]],mags:[[5,4],[3,3],[1,2],[0,0]],wim:[[6,4],[4,3],[2,2],[1,0]],
            stew:[[6,2],[6,3],[5,3],[6,2]],g1:[[8,2],[7,3],[6,3],[8,2]],g2:[[9,2],[8,3],[7,4],[9,2]]},
     outcome:'Bess heard the gate creak before anyone else did. By the time the steward reached the well, the four of them were behind the barn. He found nobody, and nobody was hurt.',
     lesson:'Senses keep your holder and companions alive: they see danger early and slip past it.',
     after(st){}},
    {req:{valor:2},target:[7,1],
     situation:'Enough hiding. Master Vell is on the manor steps with his steward and guards.',
     doThis:'Click <b>Magnify Holder\u2019s Obsession with Victory</b> <b>twice</b>. Big desires win; one point won\u2019t carry four farmers up that hill.',
     paths:{bess:[[0,1],[2,3],[5,3],[7,3],[7,3],[7,3]],tom:[[0,2],[2,4],[5,4],[6,3],[6,3],[6,3]],mags:[[0,0],[2,2],[5,3],[8,3],[8,3],[8,3]],wim:[[1,0],[3,3],[5,4],[7,4],[7,4],[7,4]],
            vell:[[7,2],[7,2],[7,2],[7,2],[7,1],[7,-2]],stew:[[6,2],[6,2],[6,2],[6,2],[5,0],[4,-2]],g1:[[8,2],[8,2],[8,2],[8,2],[9,1],[11,0]],g2:[[9,2],[9,2],[9,2],[9,2],[10,2],[12,2]]},
     sparks:[0.5,0.72],
     outcome:'Bess walked up the manor steps with a sharp fork and three friends behind her. The guards weighed it and ran. Master Vell signed the fields over to the people who work them and left by the north road.',
     lesson:'Obsession with Victory sends your holder looking for the fight; Sharper makes them win it. In the age, that is how the Dark Lord dies \u2014 and only in a fight the sword is part of.',
     after(st){st.flags.free=true;for(const k of['vell','stew','g1','g2'])st.gone[k]=true;}},
    {req:{glory:1},target:[1,8],
     situation:'The farm is free. Bess is a hero, and she misses her own hearth.',
     doThis:'Click <b>Magnify Holder\u2019s Nostalgia for Home</b>.',
     paths:{bess:[[7,3],[6,5],[3,7],[2,8]],tom:[[6,3],[5,5],[3,8],[2,9]],mags:[[8,3],[6,6],[3,9],[1,9]],wim:[[7,4],[6,6],[4,8],[3,8]]},
     outcome:'They feasted at Bess\u2019s cottage and carved her name on the barn door. Her longing for home was spent \u2014 and the will came back to you.',
     lesson:'Nostalgia sends your holder home to be honoured. Once they arrive, the desire is spent and the will returns.',
     after(st){st.pts.glory=0;st.flags.feast=true;}}];
  let st=null,active=false,onDone=null,raf=0,sheet=null;const cache={};
  function reset(){st={step:0,phase:'act',pts:{keen:0,ward:0,valor:0,glory:0,call:0,counsel:0},hold:null,pos:JSON.parse(JSON.stringify(START)),flags:{},gone:{},anim:null,last:null};}
  function spent(){let s=0;for(const k in st.pts)s+=st.pts[k];return s;}
  /* sprites */
  function sprite(id){if(cache[id])return cache[id];const cv=document.createElement('canvas');cv.width=16;cv.height=16;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;if(sheet&&sheet.complete&&sheet.naturalWidth){for(const[c,r]of PEOPLE[id].look)g.drawImage(sheet,c*17,r*17,16,16,0,0,16,16);cache[id]=cv;}return cv;}
  function portrait(id){const k='p_'+id;if(cache[k])return cache[k];if(!(sheet&&sheet.complete&&sheet.naturalWidth))return'';const url=sprite(id).toDataURL();cache[k]=url;return url;}
  function drawFork(g,x,y,s,glow){if(glow){const p=0.45+0.3*Math.sin(performance.now()/350);g.save();g.globalAlpha=p;g.fillStyle='#f4e2a6';g.beginPath();g.ellipse(x,y+s*0.35,s*0.55,s*0.2,0,0,6.283);g.fill();g.restore();}
    g.save();g.lineCap='round';g.strokeStyle='#7a4f2a';g.lineWidth=Math.max(2,s*0.08);g.beginPath();g.moveTo(x-s*0.28,y+s*0.38);g.lineTo(x+s*0.2,y-s*0.3);g.stroke();
    g.strokeStyle='#c9cfd6';g.lineWidth=Math.max(1.5,s*0.05);const bx=x+s*0.2,by=y-s*0.3;for(const o of[-0.12,0,0.12]){g.beginPath();g.moveTo(bx+o*s*0.6-s*0.04,by+o*s*0.5+s*0.03);g.lineTo(bx+o*s*0.6+s*0.12,by+o*s*0.5-s*0.2);g.stroke();}
    g.strokeStyle='#c9cfd6';g.beginPath();g.moveTo(bx-s*0.1,by+s*0.08);g.lineTo(bx+s*0.12,by-s*0.08);g.stroke();g.restore();}
  /* map */
  function posOf(id,now){const a=st.anim;if(a&&a.paths[id]){const p=a.paths[id];const t=Math.max(0,Math.min(1,(now-a.t0)/a.dur));const n=p.length-1;if(n<1)return p[0];const f=t*n;const i=Math.max(0,Math.min(n-1,Math.floor(f)));const fr=f-i;return[p[i][0]+(p[i+1][0]-p[i][0])*fr,p[i][1]+(p[i+1][1]-p[i][1])*fr];}return st.pos[id];}
  function hsh(x,y){let h=Math.imul(x+11,374761393)+Math.imul(y+7,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
  function draw(now){const cv=$('tutCv');const wrap=cv.parentElement;const side=Math.floor(Math.min(wrap.clientWidth,wrap.clientHeight||wrap.clientWidth));if(side<=0)return;const dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==side*dpr){cv.width=side*dpr;cv.height=side*dpr;cv.style.width=side+'px';cv.style.height=side+'px';}
    const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);const T=side/10;g.clearRect(0,0,side,side);
    const isPath=(x,y)=>y===3||(x===6&&y>3);const isField=(x,y)=>x>=2&&x<=5&&y>=5&&y<=7;const isYard=(x,y)=>x>=6&&y<=2;
    for(let y=0;y<10;y++)for(let x=0;x<10;x++){const h=hsh(x,y);let c=h<0.5?'#7fb24a':'#78a945';if(isPath(x,y))c=h<0.5?'#c9a86a':'#c2a064';if(isField(x,y))c=st.flags.harvested?'#b89a5a':'#8a6a3a';if(isYard(x,y))c=h<0.5?'#b8b0a2':'#b0a898';g.fillStyle=c;g.fillRect(x*T,y*T,T+0.5,T+0.5);
      if(isField(x,y)){g.strokeStyle='rgba(0,0,0,0.12)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(x*T+2,y*T+k*T/4);g.lineTo(x*T+T-2,y*T+k*T/4);g.stroke();}}}
    g.strokeStyle='rgba(0,0,0,0.08)';for(let k=0;k<=10;k++){g.beginPath();g.moveTo(k*T,0);g.lineTo(k*T,side);g.stroke();g.beginPath();g.moveTo(0,k*T);g.lineTo(side,k*T);g.stroke();}
    const B=(name,tx,ty,sc,dy)=>{if(ISO.ready)ISO.blit(g,name,(tx+0.5)*T,(ty+0.88)*T+(dy||0),sc);};const sk=T*1.25/141,pr=T*1.05/128;
    const items=[];const obj=(ty,f)=>items.push({y:ty+0.88,f});
    obj(1,()=>{B('sk_building_stack',1,1,sk);B('sk_roof_gableCornerBrown',1,1,sk,-52*sk);});
    obj(1,()=>{B('sk_castle_towerBeigeBase',7,1,sk);B('sk_castle_towerBeigeTop',7,1,sk,-52*sk);B(st.flags.free?'pr_banner-green':'pr_banner-red',6,1,pr*0.9);});
    obj(1,()=>{B('sk_building_stackBeige',8,1,sk);B('sk_roof_gableCornerPurple',8,1,sk,-52*sk);});
    obj(3,()=>B('sk_well',5,3,sk*0.8));obj(8,()=>{B('sk_building_stack',1,8,sk);B('sk_roof_gableCornerGreen',1,8,sk,-52*sk);});obj(8,()=>{B('sk_building_stack',8,8,sk);B('sk_roof_gableCornerBrown',8,8,sk,-52*sk);});
    for(const[x,y]of[[0,5],[9,5],[4,9],[9,9],[3,0],[5,0],[0,9]])obj(y,()=>B('pr_tree_oak',x,y,pr*1.1));
    if(!st.flags.harvested)for(let y=5;y<=7;y++)for(let x=2;x<=5;x++)obj(y,()=>B('pr_crops_wheatStageB',x,y,pr*0.9));
    if(st.flags.harvested){for(const[x,y]of[[3,1],[3,2],[2,1]])obj(y,()=>{g.fillStyle='#e0c060';g.beginPath();g.ellipse((x+0.5)*T,(y+0.72)*T,T*0.38,T*0.26,0,Math.PI,0);g.fill();g.strokeStyle='#b8952e';g.lineWidth=1;g.stroke();});}
    if(st.flags.feast)obj(9,()=>B('pr_campfire_stones',2,9,pr));
    for(const id in PEOPLE){if(st.gone[id]&&!(st.anim&&st.anim.paths[id]))continue;const[px,py]=posOf(id,now);items.push({y:py+0.8,f:()=>{const x=(px+0.5)*T,y=(py+0.8)*T;g.save();g.globalAlpha=0.3;g.fillStyle='#000';g.beginPath();g.ellipse(x,y,T*0.28,T*0.1,0,0,6.283);g.fill();g.restore();
        if(st.hold===id){g.save();g.globalAlpha=0.5;g.fillStyle='#f4e2a6';g.beginPath();g.ellipse(x,y,T*0.4,T*0.15,0,0,6.283);g.fill();g.restore();}
        g.imageSmoothingEnabled=false;g.drawImage(sprite(id),x-T*0.42,y-T*0.84,T*0.84,T*0.84);g.imageSmoothingEnabled=true;
        if(st.hold===id)drawFork(g,x+T*0.28,y-T*0.4,T*0.55,false);
        const lb=PEOPLE[id].label;if(lb&&(st.step===0||id==='bess'||id==='vell')){g.font=`${Math.max(9,Math.round(T*0.17))}px Georgia,serif`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,0.8)';g.strokeText(lb,x,y-T*0.88);g.fillStyle=PEOPLE[id].foe?'#ffb3a0':'#fff3cc';g.fillText(lb,x,y-T*0.88);}}});}
    if(!st.hold)items.push({y:2.85,f:()=>drawFork(g,2.5*T,2.45*T,T*0.8,true)});
    items.sort((a,b)=>a.y-b.y);for(const it of items)it.f();
    const a=st.anim;if(a&&a.sparks){const t=(now-a.t0)/a.dur;if(t>a.sparks[0]&&t<a.sparks[1]){g.fillStyle='#fff3cc';g.font=`${Math.round(T*0.4)}px serif`;g.textAlign='center';for(let k=0;k<6;k++){const ang=k*1.05+now/180;g.globalAlpha=0.6+0.4*Math.sin(now/60+k);g.fillText('✦',7.5*T+Math.cos(ang)*T*0.9,2.8*T+Math.sin(ang)*T*0.6);}g.globalAlpha=1;}}
    const S0=STEPS[st.step];if(S0&&!st.anim){const[tx,ty]=S0.target;const bob=Math.sin(now/220)*T*0.08;const x=(tx+0.5)*T,y=ty*T-T*0.15+bob;g.fillStyle='#f4e2a6';g.strokeStyle='#5a4a1e';g.lineWidth=2;g.beginPath();g.moveTo(x-T*0.22,y-T*0.3);g.lineTo(x+T*0.22,y-T*0.3);g.lineTo(x,y);g.closePath();g.fill();g.stroke();}}
  /* card */
  function card(){const el=$('tutCard');const S0=STEPS[st.step];let h='';
    h+=`<div class="tutprog">${STEPS.map((_,i)=>`<span class="${i<st.step?'done':i===st.step?'cur':''}"></span>`).join('')}<span class="tutprogtxt">${S0?`Lesson ${st.step+1} of ${STEPS.length}`:'Done'}</span></div>`;
    if(st.last)h+=`<div class="tutwhat"><div class="k">What happened</div><p>${st.last.outcome}</p><div class="tutlesson">✧ ${st.last.lesson}</div></div>`;
    if(!S0){h+=`<div class="tutend"><h3>That\u2019s the whole game.</h3><p>In the age, the pitchfork is a legendary sword, the farm is a thousand-year world, and Master Vell is a Dark Lord. The six properties work the same way:</p><ul>
      <li><b>◆ Become Sharper</b> — wins fights; fells chieftains, kings, and the Dark Lord.</li><li><b>◉ Enhance Holder\u2019s Senses</b> — keeps the holder and companions alive.</li><li><b>⚔ Magnify Holder\u2019s Obsession with Victory</b> — sends the holder after the fight, and after the Dark Lord when he rides out.</li><li><b>⌂ Magnify Holder\u2019s Nostalgia for Home</b> — home to be honoured; spent on arrival.</li><li><b>♪ Seek New Holder</b> — calls a new hand (you choose whom). At full strength, no other hand can lift it.</li><li><b>♛ Intensify Holder\u2019s Charisma</b> — steadies a crown and sways treaties, when the holder is at a capital and heeded.</li></ul>
      <p><b>Your goals:</b> slay the Dark Lord once he rises; keep each of the three crowns from its great mistake; keep the four seats standing. The difference from the farm: each turn is ten years, and the world does not wait for you.</p>
      <div class="row"><button class="primary" id="tutBegin" data-tgt="1">Begin the age ▶</button><button id="tutAgain">Play the tutorial again</button></div></div>`;el.innerHTML=h;$('tutBegin').onclick=()=>finish(true);$('tutAgain').onclick=()=>{reset();card();};return;}
    const hold=st.hold?PEOPLE[st.hold]:null;
    h+=`<div class="tuthold">${hold?`<img src="${portrait(st.hold)}" class="tutport" alt=""><div><b>${hold.name}</b>, ${hold.role} <span class="dim">— your holder</span><div class="dim">Wants ${hold.want}.</div></div>`:`<div class="tutnofork">♆</div><div><b>No one holds the pitchfork.</b><div class="dim">It leans on the barn wall, humming.</div></div>`}</div>`;
    h+=`<p class="tutsit">${S0.situation}</p>`;
    h+=`<div class="tutdo">${st.phase==='act'?S0.doThis:st.phase==='step'?'Now click <b>Let the turn play out</b> and watch what the holder does.':'Watching\u2026'}</div>`;
    h+=`<div class="actshead"><div class="actstitle">Change the magical properties of the pitchfork</div><div class="minihead">Will ${spent()} of ${WILL} spent</div></div><div class="choices">`;
    let firstTgt=true;for(const[k,icon,label]of ACTS){const v=st.pts[k];const need=S0.req[k];const live=st.phase==='act'&&need!=null&&v<need;const tg=live&&firstTgt;if(tg)firstTgt=false;
      h+=`<button class="choice${live?' tutglow':' dead compact'}" data-k="${k}" ${live?'':'disabled'} ${tg?'data-tgt="1"':''}><span class="ci">${icon}</span><span class="cl">${label} <span class="pips">${'●'.repeat(v)}${'○'.repeat(5-v)}</span></span>${live?`<span class="cs">${need-v>1?`click ${need-v} more times`:'click once'}</span>`:''}</button>`;}
    h+=`</div><button class="primary tutstep" id="tutStep" ${st.phase==='step'?'data-tgt="1"':'disabled'}>Let the turn play out ▶</button>`;
    el.innerHTML=h;
    el.querySelectorAll('.choice[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;const need=S0.req[k];if(st.phase!=='act'||need==null||st.pts[k]>=need||spent()>=WILL)return;st.pts[k]++;if(Object.keys(S0.req).every(q=>st.pts[q]>=S0.req[q]))st.phase='step';card();scrollTgt();});
    $('tutStep').onclick=()=>{if(st.phase!=='step')return;play();};}
  function scrollTgt(){const t=document.querySelector('#tutCard [data-tgt]');if(t&&t.scrollIntoView)t.scrollIntoView({block:'nearest',behavior:'smooth'});}
  function play(){const S0=STEPS[st.step];const n=Math.max(...Object.values(S0.paths).map(p=>p.length));const paths={};for(const id in S0.paths){const p=S0.paths[id].slice();while(p.length<n)p.push(p[p.length-1]);paths[id]=p;}
    if(st.hold&&!paths[st.hold]){}st.anim={t0:performance.now(),dur:Math.max(1300,(n-1)*520),paths,sparks:S0.sparks};st.phase='anim';card();
    setTimeout(()=>{for(const id in paths)st.pos[id]=paths[id][paths[id].length-1];st.anim=null;S0.after(st);st.last={outcome:S0.outcome,lesson:S0.lesson};st.step++;st.phase='act';card();const body=$('tutCard');if(body)body.scrollTop=0;},st.anim.dur+60);}
  function arrow(){const ar=$('tutArrow');const t=document.querySelector('#tutCard [data-tgt]');if(!active||!t||st.phase==='anim'){ar.style.display='none';return;}const r=t.getBoundingClientRect();const card=$('tutCard').getBoundingClientRect();ar.style.display='block';if(r.top>card.bottom-10){ar.className='tutArrow down';ar.textContent='⬇';ar.style.left=(card.left+card.width/2-14)+'px';ar.style.top=(card.bottom-46)+'px';return;}if(r.bottom<card.top+10){ar.className='tutArrow down';ar.textContent='⬆';ar.style.left=(card.left+card.width/2-14)+'px';ar.style.top=(card.top+4)+'px';return;}
    if(r.left>70){ar.className='tutArrow right';ar.textContent='➜';ar.style.left=(r.left-46)+'px';ar.style.top=(r.top+r.height/2-22)+'px';}else{ar.className='tutArrow down';ar.textContent='⬇';ar.style.left=(r.left+r.width/2-14)+'px';ar.style.top=(r.top-44)+'px';}}
  function loop(now){if(!active)return;draw(now);arrow();raf=requestAnimationFrame(loop);}
  function finish(completed){active=false;Tut_doneMem=true;cancelAnimationFrame(raf);$('tut').classList.add('hidden');$('tutArrow').style.display='none';try{localStorage.setItem('sm_tut_done','1');if(completed)localStorage.setItem('sm_howto','1');}catch(e){}const f=onDone;onDone=null;if(f)f();}
  function start(done){onDone=done||null;reset();if(!sheet){sheet=new Image();sheet.onload=()=>{for(const k in cache)delete cache[k];if(active)card();};sheet.src=ASSET_TEX.sprites;}
    $('tut').classList.remove('hidden');active=true;$('tutSkip').onclick=()=>finish(false);card();raf=requestAnimationFrame(loop);try{Music.start();Music.setMode('peace');}catch(e){}}
  return{start,get active(){return active;}};
})();
