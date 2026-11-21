# 🏘️ Website Portal Informasi Desa Tambakrigadung

Website portal informasi dan promosi Desa Tambakrigadung yang menampilkan profil desa, berita, UMKM unggulan, potensi desa, galeri dokumentasi, dan kontak. Dikembangkan sebagai project akhir **Studi Independen — Mobilitas Akademik Berdampak** bersama **Celerates** (Web Development & UI/UX).

---

## 📌 Latar Belakang

Desa Tambakrigadung memiliki potensi wisata, perikanan, peternakan, koperasi, dan paguyuban UMKM yang aktif. Namun, informasi desa dan promosi potensi belum terpusat dalam satu wadah digital. Website ini hadir sebagai **media promosi dan informasi** agar desa lebih dikenal masyarakat luas.

> ⚠️ **Catatan penting:** Website ini **BUKAN** layanan administrasi online (surat-menyurat). Sesuai arahan Kepala Desa, layanan administrasi tetap berjalan melalui RT/RW dan Dukcapil seperti biasa. Fokus website adalah **promosi dan informasi**.

---

## 🎯 Tujuan

- Memusatkan informasi desa dalam satu portal digital
- Mempromosikan UMKM, produk unggulan, dan potensi desa
- Mendokumentasikan kegiatan dan event desa
- Memudahkan masyarakat luar mengenal Desa Tambakrigadung

---

## 🌱 SDGs yang Didukung

**SDGs 8 — Pekerjaan Layak dan Pertumbuhan Ekonomi**
*(Decent Work and Economic Growth)*

Website ini mendukung pertumbuhan ekonomi lokal melalui promosi UMKM, produk unggulan, dan potensi desa.

---

## ✨ Fitur

### Area Publik (Pengunjung)

| Fitur | Deskripsi |
|-------|-----------|
| **Beranda** | Etalase desa: hero, sorotan berita, UMKM, potensi, galeri |
| **Profil Desa** | Sejarah, visi misi, struktur pemerintahan, letak geografis |
| **Berita & Informasi** | Kegiatan desa, rapat RT/RW, musdes, pengumuman (dengan filter kategori) |
| **UMKM & Produk** | Katalog UMKM, produk, foto, harga, kontak WhatsApp |
| **Potensi Desa** | Wisata, perikanan, peternakan, Koperasi Sunan Drajat |
| **Galeri Dokumentasi** | Foto kegiatan desa dan event tahunan (dengan filter & lightbox) |
| **Kontak & Lokasi** | Alamat, jam operasional, kontak perangkat desa, peta lokasi |

### Area Admin (Perangkat Desa)

| Fitur | Deskripsi |
|-------|-----------|
| **Login Admin** | Autentikasi dengan email/username & password (hash + session) |
| **Dashboard** | Ringkasan statistik konten & navigasi pengelolaan |
| **Kelola Profil Desa** | Tambah/ubah sejarah, visi misi, struktur, geografis |
| **Kelola Berita** | CRUD berita dengan status draft/published |
| **Kelola UMKM & Produk** | CRUD UMKM beserta produknya (1 UMKM : N produk) |
| **Kelola Potensi Desa** | CRUD potensi per kategori |
| **Kelola Galeri** | Unggah/ubah/hapus foto dokumentasi (dengan kompres otomatis) |
| **Kelola Kontak** | Ubah alamat, jam operasional, kontak perangkat desa |

> 🔒 **Peta lokasi bersifat read-only** — admin hanya dapat melihat, tidak dapat mengubah titik koordinat.

### Opsional (Belum Masuk Scope)

- **Chatbot** — rule-based, menjawab seputar isi website dan tata cara administrasi (panduan, bukan layanan)

---

## 🛠️ Teknologi

> _Bagian ini disesuaikan dengan stack yang digunakan._

- **Frontend:** [HTML/CSS/JS atau React/Vue — sesuaikan]
- **Backend:** [Laravel/Express/Next.js — sesuaikan]
- **Database:** [MySQL/PostgreSQL — sesuaikan]
- **Autentikasi:** Session/Token dengan password hashing (bcrypt/argon2)
- **Peta:** Embed Google Maps (read-only)

---

## 📁 Struktur Proyek

```
.
├── public/              # Aset publik (gambar, favicon)
├── src/
│   ├── pages/           # Halaman publik
│   ├── admin/           # Halaman admin
│   ├── components/      # Komponen UI
│   └── assets/          # Gambar, ikon, style
├── database/            # Skema & seed
├── docs/                # Dokumentasi & spesifikasi fitur
└── README.md
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Clone repositori
git clone https://github.com/username/portal-desa-tambakrigadung.git
cd portal-desa-tambakrigadung

# 2. Install dependensi
npm install        # atau composer install

# 3. Salin file environment
cp .env.example .env

# 4. Sesuaikan konfigurasi database di .env
# 5. Jalankan migrasi & seed
npm run migrate    # atau php artisan migrate --seed

# 6. Jalankan server
npm run dev        # atau php artisan serve
```

Akses aplikasi di `http://localhost:3000` (atau port yang sesuai).

---

## 🔑 Akun Demo Admin

> _Ganti dengan kredensial seed yang kamu buat. Jangan commit kredensial produksi!_

| Field | Nilai |
|-------|-------|
| Email | admin@tambakrigadung.desa.id |
| Password | _(isi sesuai seed)_ |

---

## 📐 Prinsip Desain

- **Mobile-first** — mayoritas pengunjung mengakses via HP
- **Sederhana & ramah** — font besar (min. 16px), tombol min. 44×44px, navigasi mudah
- **Ringan** — waktu muat < 3 detik pada koneksi 3G
- **Aksesibel** — kontras memadai, teks alternatif pada gambar
- **Bahasa Indonesia** sepenuhnya

---

## ✅ Kebutuhan Non-Fungsional

| Aspek | Ketentuan |
|-------|-----------|
| Responsif | Layar 360px – 1440px |
| Kinerja | Muat < 3 detik pada 3G |
| Keamanan | Password di-hash, route admin terproteksi, validasi input server-side |
| Upload | Maks. 2MB/gambar, format JPG/PNG/WebP |
| Kompatibilitas | Chrome, Firefox, Safari, Edge; Android & iOS |

---

## 🗺️ Peta Situs

**Publik:**
```
/                → Beranda
/profil          → Profil Desa
/berita          → Daftar Berita
/berita/{slug}   → Detail Berita
/umkm            → Daftar UMKM
/umkm/{slug}     → Detail UMKM
/potensi         → Potensi Desa
/galeri          → Galeri Dokumentasi
/kontak          → Kontak & Lokasi
```

**Admin:**
```
/admin/login     → Login
/admin           → Dashboard
/admin/profil    → Kelola Profil Desa
/admin/berita    → Kelola Berita
/admin/umkm      → Kelola UMKM & Produk
/admin/potensi   → Kelola Potensi
/admin/galeri    → Kelola Galeri
/admin/kontak    → Kelola Kontak
```

---

## 📋 Status Pengembangan

- [ ] F-01 Beranda
- [ ] F-02 Profil Desa
- [ ] F-03 Berita & Informasi
- [ ] F-04 UMKM & Produk
- [ ] F-05 Potensi Desa
- [ ] F-06 Galeri Dokumentasi
- [ ] F-07 Kontak & Lokasi
- [ ] A-01 Login Admin
- [ ] A-02 Dashboard Admin
- [ ] A-03 Kelola Profil Desa
- [ ] A-04 Kelola Berita
- [ ] A-05 Kelola UMKM & Produk
- [ ] A-06 Kelola Potensi
- [ ] A-07 Kelola Galeri
- [ ] A-08 Kelola Kontak & Lokasi
- [ ] F-08 Chatbot _(opsional)_

---

## 👨‍💻 Pengembang

**[Nama Kamu]**
Mahasiswa Studi Independen — Mobilitas Akademik Berdampak
Mitra: Celerates (Web Development & UI/UX)

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik dan implementasi di Desa Tambakrigadung.
_[Sesuaikan lisensi — mis. MIT, atau nyatakan hak penggunaan untuk desa]_