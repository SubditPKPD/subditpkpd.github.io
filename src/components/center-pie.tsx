'use client';
import {PieChart,Pie,Cell,Tooltip} from 'recharts';
import {ChartContainer} from './ui/chart';
import {formatPercent} from '../lib/trainer-analysis';
const colors:Record<string,string>={
 'Balai Pemdes Lampung':'#008cf0',
 'Balai Pemdes Yogyakarta':'#00bd8a',
 'Balai Besar Pemdes Malang':'#f5a914',
 'Ditjen Bina Pemdes':'#fa4665',
 'Instansi Pusat lainnya / belum terverifikasi':'#7957cc',
};
type Item={name:string;count:number;percent:number};
export default function CenterPie({items,total,onSelect,region='Pusat'}:{items:Item[];total:number;onSelect:(name:string)=>void;region?:string}){
 const palette=['#008cf0','#00bd8a','#f5a914','#fa4665','#7957cc','#00a8b5','#c65c00','#4763c4','#9d397e','#54812c'];
 const colorFor=(name:string)=>colors[name]||(name==='Pelatih Provinsi'?'#258590':name.includes('verifikasi')?'#7b8797':palette[Math.max(0,items.findIndex(item=>item.name===name))%palette.length]);
 const nonzero=items.filter(item=>item.count>0);
 return <div className="centerPieCard">
  <ChartContainer config={{count:{label:'Pelatih unik',color:'#008cf0'}}} className="centerPieChart" style={{height:360,width:'100%',maxWidth:500,aspectRatio:'auto',margin:'0 auto'}}>
   <PieChart accessibilityLayer><Pie onClick={(data:any)=>{const name=data?.payload?.name||data?.name;if(name)onSelect(name)}} style={{cursor:'pointer'}} data={nonzero} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius="82%" startAngle={90} endAngle={-270} stroke="#fff" strokeWidth={2} isAnimationActive={false} labelLine={false} label={({cx,cy,midAngle,innerRadius,outerRadius,value}:any)=>{
    const percent=total>0?Number(value)/total*100:0;
    if(!Number.isFinite(percent)||percent<4.5)return null;
    const radius=Number(innerRadius)+(Number(outerRadius)-Number(innerRadius))*0.7,angle=-Number(midAngle)*Math.PI/180;
    return <text x={Number(cx)+radius*Math.cos(angle)} y={Number(cy)+radius*Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={14} fontWeight={700} stroke="#17324c" strokeWidth={0.5} paintOrder="stroke">{formatPercent(percent)}</text>;
   }}>{nonzero.map(item=><Cell key={item.name} fill={colorFor(item.name)}/>)}</Pie><Tooltip content={({active,payload})=>{const item=payload?.[0]?.payload;return active&&item?<div className="distributionTooltip"><b>{item.name}</b><span>{item.count.toLocaleString('id-ID')} orang · {formatPercent(item.percent)}</span></div>:null}}/></PieChart>
  </ChartContainer>
  <ul className="centerPieLegend" aria-label={`Jumlah dan persentase pelatih di ${region}`}>{items.map(item=><li key={item.name}><button className="centerLegendButton" onClick={()=>onSelect(item.name)} aria-label={`Lihat ${item.count} pelatih ${item.name}`}><span className="centerLegendDot" style={{background:colorFor(item.name)}}/><span>{item.name}</span><b>{item.count.toLocaleString('id-ID')} orang</b><strong>{formatPercent(item.percent)}</strong></button></li>)}</ul>
  <p className="centerPieFoot">Total: {total.toLocaleString('id-ID')} pelatih unik · Persentase dari seluruh pelatih di {region} pada filter aktif.</p>
 </div>
}
