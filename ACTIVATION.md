# Aktivasi login dan database SubditPKPD

Dashboard dan halaman login sudah disiapkan. Login belum aktif sampai konfigurasi di bawah selesai. Tidak ada data pelatih atau token sinkronisasi lama di repositori publik ini.

## 1. Firebase milik instansi

Buka https://console.firebase.google.com/ menggunakan akun instansi. Buat proyek SubditPKPD, daftarkan aplikasi Web, kemudian salin konfigurasi publik aplikasi (apiKey, authDomain, projectId, appId).

Di Authentication > Sign-in method, aktifkan Google dan isi email dukungan. Pada Authentication > Settings > Authorized domains, tambahkan subditpkpd.github.io.

Isi bagian firebase dalam auth-config.json. Jangan memasukkan service account private key atau token sinkronisasi Google Sheets.

## 2. Endpoint database terpisah

Buat proyek baru di https://script.google.com/ dengan akun pemilik Google Sheets. Salin backend/Code.gs. Jangan mengganti proyek sinkronisasi lama.

Pada Project Settings > Script Properties tambahkan:

- FIREBASE_API_KEY: apiKey dari aplikasi Firebase yang sama.
- FIREBASE_PROJECT_ID: projectId yang sama.
- DATABASE_ID: 1gSSTYg_VyiUWfoUUSb_iPY8nFiUkJXrBdFqw1W4XhUw
- APPROVED_EMAILS: daftar email yang Anda setujui, dipisahkan koma. Isi email Anda sendiri terlebih dahulu. Jika kosong, semua pengguna ditolak.

Deploy > New deployment > Web app. Execute as: akun pemilik. Who has access: Anyone. Selesaikan otorisasi untuk spreadsheet dan koneksi Google API. Endpoint publik tetap memeriksa token Firebase dan daftar email sebelum membuka spreadsheet.

Salin URL /exec ke dataEndpoint dalam auth-config.json. Google Sheet tetap privat; tidak perlu Publish to web atau berbagi Anyone with link.

Jika membatasi Firebase API key, izinkan Identity Toolkit API. Pemakaian API key pada browser DAN server Apps Script perlu diperhitungkan; pembatasan hanya berdasarkan HTTP referrer browser dapat menolak panggilan server.

## 3. Pemeriksaan sebelum dinyatakan aktif

Setelah auth-config.json dikirim ke GitHub dan Pages selesai:

1. Email yang disetujui dapat login, membaca data, memakai filter dan ekspor.
2. Email yang belum disetujui menerima penolakan dan tidak mendapatkan payload data.
3. Pemanggilan endpoint tanpa token, token palsu/kedaluwarsa atau dari proyek Firebase lain ditolak.
4. Edit satu catatan di Google Sheets dan periksa pembaruan dashboard maksimal setelah pemeriksaan 60 detik saat tab terlihat (ditambah waktu jaringan).
5. Hapus email dari APPROVED_EMAILS; permintaan data berikutnya ditolak dan dashboard dikosongkan.
6. Uji browser untuk pembacaan respons Apps Script setelah redirect ContentService. Jika kebijakan browser/akun memblokir respons lintas origin, endpoint memerlukan penyesuaian sebelum login dinyatakan berfungsi.

Penyegaran bukan push instan. Data pengguna yang sebelumnya sudah diunduh tidak dapat ditarik kembali. Dashboard membaca ulang izin pada setiap permintaan.

## Status pengujian saat kode dipublikasikan

Build produksi dan pengujian penolakan endpoint dengan mock lulus. Login Google nyata, izin Google Sheets, CORS dan pembaruan data menyeluruh belum dapat diuji sebelum proyek Firebase dan deployment Apps Script dikonfigurasi.
