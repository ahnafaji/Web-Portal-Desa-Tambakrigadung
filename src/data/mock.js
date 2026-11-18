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
