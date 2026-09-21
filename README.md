# DocuView Mobile PDF

DocuView adalah aplikasi pembaca PDF berbasis Progressive Web App (PWA) yang ringan, cepat, dan dapat digunakan secara lokal di browser.

## Fitur

- Membuka file PDF dari perangkat.
- Menampilkan halaman PDF dengan ukuran yang menyesuaikan dokumen.
- Navigasi halaman sebelumnya dan berikutnya.
- Zoom dan rotasi halaman.
- Thumbnail halaman.
- Pencarian teks di dalam PDF.
- Riwayat file yang pernah dibuka.
- Mode terang dan gelap.
- Dukungan offline melalui service worker.
- Dukungan berbagi PDF melalui fitur Share Target pada browser/Android yang kompatibel.

## Demo

GitHub Pages: [Buka DocuView](https://masmas99.github.io/bukapdf_android_noiklan/)

## Cara Menggunakan

1. Buka aplikasi melalui browser.
2. Tekan **Buka PDF** atau **Pilih File PDF**.
3. Pilih file PDF dari perangkat.
4. Gunakan tombol navigasi, zoom, rotasi, pencarian, dan thumbnail sesuai kebutuhan.

Untuk membagikan PDF dari WhatsApp atau aplikasi lain:

1. Pilih file PDF.
2. Tekan **Bagikan**.
3. Pilih **DocuView** jika tersedia.

Ketersediaan DocuView pada menu berbagi bergantung pada dukungan browser dan versi Android. Upload PDF dari dalam aplikasi merupakan cara yang paling kompatibel.

## Instalasi sebagai PWA

1. Buka URL aplikasi menggunakan Chrome atau browser yang mendukung PWA.
2. Buka menu browser.
3. Pilih **Tambahkan ke layar utama** atau **Install app**.
4. Jalankan DocuView dari layar utama.

## Menjalankan Secara Lokal

Karena service worker membutuhkan HTTP atau HTTPS, jalankan project melalui web server lokal. Contoh menggunakan PHP:

```powershell
php -S localhost:8000
```

Kemudian buka:

```text
http://localhost:8000
```

## Struktur Utama

```text
index.html       Antarmuka dan logika pembaca PDF
manifest.json    Konfigurasi PWA
sw.js            Service worker dan cache offline
assets/          Aset aplikasi
icons/           Ikon PWA
```

## Teknologi

- HTML, CSS, dan JavaScript
- PDF.js
- Tailwind CSS CDN
- Font Awesome
- Service Worker
- Web App Manifest

## Catatan Privasi

File PDF diproses secara lokal di perangkat menggunakan PDF.js. File tidak dikirim ke server aplikasi.
