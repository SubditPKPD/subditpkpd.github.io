export type TrainingRecord={trainerId?:string;id?:string;level?:string;name:string;province:string;district:string;specialty:string;job?:string;institution?:string;training?:string;year?:number;sourceSheet?:string;sourceRow?:number};
// Ignore whitespace, dots and case; keep spelling and other punctuation significant.
export function nameKey(name:string){return name.replace(/[\s.]/gu,'').toLocaleUpperCase('id-ID');}
// Format only the name; keep recognized leading and trailing titles as supplied.
export function formatTrainerName(value:string){
 const text=value.trim().replace(/\s+/gu,' ');
 const prefix=text.match(/^(?:(?:Prof|Drs|Dra|Dr|Ir|Hj|H)\.\s*)+/iu)?.[0]||'';
 const rest=text.slice(prefix.length);
 const comma=rest.indexOf(',');
 const degree=rest.search(/\s+(?=(?:S\.[A-Za-z]|M\.[A-Za-z]|A\.[A-Za-z]|D[1-4]\b|S[1-3]\b|SH\b|SE\b|ST\b|STP\b|SP\b|MM\b|MSi\b|MSc\b|MBA\b|Ph\.D\b))/iu);
 const cut=comma<0?degree:degree<0?comma:Math.min(comma,degree);
 return prefix+(cut<0?rest.toLocaleUpperCase('id-ID'):rest.slice(0,cut).toLocaleUpperCase('id-ID')+rest.slice(cut));
}
function contextKey(value:string|undefined){return (value||'').trim().replace(/\s+/gu,' ').replace(/\./gu,'').toLocaleUpperCase('id-ID');}
export function trainerKey(r:TrainingRecord){
 if(r.trainerId)return "master:"+r.trainerId;
 const institution=contextKey(r.institution),job=contextKey(r.job);
 // Missing identity evidence stays separate until completed.
 return JSON.stringify([r.province,nameKey(r.name),institution,job,(!institution||!job)?(r.id||JSON.stringify(r)):'']);
}
export function groupTrainers<T extends TrainingRecord>(records:T[]){const groups=new Map<string,{key:string;name:string;province:string;records:T[]}>();for(const r of records){const key=trainerKey(r);let group=groups.get(key);if(!group){group={key,name:formatTrainerName(r.name),province:r.province,records:[]};groups.set(key,group);}group.records.push(r);}return [...groups.values()];}

export const trainerLevels=["Pusat","Provinsi","Kabupaten/Kota","Tingkat daerah belum terverifikasi"] as const;
export function trainerLevel(r:TrainingRecord){return r.province==="Pusat"?"Pusat":trainerLevels.includes(r.level as any)?r.level!:"Tingkat daerah belum terverifikasi";}
