import {parseSheetsData} from './sheets-data';
let runtime:any;
export async function authRuntime(){
 if(runtime)return runtime;
 const response=await fetch('/auth-config.json',{cache:'no-store'});
 if(!response.ok)throw Error('Konfigurasi login belum tersedia.');
 const config=await response.json();
 if(!config.firebase?.apiKey||!config.firebase?.projectId||!config.firebase?.authDomain||!config.firebase?.appId||!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.dataEndpoint||''))throw Error('Login Google belum diaktifkan oleh pengelola. Dashboard telah disiapkan; konfigurasi Firebase dan layanan database masih perlu dipasang.');
 const appUrl='https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
 const authUrl='https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
 const [appSDK,authSDK]=await Promise.all([import(/* @vite-ignore */appUrl),import(/* @vite-ignore */authUrl)]);
 const app=appSDK.initializeApp(config.firebase);
 const auth=authSDK.getAuth(app);
 await authSDK.setPersistence(auth,authSDK.browserSessionPersistence);
 runtime={auth,authSDK,config};return runtime;
}
export async function login(){const {auth,authSDK}=await authRuntime();const provider=new authSDK.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await authSDK.signInWithPopup(auth,provider);}
export async function logout(){if(runtime)await runtime.authSDK.signOut(runtime.auth);}
export async function requestDatabase(){
 const {auth,config}=await authRuntime();
 if(!auth.currentUser)throw Error('Silakan masuk kembali.');
 const idToken=await auth.currentUser.getIdToken();
 const response=await fetch(config.dataEndpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({idToken}),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(90000)});
 if(!response.ok)throw Error('Layanan database tidak dapat dihubungi.');
 const data=await response.json();
 if(!data.ok){const error:any=Error(data.error||'Data tidak dapat dibaca.');error.accessDenied=data.code==='ACCESS_DENIED'||data.code==='AUTH_REQUIRED';throw error;}
 return {rows:parseSheetsData(data),source:'sheets',fetchedAt:data.fetchedAt};
}
