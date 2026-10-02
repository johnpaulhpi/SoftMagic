/* ---------- isometric map (Kenney tiles + pre-rendered kits) ---------- */
const ISO=(()=>{
  const TW=128,TH=64;const CW=W*2,CH=H*2;let atlas=null,sheet=null,ready=false;const tinted={},charCache={};
  let overview=null,overviewZ=0.25,overviewVer=-1,overviewSets='';let cells=null,cellsVer=-1,cellsSets='';
  function hash(x,y,s){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul((s||0)+1,1274126177))|0;h=Math.imul(h^(h>>>13),1274126177);h=Math.imul(h^(h>>>16),2246822519);h=(h^(h>>>13))>>>0;return h/4294967296;}
  function load(){return new Promise(res=>{let n=0;const done=()=>{if(++n===2){ready=true;res();}};atlas=new Image();atlas.onload=done;atlas.onerror=done;atlas.src=ISO_ATLAS;sheet=new Image();sheet.onload=done;sheet.onerror=done;sheet.src=ASSET_TEX.sprites;});}
  /* cell data: ground tile name, elevation (px), water flag, deco sprite, built flag */
  let builtMask=null;
  function waterCell(cx,cy){const tx=cx>>1,ty=cy>>1;const i=idx(tx,ty);const t=S.terrain[i];if(t===TR.OCEAN||t===TR.LAKE)return true;if(t===TR.GRAVE&&!S.river[i]&&!(builtMask&&builtMask[cy*CW+cx])&&hash(cx,cy,31)<0.13)return true;if(!S.river[i]||t===TR.MOUNTAIN)return false;const sx=cx&1,sy=cy&1;if(sx===1&&sy===1)return true;const isW=(x,y)=>inb(x,y)&&(S.river[idx(x,y)]||S.terrain[idx(x,y)]===TR.OCEAN||S.terrain[idx(x,y)]===TR.LAKE);if(sx===0&&sy===1&&isW(tx-1,ty))return true;if(sx===1&&sy===0&&isW(tx,ty-1))return true;return false;}
  const BLK=52;let hmap=null;
  let nearSet=null;const HMAX=20;
  function biomeBase(tx,ty){const i=idx(tx,ty);const t=S.terrain[i];const reg=S.region[i];
    if(t===TR.LAKE)return 1;if(t===TR.OCEAN)return 2;if(t===TR.GRAVE)return 2.4;if(t===TR.BARRENS)return reg===4?2.6:3.2;if(t===TR.MARSH)return 3;if(t===TR.MIST)return 3;if(t===TR.FIELDS)return 3.5;
    if(t===TR.WOODS)return 4.6;if(t===TR.FOREST)return reg===1?6.2:5.6;if(t===TR.HILLS)return 7.6;
    if(t===TR.MOUNTAIN){const spine=Math.pow(Math.max(0,Math.min(1,1-ty/11)),1.6);return 11+8*spine;}
    if(t===TR.DEEPS)return 13;return 3;}
  function smoothNoise(cx,cy,seed){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)n+=hash(cx+dx,cy+dy,seed);return n/9-0.5;}
  function buildHeights(){hmap=new Int8Array(CW*CH);nearSet=new Uint8Array(CW*CH);
    const isWaterT=t=>t===TR.OCEAN||t===TR.LAKE;
    let base=new Float32Array(W*H);for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)base[ty*W+tx]=biomeBase(tx,ty);
    for(let pass=0;pass<2;pass++){const nb=new Float32Array(W*H);for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const i=ty*W+tx;if(isWaterT(S.terrain[i])){nb[i]=base[i];continue;}let s=0,wsum=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=tx+dx,y=ty+dy;if(!inb(x,y))continue;const w=(dx===0?2:1)*(dy===0?2:1);s+=base[y*W+x]*w;wsum+=w;}nb[i]=s/wsum;}base=nb;}
    for(let cy=0;cy<CH;cy++)for(let cx=0;cx<CW;cx++){const tx=cx>>1,ty=cy>>1;const i=idx(tx,ty);const t=S.terrain[i];let h=base[ty*W+tx];
      const amp=t===TR.MOUNTAIN?3.4:t===TR.HILLS?1.9:t===TR.DEEPS?1.5:t===TR.FOREST?0.8:t===TR.WOODS?0.6:t===TR.FIELDS?0.3:isWaterT(t)?0:0.25;
      h+=smoothNoise(cx,cy,21)*2*amp;
      if(t===TR.MOUNTAIN){h+=(hash(cx,cy,26)-0.5)*1.2;}
      if(isWaterT(t))h=biomeBase(tx,ty);
      let hi=Math.round(h);if(hi<1)hi=1;if(hi>HMAX)hi=HMAX;
      if(S.river[i]&&!isWaterT(t)&&waterCell(cx,cy))hi=Math.max(1,hi-1);else if(t===TR.GRAVE&&waterCell(cx,cy))hi=Math.max(1,hi-1);
      hmap[cy*CW+cx]=hi;}
    for(const s of S.settlements){if(s.status==='sundered')continue;const f=footprint(s);let m=99;for(let y=f.y0;y<=f.y1;y++)for(let x=f.x0;x<=f.x1;x++){if(x<0||y<0||x>=CW||y>=CH)continue;if(waterCell(x,y))continue;m=Math.min(m,hmap[y*CW+x]);}if(m===99)m=3;if(m<2)m=2;
      for(let y=f.y0-1;y<=f.y1+1;y++)for(let x=f.x0-1;x<=f.x1+1;x++){if(x<0||y<0||x>=CW||y>=CH)continue;if(waterCell(x,y))continue;hmap[y*CW+x]=m;}
      for(let y=f.y0-3;y<=f.y1+3;y++)for(let x=f.x0-3;x<=f.x1+3;x++){if(x<0||y<0||x>=CW||y>=CH)continue;nearSet[y*CW+x]=1;}}}
  function hAt(cx,cy){if(cx<0||cy<0||cx>=CW||cy>=CH)return 0;return hmap[cy*CW+cx];}
  function footprint(s){const cx=s.x*2,cy=s.y*2;const big=s.type==='capital'||s.type==='fortress';const mid=s.type==='town';const r=big?2:mid?1:0;return{x0:cx-r,y0:cy-r,x1:cx+1+r,y1:cy+1+r};}
  function buildCells(){cells=new Array(CW*CH);const built=new Uint8Array(CW*CH);for(const s of S.settlements){if(s.status==='sundered')continue;const f=footprint(s);for(let y=f.y0;y<=f.y1;y++)for(let x=f.x0;x<=f.x1;x++){if(x<0||y<0||x>=CW||y>=CH)continue;const tx=x>>1,ty=y>>1;const t=S.terrain[idx(tx,ty)];if(t===TR.OCEAN||t===TR.LAKE||t===TR.MIST||t===TR.DEEPS)continue;if(S.river[idx(tx,ty)]&&(tx!==s.x||ty!==s.y))continue;built[y*CW+x]=1;}}builtMask=built;buildHeights();
    for(let cy=0;cy<CH;cy++)for(let cx=0;cx<CW;cx++){const tx=cx>>1,ty=cy>>1;const i=idx(tx,ty);const t=S.terrain[i];const reg=S.region[i];const o=S.owner?S.owner[i]:0;const dev=S.dev?S.dev[i]:0;const w=waterCell(cx,cy);const b=built[cy*CW+cx];const r1=hash(cx,cy,1),r2=hash(cx,cy,2),r3=hash(cx,cy,3);
      let ground='grass',elev=0,deco=null,dscale=1;const hh=hAt(cx,cy);let blockTile='sk_grass_block',top=null,slope=null;const ns=nearSet[cy*CW+cx];
      const SNOW=17;
      if(w){ground=t===TR.GRAVE&&!S.river[i]?'waterSwamp':'water';if(t===TR.GRAVE&&!S.river[i]&&!b&&r1<0.7)deco='pr_lily_large';}
      else if(t===TR.MOUNTAIN){const snowy=hh>=SNOW;ground=snowy?'grassSnow':'grassStone';blockTile=snowy?'blk_snow':'blk_stone';const isTop=hh>=hAt(cx+1,cy)&&hh>=hAt(cx-1,cy)&&hh>=hAt(cx,cy+1)&&hh>=hAt(cx,cy-1);if(isTop&&!b&&!ns&&hh>=18&&r1<0.6)top='peakSnow';else if(isTop&&!b&&!ns&&hh>=13&&hh<SNOW&&r1<0.25)top='peakStone';if(!b&&!top&&!snowy){if(r2<0.3)deco='pr_stone_tallB';else if(r2<0.42)deco='pr_stone_smallA';else if(r2<0.5)deco='pr_stone_tallA';}else if(!b&&!top&&snowy&&r2<0.12)deco='pr_stone_smallA';}
      else if(t===TR.DEEPS){ground='grassStone';blockTile='blk_deeps';if(!b&&r1<0.5)deco='pr_template-wall_dark';}
      else if(t===TR.HILLS){ground='grass';if(!b&&r2<0.15)deco=r3<0.5?'pr_stone_smallA':'pr_rock_smallB';else if(!b&&r2<0.35)deco='pr_grass_large';}
      else if(t===TR.FOREST){ground=reg===1?'grassOld':'grassForest';if(!b){const names=reg===0?['pr_tree_pineTallA','pr_tree_pineDefaultA','sk_tree_pine']:reg===1?['pr_tree_default_dark','pr_tree_oak_dark','pr_tree_tall']:['pr_tree_oak','pr_tree_default','pr_tree_detailed'];if(r1<0.85)deco=names[(r2*3)|0];dscale=1.15+r3*0.35;}}
      else if(t===TR.WOODS){ground='grassForest';if(!b){if(r1<0.5){const names=reg===0?['pr_tree_pineDefaultA','sk_tree_pine']:['pr_tree_simple','pr_tree_oak','pr_tree_default'];deco=names[(r2*names.length)|0];dscale=1.05+r3*0.3;}else if(r1<0.65)deco='pr_grass_large';}}
      else if(t===TR.FIELDS){ground=['grass','grass2','grass3'][(r1*3)|0];if(!b){if(r2<0.12)deco='pr_grass_large';else if(r2<0.16)deco=r3<0.5?'pr_flower_yellowA':'pr_flower_purpleA';}}
      else if(t===TR.MARSH){ground='grassMarsh';if(!b){if(r1<0.35)deco='pr_lily_large';else if(r1<0.6)deco='pr_plant_flatTall';else if(r1<0.68)deco='pr_mushroom_redGroup';}}
      else if(t===TR.BARRENS){const south=reg===4;ground=south?(r1<0.55?'dirtDark':'dirt2'):(r1<0.5?'dirt':'dirt2');if(!b){if(south&&r2<0.14)deco='pr_plant_flatTall';else if(r2<0.22)deco='pr_stump_old';else if(r2<0.3)deco='pr_rock_smallB';else if(south&&r2<0.34)deco='pr_mushroom_redGroup';}}
      else if(t===TR.GRAVE){ground=r1<0.3?'dirtDark':'grassSwamp';if(!b){if(r2<0.1){deco=r3<0.5?'pr_tree_default_dark':'pr_tree_simple';dscale=1.05+r3*0.3;}else if(r2<0.3)deco='pr_plant_flatTall';else if(r2<0.36)deco='pr_mushroom_redGroup';else if(r2<0.5){const names=['pr_statue_obelisk','pr_stone_tallA','pr_statue_column','pr_stone_tallB'];deco=names[(r3*4)|0];}else if(r2<0.53)deco='pr_statue_head';}}
      else if(t===TR.MIST){ground='grassMist';elev=6;}
      if(!w&&!b&&dev&&o){if(o===3){ground=r1<0.5?'sk_furrow_cropWheat':'sk_furrow_crop';deco=null;}else if(o===2){deco=r1<0.5?'pr_tree_fat_fall':'pr_tree_detailed_fall';dscale=1.2;}else if(o===1&&(cx&1)&&(cy&1)){deco='pr_gate-rock';dscale=0.9;}}
      elev=hh*BLK;

      const hr=w?hh:hAt(cx+1,cy),hl=w?hh:hAt(cx,cy+1);const from=Math.max(1,Math.min(Math.min(hr,hl)+1,hh));
      const blockLow=blockTile==='blk_snow'?'blk_stone':null;
      let shore=false;if(!w&&hh<=4){for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=CW||ny>=CH)continue;const nt=S.terrain[idx(nx>>1,ny>>1)];if(nt===TR.OCEAN||nt===TR.LAKE){shore=true;break;}}}if(shore&&!b&&(t===TR.FIELDS||t===TR.WOODS||t===TR.HILLS||t===TR.MARSH)){ground='sand';deco=null;}
      cells[cy*CW+cx]={ground,elev,w,deco,dscale,b,h:hh,blockTile,blockLow,top,slope,from};}
    cellsVer=S.terrainVersion;cellsSets=setsKey();}
  function setsKey(){return S.settlements.map(s=>s.id+':'+s.status).join(',');}
  /* settlement layouts: list of [cx,cy,sprite,dy,scale] */
  function layout(s){const out=[];const cx=s.x*2,cy=s.y*2;const st=s.status;const f=footprint(s);const at=(x,y,n,dy,sc)=>{out.push([x,y,n,dy||0,sc||1]);};const BH=52;
    const house=(x,y,roof,beige)=>{at(x,y,beige?'sk_building_stackBeige':'sk_building_stack',0);at(x,y,roof,-BH);};
    const tower=(x,y,col,tall)=>{at(x,y,'sk_castle_tower'+col+'Base',0);if(tall)at(x,y,'sk_castle_tower'+col+'Base',-BH);at(x,y,'sk_castle_tower'+col+'Top',-BH*(tall?2:1));};
    if(st==='sundered')return out;if(st==='sealed'){at(cx,cy,'sk_cliff',0);at(cx+1,cy,'sk_cliff',0);at(cx,cy+1,'pr_gate-metal-bars',0,1.2);at(cx+1,cy+1,'pr_template-wall',0);return out;}
    if(st==='ruined'){at(cx,cy,'sk_castle_endRuined',0);at(cx+1,cy+1,'pr_wall-broken',0);at(cx+1,cy,'pr_rock_smallB',0);return out;}
    const race=s.race;const orc=s.faction==='orcs';
    if(race==='dwarf'){const big=s.type==='capital';if(big){for(let x=f.x0;x<=f.x1;x++)for(let y=f.y0;y<=f.y1;y++){const edge=x===f.x0||x===f.x1||y===f.y0||y===f.y1;if(edge&&!(x===cx&&y===f.y1)&&!(x===cx+1&&y===f.y1))at(x,y,(x+y)%3?'sk_cliff':'sk_cliff_corner',0);}at(cx,cy,'sk_cliff_entrance',0);at(cx+1,cy,'sk_cliff',0);at(cx,cy+1,'sk_castle_towerBrownBase',0);at(cx,cy+1,'sk_castle_towerBrownTop',-BH);at(cx+1,cy+1,'pr_banner-red',0);at(cx-1,cy+1,'pr_rock_tallB',0);at(cx+2,cy+1,'pr_rock_tallA',0);}
      else{at(cx,cy,'sk_cliff_entrance',0);at(cx+1,cy,'pr_rock_tallB',0);at(cx,cy+1,'pr_rock_smallB',0);at(cx+1,cy+1,'pr_stone_tallB',0);}}
    else if(race==='highelf'||race==='woodelf'){if(s.type==='glade'){at(cx,cy,'sk_tree_pineLarge',0);at(cx+1,cy,'pr_tree_detailed',0,1.2);at(cx,cy+1,'pr_campfire_stones',0);at(cx+1,cy+1,'pr_tree_oak',0,1.2);}
      else{const big=s.type==='capital';if(big){for(let x=f.x0;x<=f.x1;x++)for(let y=f.y0;y<=f.y1;y++){const edge=x===f.x0||x===f.x1||y===f.y0||y===f.y1;if(!edge)continue;const corner=(x===f.x0||x===f.x1)&&(y===f.y0||y===f.y1);if(corner)tower(x,y,'Green',true);else if(hash(x,y,5)<0.5)at(x,y,'sk_tree_pine',0);else at(x,y,'pr_tree_detailed',0,1.2);}tower(cx,cy,'Green',true);tower(cx+1,cy+1,'Green',false);at(cx+1,cy,'pr_fountain-round',0);house(cx,cy+1,'sk_roof_roundCornerGreen');at(cx-1,cy,'pr_banner-green',0);house(cx+2,cy,'sk_roof_roundCornerBeige',true);house(cx-1,cy+1,'sk_roof_roundCornerGreen');}
        else{tower(cx,cy,'Green',s.type==='haven');at(cx+1,cy,'sk_tree_pine',0);at(cx,cy+1,'pr_tree_detailed',0,1.2);house(cx+1,cy+1,'sk_roof_roundCornerGreen');}}}
    else if(orc){if(s.type==='fortress'){for(let x=f.x0;x<=f.x1;x++)for(let y=f.y0;y<=f.y1;y++){const edge=x===f.x0||x===f.x1||y===f.y0||y===f.y1;if(!edge)continue;const corner=(x===f.x0||x===f.x1)&&(y===f.y0||y===f.y1);if(corner)tower(x,y,'Purple',true);else if(x===cx&&y===f.y1)at(x,y,'pr_gate',0,1.1);else at(x,y,'sk_castle_end',0);}tower(cx,cy,'Purple',true);tower(cx+1,cy+1,'Purple',false);at(cx+1,cy,'pr_banner-red',0);at(cx,cy+1,'pr_campfire_stones',0);at(cx-1,cy,'pr_tent_detailedClosed',0);at(cx+2,cy+1,'pr_statue_head',0);}
      else{at(cx,cy,'pr_tent_smallOpen',0);at(cx+1,cy,'pr_tent_detailedClosed',0);at(cx,cy+1,'pr_campfire_stones',0);at(cx+1,cy+1,'pr_statue_head',0);}}
    else{const wood=s.faction==='vale';const big=s.type==='capital';
      if(big){for(let x=f.x0;x<=f.x1;x++)for(let y=f.y0;y<=f.y1;y++){const edge=x===f.x0||x===f.x1||y===f.y0||y===f.y1;if(!edge)continue;const corner=(x===f.x0||x===f.x1)&&(y===f.y0||y===f.y1);if(corner)tower(x,y,'Brown',false);else if(x===cx&&y===f.y1)at(x,y,'sk_castle_endRound',0);else at(x,y,'sk_castle_end',0);}
        tower(cx,cy,'Beige',true);house(cx+1,cy,'sk_roof_gableCornerBrown');house(cx,cy+1,'sk_roof_gableCornerPurple',true);house(cx+1,cy+1,'sk_roof_gableCornerBeige');house(cx-1,cy,'sk_roof_slantCornerBrown');house(cx+2,cy+1,'sk_roof_gableCornerBrown',true);house(cx-1,cy+1,'sk_roof_roundCornerBrown');house(cx+2,cy,'sk_roof_gableCornerGreen');at(cx,cy-1,'sk_well',0);at(cx+1,cy-1,'pr_banner-green',0);at(cx-1,cy-1,'pr_stall',0);at(cx+2,cy-1,'pr_lantern',0);at(cx,cy+2,'pr_fountain-round',0);at(cx+1,cy+2,'pr_lantern',0);}
      else if(s.type==='town'){house(cx,cy,'sk_roof_gableCornerBrown');house(cx+1,cy,wood?'sk_roof_gableCornerGreen':'sk_roof_gableCornerBeige',!wood);house(cx,cy+1,'sk_roof_roundCornerBrown');at(cx+1,cy+1,'sk_well',0);house(cx-1,cy,'sk_roof_slantCornerBrown');house(cx+2,cy+1,'sk_roof_gableCornerBrown',true);at(cx-1,cy+1,'sk_fence_wood',0);at(cx+2,cy,'pr_lantern',0);at(cx,cy-1,'sk_fence_woodCorner',0);at(cx+1,cy-1,'pr_stall',0);if(S.river[idx(s.x,s.y)])at(cx-1,cy-1,'pr_watermill',0);else at(cx-1,cy-1,'sk_tree_pine',0);at(cx+2,cy-1,'pr_tree_oak',0,1.1);at(cx,cy+2,'sk_furrow_cropWheat',0);at(cx+1,cy+2,'sk_furrow_crop',0);}
      else{house(cx,cy,wood?'sk_roof_gableCornerGreen':'sk_roof_gableCornerBrown');house(cx+1,cy+1,wood?'sk_roof_slantCornerGreen':'sk_roof_gableCornerBeige',!wood);at(cx+1,cy,s.type==='dcamp'?'pr_tent_smallOpen':'sk_fence_wood',0);at(cx,cy+1,s.type==='dcamp'?'pr_campfire_stones':'sk_furrow_crop',0);}}
    if(st==='fallen'){at(cx,cy-1,'pr_banner-red',0);at(cx+1,cy+2,'pr_campfire_stones',0);}
    if(st==='besieged'){const r=Math.max(f.x1-cx,2)+1;for(const[dx,dy]of[[-r,-1],[r+1,0],[0,r+1],[1,-r],[-r,r],[r+1,r+1]])at(cx+dx,cy+dy,(dx+dy)%2?'pr_tent_smallOpen':'pr_tent_detailedClosed',0);at(cx-r,cy+1,'pr_campfire_stones',0);at(cx+r+1,cy-1,'pr_campfire_stones',0);}
    return out;}
  let setSprites=new Map();function buildSettlements(){setSprites=new Map();for(const s of S.settlements){for(const it of layout(s)){const[x,y]=it;if(x<0||y<0||x>=CW||y>=CH)continue;const k=y*CW+x;(setSprites.get(k)||setSprites.set(k,[]).get(k)).push(it);}}}
  /* projection: view.px/py = screen position of cell (0,0) center; zoom scales */
  function toScreenC(u,v){const z=view.zoom;return[view.px+(u-v)*(TW/2)*z,view.py+(u+v)*(TH/2)*z];}
  function toCell(sx,sy){const z=view.zoom;const a=(sx-view.px)/((TW/2)*z),b=(sy-view.py)/((TH/2)*z);return[(a+b)/2,(b-a)/2];}
  function sprite(name,tint){const r=ISO_RECTS[name];if(!r)return null;if(!tint)return{img:atlas,r};const k=name+'|'+tint;if(tinted[k])return tinted[k];const c=document.createElement('canvas');c.width=r[2];c.height=r[3];const g=c.getContext('2d');g.drawImage(atlas,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);g.globalCompositeOperation='source-atop';g.fillStyle=tint;g.fillRect(0,0,r[2],r[3]);tinted[k]={img:c,r:[0,0,r[2],r[3],r[4],r[5]]};return tinted[k];}
  function drawSprite(ctx,name,sx,sy,z,scale,tint){const sp=sprite(name,tint);if(!sp)return;const r=sp.r;const sc=z*(scale||1);const dx=Math.round(sx-r[4]*sc),dy=Math.round(sy-r[5]*sc);ctx.drawImage(sp.img,r[0],r[1],r[2],r[3],dx,dy,Math.ceil(r[2]*sc)+0.6,Math.ceil(r[3]*sc)+0.6);}
  /* draw a region of cells with painter's order; pos(u,v) gives screen coords for cell centers */
  function drawCells(ctx,x0,y0,x1,y1,pos,z,withDeco,people){x0=Math.max(0,x0);y0=Math.max(0,y0);x1=Math.min(CW-1,x1);y1=Math.min(CH-1,y1);
    for(let d=x0+y0;d<=x1+y1;d++){for(let cx=Math.max(x0,d-y1);cx<=Math.min(x1,d-y0);cx++){const cy=d-cx;const c=cells[cy*CW+cx];if(!c)continue;const[sx,sy0]=pos(cx+0.5,cy+0.5);const sy=sy0-c.elev*z;
        if(c.w){for(let k=c.from;k<=c.h;k++)drawSprite(ctx,'sk_grass_block',sx,sy0-(k-1)*BLK*z,z);drawSprite(ctx,c.ground,sx,sy,z);}
        else{for(let k=c.from;k<=c.h;k++)drawSprite(ctx,(c.blockLow&&k<17)?c.blockLow:c.blockTile,sx,sy0-(k-1)*BLK*z,z);if(c.h===0||!(c.ground==='grass'&&c.blockTile==='sk_grass_block'))drawSprite(ctx,c.ground,sx,sy,z);if(c.top)drawSprite(ctx,c.top,sx,sy,z);}
        if(withDeco){const sl=setSprites.get(cy*CW+cx);if(sl){for(const it of sl)drawSprite(ctx,it[2],sx,sy+it[3]*z,z,it[4]);}else if(c.deco)drawSprite(ctx,c.deco,sx,sy,z,c.dscale);}
        if(people){const list=people.get(cy*CW+cx);if(list)for(const p of list)drawPerson(ctx,p,pos,z,c.elev);}}}}
  function buildOverview(){overviewZ=innerWidth<=980?0.125:0.25;const z=overviewZ;const w=Math.ceil((CW+CH)*(TW/2)*z)+TW*z,h=Math.ceil((CW+CH)*(TH/2)*z)+1400*z;overview=document.createElement('canvas');overview.width=w;overview.height=h;const g=overview.getContext('2d');g.imageSmoothingEnabled=true;const ox=CH*(TW/2)*z+TW/2*z,oy=1200*z;const pos=(u,v)=>[ox+(u-v)*(TW/2)*z,oy+(u+v)*(TH/2)*z];overview.ox=ox;overview.oy=oy;drawCells(g,0,0,CW-1,CH-1,pos,z,true,null);overviewVer=S.terrainVersion;overviewSets=setsKey();}
  /* characters */
  const SH=17;function cell16(ctx,c,r){ctx.drawImage(sheet,c*SH,r*SH,16,16,0,0,16,16);}
  function lookKey(c){return[c.race,c.faction,c.role,c.hero?1:0,c.id===S.sword.holder?1:0,c.sick?1:0,c.sex,(c.id*7)%3].join('|');}
  function charImg(c){const key=lookKey(c);if(charCache[key])return charCache[key];const cv2=document.createElement('canvas');cv2.width=16;cv2.height=16;const ctx=cv2.getContext('2d');ctx.imageSmoothingEnabled=false;const v=(c.id*7)%3;
    const skinRow=c.race==='dwarf'?(v?1:2):c.race==='human'?(v===2?2:v):(c.race==='orc'||c.race==='goblin')?3:0;cell16(ctx,c.sex==='f'?1:0,skinRow);
    const f=c.faction;const clothes={dwarves:[6,0],elves:[10,0],city:[6,4],vale:[6,5],orcs:[10,5],goblins:[14,0]}[f]||[10,4];
    if(c.role==='warrior'||c.role==='captain'||c.role==='general'||c.role==='ranger'||c.hero)cell16(ctx,f==='elves'?12:f==='dwarves'?7:9,c.hero?0:f==='city'?4:f==='vale'?5:0);else if(c.role==='priest'||c.role==='scholar'||c.role==='envoy')cell16(ctx,14,4);else if(c.role==='leader'||c.role==='darklord')cell16(ctx,c.role==='darklord'?14:8,c.role==='darklord'?7:3);else cell16(ctx,clothes[0],clothes[1]);
    if(c.race==='dwarf'){cell16(ctx,v?24:19,v?0:1);cell16(ctx,v?24:21,2);}else if(c.race==='highelf'){cell16(ctx,19,4);}else if(c.race==='woodelf'){cell16(ctx,v?21:19,v?4:0);}else if(c.race==='human'){cell16(ctx,[19,20,25][v],[0,1,0][v]);if(c.sex==='m'&&v===1)cell16(ctx,21,6);}
    if(c.role==='warrior'||c.role==='captain'||c.role==='general')cell16(ctx,28+(v%2),0);else if(c.role==='priest')cell16(ctx,28,1);else if(c.role==='scholar'||c.role==='envoy')cell16(ctx,29,2);else if(c.role==='leader')cell16(ctx,28,7);else if(c.role==='darklord')cell16(ctx,30,6);else if(c.role==='chieftain'||c.role==='goblinking')cell16(ctx,c.role==='goblinking'?29:28,c.role==='goblinking'?7:6);else if(c.hero)cell16(ctx,31,3);
    if(c.id===S.sword.holder)cell16(ctx,46,6);else if(c.role==='warrior'||c.role==='captain'||c.hero||c.role==='general')cell16(ctx,44,6);else if(c.role==='priest'||c.role==='scholar')cell16(ctx,43,0);else if(c.role==='chieftain'||c.role==='goblin')cell16(ctx,47,1);
    if(c.sick){ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(120,220,120,0.35)';ctx.fillRect(0,0,16,16);}
    charCache[key]=cv2;return cv2;}
  function personPos(c,t){const s=(!c.party)?settlementAt(S,c.x,c.y):null;if(s){const f=footprint(s);const w=f.x1-f.x0+1,h=f.y1-f.y0+1;const u=f.x0+((c.id*13)%w)+0.2+hash(c.id,1,7)*0.6,v=f.y0+((c.id*7)%h)+0.2+hash(c.id,2,7)*0.6;return[u,v];}const[wx,wy]=charPos(c,t);return[wx*2,wy*2];}
  function drawPerson(ctx,p,pos,z,elev,zs){const c=p.c;const[sx,sy0]=pos(p.u,p.v);const sy=sy0-elev*z;const big=c.hero||c.id===S.sword.holder||c.role==='leader'||c.role==='darklord';const sc=(zs||z)*(big?3.2:2.6);const img=charImg(c);
    ctx.save();ctx.globalAlpha=0.35;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx,sy,8*sc/2.6,3.5*sc/2.6,0,0,6.283);ctx.fill();ctx.restore();
    if(c.id===S.sword.holder){ctx.save();ctx.globalAlpha=0.5;ctx.fillStyle='#f4e2a6';ctx.beginPath();ctx.ellipse(sx,sy,12*sc/2.6,5*sc/2.6,0,0,6.283);ctx.fill();ctx.restore();}
    if(c.id===sel.char||c===hoverChar){ctx.strokeStyle='#f4e2a6';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy,11*sc/2.6,4.5*sc/2.6,0,0,6.283);ctx.stroke();}
    ctx.imageSmoothingEnabled=false;ctx.drawImage(img,sx-8*sc,sy-16*sc+2*sc,16*sc,16*sc);ctx.imageSmoothingEnabled=true;
    if(c.hero){ctx.fillStyle='#f4e2a6';ctx.font=`${Math.round(10*z)+4}px serif`;ctx.textAlign='center';ctx.fillText('★',sx,sy-16*sc-2);}}
  function drawSwordLying(ctx,pos,z){const sw=S.sword;if(sw.holder)return;const[sx,sy0]=pos(sw.x*2+1,sw.y*2+1);const c=cells[(sw.y*2+1)*CW+sw.x*2+1];const sy=sy0-(c?c.elev:0)*z;const pulse=0.5+0.3*Math.sin(performance.now()/400);ctx.save();ctx.globalAlpha=pulse;ctx.fillStyle='#f4e2a6';ctx.beginPath();ctx.ellipse(sx,sy,18*z+6,8*z+3,0,0,6.283);ctx.fill();ctx.restore();const cv2=document.createElement('canvas');cv2.width=16;cv2.height=16;const g=cv2.getContext('2d');g.imageSmoothingEnabled=false;cell16(g,46,6);ctx.imageSmoothingEnabled=false;ctx.drawImage(cv2,sx-8*z*2.6,sy-16*z*2.6,16*z*2.6,16*z*2.6);ctx.imageSmoothingEnabled=true;}
  /* main draw */
  function draw(ctx,t){if(!ready)return;if(!cells||cellsVer!==S.terrainVersion||cellsSets!==setsKey()){buildCells();buildSettlements();}
    const z=view.zoom;const live=z>=overviewZ*1.6;
    if(!live){if(!overview||overviewVer!==S.terrainVersion||overviewSets!==setsKey())buildOverview();const s=z/overviewZ;ctx.imageSmoothingEnabled=true;ctx.drawImage(overview,view.px-overview.ox*s,view.py-overview.oy*s,overview.width*s,overview.height*s);}
    const people=new Map();for(const c of S.chars){if(!c.alive)continue;const[u,v]=personPos(c,t);const cx=Math.floor(u),cy=Math.floor(v);if(cx<0||cy<0||cx>=CW||cy>=CH)continue;const k=cy*CW+cx;(people.get(k)||people.set(k,[]).get(k)).push({c,u,v});}
    for(const[k,list]of people)list.sort((a,b)=>(a.u+a.v)-(b.u+b.v));
    const corners=[toCell(0,0),toCell(cw,0),toCell(0,ch),toCell(cw,ch)];const us=corners.map(c=>c[0]),vs=corners.map(c=>c[1]);const x0=Math.floor(Math.min(...us))-2,x1=Math.ceil(Math.max(...us))+18,y0=Math.floor(Math.min(...vs))-2,y1=Math.ceil(Math.max(...vs))+18;
    if(live)drawCells(ctx,x0,y0,x1,y1,toScreenC,z,true,people);
    else{for(let d=x0+y0;d<=x1+y1;d++)for(let cx=Math.max(Math.max(0,x0),d-Math.min(CH-1,y1));cx<=Math.min(Math.min(CW-1,x1),d-Math.max(0,y0));cx++){const cy=d-cx;const list=people.get(cy*CW+cx);if(list){const c=cells[cy*CW+cx];for(const p of list)drawPerson(ctx,p,toScreenC,z,c?c.elev:0,Math.max(z,0.3));}}}
    drawSwordLying(ctx,toScreenC,z);
    if(sel.tile){const[tx,ty]=sel.tile;const c=cells[(ty*2)*CW+tx*2];const e=(c?c.elev:0)*z;const pts=[toScreenC(tx*2,ty*2),toScreenC(tx*2+2,ty*2),toScreenC(tx*2+2,ty*2+2),toScreenC(tx*2,ty*2+2)];ctx.strokeStyle='rgba(244,226,166,0.9)';ctx.lineWidth=2;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y-e):ctx.moveTo(x,y-e));ctx.closePath();ctx.stroke();}
    drawIsoLabels(ctx,z);}
  function drawIsoLabels(ctx,z){ctx.font=`${Math.max(10,Math.round(11*Math.min(1.6,z*1.4)))}px Cinzel, Georgia, serif`;ctx.textAlign='center';for(const s of S.settlements){if(s.status==='sundered')continue;if(z<0.5&&s.type!=='capital'&&s.type!=='fortress'&&s.type!=='town')continue;if(z<0.2&&s.type!=='capital'&&s.type!=='fortress')continue;const f=footprint(s);const[sx,sy]=toScreenC(s.x*2+1,f.y0);const c=cells[(f.y0)*CW+(s.x*2)];const y=sy-(c?c.elev:0)*z-(s.type==='capital'||s.type==='fortress'?110:60)*z;if(sx<-80||sx>cw+80||y<-20||y>ch+20)continue;const txt=(s.type==='capital'||s.type==='fortress'?'♛ ':'')+s.name;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,0.85)';ctx.strokeText(txt,sx,y);ctx.fillStyle=FACTIONS[s.faction].color;ctx.fillText(txt,sx,y);}}
  function pickChar(sx,sy){let best=null,bd=1e9;const t=1;for(const c of S.chars){if(!c.alive)continue;const[u,v]=personPos(c,t);const cx=Math.floor(u),cy=Math.floor(v);const cell=cells&&cells[cy*CW+cx];const[px,py0]=toScreenC(u,v);const py=py0-(cell?cell.elev:0)*view.zoom;const sc=view.zoom*2.6;const dx=sx-px,dy=sy-(py-8*sc);if(Math.abs(dx)<9*sc&&Math.abs(dy)<9*sc){const d=Math.hypot(dx,dy);if(d<bd){bd=d;best=c;}}}return best;}
  function mapBounds(){const z=view.zoom;return{w:(CW+CH)*(TW/2)*z,h:(CW+CH)*(TH/2)*z+1400*z,left:view.px-CH*(TW/2)*z,top:view.py-1200*z};}
  function fit(){const z=Math.min(cw/((CW+CH)*(TW/2)),ch/((CW+CH)*(TH/2)+1100))*0.98;view.zoom=Math.max(0.05,z);view.px=cw/2;view.py=(ch-((CW+CH)*(TH/2)+900)*view.zoom)/2+900*view.zoom;}
  return{blit(ctx,name,x,y,sc){const r=ISO_RECTS[name];if(!r||!atlas)return;ctx.drawImage(atlas,r[0],r[1],r[2],r[3],x-r[4]*sc,y-r[5]*sc,r[2]*sc,r[3]*sc);},charImg,cellInfo(x,y){const c=cells&&cells[y*CW+x];return c?`${c.h}${c.w?'w':''}:${c.ground.slice(0,6)}:${c.blockTile.slice(0,6)}:f${c.from}`:'-';},load,draw,pickChar,toScreenC,toCell,fit,mapBounds,get ready(){return ready;},reset(){cells=null;overview=null;cellsVer=-1;overviewVer=-1;},footprint};
})();
