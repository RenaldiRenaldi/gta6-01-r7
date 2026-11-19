import {districts,seasons,radio,crews,debts,jobs,units,fresh,sample,money,progress,position,limits,names,rank} from './data.js';
import {draw,drawMap,drawInset} from './art.js';

const screen = document.querySelector('#screen'), overlay = document.querySelector('#overlay');
const read = (key,fallback) => { try { return JSON.parse(localStorage.getItem('solmara.'+key)) ?? fallback; } catch { return fallback; } };
const write = (key,value) => localStorage.setItem('solmara.'+key,JSON.stringify(value));
const slots = read('slots',[null,null,null]);
const options = {...{music:45,sfx:65,quality:3,hud:'CLASSIC'},...read('options',{})};
const sceneShot = new URLSearchParams(location.search).get('shot');
const shot = ['hero','market','stats','title'].includes(sceneShot) ? sceneShot : '';
if(shot) options.hud='CLASSIC';
const showcaseSlots = [sample(),{...sample(),debt:6,cash:5420,bank:22300,elapsed:10842},null];
let s = shot ? sample() : fresh();
let scene = shot || 'title', previous = 'title', mode = '', pane = '', slot = 0, roaming = false, active = false;
let tip = '', nextMessage = 0, frame = 0, lastNoise = -1000, lastAction = 0, selected = 0, audio, phone='JEPRET';
let challenge=null, focusHeld=false;
let mapTarget = null;
const keys = new Set();
if(shot==='hero') Object.assign(s,{heat:6,evidence:7,speed:163,stage:2,remaining:34,hp:86,energy:67,focus:91,x:1034,y:528});
if(shot==='market') Object.assign(s,{heat:3,evidence:6,stage:1,mask:false,remaining:42,mode:1,x:483,y:327});
const runScenes = ['play','market','vault'];
const button = (id,lang) => '<button data-action="'+id+'">'+lang+'</button>';
const box = (heading,body,cls='') => '<section class="panel '+cls+'"><h3>'+heading+'</h3>'+body+'</section>';
const bar = (n,max) => '<span class="bar"><i style="width:'+Math.max(0,Math.min(100,n/max*100))+'%"></i></span>';
const time = n => Math.floor(n/60).toString().padStart(2,'0')+':'+Math.floor(n%60).toString().padStart(2,'0');
const profile = () => s.loud>s.quiet+2?'BRUTAL':s.quiet>s.loud+2?'HANTU':'LICIN';
const missionIndex = () => shot==='market'?0:Math.min(s.debt,11);
const mission = () => debts[missionIndex()];
const target = () => {
  if(challenge) return challenge.target;
  if(shot==='hero')return [1160,650];
  if(shot==='stats')return [1150,540];
  if(mapTarget && roaming) return mapTarget;
  if(roaming || s.debt>=12&&!shot) return null;
  if(scene==='market'||scene==='vault') return [s.x+90,s.y-85];
  return position(missionIndex(),s.stage);
};
function rankPanel(){
  const r=rank(s.rp), next=limits[r+1];
  return '<strong>RANK '+(r+1)+' · '+names[r]+'</strong>'+bar(s.rp,next||s.rp)+'<small>'+s.rp.toLocaleString('en-US')+' / '+(next||s.rp).toLocaleString('en-US')+' RP'+(next?' · '+(next-s.rp).toLocaleString('en-US')+' to '+names[r+1]:'')+'</small>';
}
function save(i){
  const copy = {...structuredClone(s),heat:0,evidence:0,roaming,savedAt:Date.now()};
  slots[i]=copy;slot=i;write('slots',slots);
}
function start(state=fresh(), free=false){
  s=structuredClone(state);
  // Remove retired state fields from saves created before the solo update.
  delete s.who;
  delete s.duo;
  s.radio%=radio.length;
  roaming=free;active=true;mapTarget=null;challenge=null;pane='';tip=free?'Jelajahi kota sesukamu.':'Skor gampang. Lalu semuanya berantakan.';
  if(!free && state.debt===0 && state.stage<2)s.mode=1;
  nextMessage=frame+240;setScene(!free && state.debt===0 && state.stage<2?'market':!free&&state.debt===11&&state.stage===2?'vault':'play');
}
function setScene(next){previous=scene;scene=next;render();}
function slotList(interactive=false){
  const list=shot?showcaseSlots:slots;
  return list.map((entry,i)=>{
    const act=entry ? entry.debt>=11?'ACT III · THE TWELFTH DEBT':entry.debt>=5?'ACT II · KOTA BERUTANG':'ACT I · SKOR GAMPANG':'EMPTY';
    const detail=entry?progress(entry)+'% complete · '+entry.debt+'/12 debts · '+money(entry.cash+entry.bank)+' · '+Math.floor(entry.elapsed/3600)+'h '+Math.floor(entry.elapsed%3600/60)+'m':'Belum ada rekaman';
    return '<div class="slot"><b>SLOT '+(i+1)+' · '+act+'</b><small>'+detail+'</small>'+(interactive?button('slot-'+i,mode==='save'?'SAVE':'LOAD'):'')+'</div>';
  }).join('');
}
function title(){
  return '<header class="title-logo"><span>JAKARTA AFTER DARK</span><h1>SOLMARA</h1><h2>TWELVE DEBTS</h2></header><nav class="main-menu" aria-label="Main menu">'+[['continue','CONTINUE'],['new','NEW GAME'],['load','LOAD GAME'],['save','SAVE GAME'],['settings','SETTINGS'],['roam','FREE ROAM'],['stats','PROGRESSION'],['file','WANTED FILE']].map(([id,t])=>button(id,t)).join('')+'</nav><section class="title-slots">'+slotList()+'</section><footer>An original open-world crime story in a city that never sleeps · Keyboard &amp; mouse</footer>';
}
function stars(){
  return '<div class="stars" aria-label="'+s.heat+' dari 6 bintang">'+Array.from({length:6},(_,i)=>'<span class="'+(i<s.heat?'hot':'cold')+'">'+(i<s.heat?'★':'☆')+'</span>').join('')+'</div>';
}
function phoneBody(){
  let content;
  if(phone==='CEK MOBIL') content='<b>MARINER GT</b><p>Nilai jual $8,200 · Keamanan tinggi</p>'+(s.evidence&1?'<p>TRACKER AKTIF · Buang mobil ini!</p>':'<p>Pelacak tidak aktif</p>');
  else if(phone==='TEKSI') content='<p>Pesan kendaraan ke Kuningan atau dermaga.</p>'+button('taxi-0','KUNINGAN')+button('taxi-1','DERMAGA');
  else content='<article><b>@sorekening</b><p>Komodo bikin macet di tepi pantai 🦎</p></article><article><b>@kanalbeat</b><p>Polisi di Rasuna. Putar balik!</p></article><article><b>@luzmalam</b><p>Balap liar malam ini · Old Coral</p></article>';
  return '<div class="phone-contents"><div class="live">● LIVE — 12,4rb menonton</div><nav>'+['JEPRET','CEK MOBIL','TEKSI'].map(n=>button('phone-'+n,n)).join('')+'</nav>'+content+'</div>';
}
function wheel(items){
  const slots = items?['Bandana','Kacamata','Topi','—','—','—','—','—']:['Tinju','Teras 9','Setia .45','Shotgun','Rifle','—','—','—'];
  return '<div class="wheel"><nav>'+button('wheel','WEAPONS')+button('items','ITEMS')+'</nav><div class="dial">'+slots.map((n,i)=>'<button data-action="equip-'+i+'" style="--a:'+(i*45)+'deg"><b>'+(i+1)+'</b><small>'+n+'</small></button>').join('')+'<strong>'+(items?'PAKAI':'LOADOUT')+'</strong></div></div>';
}
function hud(){
  const [name,type,district,goal]=mission();
  const action=shot==='hero'?'Lolos dari pengejaran':s.stage===0?'Capai lokasi':s.stage===1||scene==='vault'?goal:s.stage===2?'Bawa hasil ke titik temu':'Temui kru';
  const next=['Mulai tugas','Bawa hasil','Temui kru','Debrief'][s.stage]||'Simpan progres';
  const evidence=['MOBIL DIKENAL','BAJU DIKENAL','IDENTITAS DIKENAL'].filter((_,i)=>s.evidence&(1<<i)).map(e=>'<span>'+e+'</span>').join('');
  const season=scene==='hero'?seasons[0]:shot==='market'?seasons[1]:seasons[Math.floor(missionIndex()/3)];
  const unitCount=s.heat===6?9:s.heat;
  const selectedUnits=s.heat>=4?units:units.slice(4,4+unitCount);
  const roster=s.heat?box('CODE '+(s.heat===6?5:s.heat)+' <em>'+unitCount+' UNITS</em>',selectedUnits.slice(0,Math.min(unitCount,5)).map(([n,status],i)=>'<div class="unit"><b>'+n+'</b><span>'+status+'</span><small>'+(22+i*37)+' m</small></div>').join('')+(unitCount>5?'<small>+4 more units</small>':''),'roster'):'';
  return '<div class="hud '+options.hud.toLowerCase()+'"><div class="hud-left">'+box('SOLMARA <em>'+season+'</em>',[['♥ HEALTH',s.hp],['ϟ ENERGY',s.energy],['◉ FOCUS',s.focus]].map(([n,v],i)=>'<div class="meter m'+i+'"><b>'+n+'</b>'+bar(v,100)+'<small>'+Math.round(v)+'</small></div>').join(''),'vitals')+box(roaming?'FREE ROAM':s.debt===12&&!shot?'STORY COMPLETE':'DEBT '+(missionIndex()+1)+'/12 · '+type,'<h2>'+(roaming?'Kuningan bebas':name)+'</h2>'+(roaming||s.debt===12&&!shot?'<small>Jelajahi jalan, pesisir, dan kanal.</small>':'<div class="mission-stage">STAGE '+(s.stage+1)+'/4 <em>'+time(s.remaining)+'</em></div><strong>'+action+'</strong><small>NEXT · '+next+'</small>'),'objective')+roster+'</div><div class="hud-right">'+box('CASH <em>'+money(s.cash)+'</em>','<h3>BANK <em>'+money(s.bank)+'</em></h3><small>TOTAL '+money(s.cash+s.bank)+' · '+s.debt+'/12 DEBTS</small>'+stars()+(s.heat?'<small class="heat">HEAT · POLISI MENCARI</small>':'')+'<div class="evidence">'+evidence+'</div>','wallet')+box('CREW RATING',rankPanel()+'<small>◆ Golden Komodo '+s.komodos.length+'/20</small>','rank')+box('LOADOUT · DANI','<strong>Teras 9 · Setia .45</strong><small>DIBAWA · 2 pistol tersembunyi</small><small>DI BAGASI · shotgun + rifle</small>','loadout')+'<div class="abilities">'+crews.map(([k,n,role])=>button('ability-'+k.toLowerCase(),'<kbd>'+k+'</kbd><b>'+n+'</b><small>'+role+'</small>')).join('')+'</div></div><section class="hud-map"><div class="area"><b>'+(scene==='hero'?'KUMALA STRAND':district.toUpperCase())+'</b><small>JL. RASUNA SAID · KANAL RASUNA</small></div><canvas id="minimap" width="240" height="240" aria-label="Minimap GPS"></canvas><div class="mini-profile">CRIMINAL PROFILE · '+profile()+'</div></section><div class="dialogue"><span class="live">● LIVE — 12,4rb menonton</span><div class="panel"><b>'+(shot?'LUZ MORENO':['LUZ MORENO','INES VEGA','LIO'][missionIndex()%3])+'</b><p>'+(tip || (scene==='hero'?'Dani, ambil jalur pantai. Jalur di depan masih kosong.':scene==='market'?'Dani, aku jaga pintunya. Ambil uangnya.':'Aku di jalur ini bersamamu, Dani.'))+'</p></div></div><div class="drive"><strong>'+(shot==='market'?'':Math.round(s.speed))+'</strong><b>'+(shot==='market'?'':(s.mode===2?'AIR ':'')+'KM/H')+'</b><small>'+['MARINER GT','ON FOOT','KITE OVER SERIBU','BAY JET SKI'][s.mode]+'</small><small>♫ '+radio[s.radio]+'</small></div><nav class="controls">'+button('pause','ESC · PAUSE')+button('stats','M · STATS')+button('phone','P · PHONE')+button('wheel','Q · GEAR')+'</nav>'+'</div>';
}
function row(label,n,max){return '<div class="progress-row"><span>'+label+'</span>'+bar(n,max)+'<strong>'+n+'/'+max+'</strong></div>';}
function stats(){
  const jobRows=jobs.map(([n,max],i)=>row(n,s.jobs[i],max)).join('');
  const typeRows=[...new Set(debts.map(d=>d[1]))].map(type=>[type,debts.filter(d=>d[1]===type).length]).map(([n,max])=>row(n,debts.slice(0,s.debt).filter(d=>d[1]===n).length,max)).join('');
  const totals=['Cars stolen','Cops escaped','Distance driven','People taken out','Crew abilities','Hidden by locals'].map((n,i)=>'<div><strong>'+(i===2?s.career[i].toFixed(1)+' km':s.career[i])+'</strong><small>'+n+'</small></div>').join('');
  const grades=Array.from({length:12},(_,i)=>'<span class="medal '+(s.grades[i]||'')+'"><small>'+String(i+1).padStart(2,'0')+'</small><b>'+(s.grades[i]||'·')+'</b></span>').join('');
  return '<div class="stats"><header><div><small>SOLMARA CITY RECORDS</small><h1>PROGRESSION</h1></div><strong class="stats-wallet">'+money(s.cash+s.bank)+'</strong>'+button('back','ESC · KEMBALI')+'</header><div class="stats-grid"><div class="map-column">'+box('KUNINGAN <em>JAKARTA · 11 DISTRICTS</em>','<canvas id="fullmap" width="900" height="670" aria-label="Peta distrik Jakarta"></canvas><small>◆ Objective &nbsp; · &nbsp; Klik peta saat free roam untuk menandai tujuan</small>','atlas')+'</div><div class="career-column">'+box('CRIMINAL PROFILE','<h2>'+profile()+'</h2>'+rankPanel())+box('CAREER', '<div class="career">'+totals+'</div>')+box('SAVE SLOTS',slotList()+button('save','SAVE GAME'))+'</div><div class="records-extra">'+box('SAFEHOUSE · APARTEMEN DANI','<div class="safehouse"><span>▤<small>Kulkas & TV</small></span><span>▥<small>Loker senjata</small></span><span>♧<small>Rak pakaian</small></span></div><small>PROPERTI · Apartemen + Bengkel Lio</small>'+button('outfit','GANTI OUTFIT · HAPUS HEAT'))+box('SOLMARA RADIO',radio.map(n=>'<small>♫ '+n+'</small>').join('')+'<hr><b>WANTED · FILE No. 07-122</b><small>DANI CRUZ · ★★★★★★</small>'+button('file','BOOKING PHOTO'),'records-radio')+'</div><div class="stats-side">'+box('CITY COMPLETION','<div class="ring" style="--value:'+progress(s)+'%"><b>'+progress(s)+'%</b><small>COMPLETE</small></div>'+row('Story debts',s.debt,12)+row('Golden Komodo',s.komodos.length,20)+row('Crew recruited',Math.min(3,s.debt),3)+row('Gold ratings',s.grades.filter(g=>g==='G').length,12)+jobRows+typeRows)+box('MISSION RATINGS · GOLD / SILVER / BRONZE','<div class="medals">'+grades+'</div>')+'</div></div></div>';
}
function installRecords(){
  const stats = screen.querySelector('.stats');
  const radioPanel = stats.querySelector('.records-radio');
  const portrait = document.createElement('canvas');
  portrait.width=240;
  portrait.height=160;
  portrait.className='booking-inset';
  portrait.setAttribute('aria-label','Booking photo Dani Cruz');
  radioPanel.append(portrait);
  drawInset(portrait,true);
  const district = document.createElement('section');
  district.className='panel district-ledger';
  district.innerHTML='<h3>WATERFRONT FIELD GUIDE</h3><div><b>KEPULAUAN SERIBU</b><small>Marina · Pulau · Jalan lintas</small></div><div><b>RAWA MUARA</b><small>Jalur satwa · Kanal dangkal</small></div><div><b>PELABUHAN TUA</b><small>Dermaga · Gudang · Penginapan</small></div>';
  stats.append(district);
}
function settings(){
  return '<label>MUSIC <input type="range" min="0" max="100" data-setting="music" value="'+options.music+'"></label><label>SFX <input type="range" min="0" max="100" data-setting="sfx" value="'+options.sfx+'"></label><label>GRAPHICS <select data-setting="quality">'+['LOW','MEDIUM','HIGH'].map((t,i)=>'<option value="'+(i+1)+'" '+(i+1===options.quality?'selected':'')+'>'+t+'</option>').join('')+'</select></label><label>HUD <select data-setting="hud">'+['FADE','CLASSIC','COMPASS'].map(t=>'<option '+(t===options.hud?'selected':'')+'>'+t+'</option>').join('')+'</select></label><p>WASD / panah · Gerak<br>Space · Rem / berlindung<br>Klik · Serang &nbsp; F · Interaksi<br>V · Kendaraan<br>Z / X / C · Kru &nbsp; R · Radio &nbsp; ESC · Pause</p>';
}
function render(){
  document.body.dataset.scene=scene;
  screen.innerHTML=scene==='title'?title():scene==='stats'?stats():hud();
  if(challenge && scene==='play'){
    const objective=screen.querySelector('.objective');
    objective.innerHTML='<h3>'+jobs[challenge.index][0]+'</h3><strong>'+challenge.instruction+'</strong><small>'+time(Math.max(0,(challenge.deadline-frame)/60))+' · Selesaikan sebelum waktu habis</small>';
  }
  if(scene==='stats'){
    const safehouse=screen.querySelector('.safehouse');
    const illustration=document.createElement('canvas');
    illustration.width=360;
    illustration.height=103;
    illustration.setAttribute('aria-label','Apartemen Dani');
    safehouse.before(illustration);
    drawInset(illustration);
    installRecords();
  }
  let contents='';
  if(pane==='settings')contents=settings();
  if(pane==='slots')contents=slotList(true);
  if(pane==='confirm')contents='<p>Mulai cerita dari awal? Slot lama tetap tersimpan sampai kamu menggunakan slot tersebut.</p>'+button('confirm-new','MULAI CERITA');
  if(pane==='notice')contents='<p>'+tip+'</p>';
  if(pane==='pause')contents=button('close','RESUME')+button('save','SAVE GAME')+button('stats','PROGRESSION')+button('settings','SETTINGS')+button('title','TITLE SCREEN');
  if(pane==='phone')contents=phoneBody();
  if(pane==='wheel'||pane==='items')contents=wheel(pane==='items');
  if(pane==='file')contents='<canvas id="mugshot" width="240" height="160" aria-label="Dani Cruz"></canvas><h2>DANI CRUZ</h2><small>FILE No. 07-122 · KUNINGAN</small><p class="stars">★★★★★★</p>';
  overlay.innerHTML=pane?'<div class="modal panel" role="dialog" aria-label="'+pane+'"><header><h2>'+(pane==='slots'?mode.toUpperCase()+' GAME':pane==='file'?'WANTED':pane.toUpperCase())+'</h2>'+button('close','×')+'</header>'+contents+'</div>':'';
  updateMaps();
}
function updateMaps(){
  const minimap=document.querySelector('#minimap'), full=document.querySelector('#fullmap'), photo=document.querySelector('#mugshot');
  if(minimap){
    const destination=target();
    minimap.setAttribute('aria-label','Minimap GPS · '+Math.round(s.x)+', '+Math.round(s.y)+(destination?' → '+destination.join(', '):''));
    drawMap(minimap,s,destination);
  }
  if(full)drawMap(full,s,target(),true);
  if(photo)drawInset(photo,true);
}
function notify(message){tip=message;nextMessage=frame+210;render();}
function heat(evidence=6){
  s.heat=Math.min(6,s.heat+1);s.evidence|=evidence;s.loud++;lastNoise=frame;
}
function sound(freq,level=.15,length=.12){
  try{
    audio??=new AudioContext();
    if(audio.state==='suspended')return;
    const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.value=freq;g.gain.value=level;
    o.connect(g);g.connect(audio.destination);const end=audio.currentTime+length;g.gain.exponentialRampToValueAtTime(.001,end);o.start();o.stop(end);
  }catch { /* Audio is optional on browsers without Web Audio. */ }
}
function ability(k){
  if(!active||!runScenes.includes(scene)||s.energy<12)return;
  s.career[4]++;s.energy-=12;
  if(k==='z'){s.evidence&=~1;s.heat=Math.max(0,s.heat-1);notify('Ines Vega · Pelat sudah diganti, Dani.');}
  if(k==='x'){s.hp=Math.min(100,s.hp+30);notify('Lio · Mobil sudah siap.');}
  if(k==='c'){s.focus=Math.min(100,s.focus+32);lastNoise-=150;notify('Luz Moreno · Aku lihat jalur kosong.');}
}
function finishDebt(){
  s.grades.push(s.remaining>52?'G':s.remaining>20?'S':'B');s.cash+=350+s.debt*125;s.bank+=2000+s.debt*500;s.rp+=325;
  s.debt++;s.stage=0;s.remaining=105;
  if(s.debt===12)roaming=true;
  save(slot);notify('Debt selesai · Progres tersimpan otomatis.');
}
function interact(){
  if(!active)return;
  if(roaming){
    if(challenge){notify(challenge.instruction);return;}
    const index=jobs.findIndex((_,i)=>Math.hypot(s.x-position(i,5)[0],s.y-position(i,5)[1])<=82);
    if(index>=0){
      if(s.jobs[index]>=jobs[index][1]){notify('Aktivitas ini sudah lengkap.');return;}
      const instructions=['Lewati garis finis dengan mobil','Capai marka pada 110 km/h','Antarkan kendaraan ke bengkel','Antarkan penumpang ke tujuan','Temui warga di titik temu','Berhenti di dermaga dan tahan rem','Capai sasaran dengan berjalan kaki','Berhenti di depan klub','Capai marka dengan jet ski','Dekati penanda satwa dengan berjalan kaki','Susuri kanal dengan jet ski'];
      challenge={index,instruction:instructions[index],target:position(index+s.jobs[index],index>=8?3:1),deadline:frame+3600};
      notify(challenge.instruction);return;
    }
    s.mode=0;s.career[0]++;heat(1);notify('TRACKER AKTIF · Buang mobil ini!');return;
  }
  const p=target(), inSet=scene==='market'||scene==='vault';
  if(!inSet&&p&&Math.hypot(s.x-p[0],s.y-p[1])>84){notify('Ikuti GPS merah muda ke titik tujuan.');return;}
  if(s.stage===0){s.stage++;if(s.debt===0)notify('Pakai bandana (Q → ITEMS) atau langsung ambil uang.');else notify(mission()[3]);}
  else if(s.stage===1){if(!s.mask&&s.evidence)heat();else s.quiet++;s.stage++;if(scene==='market')setScene('play');else if(s.debt===11)setScene('vault');}
  else if(s.stage===2){s.stage++;if(scene==='vault')setScene('play');notify('Temui kru di titik terakhir.');}
  else finishDebt();
  render();
}
function action(id){
  if(id==='close'){pane='';render();return;}
  if(id==='continue'){
    const i=slots.reduce((best,entry,i)=>entry&&(!slots[best]||entry.savedAt>slots[best].savedAt)?i:best,0);
    if(slots[i]){slot=i;start(slots[i],slots[i].roaming);return;}
    pane='notice';tip='Belum ada save. Pilih NEW GAME.';
  }
  if(id==='new') {if(!slots.some(Boolean)){slot=0;start();return;}pane='confirm';}
  if(id==='confirm-new'){slot=slots.findIndex(x=>!x);if(slot<0)slot=0;start();return;}
  if(id==='load'||id==='save'){mode=id;pane='slots';}
  if(id.startsWith('slot-')){
    const i=Number(id.slice(5));
    if(mode==='load'&&slots[i]){slot=i;start(slots[i],slots[i].roaming);return;}
    if(mode==='save'){save(i);tip='Progres disimpan ke SLOT '+(i+1)+'.';}
    else tip='Slot ini kosong.';
    pane='notice';
  }
  if(id==='roam'){start(active?s:fresh(),true);return;}
  if(id==='title'){pane='';setScene('title');return;}
  if(id==='stats'){pane='';setScene('stats');return;}
  if(id==='back'){pane='';setScene(previous==='stats'?'title':previous);return;}
  if(id==='outfit'){s.heat=0;s.evidence=0;s.mask=false;s.career[5]++;tip='Pakaian diganti · Heat hilang.';pane='notice';}
  if(id.startsWith('ability-')){ability(id.at(-1));return;}
  if(id.startsWith('phone-'))phone=id.slice(6);
  if(id.startsWith('taxi-')){
    if(s.heat){notify('Teksi tidak menerima penumpang saat Heat aktif.');return;}
    const toPier=id.endsWith('1');s.x=toPier?1275:320;s.y=toPier?953:300;pane='';
    notify(toPier?'Tiba di dermaga.':'Tiba di Kuningan.');return;
  }
  if(id.startsWith('equip-')){
    const i=Number(id.slice(6));
    if(pane==='items'||shot==='market'){
      if(i===0){s.mask=!s.mask;s.evidence&=~2;}
      else if(i<3) s.evidence&=~2;
    }else if(i<3||i<5&&s.mode===0)selected=i;
    pane='';
  }
  if(['pause','settings','file','wheel','items','phone'].includes(id))pane=id===pane?'':id;
  render();
}
document.addEventListener('click',e=>{
  const command=e.target.closest('button[data-action]');
  if(command){action(command.dataset.action);return;}
  if(e.target.id==='fullmap'&&roaming){const bounds=e.target.getBoundingClientRect();mapTarget=[(e.clientX-bounds.x)/bounds.width*1800,(e.clientY-bounds.y)/bounds.height*1110];updateMaps();return;}
  if(active&&runScenes.includes(scene)&&!pane&&frame-lastAction>10){
    heat(s.mode===0?7:6);lastAction=frame;s.career[3]++;sound(105+selected*42,options.sfx/240,.18);render();
  }
});
document.addEventListener('input',e=>{
  const key=e.target.dataset.setting;if(!key)return;
  options[key]=key==='hud'?e.target.value:Number(e.target.value);write('options',options);
  if(key==='sfx')sound(390,options.sfx/300);
  if(key==='music')sound(245,options.music/300);
});
document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(!active && scene==='title' && k==='enter'){action('new');return;}
  if(pane&&['input','select'].includes(e.target.tagName.toLowerCase())&&k!=='escape')return;
  if(k==='escape'){e.preventDefault();action(pane?'close':scene==='stats'?'back':'pause');return;}
  if(!runScenes.includes(scene))return;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  keys.add(k);if(e.repeat)return;
  if(k==='f'&&!pane)interact();
  if(k==='p')action('phone');
  if(k==='q')action('wheel');
  if(k==='m')action('stats');
  if(k==='v'&&!pane){s.mode=(s.mode+1)%4;if(s.mode===1)s.evidence&=~1;if(s.mode===3){s.x=1085;s.y=510;}notify('Mode · '+['Mobil','Jalan kaki','Kite over Seribu','Jet ski'][s.mode]);}
  if(k==='r'){s.radio=(s.radio+1)%radio.length;render();}
  if('zxc'.includes(k)&&k.length===1)ability(k);
});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());
function step(){
  frame++;
  if(!active||pane||!runScenes.includes(scene))return;
  s.elapsed+=1/60;
  if(!roaming&&s.debt<12){
    s.remaining=Math.max(0,s.remaining-1/60);
    if(s.remaining===0){s.stage=0;s.remaining=105;notify('Waktu habis · Coba tahap pertama lagi.');}
  }
  const up=keys.has('w')||keys.has('arrowup'),down=keys.has('s')||keys.has('arrowdown');
  const right=keys.has('d')||keys.has('arrowright'),left=keys.has('a')||keys.has('arrowleft');
  const brake=keys.has(' ');
  focusHeld=(keys.has('shift')&&s.focus>0);
  s.focus=Math.max(0,Math.min(100,s.focus+(focusHeld?-.55:.1)));
  const speedCap=[163,24,108,92][s.mode];
  if(up||down||left||right){
    s.heading=Math.atan2(Number(down)-Number(up),Number(right)-Number(left));
    s.speed=Math.min(speedCap,s.speed+2.1);
  }else s.speed*=.86;
  if(brake)s.speed*=.68;
  if(scene==='play'){
    const amount=s.speed/32*(focusHeld?.55:1);
    s.x=Math.max(15,Math.min(1785,s.x+Math.cos(s.heading)*amount));
    s.y=Math.max(15,Math.min(1095,s.y+Math.sin(s.heading)*amount));s.career[2]+=amount/1000;
    for(let i=0;i<20;i++){
      if(s.komodos.includes(i))continue;
      const [x,y]=position(i,2);
      if(Math.hypot(s.x-x,s.y-y)<26){s.komodos.push(i);s.rp+=50;notify('Golden Komodo '+s.komodos.length+'/20');}
    }
  }
  if(challenge){
    const {index,target:finish,deadline}=challenge;
    const rightMode=index===1?s.mode===0&&s.speed>=110:[0,2,3].includes(index)?s.mode===0:[6,9].includes(index)?s.mode===1:[8,10].includes(index)?s.mode===3:[5,7].includes(index)?brake:true;
    if(frame>deadline){challenge=null;notify('Waktu aktivitas habis.');}
    else if(rightMode&&Math.hypot(s.x-finish[0],s.y-finish[1])<49){
      challenge=null;s.jobs[index]++;s.cash+=90;s.rp+=25;notify(jobs[index][0]+' selesai · +$90');
    }
  }
  if(s.heat>=3&&s.speed<25&&!brake&&frame-lastNoise<180&&frame%18===0){
    s.hp=Math.max(0,s.hp-s.heat);
    if(!s.hp){s.hp=100;s.heat=0;s.evidence=0;s.cash=Math.max(0,s.cash-300);s.x=320;s.y=300;notify('BUSTED · Kembali ke apartemen.');}
  }
  s.energy=Math.min(100,s.energy+.11);
  if(brake&&s.heat&&frame-lastNoise>145){s.heat--;lastNoise=frame;s.evidence=s.heat?s.evidence:0;if(!s.heat)s.career[1]++;}
  if(tip&&frame>=nextMessage)tip='';
  if(frame%28===0&&options.music>0)sound(([220,262,294,330][Math.floor(frame/28)%4])*(1+s.radio*.16),options.music/700,.22);
  if(frame%18===0)render();
}
render();
if(!shot){
  setInterval(step,1000/60);
  const animate=()=>{draw(scene,s,target(),frame,options.quality,roaming);requestAnimationFrame(animate);};
  animate();
}else{
  draw(scene,s,target(),0,3);
  addEventListener('resize',()=>draw(scene,s,target(),0,3));
}
