# Migrasi database pelatih ke GitHub Pages

Portal publik, dashboard penuh (filter LMS/bukan LMS, kohort/tahun, peta, grafik Pusat/provinsi/kabupaten, daftar unik, riwayat dan ekspor) dan alur login Google tersedia dalam kode.

Konfigurasi auth-config.json masih kosong: layanan menolak pembacaan data sampai Firebase dan Apps Script dipasang. Lihat ACTIVATION.md. Database lama tetap dilindungi di https://persebaran-pelatih-desa.subditkapasitaspemde.chatgpt.site/.

Dashboard hanya menerima data dari endpoint yang memeriksa token Google/Firebase dan email yang disetujui, lalu membaca spreadsheet privat. Tidak ada database, snapshot peserta atau token sinkronisasi lama dalam repositori publik.

Untuk membangun ulang: npm install, npm run build. Salin dist/index.html dan dist/assets ke root repository, serta auth-config.json. source.html adalah entry build. Hosting saat ini memakai GitHub Pages dari main/root.
