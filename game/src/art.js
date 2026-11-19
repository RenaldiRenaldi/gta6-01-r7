import {districts, position} from './data.js';
const ctx = document.querySelector('#city').getContext('2d');
let g = ctx;
const ink = '#150f25';
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
function skyline(night){
  rect(0,0,1280,860,night?gradient(0,470,'#110b29','#4c1b5a','#de5678'):gradient(0,510,'#292050','#8d3877','#fa746e','#ffd78a'));
  const halo=g.createRadialGradient(801,285,23,801,285,205);
  halo.addColorStop(0,'#fff2b8');halo.addColorStop(.28,'#ffba78a0');halo.addColorStop(1,'#ff716500');
  rect(570,70,470,430,halo);oval(801,285,70,70,'#ffe2a1');
  for(let i=0;i<28;i++){
    const x=i*52-23,w=26+rand(i)*47,h=35+rand(i+52)*155;
    rect(x,401-h,w,h,i%2?'#3b315a':'#4b345a');
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
export function person(x,y,scale,mara=false,mask=false,action=false){
  g.save();g.translate(x,y);g.scale(scale,scale);
  const skin=mara?'#c67c66':'#ae6954', light=mara?'#ec9b80':'#d48a67';
  oval(0,1,42,8,'#1a122998');
  poly(mara?'#341b48':'#214668',[-24,-82],[23,-81],[24,-44],[19,-9],[1,-9],[-2,-51],[-11,-9],[-29,-9],[-28,-46]);
  line('#7797b0',2,[-18,-75],[-21,-15]);rect(-31,-10,23,10,'#492c24');rect(0,-10,24,10,'#492c24');
  if(mara)poly('#2b152d',[-22,-169],[-28,-87],[23,-89],[28,-157],[16,-176]);
  poly(skin,[-25,-137],[-35,-130],[-45,-93],[-34,-72],[-23,-80],[-31,-96],[-19,-117]);
  poly(light,[22,-135],[33,-128],[action?61:41,action?-122:-87],[action?78:42,action?-123:-76],[action?76:32,action?-113:-75],[24,-110]);
  if(action){poly('#29273e',[67,-125],[96,-125],[96,-119],[79,-118],[77,-111],[69,-112]);poly('#ffdf87',[98,-123],[120,-131],[115,-123],[130,-120],[109,-116]);}
  poly(mara?'#962974':'#f4e5d1',[-21,-139],[-10,-143],[13,-143],[23,-135],[27,-96],[20,-79],[-24,-81],[-28,-102]);
  poly(mara?'#551e65':'#c2a7a4',[10,-132],[22,-135],[27,-96],[20,-79],[9,-84],[14,-105]);
  rect(-7,-151,17,17,skin);
  oval(0,-160,20,24,skin);
  poly(light,[-3,-180],[14,-176],[19,-162],[14,-145],[2,-138],[-5,-143],[1,-151]);
  if(mara){poly('#27152e',[-23,-165],[-19,-180],[-7,-187],[13,-185],[23,-170],[11,-177],[0,-179],[-13,-172]);}
  else{poly('#633927',[-22,-168],[-21,-181],[-11,-190],[8,-190],[20,-180],[20,-171],[-7,-171],[-28,-165],[-32,-170]);label('GTC',-15,-177,8,'#f7bd77');}
  if(mara){
    oval(-9,-163,5,2,'#ffe1c3');oval(10,-163,5,2,'#ffe1c3');
    oval(-9,-163,2,2,'#2d1732');oval(10,-163,2,2,'#2d1732');
    line('#291a30',1,[-15,-168],[-5,-169]);line('#291a30',1,[5,-169],[15,-168]);
  }
  else{poly('#202034',[-19,-166],[19,-166],[16,-157],[5,-156],[0,-161],[-5,-156],[-16,-157]);line('#a7c1c1',1,[-15,-164],[-7,-164]);line('#a7c1c1',1,[6,-164],[14,-164]);}
  if(mask)poly(mara?'#673a87':'#e34872',[-18,-155],[1,-153],[18,-156],[15,-140],[1,-130],[-12,-140]);
  else line('#6d3a46',1,[-5,-147],[7,-147]);
  line('#ffcb66',3,[-13,-141],[-9,-130],[1,-123],[11,-131],[15,-142]);
  oval(1,-122,5,6,'#eaa740');label('◆',-2,-120,6,'#ffef9b');
  line('#683e4c',1,[-34,-119],[-38,-108],[-33,-111]);
  g.restore();
}
function dog(x,y,s){
  g.save();g.translate(x,y);g.scale(s,s);
  oval(0,1,48,8,'#120b24a6');
  oval(-11,-23,33,24,'#201826');oval(-24,-9,16,10,'#241c29');
  poly('#ad6947',[-25,-18],[-13,-19],[-14,0],[-30,0]);
  poly('#ae6847',[14,-24],[28,-25],[29,0],[15,0]);
  oval(17,-42,23,20,'#241d29');poly('#211725',[-7,-49],[3,-64],[11,-50],[28,-64],[39,-50],[37,-35]);
  oval(25,-34,15,9,'#a56346');oval(36,-35,8,6,'#141421');oval(17,-46,3,2,'#ffdc8a');oval(31,-46,3,2,'#ffdc8a');
  line('#ffbd62',4,[-2,-31],[9,-25],[26,-24]);oval(18,-21,5,5,'#ffc86b');
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
  skyline(!title && Math.floor(state.elapsed/90)%2===1);
  rect(0,401,1280,98,gradient(401,499,'#4e8593','#2f758b','#37a2a3'));
  for(let i=0;i<95;i++){const y=408+rand(i)*90;rect(rand(i+77)*1280,y,8+rand(i)*65,1,'#f6c39c50');}
  poly('#d4a180',[0,519],[1280,463],[1280,590],[0,650]);
  poly('#3c324a',[0,579],[1280,529],[1280,860],[0,860]);
  for(let i=0;i<64;i++){
    const x=rand(i+44)*1280,y=520+rand(i+32)*340;
    line(['#ff588340','#f8a25b4d','#4bd6ee44'][i%3],1+i%4,[x,y],[x+22+37*rand(i),y-1]);
  }
  line('#f9b398',3,[0,563],[1280,520]);line('#db9e7a',2,[0,707],[1280,639]);
  for(let i=0;i<13;i++){
    const x=i*107-15,y=704-x*.05;
    line('#f2b66b',3,[x,y],[x+45,y-3]);
  }
  for(let i=0;i<10;i++)palm(i*138+24,559-i*4,.54+rand(i+65)*.48,25-i*6);
  for(let i=0;i<15;i++){
    const x=i*95,y=506-i*3;
    poly(['#ee5577','#49a3a5','#efb361'][i%3],[x-22,y],[x,y-14],[x+25,y]);line('#654258',1,[x,y],[x,y+20]);
  }
  for(let i=0;i<quality*13;i++){
    const x=(rand(i+213)*1280+frame*(i%2?-.8:1.2)+12800)%1280,y=562-x*.036+rand(i+88)*27;
    oval(x,y-14,3,4,'#e4aa83');line(['#cf567b','#65c8ba','#f3bf78'][i%3],4,[x,y-10],[x+1,y-3]);line('#2a283a',2,[x-2,y],[x,y-5],[x+3,y]);
  }
  for(let i=0;i<quality*3;i++){const x=(i*183+frame*(i%2?2:1)+97)%1450-85;car(x,594-x*.045+(i%2)*26,.30+rand(i)*.12,['#d976ac','#77a896','#d98a53','#9c83bf'][i%4],!title && i<state.heat);}
  if(title){palm(1210,858,3.6,-49);palm(74,830,3.3,33);person(824,822,2.05);person(991,820,1.95,true);dog(903,840,1.56);return;}
  if(!still)return;
  for(const [x,y,s] of [[340,653,.73],[918,613,.58],[1012,647,.72]])car(x,y,s,'#e9d4ce',true);
  aircraft(749,315);palm(1204,574,2.6,-39);palm(120,584,2.8,51);
  rect(30,414,194,54,'#302039');label('CLUB MERAH',41,443,25,'#ff729f');label('KUMALA STRAND',44,460,12,'#61ead8');
  car(676,689,1.68,'#ef3659');person(472,732,1.54,false,false,true);person(838,706,1.43,true,false,true);dog(535,773,1.16);
  poly('#63845d',[920,584],[945,575],[971,576],[980,571],[992,574],[987,579],[969,582],[942,581],[908,592]);
  line('#63845d',3,[942,580],[935,588],[926,587]);line('#63845d',3,[960,581],[963,588],[973,587]);
  for(let i=0;i<54;i++){const x=310+rand(i)*708,y=520+rand(i+13)*300;line(i%2?'#ffbb74a8':'#ff777388',1,[x,y],[x+6+rand(i)*11,y-3]);}
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
    label('BANK SOLMARA',541,214,29);person(906,644,1.38,true,false);
  }else{
    for(let j=0;j<4;j++){
      rect(177,292+j*49,942,4,'#b4889b');
      for(let i=0;i<56;i++){const x=182+i*16.7,y=289+j*49;rect(x,y-8-rand(i+j)*26,11,11+rand(i+j)*26,['#ef657b','#efbd72','#6ca5b4','#688283','#cb76a9'][Math.floor(rand(i+98+j*15)*5)]);rect(x+2,y-5,7,3,'#fff5d08c');}
    }
    rect(480,191,306,65,'#842b66');rect(488,198,290,51,'#b9206f');label('MART 24',516,239,43,'#fff4cb');
    oval(664,355,19,25,'#ad705f');oval(664,338,18,9,'#44283c');oval(657,353,3,2,'#291c31');oval(671,353,3,2,'#291c31');
    poly('#639c9d',[642,378],[681,376],[691,476],[631,479]);
    rect(637,403,48,13,'#f7bd72');label('MART',648,414,10);
    line('#d78969',13,[641,381],[624,344],[615,316]);line('#d78969',13,[682,382],[700,349],[704,318]);oval(615,313,7,10,'#e29c7a');oval(705,314,7,10,'#e29c7a');
    poly('#bb6c80',[514,481],[750,479],[814,514],[473,515]);rect(473,515,341,59,'#523354');rect(473,525,341,6,'#f185a5');
  }
  person(494,745,1.92,false,true,true);person(812,752,1.96,true,true);
  for(let i=0;i<47;i++){
    const x=300+rand(i+40)*690,y=300+(rand(i)*560+frame*1.2)%507;
    if((Math.abs(x-494)<55||Math.abs(x-812)<55)&&y>373&&y<500)continue;
    g.save();g.translate(x,y);g.rotate(rand(i+77)*6.29);rect(0,0,18,9,'#b2c28d');rect(2,2,14,5,'#4f9a79');oval(9,4,3,2,'#ccdf9c');g.restore();
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
    const labels=[[58,173],[649,310],[671,594],[217,428],[246,85],[154,785],[1210,600],[1265,825],[1185,1075],[700,934],[1275,342]];
    for(let i=0;i<districts.length;i++){
      const [x,y]=labels[i];rect(x-13,y-36,districts[i].length*22+23,49,'#171a2bea');label(districts[i],x,y,38);
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
  else if(s.mode===1)person(0,6,.28,s.who===1,s.mask);
  else car(0,0,.31,s.who?'#793fee':'#e73f66');
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
    person(120,343,1.75);
    rect(0,138,240,22,'#251b34');label('FILE No. 07-122',14,153,11);
  }else{
    rect(0,0,360,103,gradient(0,103,'#694261','#2b2840'));
    rect(15,21,54,34,'#111c2f');rect(19,25,46,25,'#456879');
    rect(18,58,49,30,'#a66475');rect(84,16,37,78,'#a38a9c');line('#e8c0b0',1,[84,42],[121,42]);
    rect(150,49,92,36,'#ac5d7c');rect(146,68,100,19,'#774d6c');dog(194,71,.51);
    rect(263,20,42,71,'#463d55');line('#c69b9b',1,[283,20],[283,90]);
    line('#edb09a',2,[316,27],[349,27]);poly('#cb799e',[319,33],[327,27],[339,32],[350,66],[324,66]);
  }
  g=ctx;
}
