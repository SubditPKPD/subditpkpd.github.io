import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const script=readFileSync(new URL('../backend/Code.gs',import.meta.url),'utf8');
function scenario({body,claims,user,approved='owner@example.com',lookupCode=200}){
 let opens=0,lookups=0;
 const props={FIREBASE_API_KEY:'test-key',FIREBASE_PROJECT_ID:'test-project',DATABASE_ID:'private-sheet',APPROVED_EMAILS:approved};
 const context={PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},Utilities:{base64DecodeWebSafe:s=>Buffer.from(s,'base64url'),newBlob:b=>({getDataAsString:()=>b.toString()})},UrlFetchApp:{fetch:()=>{lookups++;return {getResponseCode:()=>lookupCode,getContentText:()=>JSON.stringify({users:[user]})}}},SpreadsheetApp:{openById:()=>{opens++;return {getSheetByName:()=>({getLastRow:()=>6,getRange:()=>({getDisplayValues:()=>[['id']]})})}}},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}};
 vm.createContext(context);vm.runInContext(script,context);
 const token=claims?'header.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.signature':undefined;
 const result=context.doPost({postData:{contents:body??JSON.stringify({idToken:token})}});return {result,opens,lookups};
}
const now=Math.floor(Date.now()/1000),claims={aud:'test-project',iss:'https://securetoken.google.com/test-project',sub:'uid',iat:now,exp:now+3600};
const user={localId:'uid',email:'owner@example.com',emailVerified:true,validSince:0};
for(const options of [{},{body:'broken'},{claims:{...claims,aud:'other'},user},{claims:{...claims,exp:now-1},user},{claims,user,lookupCode:400},{claims,user:{...user,emailVerified:false}},{claims,user:{...user,disabled:true}},{claims,user:{...user,validSince:now+1}},{claims,user:{...user,email:'other@example.com'}},{claims,user,approved:''}]){const {result,opens}=scenario(options);assert.equal(result.ok,false);assert.equal(opens,0,'Rejected requests must not open the private spreadsheet');}
const allowed=scenario({claims,user});assert.equal(allowed.result.ok,true);assert.equal(allowed.opens,1);assert.equal(allowed.lookups,1);
console.log('11 authorization scenarios passed; rejected requests never opened spreadsheet.');
