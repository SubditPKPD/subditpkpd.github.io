import {groupTrainers, type TrainingRecord} from './trainer-groups';
export const cohortPresets = [
 {label:'ToMT PAD 2023',training:'ToMT PAD',year:'2023'},
 {label:'ToT PAD 2023',training:'ToT PAD',year:'2023'},
 {label:'ToT Tematik 2023',training:'ToT Tematik',year:'2023'},
 {label:'ToMT PAD 2024',training:'ToMT PAD',year:'2024'},
 {label:'ToT PAD 2024',training:'ToT PAD',year:'2024'},
 {label:'ToT Tambahan PAD 2024',training:'ToT Tambahan PAD',year:'2024'},
 {label:'ToMT LMS 2024',training:'ToMT LMS',year:'2024'},
 {label:'ToT LMS 2024',training:'ToT LMS',year:'2024'},
];
export const combinedPresets = [
 {label:'Pelatih LMS',training:'__LMS',cohorts:cohortPresets.filter(p=>p.training==='ToMT LMS'||p.training==='ToT LMS')},
 {label:'Pelatih bukan LMS',training:'__NON_LMS',cohorts:cohortPresets.filter(p=>!['ToMT LMS','ToT LMS'].includes(p.training))},
];
export function trainingLabel(training:string){
 return combinedPresets.find(p=>p.training===training)?.label || (training==='__PAD'?'Seluruh PAD':training||'Seluruh pelatihan');
}
export function matchesTraining(record:TrainingRecord, training:string, year:string){
 const combined=combinedPresets.find(p=>p.training===training);
 const matched=combined ? combined.cohorts.some(p=>record.training===p.training&&String(record.year)===p.year) : !training || (training==='__PAD' ? ['ToMT PAD','ToT PAD','ToT Tambahan PAD'].includes(record.training||'') : record.training===training);
 return matched && (!year || String(record.year)===year);
}
export function provinceDistribution(records:TrainingRecord[], provinces:string[],includeCenter=false){
 const people=groupTrainers(records), counts=new Map<string,number>();
 for(const person of people)counts.set(person.province,(counts.get(person.province)||0)+1);
 const categories=includeCenter?[...provinces,'Pusat']:provinces;
 const total=categories.reduce((sum,name)=>sum+(counts.get(name)||0),0);
 return {total,center:counts.get('Pusat')||0,items:categories.map(name=>({name,count:counts.get(name)||0,percent:total?(counts.get(name)||0)/total*100:0})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'id'))};
}
export function formatPercent(value:number){return value.toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2})+'%'}
