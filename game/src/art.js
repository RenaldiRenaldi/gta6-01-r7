import {districts, position} from './data.js';
const ctx = document.querySelector('#city').getContext('2d');
let g = ctx;
const ink = '#150f25';
// Compare the standing sprite and the roof at the same depth.
const personToCarScale = 1.2 * 97 / 190;
function rect(x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function oval(x,y,w,h,c){g.beginPath();g.ellipse(x,y,w,h,0,0,Math.PI*2);g.fillStyle=c;g.fill();}
function poly(c,...points){g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.closePath();g.fillStyle=c;g.fill();}
function line(c,w,...points){g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.strokeStyle=c;g.lineWidth=w;g.stroke();}
function gradient(y1,y2,...colors){const fill=g.createLinearGradient(0,y1,0,y2);colors.forEach((c,i)=>fill.addColorStop(i/(colors.length-1),c));return fill;}
function label(text,x,y,size,color='#fff1d8'){g.font='900 '+size+'px sans-serif';g.fillStyle=color;g.fillText(text,x,y);}
const rand = n => ((Math.sin(n*12.9898+78.233)*43758.5453)%1+1)%1;

function palm(x,y,size,lean=0){
  g.save();g.translate(x,y);g.scale(size,size);
  poly('#37243f',[-9,0],[4,0],[lean+5,-150],[lean-3,-150]);
  line('#da8071',2,[-4,0],[lean,-145]);
  for(let i=0;i<9;i++){
    const angle=(i-4)*.48, dx=Math.sin(angle)*105, dy=-Math.cos(angle)*54;
    poly(i%2?'#123c46':'#205355',[lean,-147],[lean+dx*.52,-160+dy],[lean+dx,-135+dy*.72],[lean+dx*.58,-151+dy*.52]);
    line('#43816c',1,[lean,-148],[lean+dx*.55,-158+dy*.8],[lean+dx,-135+dy*.72]);
  }
  g.restore();
}
function skyline(day){
  rect(0,0,1280,860,day?gradient(0,480,'#2379cd','#62c9ff','#defbff'):gradient(0,510,'#292050','#8d3877','#fa746e','#ffd78a'));
  if(day){
    for(let i=0;i<31;i++){
      const x=265+i*31,y=94+Math.sin(i*.39)*29;
      oval(x,y,21+rand(i+251)*51,5+rand(i+249)*12,'#effaff26');
    }
  }
  const halo=g.createRadialGradient(801,285,23,801,285,205);
  halo.addColorStop(0,'#fff2b8');halo.addColorStop(.28,'#ffba78a0');halo.addColorStop(1,'#ff716500');
  rect(570,70,470,430,halo);oval(801,285,day?46:70,day?46:70,'#ffeab6');
  for(let i=0;i<28;i++){
    const x=i*52-23,w=26+rand(i)*47,h=35+rand(i+52)*(day?105:255);
    rect(x,401-h,w,h,day?(i%2?'#577b9f':'#7497ac'):(i%2?'#524669':'#8b5466'));
    poly('#856078',[x,401-h],[x+8,393-h],[x+w+8,393-h],[x+w,401-h]);
    rect(x+w,401-h,8,h,'#282740');
    for(let r=10;r<h-8;r+=12)for(let j=6;j<w-5;j+=9)
      if(rand(i*377+r+j*11)>.28)rect(x+j,401-h+r,4,3,['#fda887','#f3ca91','#7495a3'][i%3]);
  }
}
function car(x,y,scale,c,police=false){
  g.save();g.translate(x,y);g.scale(scale,scale);
  oval(2,27,113,27,'#100c23a6');
  for(const px of [-83,67]){oval(px,22,19,26,'#10121e');oval(px,23,11,14,'#52516c');oval(px,23,5,6,'#a8a2ae');}
  poly(c,[-105,11],[-102,-10],[-62,-20],[-33,-49],[37,-48],[73,-23],[107,-9],[107,17],[86,24],[82,7],[63,1],[48,24],[-63,24],[-68,7],[-90,6],[-98,23]);
  poly('#171832',[-53,-21],[-26,-43],[32,-41],[63,-22]);
  poly('#657b99',[-45,-24],[-24,-40],[13,-39],[-7,-24]);
  line('#fff0c989',2,[-100,-8],[-63,-13],[73,-14],[100,-5]);
  rect(89,-4,18,8,police?'#9eeaff':'#ffe4a8');rect(-105,-5,13,7,'#ff6f95');rect(96,12,12,4,'#131526');
  if(police){
    for(const [lx,lc] of [[-13,'#ff366e'],[9,'#34c6ff']]){
      g.shadowColor=lc;g.shadowBlur=22;rect(lx,-54,17,7,lc);g.shadowBlur=0;
      poly(lc+'37',[lx,-52],[lx+210,-65],[lx+220,-25]);
    }
  }
  g.restore();
}
export function person(x,y,scale,mask=false,action=false,uniform=false){
  g.save();g.translate(x,y);g.scale(scale,scale);
  const skin='#ae6954', light='#d48a67';
  oval(0,1,42,8,'#1a122998');
  if(action){
    poly('#214668',[-24,-83],[22,-84],[43,-38],[65,-14],[49,-5],[20,-25],[0,-51],[-24,-11],[-48,0],[-53,-11],[-31,-29]);
    rect(-54,-9,21,9,'#492c24');rect(48,-8,21,8,'#492c24');
  }else{
  poly('#214668',[-24,-82],[23,-81],[24,-44],[19,-9],[1,-9],[-2,-51],[-11,-9],[-29,-9],[-28,-46]);
  line('#7797b0',2,[-18,-75],[-21,-15]);rect(-31,-10,23,10,'#492c24');rect(0,-10,24,10,'#492c24');
  }
  poly(skin,[-25,-137],[-35,-130],[-45,-93],[-34,-72],[-23,-80],[-31,-96],[-19,-117]);
  poly(light,[22,-135],[33,-128],[action?61:41,action?-122:-87],[action?78:42,action?-123:-76],[action?76:32,action?-113:-75],[24,-110]);
  if(action){poly('#29273e',[67,-125],[96,-125],[96,-119],[79,-118],[77,-111],[69,-112]);poly('#ffdf87',[98,-123],[120,-131],[115,-123],[130,-120],[109,-116]);}
  poly(uniform?'#263a53':'#f4e5d1',[-21,-139],[-10,-143],[13,-143],[23,-135],[27,-96],[20,-79],[-24,-81],[-28,-102]);
  poly(uniform?'#4e6982':'#c2a7a4',[10,-132],[22,-135],[27,-96],[20,-79],[9,-84],[14,-105]);
  rect(-7,-151,17,17,skin);
  oval(0,-160,20,24,skin);
  poly(light,[-3,-180],[14,-176],[19,-162],[14,-145],[2,-138],[-5,-143],[1,-151]);
  {poly(uniform?'#142740':'#633927',[-22,-168],[-21,-181],[-11,-190],[8,-190],[20,-180],[20,-171],[-7,-171],[-28,-165],[-32,-170]);if(uniform)label('◆',-5,-177,10,'#9ccde8');else label('GTC',-15,-177,8,'#f7bd77');}
  {poly('#202034',[-19,-166],[19,-166],[16,-157],[5,-156],[0,-161],[-5,-156],[-16,-157]);line('#a7c1c1',1,[-15,-164],[-7,-164]);line('#a7c1c1',1,[6,-164],[14,-164]);}
  if(mask)poly('#e34872',[-18,-155],[1,-153],[18,-156],[15,-140],[1,-130],[-12,-140]);
  else line('#6d3a46',1,[-5,-147],[7,-147]);
  if(!uniform){line('#ffcb66',3,[-13,-141],[-9,-130],[1,-123],[11,-131],[15,-142]);
  oval(1,-122,5,6,'#eaa740');label('◆',-2,-120,6,'#ffef9b');}
  else{rect(-16,-128,9,7,'#a8c7da');line('#192738',5,[-24,-89],[24,-89]);}
  line('#683e4c',1,[-34,-119],[-38,-108],[-33,-111]);
  g.restore();
}
function aircraft(x,y){
  poly('#fff3a441',[x,y],[x-125,y+370],[x+160,y+370]);
  poly('#fff2bd34',[x,y],[x-69,y+370],[x+92,y+370]);
  line('#2e223c',5,[x-102,y-64],[x+112,y-53]);line('#242136',4,[x,y-50],[x,y-18]);
  poly('#292746',[x-119,y-42],[x-40,y-22],[x+13,y-14],[x-31,y+2],[x-118,y-33],[x-132,y-62],[x-120,y-58]);
  oval(x,y-10,52,24,'#393950');oval(x+34,y-14,22,16,'#6895aa');line('#192035',4,[x-36,y+17],[x-30,y+26],[x+48,y+26],[x+53,y+21]);
  oval(x,y+13,7,4,'#fff3ae');
}
function boulevard(title, state, frame, quality, still){
  skyline(!title);
  const vanishing = [489,466];
  rect(0,401,1280,170,gradient(401,571,title?'#4b708b':'#1a91c1','#64d2cf'));
  for(let i=0;i<130;i++){
    const y=406+rand(i)*145;
    rect(rand(i+77)*1280,y,8+rand(i+35)*58,1+rand(i+41)*2,'#fffce367');
  }
  poly(title?'#da9c82':'#f9d8a6',[475,468],[1280,456],[1280,860],[590,860]);
  poly(title?'#ac7c75':'#e8b58a',[490,468],[1280,644],[1280,860],[536,860]);
  poly(title?'#413448':'#4d5870',vanishing,[1280,795],[1280,860],[0,860],[0,780]);
  poly(title?'#d88e8a':'#eacfc0',vanishing,[424,477],[0,829],[0,780]);
  line('#fff2d7',4,vanishing,[1280,796]);
  line('#f4c46a',5,vanishing,[868,860]);line('#ffdd80',3,vanishing,[892,860]);
  for(let i=1;i<13;i++){
    const t=(i/13)**2, u=((i+.48)/13)**2;
    line('#e5eaf0',1+t*5,[489-235*t,466+394*t],[489-235*u,466+394*u]);
  }
  for(let i=0;i<13;i++){
    const t=(i/12)**1.8,x=536+740*t,y=473+292*t;
    palm(x,y,.17+1.2*t,(i%3-1)*19);
    const ux=x+40,uy=y-18;
    poly(['#fb557b','#329bac','#ffbd58'][i%3],[ux-16*t-5,uy],[ux,uy-12*t-4],[ux+17*t+5,uy]);
    line('#785355',1,[ux,uy],[ux,uy+10+t*19]);
  }
  for(let i=0;i<quality*9;i++){
    const x=532+rand(i+45)*744,y=474+rand(i+99)*(x-480)*.35;
    if(title && x>717 && x<910)continue;
    oval(x,y-9,2.3,2.7,'#b97350');line(['#df576f','#1d8b9a','#e79939'][i%3],3,[x,y-7],[x,y-3]);line('#2a283a',1.5,[x-2,y],[x,y-4],[x+2,y]);
  }
  if(!title){
    // The promenade runs between the seafront and the hotel arcade.
    poly('#ccaa97',[0,286],[177,359],[177,581],[0,739]);
    poly('#f1d4af',[177,359],[410,448],[410,490],[177,581]);
    for(let i=0;i<4;i++){
      const y=324+i*53;
      poly('#385b73',[0,y],[178,y+39],[178,y+55],[0,y+25]);
      line('#fff0cf',2,[0,y+26],[178,y+56]);
    }
    for(let i=0;i<7;i++){
      const t=i/7,x=181+229*t,y=561-76*t;
      poly(i%2?'#cf6758':'#268e93',[x,y-37*(1-t)],[x+31,y-42*(1-t)],[x+37,y-31*(1-t)],[x-5,y-24*(1-t)]);
      line('#947b78',2,[x,y-28*(1-t)],[x,y+12*(1-t)]);
    }
  }
  for(let i=0;i<quality*2;i++){
    const t=.06+.35*rand(i+12);
    car(489+(rand(i+44)-.62)*500*t+Math.sin(frame/80+i)*10,466+394*t,.18+.66*t,['#d976ac','#77a896','#d98a53','#9c83bf'][i%4]);
  }
  if(title){
    car(770,700,.91,'#e57743');
    person(865,743,.55);
    return;
  }
  if(!still)return;
  for(const [x,y,size] of [[480,544,.47],[604,571,.55],[395,606,.65],[751,624,.68]])car(x,y,size,'#e9edf4',true);
  aircraft(592,266);
  rect(296,425,137,42,'#18243e');label('CLUB MERAH',305,445,17,'#ff9b8c');label('KUMALA STRAND',306,460,10,'#92f7e2');
  car(658,690,1.87,'#f16b34');
  person(460,780,1.145);
}
function interior(vault, frame){
  rect(0,0,1280,860,gradient(0,860,'#201938','#63335d','#211b32'));
  poly('#44405c',[0,0],[1280,0],[1040,188],[220,188]);poly('#593b62',[0,860],[1280,860],[1030,474],[238,474]);
  for(let i=0;i<17;i++)line('#d796ae43',2,[i*92-96,860],[425+i*25,467]);
  for(let i=0;i<14;i++){const y=478+i*i*2.2;line('#d796ae49',2,[0,y],[1280,y]);}
  rect(188,180,900,261,'#332c51');
  for(let i=0;i<7;i++){rect(228+i*140,134,74,12,'#fff0ba');rect(228+i*140,146,74,23,'#ffe59543');}
  if(vault){
    oval(678,336,193,163,'#928795');oval(678,336,168,142,'#373547');oval(678,336,141,117,'#15172b');
    for(let i=0;i<16;i++){const a=i*Math.PI/8;oval(678+Math.cos(a)*174,336+Math.sin(a)*145,8,8,'#d6a777');}
    label('BANK SOLMARA',541,214,29);
  }else{
    for(let j=0;j<4;j++){
      rect(177,292+j*49,622,4,'#b4889b');
      for(let i=0;i<37;i++){const x=182+i*16.7,y=289+j*49;rect(x,y-8-rand(i+j)*26,11,11+rand(i+j)*26,['#ef657b','#efbd72','#6ca5b4','#688283','#cb76a9'][Math.floor(rand(i+98+j*15)*5)]);rect(x+2,y-5,7,3,'#fff5d08c');}
    }
    rect(809,186,306,276,'#132743');
    rect(817,194,289,246,gradient(194,440,'#504374','#e78783','#698fba'));
    oval(1015,267,24,24,'#ffe0a7');
    for(let i=0;i<9;i++){
      const h=25+rand(i+603)*77;
      rect(825+i*30,327-h,22,h,'#55546b');
      rect(830+i*30,331-h,2,12,'#ffd39d');
    }
    rect(817,327,289,47,'#499cb0');rect(817,374,289,27,'#d9ab8b');rect(817,401,289,39,'#535c70');
    line('#edd39d',2,[817,423],[1106,423]);line('#26374f',6,[941,194],[941,440]);
    car(910,409,.57,'#e5e8ee',true);
    rect(480,191,306,65,'#842b66');rect(488,198,290,51,'#b9206f');label('MART 24',516,239,43,'#fff4cb');
    oval(664,355,15,18,'#ad705f');oval(664,342,15,8,'#44283c');oval(657,353,3,2,'#291c31');oval(671,353,3,2,'#291c31');
    poly('#639c9d',[642,378],[681,376],[691,476],[631,479]);
    rect(637,403,48,13,'#f7bd72');label('MART',648,414,10);
    line('#d78969',13,[641,381],[624,344],[615,316]);line('#d78969',13,[682,382],[700,349],[704,318]);oval(615,313,7,10,'#e29c7a');oval(705,314,7,10,'#e29c7a');
    poly('#bb6c80',[514,481],[750,479],[814,514],[473,515]);rect(473,515,341,59,'#523354');rect(473,525,341,6,'#f185a5');
  }
  if(!vault){
    // The open side of the shop looks onto the curb and the responding cruiser.
    poly('#263a4b',[1013,467],[1280,426],[1280,827],[754,764]);
    line('#e8c785',4,[1013,467],[754,764],[1280,827]);
    line('#e2d6c1',3,[1034,521],[1280,550]);
    car(1011,733,1.43,'#e5edf2',true);
    person(867,556,.49,false,false,true);
    person(966,608,.57,false,false,true);
    line('#fff4ab',2,[571,630],[851,492]);
    line('#ffd974',3,[571,630],[664,594]);
  }
  person(459,739,.88,false,true);
  for(let i=0;i<47;i++){
    const x=300+rand(i+40)*690,y=300+(rand(i)*560+frame*1.2)%507;
    if((Math.abs(x-494)<55||Math.abs(x-812)<55)&&y>373&&y<500)continue;
    g.save();g.translate(x,y);g.rotate(rand(i+77)*6.29);rect(0,0,9,4,'#c4e6a4');rect(1,1,7,2,'#4f9a79');oval(4.5,2,1.1,1,'#ccdf9c');g.restore();
  }
}
export function markerField(s,target){
  rect(0,0,1800,1110,'#6ea5b5');
  rect(0,0,1800,1044,'#dad1ab');
  for(let row=0;row<8;row++)for(let col=0;col<12;col++){
    const x=col*150,y=row*130;
    rect(x+19,y+16,112,95,['#98b69b','#cca390','#cebd95','#a7aaa7'][(col*7+row*3)%4]);
    for(let i=0;i<6;i++){
      const cx=x+25+i%3*34,cy=y+23+Math.floor(i/3)*41;
      rect(cx,cy,23,28,'#67777988');rect(cx+1,cy+1,19,23,'#e5d4aa77');
    }
    line('#434d55',10,[x,y],[x+150,y]);line('#434d55',10,[x,y],[x,y+130]);
  }
  line('#48a2cf',63,[1183,0],[1030,285],[1110,604],[906,811],[946,1110]);
  for(const y of [260,520,780])line('#363f50',12,[850,y],[1260,y]);
  if(s.heat){
    oval(s.x+36,s.y-20,166,166,'#f64f7b39');
    g.beginPath();g.arc(s.x+36,s.y-20,166,0,6.29);g.strokeStyle='#f55075';g.lineWidth=9;g.stroke();
    oval(s.x+112,s.y-45,17,17,'#e92f63');oval(s.x-87,s.y+82,17,17,'#e92f63');
  }
  if(target){
    line('#f42b92',12,[s.x,s.y],[s.x,target[1]],[target[0],target[1]]);
    oval(...target,21,21,'#4e61e0');
  }
  poly('#fff',[s.x,s.y-23],[s.x-16,s.y+17],[s.x,s.y+9],[s.x+16,s.y+17]);
}
export function drawMap(canvas,s,target,full=false){
  g=canvas.getContext('2d');g.save();g.scale(canvas.width/(full?1800:480),canvas.height/(full?1110:480));
  if(!full)g.translate(-s.x+240,-s.y+240);
  rect(-500,-500,2800,2200,'#7bb5c3');markerField(s,target);
  if(full){
    // Clip the city grid to the atlas coastline. The driving grid stays continuous.
    const coast = [[100,230],[215,125],[450,69],[710,97],[970,56],[1210,130],[1550,150],[1675,290],[1600,454],[1715,527],[1575,730],[1330,744],[1170,895],[925,914],[725,998],[465,929],[275,823],[172,606],[78,425]];
    rect(0,0,1800,1110,gradient(0,1110,'#12465f','#188d9c'));
    for(let i=0;i<110;i++){
      const x=rand(i+451)*1800,y=rand(i+512)*1110;
      line('#91dfdb45',2,[x,y],[x+18+rand(i)*43,y]);
    }
    g.save();
    poly('#eada9e',...coast);g.strokeStyle='#81d3c6';g.lineWidth=35;g.stroke();g.clip();
    markerField({...s,heat:0,x:-400,y:-400},null);
    g.restore();
    poly('#b7bf82',[1370,873],[1515,825],[1602,887],[1551,1012],[1431,1040],[1344,982]);
    poly('#d0c595',[1715,873],[1762,903],[1743,976],[1680,966],[1667,911]);
    line('#302644',23,[400,282],[400,518],[755,518],[755,734],[1200,734],[1200,564]);
    line('#f383c4',11,[400,282],[400,518],[755,518],[755,734],[1200,734],[1200,564]);
    if(!target || target[0]!==1150){
      if(target){line('#f383c4',11,[s.x,s.y],[s.x,target[1]],[target[0],target[1]]);oval(...target,18,18,'#f4d377');}
      oval(s.x,s.y,14,14,'#f6f4dc');
    }
    oval(1200,564,19,19,'#f7d879');
    const labels=[[244,269],[627,369],[492,669],[188,492],[536,185],[658,869],[1190,288],[1274,535],[1287,1061],[1082,793],[1261,674]];
    for(let i=0;i<districts.length;i++){
      const [x,y]=labels[i];g.font='900 39px sans-serif';rect(x-13,y-36,g.measureText(districts[i]).width+27,48,'#152b3eec');label(districts[i],x,y,39);
    }
  }
  g.restore();g=ctx;
}
function cityPlay(s,target,frame,quality,activities){
  const water=s.mode===3, air=s.mode===2;
  const z=air?.39:.78;
  g.save();g.translate(640-s.x*z,434-s.y*z);g.scale(z,z);rect(-950,-900,3800,3000,water?'#34798d':'#322d48');
  markerField({...s,heat:0,x:-400,y:-400},null);
  if(activities)for(let i=0;i<11;i++){
    const [x,y]=position(i,5);
    oval(x,y,16,16,'#26223c');label('◆',x-9,y+6,18,'#6ce6d2');
  }
  for(let i=0;i<20;i++){
    const [x,y]=position(i,2);
    if(!s.komodos.includes(i)){oval(x,y,10,10,'#ffb94e');label('◆',x-8,y+5,16,ink);}
  }
  for(let i=0;i<quality*16;i++){
    const [x,y]=position(i);
    car((x+frame*(1+i%3))%1800,Math.floor(y/130)*130,.12,['#a4537e','#d88f62','#466f98'][i%3]);
    const sidewalk=(y+Math.sin(frame*.018+i)*23)%1040;
    oval(x,sidewalk,4,6,['#ed874f','#774787','#29695e'][i%3]);
  }
  if(target){oval(...target,49,49,'#a73d957d');oval(...target,11,11,'#ffb7dc');}
  for(let i=0;i<s.heat;i++)car(s.x+Math.cos(i+frame*.025)*(140+i*24),s.y+Math.sin(i+frame*.025)*(140+i*24),.22,'#e8dee2',true);
  g.translate(s.x,s.y);g.rotate(s.heading);
  if(water){
    poly('#f1dc9c',[-25,-10],[14,-9],[28,0],[14,9],[-25,10]);line('#f9dfceaa',2,[-28,0],[-79,-18]);
  }else if(air){oval(0,0,26,12,'#581b55');line('#29223e',3,[-36,13],[35,-13]);}
  else if(s.mode===1)person(0,6,.31*personToCarScale,s.mask);
  else car(0,0,.31,'#f16b34');
  g.restore();
}
export function draw(scene,s,target,frame,quality,activities=false){
  const canvas=ctx.canvas,w=innerWidth,h=innerHeight;
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  g=ctx;g.save();g.scale(w/1280,h/860);
  if(scene==='market'||scene==='vault')interior(scene==='vault',frame);
  else if(scene==='play')cityPlay(s,target,frame,quality,activities);
  else boulevard(scene!=='hero',s,frame,quality,scene==='hero');
  g.restore();
}
export function drawInset(canvas,portrait=false){
  g=canvas.getContext('2d');
  if(portrait){
    rect(0,0,240,160,'#7f5270');
    for(let y=15;y<160;y+=21)line('#ebb1a166',1,[0,y],[240,y]);
    person(120,266,1.25);
    rect(0,138,240,22,'#251b34');label('FILE No. 07-122',14,153,11);
  }else{
    rect(0,0,360,103,gradient(0,103,'#694261','#2b2840'));
    rect(15,21,54,34,'#111c2f');rect(19,25,46,25,'#456879');
    rect(18,58,49,30,'#a66475');rect(84,16,37,78,'#a38a9c');line('#e8c0b0',1,[84,42],[121,42]);
    rect(150,49,92,36,'#ac5d7c');rect(146,68,100,19,'#774d6c');rect(163,52,24,14,'#caa3ae');;
    rect(263,20,42,71,'#463d55');line('#c69b9b',1,[283,20],[283,90]);
    line('#edb09a',2,[316,27],[349,27]);poly('#cb799e',[319,33],[327,27],[339,32],[350,66],[324,66]);
  }
  g=ctx;
}
