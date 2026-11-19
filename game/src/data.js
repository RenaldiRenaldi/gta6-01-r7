export const districts = ['Kuningan', 'Rasuna Said', 'Casablanca', 'Setiabudi', 'Menteng', 'Old Coral', 'Glass Quarter', 'Kumala Strand', 'Kepulauan Seribu', 'Rawa Muara', 'Pelabuhan Tua'];
export const seasons = ['Summer', 'Spring', 'Autumn', 'Winter'];
export const radio = ['SOL WAVE 98.4 · DJ Kirana', 'KALI FM · Bima', 'MACAN FM · Sari', 'SENJA 101 · Nala'];
export const crews = [['Z','Swap Plates','Ines · Driver'],['X','Quick Fix','Lio · Mechanic'],['C','Eyes Out','Luz · Lookout']];
export const debts = [
  ['Skor Gampang','Robbery','MART 24','Ambil uangnya'],
  ['Surat dari Luz','Infiltration','Setiabudi','Temukan arsip Luz'],
  ['Pintu Air','Chase','Rawa Muara','Susuri kanal'],
  ['Sinyal Putus','Chase','Rasuna Said','Kejar mobil kurir'],
  ['Telepon Tengah Malam','Robbery','Menteng','Bawa tas ke Mara'],
  ['Kaca Pecah','Chase','Glass Quarter','Temui Ines'],
  ['Gudang Garam','Infiltration','Pelabuhan Tua','Ambil dokumen impor'],
  ['Jalur Sutra','Chase','Casablanca','Kawal mobil Lio'],
  ['Uang Pasang','Robbery','Old Coral','Ambil kembali uang kru'],
  ['Mara’s Kite','Chase','Kepulauan Seribu','Capai landasan'],
  ['Jalan Terakhir','Chase','Kumala Strand','Amankan jalur pulang'],
  ['The Twelfth Debt','Heist','Bank Solmara','Ambil cadangan dari vault']
];
export const jobs = [['Street races',4],['Stunt jumps',8],['Export list',5],['District jobs',7],['Districts friendly',7],['Fishing',4],['Gym',4],['Billiards',4],['Kayaking',4],['Wildlife spotted',40],['Kejar-kejaran air',3]];
export const units = [['KITE-01','SPOTLIGHT'],['RAJAWALI-06','FIRING'],['RASUNA-12','RAMMING'],['CORAL-21','ROADBLOCK'],['KUNINGAN-34','PURSUIT'],['MUARA-05','SEARCHING'],['MUARA-08','PURSUIT'],['MENTENG-07','SEARCHING'],['SETIA-02','ROADBLOCK']];
export const fresh = () => ({debt:0, stage:0, grades:[], cash:450, bank:1200, rp:0, komodos:[], jobs:jobs.map(()=>0), career:[0,0,0,0,0,0], duo:0, x:320, y:300, heading:0, speed:0, mode:0, who:0, heat:0, evidence:0, loud:0, quiet:0, hp:100, energy:100, focus:100, elapsed:0, remaining:105, mask:false, radio:0});
export function sample() {
  return Object.assign(fresh(), {debt:12, grades:[...'GSGGBGSGGSGG'], cash:12450, bank:86190, rp:3900, komodos:Array.from({length:12},(_,i)=>i), jobs:[3,5,3,4,5,2,3,1,2,12,2], career:[26,14,83.6,11,24,7], duo:4, elapsed:22320, loud:18});
}
export const money = n => '$'+Math.floor(n).toLocaleString('en-US');
export const progress = s => (((s.debt + s.komodos.length + s.jobs.reduce((a,b)=>a+b,0)) / (32 + jobs.reduce((a,[,max])=>a+max,0)))*100).toFixed(1);
// Keep all objectives and collectibles inside the navigable atlas.
export const position = (i, salt=0) => [(125+i*347+salt*291)%1650+75,(180+i*193+salt*65)%960+75];
export const limits = [0,400,1000,1800,3000,5200];
export const names = ['Runner','Wheelman','Scavenger','Operator','Fixer','Shot Caller'];
export const rank = rp => limits.findLastIndex(n=>rp>=n);
