const img = (name) => `/images/${name}`;

export const slider = [
  { id: 1, title: "Desa Tambakrigadung", subtitle: "Kec. Tikung, Kab. Lamongan, Prov. Jawa Timur", image: img("hero-1.jpg") },
  { id: 2, title: "Balai Desa Tambakrigadung", subtitle: "Melayani dengan sepenuh hati", image: img("hero-2.jpg") },
  { id: 3, title: "Potensi Perikanan dan Peternakan", subtitle: "Penggerak ekonomi warga desa", image: img("hero-3.jpg") },
];

export const statistik = [
  { key: "jiwa", label: "Total Jiwa", value: 2039, icon: "users", color: "#79a98a" },
  { key: "kk", label: "Kepala Keluarga", value: 733, icon: "user", color: "#e53935" },
  { key: "laki", label: "Laki-Laki", value: 1080, icon: "male", color: "#3b82f6" },
  { key: "perempuan", label: "Perempuan", value: 939, icon: "female", color: "#e91ee9" },
  { key: "umkm", label: "Produk UMKM", value: 14, icon: "cart", color: "#2b2825" },
  { key: "potensi", label: "Potensi Desa", value: 11, icon: "trophy", color: "#2b2825" },
  { key: "fasilitas", label: "Fasilitas Desa", value: 10, icon: "building", color: "#2b2825" },
  { key: "aparatur", label: "Aparatur Desa", value: 44, icon: "group", color: "#2b2825" },
];

export const profil = {
  sejarah:
    "Desa Tambakrigadung merupakan salah satu desa yang berada di wilayah Kecamatan Tikung, Kabupaten Lamongan, Provinsi Jawa Timur. Perjalanan pemerintahan desa mengalami beberapa pergantian kepemimpinan dari masa ke masa.",
  kepalaDesa: [
    { urutan: 1, nama: "Asikin Demang", periode: "1932 - 1965" },
    { urutan: 2, nama: "Supardi", periode: "1966 - 1990" },
    { urutan: 3, nama: "Supardi", periode: "1990 - 1998" },
    { urutan: 4, nama: "H. Baris", periode: "1998 - 2007" },
    { urutan: 5, nama: "H. Baris", periode: "2007 - 2013" },
    { urutan: 6, nama: "Mugiharto", periode: "2013 - 2019" },
    { urutan: 7, nama: "Moch. Takim", periode: "2019 - Sekarang" },
  ],
  visi: "Terwujudnya Desa Tambakrigadung Yang Mandiri, Berdaya Saing, Agamis, dan Berketahanan Iklim Berbasis Gotong Royong.",
  misi: [
    "Meningkatkan Kualitas Tata Kelola Pemerintahan Desa. Mewujudkan pelayanan publik yang transparan, akuntabel, cepat, dan berbasis digital untuk kemudahan administrasi masyarakat.",
    "Memperkuat Kemandirian Ekonomi dan Ketahanan Pangan. Mengoptimalkan peran BUMDes, koperasi desa, serta sektor pertanian dan UMKM lokal guna meningkatkan kesejahteraan warga.",
    "Meningkatkan Pembangunan Infrastruktur Dasar yang Merata. Membangun dan memelihara jalan lingkungan, saluran irigasi pertanian, serta fasilitas umum secara berkelanjutan.",
  ],
  runningText: "Selamat Datang Di Website Resmi Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
};

export const sambutan = {
  nama: "Moch. Takim",
  jabatan: "Kepala Desa",
  foto: img("kades.jpeg"),
  teks: "Assalamu’alaikum warahmatullahi wabarakatuh, Salam sejahtera untuk kita semua. Puji syukur kita panjatkan ke hadirat Allah SWT, karena pada hari ini kita dapat berkumpul bersama dalam kegiatan yang sangat bermanfaat bagi kemajuan Desa Cikahuripan. Saya mengucapkan terima kasih kepada seluruh warga.",
};

export const potensi = [
  { id: 1, nama: "Potensi Wisata Boyo Sirno Desa Tambakrigadung", image: img("potensi-wisata.jpg") },
  { id: 2, nama: "Potensi Tambak Ikan Desa Tambakrigadung", image: img("potensi-tambak.jpg") },
  { id: 3, nama: "Potensi Ternak Domba Desa Tambakrigadung", image: img("potensi-domba.jpg") },
];

export const apbd = { tahun: 2026, pendapatan: 969000000, pengeluaran: 955050000 };

const umkmItem = (id) => ({ id, nama: "Ayam Geprek Pak Gembul", tanggal: "2026-08-20", image: img("umkm-1.jpg"), slug: `ayam-geprek-pak-gembul-${id}` });
export const umkm = [umkmItem(1), umkmItem(2), umkmItem(3)];

const beritaItem = (id) => ({ id, judul: "Kerja Bakti Membersihkan Saluran Air Oleh Seluruh Warga", tanggal: "2026-08-20", image: img("berita-1.jpg"), slug: `kerja-bakti-${id}` });
export const berita = [beritaItem(1), beritaItem(2), beritaItem(3)];

export const kontak = {
  nama: "Pemerintah Desa Tambakrigadung",
  alamat: "VC9G+67Q, Jl. Raya Tambak Boyo, Tikung, Tambakboyo, Kec. Tikung, Kabupaten Lamongan, Jawa Timur 62281",
  kodeWilayah: "35.24.23.2011",
  telepon: "+123 3888 994 838",
  email: "tambakrigadung@gmail.com",
  nomorPengurus: [
    { label: "Pak Moch. Takim (Kepala Desa)", href: "#" },
    { label: "Pak (Sekertaris)", href: "#" },
    { label: "Pak (Babinsa)", href: "#" },
  ],
  jelajahi: [
    { label: "Website Kecamatan Tikung", href: "https://tikung.lamongankab.go.id/" },
    { label: "Website Provinsi", href: "https://jatimprov.go.id/" },
    { label: "Cek DPT Online", href: "https://cekdptonline.kpu.go.id/" },
    { label: "Cek Bansos Kemensos", href: "https://cekbansos.kemensos.go.id/" },
  ],
};



// Halaman Potensi Desa (/potensi)

const MAPS = "https://www.google.com/maps/search/?api=1&query=";

export const potensiPage = {
  header: {
    badge: "Kekayaan Alam & Kemandirian Desa",
    judul: "Potensi Unggulan Desa Tambakrigadung",
    deskripsi:
      "Mengenal kekayaan alam, wisata, perikanan, peternakan, dan pertanian unggulan yang menjadi penggerak ekonomi dan kesejahteraan masyarakat Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan.",
    labelBidang: "Sektor Unggulan Utama",
  },
  kategori: [
    { key: "wisata", label: "Wisata & Rekreasi" },
    { key: "perikanan", label: "Perikanan & Tambak" },
    { key: "peternakan", label: "Peternakan" },
  ],
  items: [
    {
      id: 1,
      kategori: "wisata",
      kategoriLabel: "Wisata Alam & Budaya",
      ikon: "trees",
      lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
      judul: "Wisata Boyo Sirno: Destinasi Rekreasi Desa Tambakrigadung",
      image: img("potensi-wisata.jpg"),
      deskripsi: [
        "Wisata Boyo Sirno merupakan salah satu potensi wisata unggulan Desa Tambakrigadung. Nama Boyo Sirno juga dikenal dalam filosofi lambang desa, yaitu pada makna tombak sebagai “Pamungkas Boyo Sirno”.",
        "Pemerintah desa mendukung pengembangan wisata ini melalui APBDes 2026, dengan alokasi Rp15.000.000 dari Dana Desa untuk kegiatan Pembangunan Desa Wisata. Letak desa hanya sekitar 2 km dari pusat Kabupaten Lamongan, dengan jalan beraspal yang dapat dilalui sepanjang tahun, menjadi modal penting bagi wisatawan maupun pelaku usaha.",
      ],
      info: [
        { ikon: "banknote", label: "Anggaran APBDes 2026", value: "Rp15.000.000 · Pembangunan Desa Wisata (Dana Desa)" },
        { ikon: "route", label: "Jarak ke Pusat Kabupaten", value: "± 2 km ke ibu kota Kab. Lamongan (BPS 2023)" },
        { ikon: "utensils", label: "Penunjang Kuliner", value: "4 restoran/rumah makan & 20 warung makan-minum (BPS 2023)" },
        { ikon: "calendar", label: "Agenda Budaya", value: "Sedekah Bumi Dusun Tuwiri (tradisi tahunan)" },
      ],
      aksi: [
        { label: "Petunjuk Rute / Lokasi", href: `${MAPS}${encodeURIComponent("Wisata Boyo Sirno Tambakrigadung Tikung Lamongan")}`, ikon: "navigation", primary: true },
        { label: "Lihat Galeri Foto", to: "/galeri", ikon: "image" },
      ],
    },
    {
      id: 2,
      kategori: "perikanan",
      kategoriLabel: "Perikanan & Budidaya",
      ikon: "fish",
      lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
      judul: "Budidaya Ikan Air Tawar: Tambak Khas Lamongan",
      image: img("potensi-tambak.jpg"),
      deskripsi: [
        "Kondisi dataran rendah serta keberadaan sumber air, embung, dan tambak darat menjadikan perikanan darat sebagai salah satu potensi Desa Tambakrigadung, sebagaimana kekhasan wilayah Lamongan. Budidaya dilakukan warga baik dalam skala rumah tangga maupun kelompok.",
        "Komoditas yang dibudidayakan meliputi lele, nila, dan bandeng. Untuk menjaga ketersediaan air, pemerintah desa menganggarkan pemeliharaan saluran air di Dusun Tambakboyo pada APBDes 2026.",
      ],
      info: [
        { ikon: "fish", label: "Komoditas Utama", value: "Lele, Nila, dan Bandeng" },
        { ikon: "users", label: "Skala Usaha", value: "Rumah tangga dan kelompok" },
        { ikon: "droplets", label: "Sumber Air", value: "Sumber air, embung, dan tambak darat" },
        { ikon: "banknote", label: "Dukungan Desa 2026", value: "Rp5.000.000 · Pemeliharaan saluran air Dusun Tambakboyo" },
      ],
      aksi: [
        { label: "Hubungi Pemerintah Desa", to: "/kontak", ikon: "phone", primary: true },
        { label: "Lihat UMKM Desa", to: "/umkm", ikon: "store" },
      ],
    },
    {
      id: 3,
      kategori: "peternakan",
      kategoriLabel: "Peternakan Terintegrasi",
      ikon: "paw",
      lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
      judul: "Peternakan Domba Kolektif BUMDes Tambakrigadung",
      image: img("potensi-domba.jpg"),
      deskripsi: [
        "Peternakan merupakan sektor unggulan Desa Tambakrigadung dengan komoditas domba, kambing, dan ternak potong. Sektor ini dikelola secara kolektif melalui inovasi peternakan domba milik BUMDes Tambakrigadung.",
        "Hasil peternakan juga menjadi bahan baku bagi pelaku UMKM desa yang mengembangkan olahan pangan lokal, sehingga komoditas mentah memiliki nilai tambah bagi ekonomi warga.",
      ],
      info: [
        { ikon: "paw", label: "Komoditas Ternak", value: "Domba, kambing, dan ternak potong" },
        { ikon: "landmark", label: "Pengelola", value: "BUMDes Tambakrigadung" },
        { ikon: "users", label: "Pola Usaha", value: "Dikelola kolektif melalui inovasi peternakan domba" },
        { ikon: "store", label: "Hilirisasi", value: "Olahan hasil peternakan oleh UMKM desa" },
      ],
      aksi: [
        { label: "Hubungi Pemerintah Desa", to: "/kontak", ikon: "phone", primary: true },
        { label: "Lihat Galeri Foto", to: "/galeri", ikon: "image" },
      ],
    },
  ],
  statistik: {
    judul: "Potensi Desa dalam Angka",
    subjudul: "Ringkasan data resmi desa dan Kecamatan Tikung sebagai gambaran daya dukung sektor unggulan.",
    diperbarui: "Data BPS 2023 & APBDes 2026",
    items: [
      { key: "luas", label: "Luas Wilayah", value: "421 Ha", caption: "4,21 km² · 7,38% luas Kec. Tikung", persen: 7.38 },
      { key: "penduduk", label: "Penduduk", value: "6.644 Jiwa", caption: "13,95% penduduk Kec. Tikung · 3 dusun, 15 RW, 58 RT", persen: 13.95 },
      { key: "usaha", label: "Warung & Toko", value: "45 Unit", caption: "20 warung makan-minum + 25 toko kelontong · 5,4% dari Kec. Tikung", persen: 5.42 },
      { key: "bangun", label: "Belanja Pembangunan", value: "Rp227,3 jt", caption: "24,5% dari total belanja APBDes 2026", persen: 24.5 },
    ],
    sumber:
      "Sumber: Formulir Profil Desa Tambakrigadung; BPS Kab. Lamongan, Kecamatan Tikung dalam Angka 2024 (data 2023); Perdes No. 06 Tahun 2025 tentang APBDes 2026. Persentase dihitung dari data tersebut.",
  },
  cta: {
    badge: "Kemitraan & Kunjungan",
    judul: "Tertarik Menjalin Kerja Sama atau Berkunjung ke Desa Kami?",
    deskripsi:
      "Pemerintah Desa Tambakrigadung terbuka bagi calon mitra usaha, investor, maupun pengunjung yang ingin mengenal potensi perikanan, peternakan, pertanian, dan wisata desa.",
    whatsapp: "6281332837585",
    email: "Pemdestambakrigadung@gmail.com",
  },
};
