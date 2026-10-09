/** NEW Apps Script project. Do not replace the existing synchronization script.
 * Configure Script Properties: FIREBASE_API_KEY, FIREBASE_PROJECT_ID,
 * DATABASE_ID and APPROVED_EMAILS (comma separated). Default is deny all.
 * Deploy as web app: Execute as owner, accessible by Anyone.
 * Public access to this endpoint does not grant access to spreadsheet data.
 */
function answer_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return answer_({ok:false,code:'AUTH_REQUIRED',error:'Silakan masuk terlebih dahulu.'});}
function authorized_(token){
 const p=PropertiesService.getScriptProperties();
 const key=p.getProperty('FIREBASE_API_KEY'),project=p.getProperty('FIREBASE_PROJECT_ID');
 if(!key||!project||typeof token!=='string'||token.length>10000)throw Error('AUTH_REQUIRED');
 // Parsing only supplies additional project/time restrictions. Google verifies the token.
 let claims;
 try{claims=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(token.split('.')[1])).getDataAsString());}catch(e){throw Error('AUTH_REQUIRED');}
 const now=Math.floor(Date.now()/1000);
 if(claims.aud!==project||claims.iss!=='https://securetoken.google.com/'+project||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60)throw Error('AUTH_REQUIRED');
 const result=UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(key),{method:'post',contentType:'application/json',payload:JSON.stringify({idToken:token}),muteHttpExceptions:true});
 if(result.getResponseCode()!==200)throw Error('AUTH_REQUIRED');
 const users=JSON.parse(result.getContentText()).users;
 const user=Array.isArray(users)&&users.length===1?users[0]:null;
 if(!user||user.localId!==claims.sub||user.disabled||user.emailVerified!==true||Number(user.validSince||0)>claims.iat)throw Error('AUTH_REQUIRED');
 const approved=(p.getProperty('APPROVED_EMAILS')||'').split(',').map(function(email){return email.trim().toLowerCase();}).filter(Boolean);
 if(approved.indexOf(String(user.email||'').toLowerCase())<0)throw Error('ACCESS_DENIED');
 return true;
}
function readTab_(db,name,columns){const tab=db.getSheetByName(name);if(!tab)throw Error('DATA_UNAVAILABLE');const count=tab.getLastRow()-5;return count>0?tab.getRange(6,1,count,columns).getDisplayValues().filter(function(row){return row[0].trim();}):[];}
function doPost(event){
 try{
  const body=event&&event.postData&&event.postData.contents;
  if(typeof body!=='string'||body.length>12000)throw Error('AUTH_REQUIRED');
  let input;try{input=JSON.parse(body);}catch(e){throw Error('AUTH_REQUIRED');}
  authorized_(input.idToken); // Spreadsheet is never opened before verified authorization.
  const id=PropertiesService.getScriptProperties().getProperty('DATABASE_ID');
  if(!id)throw Error('DATA_UNAVAILABLE');
  const db=SpreadsheetApp.openById(id);
  return answer_({ok:true,spreadsheetId:id,fetchedAt:new Date().toISOString(),master:readTab_(db,'Master Pelatih',12),history:readTab_(db,'Riwayat Pelatihan',9)});
 }catch(e){const code=['AUTH_REQUIRED','ACCESS_DENIED'].indexOf(e.message)>=0?e.message:'DATA_UNAVAILABLE';return answer_({ok:false,code:code,error:code==='ACCESS_DENIED'?'Email Anda belum disetujui oleh pengelola.':code==='AUTH_REQUIRED'?'Sesi login tidak valid. Silakan masuk kembali.':'Database belum dapat dibaca. Hubungi pengelola.'});}
}
