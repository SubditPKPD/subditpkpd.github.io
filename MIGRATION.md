# Status pemindahan

Halaman publik GitHub Pages menampilkan peta referensi wilayah dan tautan ke aplikasi lama yang dilindungi autentikasi Sites. Ini tahap awal, bukan pemindahan penuh dashboard.

Data pelatih, token Google Sheets, spreadsheet privat, dan server aplikasi lama tidak disertakan dalam repository publik.

Login langsung di GitHub Pages, daftar email yang diizinkan admin, dan API terautentikasi belum dikonfigurasi. Semua permintaan data pada implementasi berikutnya harus diperiksa oleh server sebelum data dikirim. Jangan menggunakan penyembunyian tampilan atau localStorage sebagai kontrol akses.

## Build

Sumber React ada di src. Install dependency dari package.json lalu jalankan npm run build. Salin hasil dist ke akar repository untuk publikasi berbasis branch GitHub Pages. File .nojekyll menonaktifkan Jekyll.

## Fitur yang masih berada di aplikasi lama

Filter pelatihan/tahun/LMS, statistik, diagram, daftar dan riwayat pelatih, serta sinkronisasi Google Sheets. Aplikasi lama tetap memiliki pembatasan pengguna sebelumnya.
