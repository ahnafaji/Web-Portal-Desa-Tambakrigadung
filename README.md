# Portal Desa Tambakrigadung - Frontend

React 18 + Vite + React Router. Typography: Poppins. Warna: Primary (emas), Secondary (hijau), Neutral, semua ada di `src/styles/tokens.css`. Backend (Express) dihubungkan belakangan lewat `src/services/api.js`.

## Menjalankan
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil di folder dist/
```

## Mode data
- `.env` -> `VITE_USE_MOCK=true`  : pakai data dummy `src/data/mock.js` (backend belum perlu ada)
- `.env` -> `VITE_USE_MOCK=false` : ambil data dari Express di `http://localhost:5000/api/*` (lewat proxy Vite)

## Kontrak endpoint yang dipakai Homepage (untuk dibagikan ke Backend Developer)
Semua GET, balasan `{ "data": ... }`.
| Endpoint | Bentuk data (lihat contoh di src/data/mock.js) |
| --- | --- |
| /api/slider | [{id,title,subtitle,image}] |
| /api/statistik | [{key,label,value,icon,color}] |
| /api/profil | {sejarah,kepalaDesa[],visi,misi[],runningText} |
| /api/sambutan | {nama,jabatan,foto,teks} |
| /api/potensi?limit=3 | [{id,nama,image}] |
| /api/apbd | {tahun,pendapatan,pengeluaran} |
| /api/umkm?limit=3 | [{id,nama,tanggal,image,slug}] |
| /api/berita?limit=3 | [{id,judul,tanggal,image,slug}] |
| /api/kontak | {nama,alamat,kodeWilayah,telepon,email,nomorPengurus[],jelajahi[]} |

## Gambar
Taruh aset di `public/images/` (hero-1.jpg, kades.jpg, potensi-*.jpg, umkm-1.jpg, berita-1.jpg, dst).
