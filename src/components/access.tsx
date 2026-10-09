import React,{useState,lazy,Suspense} from 'react';
import {LockKeyhole} from 'lucide-react';
import {login,logout,requestDatabase} from '../lib/access';
const Dashboard=lazy(()=>import('../app/dashboard'));
export default function Access({onClose}:{onClose:()=>void}){
 const [approved,setApproved]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function enter(){setBusy(true);setError('');try{await login();await requestDatabase();setApproved(true);}catch(e){setError((e as Error).message);await logout();}finally{setBusy(false)}}
 async function exit(){setApproved(false);await logout();onClose();}
 if(approved)return <Suspense fallback={<main className="loginPage">Memuat dashboard…</main>}><Dashboard onExit={exit}/></Suspense>;
 return <main className="loginPage"><section className="loginCard"><LockKeyhole size={40}/><div className="eyebrow">SUBDIT PKPD</div><h1>Masuk ke database pelatih</h1><p>Gunakan akun Google dengan email yang telah disetujui pengelola.</p><button className="primary" disabled={busy} onClick={enter}>{busy?'Memeriksa akun dan izin akses…':'Masuk dengan Google'}</button>{error&&<p className="alert" role="alert">{error}</p>}<button onClick={onClose}>Kembali ke peta</button></section></main>
}
