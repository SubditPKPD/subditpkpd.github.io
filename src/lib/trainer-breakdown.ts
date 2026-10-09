import {groupTrainers,trainerLevel,type TrainingRecord} from './trainer-groups';
import regions from '../app/regions.json';
export const centerInstitutions=['Balai Pemdes Lampung','Balai Pemdes Yogyakarta','Balai Besar Pemdes Malang','Ditjen Bina Pemdes'];
export function centerInstitution(institution:string){
 const name=institution.toLowerCase().replace(/\s+/g,' ');
 if(name.includes('balai')&&name.includes('lampung'))return centerInstitutions[0];
 if(name.includes('balai')&&name.includes('yogyakarta'))return centerInstitutions[1];
 if(name.includes('balai')&&name.includes('malang'))return centerInstitutions[2];
 if(/ditjen bina|direktorat jenderal bina|direktorat pengembangan kapasitas pemerintahan desa|direktorat fasilitasi lembaga kemasyarakatan/.test(name))return centerInstitutions[3];
 return 'Instansi Pusat lainnya / belum terverifikasi';
}
export function trainerBreakdown(records:TrainingRecord[],region:string){
 const people=groupTrainers(records.filter(r=>r.province===region)),counts=new Map<string,number>();
 const names=region==='Pusat'?[...centerInstitutions]:['Pelatih Provinsi',...(regions.find(p=>p.name===region)?.districts.map(d=>d.name)||[]),'Wilayah belum jelas / perlu verifikasi'];
 for(const person of people){
  const name=trainerCategory(person.records,region);
  counts.set(name,(counts.get(name)||0)+1);
  if(!names.includes(name))names.push(name);
 }
 const total=people.length;
 return {total,items:names.map(name=>({name,count:counts.get(name)||0,percent:total?(counts.get(name)||0)/total*100:0})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'id'))};
}

export function trainerCategory(records:TrainingRecord[],region:string){
 if(region==='Pusat')return centerInstitution(records[0]?.institution||'');
 const categories=[...new Set(records.map(r=>trainerLevel(r)==='Provinsi'?'Pelatih Provinsi':r.district||'Wilayah belum jelas / perlu verifikasi'))];
 return categories.length===1?categories[0]:'Wilayah belum jelas / perlu verifikasi';
}

export function categoryRecords<T extends TrainingRecord>(records:T[],region:string,category:string){
 return groupTrainers(records.filter(r=>r.province===region)).filter(p=>!category||trainerCategory(p.records,region)===category).flatMap(p=>p.records);
}
