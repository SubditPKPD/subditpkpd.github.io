const spreadsheetId='1gSSTYg_VyiUWfoUUSb_iPY8nFiUkJXrBdFqw1W4XhUw';
export function parseSheetsData(data:any){
 if(!data?.ok||data.spreadsheetId!==spreadsheetId||!Array.isArray(data.master)||!Array.isArray(data.history))throw Error('Respons database tidak sesuai. Periksa kode, izin dan deployment Apps Script.');
 if(!data.master.length||!data.history.length||data.master.length>50000||data.history.length>100000)throw Error('Database kosong atau melebihi batas pembacaan.');
 const masters=new Map<string,string[]>(),historyIds=new Set<string>();
 for(const row of data.master){
  if(!Array.isArray(row)||row.length!==12||row.some(v=>typeof v!=='string'))throw Error('Kolom Master Pelatih tidak sesuai.');
  const id=row[0].trim();if(!id||masters.has(id)||!row[1].trim())throw Error('ID Pelatih kosong/duplikat atau nama belum diisi. Periksa Master Pelatih.');
  masters.set(id,row);
 }
 const rows=data.history.map((row:any)=>{
  if(!Array.isArray(row)||row.length!==9||row.some(v=>typeof v!=='string'))throw Error('Kolom Riwayat Pelatihan tidak sesuai.');
  const id=row[0].trim(),personId=row[1].trim(),master=masters.get(personId);
  if(!id||historyIds.has(id)||!master)throw Error('ID Riwayat duplikat atau ID Pelatih tidak ditemukan dalam Master Pelatih.');
  historyIds.add(id);
  const year=Number(row[4]);if(!Number.isInteger(year)||year<2000||year>2100||!row[3].trim())throw Error('Jenis pelatihan atau tahun belum sesuai.');
  const level=master[4].trim()||'Tingkat daerah belum terverifikasi';
  if(!['Pusat','Provinsi','Kabupaten/Kota','Tingkat daerah belum terverifikasi'].includes(level))throw Error('Tingkat pelatih tidak dikenal.');
  if(level==='Kabupaten/Kota'&&!master[3].trim())throw Error('Pelatih Kabupaten/Kota belum memiliki wilayah kabupaten/kota.');
  return {id,trainerId:personId,name:master[1].trim(),originalName:row[2],province:level==='Pusat'?'Pusat':master[2].trim(),district:['Pusat','Provinsi'].includes(level)?'':master[3].trim(),level,institution:master[5].trim(),job:master[6].trim(),training:row[3].trim(),year,specialty:row[6].trim(),sourceSheet:row[7],sourceRow:Number(row[8])||0,identityNote:master[7]||master[11],regionWarning:master[8],districtOrigin:master[9]};
 });
 return rows;
}
