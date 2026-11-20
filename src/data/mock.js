const img = (name) => `/images/${name}`;
const MAPS = "https://www.google.com/maps/search/?api=1&query=";

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

// Ganti bagian `const umkmItem = ...` & `export const umkm = ...` di src/data/mock.js dengan kode berikut:

export const umkmItems = [
  {
    id: 1,
    slug: "ayam-geprek-pak-slamet",
    nama: "Ayam Geprek Pak Slamet",
    kategori: "pangan",
    kategoriLabel: "Kuliner & Kudapan",
    badgeUtama: "KULINER LOKAL",
    statusBuka: "Buka (09.00 - 21.00 WIB)",
    jamOperasional: "Setiap Hari, 09.00 – 21.00 WIB",
    dusun: "Dusun Tambakrigadung",
    alamat: "RT 03 / RW 01, Dusun Tambakrigadung, Tikung, Lamongan",
    patokanLokasi: "Dusun Tambakrigadung RT 03 (Depan Gapura Selatan)",
    pemilik: "Pak Slamet (Cak Slamet)",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, QRIS Desa, Bank Jatim",
    hargaLabel: "Rp 12.000 – Rp 25.000",
    hargaSatuan: "/ porsi",
    hargaBadge: "Harga Ramah Warga",
    hargaMulai: "Rp 12.000",
    tanggal: "2026-02-20",
    image: img("hero-1.jpg"),
    galeri: [img("hero-1.jpg"), img("hero-3.jpg"), img("potensi-tambak.jpg"), img("potensi-domba.jpg")],
    ringkasan:
      "Usaha kuliner ayam krispi favorit warga dengan racikan sambal bawang segar ulek dadakan. Menggunakan ayam potong segar harian dan bumbu rempah pilihan khas Lamongan.",
    tags: ["Pedas Lv 1–5", "Dibuat per Pesanan"],
    deskripsiLengkap: [
      "Ayam Geprek Pak Slamet berawal dari inisiatif keluarga sederhana di Dusun Tambakrigadung pada awal tahun 2021. Berbekal resep tepung bumbu krispi racikan sendiri dan sambal bawang khas pedesaan Jawa Timur yang gurih tanpa bahan pengawet, gerai ini dengan cepat menjadi salah satu destinasi kuliner andalan setiap siang para pegawai kantor desa, guru sekolah, petani, dan pemuda setempat.",
      "Melalui pendampingan program digitalisasi dan sertifikasi higienis pangan dari BUMDes Tambakrigadung, Pak Slamet telah menerapkan standar pengolahan bersih, pencatatan transaksi berkala, serta kemasan ramah lingkungan bersertifikasi pangan. Daging ayam dipasok langsung dari kelompok peternak lokal di kawasan Tikung setiap fajar, menjamin kesegaran rasa di setiap porsi.",
    ],
    catatanMenu: "Pilihan level pedas sambal: Level 1 s.d. Level 5",
    menu: [
      {
        id: 1,
        badge: "Paling Laris",
        nama: "Paket Geprek Sambal Bawang",
        deskripsi: "Nasi pulen hangat + Ayam Geprek Krispi (Paha/Dada) + Lalapan segar timun & kemangi + Es Teh manis.",
        harga: "Rp 15.000",
      },
      {
        id: 2,
        badge: "Favorit Remaja",
        nama: "Paket Geprek Mozarella Leleh",
        deskripsi: "Nasi putih hangat + Ayam krispi berselimut keju mozarella bakar leleh + Sambal korek ulek dadakan.",
        harga: "Rp 20.000",
      },
      {
        id: 3,
        badge: "Porsi Kenyang",
        nama: "Ayam Geprek Jumbo Komplit",
        deskripsi: "Potongan ayam ukuran besar + Nasi dobel + Tahu goreng krispi + Tempe gurih + Gratis ekstra sambal.",
        harga: "Rp 22.000",
      },
      {
        id: 4,
        badge: "Sensasi Gurih",
        nama: "Mie Geprek Pedas Nampol",
        deskripsi: "Mie instan goreng gurih + topping Ayam geprek remah pedas + taburan daun bawang dan bawang goreng.",
        harga: "Rp 16.000",
      },
      {
        id: 5,
        badge: "Menu Pendamping",
        nama: "Tahu & Tempe Krispi",
        deskripsi: "2 potong tahu kuning lembut + 2 potong tempe kedelai lokal digoreng tepung krispi renyah + cocolan sambal.",
        harga: "Rp 5.000",
      },
      {
        id: 6,
        badge: "Minuman Segar",
        nama: "Es Teh Manis Jumbo",
        deskripsi: "Seduhan teh melati wangi dengan es kristal higienis dan gula tebu asli, penyegar pereda sensasi pedas.",
        harga: "Rp 3.000",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Ayam Geprek Pak Slamet Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Hanya 2 menit dari Balai Desa Tambakrigadung ke arah selatan. Terletak di tepi jalan poros dusun dengan area parkir teduh dan roda empat yang memadai.",
      fasilitas: [
        "Parkir Gratis & Luas",
        "Tersedia Akses WiFi Komunitas",
        "Fasilitas Lesehan & Meja Kursi",
      ],
    },
  },
  {
    id: 2,
    slug: "madu-klanceng-liar-hutan-randu-barokah",
    nama: "Madu Klanceng Liar Hutan Randu Barokah",
    kategori: "olahan",
    kategoriLabel: "Olahan Tambak & Madu",
    badgeUtama: "PANGAN ALAMI",
    statusBuka: "Buka (08.00 - 17.00 WIB)",
    jamOperasional: "Setiap Hari, 08.00 – 17.00 WIB",
    dusun: "Dusun Melik",
    alamat: "Dusun Melik Barat RT 02, Desa Tambakrigadung, Tikung",
    patokanLokasi: "Dusun Melik Barat RT 02 (Sebelah Utara Masjid Melik)",
    pemilik: "Pak H. Ahmad Fauzi",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, Transfer Bank, QRIS",
    hargaLabel: "Rp 45.000 – Rp 135.000",
    hargaSatuan: "/ botol",
    hargaBadge: "100% Murni Tanpa Campuran",
    hargaMulai: "Rp 45.000",
    tanggal: "2026-02-18",
    image: img("potensi-domba.jpg"),
    galeri: [img("potensi-domba.jpg"), img("hero-1.jpg"), img("potensi-wisata.jpg"), img("potensi-tambak.jpg")],
    ringkasan:
      "Dihasilkan oleh kelompok tani lebah tanpa sengat di perkebunan Dusun Melik. Memiliki rasa manis bercampur asam segar alami dengan kadar air rendah dan antioksidan tinggi.",
    tags: ["Rasa Manis Asam Segar", "Kemasan 250ml & 500ml", "Sertifikat Halal MUI"],
    deskripsiLengkap: [
      "Budidaya lebah Trigona (Klanceng) di Dusun Melik memanfaatkan vegetasi pohon randu, mangga, dan bunga liar di pekarangan warga sehingga menghasilkan nektar propolis berkualitas tinggi.",
      "Proses panen dilakukan secara higienis menggunakan alat sedot khusus tanpa merusak sarang lebah, menjaga keaslian enzim dan khasiat kesehatan madu bagi konsumen.",
    ],
    catatanMenu: "Tersedia pengiriman luar kota dengan kemasan botol kaca tebal & bubble wrap",
    menu: [
      {
        id: 1,
        badge: "Kemasan Praktis",
        nama: "Madu Klanceng Murni 250 ml",
        deskripsi: "Botol kaca tersegel higienis, cocok untuk konsumsi harian keluarga penambah imunitas.",
        harga: "Rp 75.000",
      },
      {
        id: 2,
        badge: "Hemat Keluarga",
        nama: "Madu Klanceng Murni 500 ml",
        deskripsi: "Kemasan botol besar isi penuh nektar bunga randu & multiflora Dusun Melik.",
        harga: "Rp 135.000",
      },
      {
        id: 3,
        badge: "Paket Trial",
        nama: "Madu Klanceng Travel 100 ml",
        deskripsi: "Ukuran saku praktis untuk tester rasa atau oleh-oleh khas Desa Tambakrigadung.",
        harga: "Rp 45.000",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Dusun Melik Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Masuk melalui gerbang Dusun Melik sekitar 500 meter ke arah barat, lokasi galeri berada di rumah joglo sebelah utara masjid dusun.",
      fasilitas: [
        "Edukasi Panen Lebah Langsung",
        "Tester Madu Gratis di Lokasi",
        "Menerima Pesanan Reseller",
      ],
    },
  },
  {
    id: 3,
    slug: "keripik-ikan-nila-mujair-crispy-bu-siti",
    nama: "Keripik Ikan Nila & Mujair Crispy Bu Siti",
    kategori: "olahan",
    kategoriLabel: "Olahan Tambak",
    badgeUtama: "OLAHAN TAMBAK",
    ratingLabel: "4.9 (120+)",
    statusBuka: "Buka (08.00 - 16.00 WIB)",
    jamOperasional: "Senin – Sabtu, 08.00 – 16.00 WIB",
    dusun: "Dusun Tambakboyo",
    alamat: "Dusun Tambakboyo RT 05, Desa Tambakrigadung, Tikung",
    patokanLokasi: "Dusun Tambakboyo RT 05 (Dekat Sentra Tambak)",
    pemilik: "Bu Siti Aminah",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, QRIS Desa, Transfer",
    hargaLabel: "Rp 15.000 – Rp 35.000",
    hargaSatuan: "/ pouch",
    hargaBadge: "P-IRT & Halal Terdaftar",
    hargaMulai: "Rp 15.000",
    tanggal: "2026-02-15",
    image: img("potensi-tambak.jpg"),
    galeri: [img("potensi-tambak.jpg"), img("hero-3.jpg"), img("hero-1.jpg"), img("potensi-wisata.jpg")],
    ringkasan:
      "Olahan daging ikan air tawar segar hasil panen tambak desa dengan rempah kunyit gurih tinggi protein tanpa bahan pengawet.",
    tags: ["Kemasan Standing Pouch 150gr", "Tahan 3 Bulan"],
    deskripsiLengkap: [
      "Keripik Ikan Crispy Bu Siti memanfaatkan melimpahnya hasil panen ikan nila dan mujair dari sentra perikanan Dusun Tambakboyo. Ikan diolah dalam kondisi segar sehingga tidak berbau amis dan bertekstur renyah.",
      "Diproses menggunakan mesin spinner peniris minyak agar keripik tetap kering, rendah lemak, dan tahan lama dalam kemasan standing pouch aluminium foil.",
    ],
    catatanMenu: "Varian rasa: Original Gurih Rempah, Daun Jeruk, dan Balado Pedas Manis",
    menu: [
      {
        id: 1,
        badge: "Best Seller",
        nama: "Keripik Ikan Nila Original 150gr",
        deskripsi: "Fillet ikan nila segar berbumbu ketumbar bawang putih gurih renyah.",
        harga: "Rp 15.000",
      },
      {
        id: 2,
        badge: "Aroma Segar",
        nama: "Keripik Ikan Mujair Daun Jeruk 150gr",
        deskripsi: "Paduan irisan daun jeruk purut wangi dengan keripik ikan krispi.",
        harga: "Rp 16.000",
      },
      {
        id: 3,
        badge: "Paket Oleh-Oleh",
        nama: "Paket Hampers 3 Varian Rasa",
        deskripsi: "Kemasan kardus eksklusif berisi 3 standing pouch varian lengkap.",
        harga: "Rp 45.000",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakboyo,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Tambakboyo Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Berada di kawasan sentra perikanan Dusun Tambakboyo, 300 meter dari jalan raya poros Kecamatan Tikung.",
      fasilitas: [
        "Siap Kirim Ekspedisi Seluruh Jatim",
        "Harga Grosir untuk Oleh-Oleh",
        "Kemasan Segel Aluminium",
      ],
    },
  },
  {
    id: 4,
    slug: "kopi-bubuk-biji-sangrai-boyo-roastery",
    nama: "Kopi Bubuk & Biji Sangrai Boyo Roastery",
    kategori: "pangan",
    kategoriLabel: "Minuman Kopi",
    badgeUtama: "MINUMAN KOPI",
    statusBuka: "Buka (09.00 - 22.00 WIB)",
    jamOperasional: "Setiap Hari, 09.00 – 22.00 WIB",
    dusun: "Dusun Boyo",
    alamat: "Jl. Poros Raya Tambakrigadung, Dusun Boyo",
    patokanLokasi: "Jl. Poros Raya Tambakrigadung (Seberang Wisata Boyo Sirno)",
    pemilik: "Mas Danang",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, QRIS, E-Wallet",
    hargaLabel: "Rp 16.000 – Rp 45.000",
    hargaSatuan: "/ kemasan",
    hargaBadge: "Sangrai Segar Mingguan",
    hargaMulai: "Rp 18.000",
    tanggal: "2026-02-12",
    image: img("hero-3.jpg"),
    galeri: [img("hero-3.jpg"), img("hero-1.jpg"), img("potensi-wisata.jpg"), img("potensi-domba.jpg")],
    ringkasan:
      "Biji kopi robusta pilihan sangrai segar dengan racikan khas kopi lelet rempah, cocok untuk seduhan tubruk maupun espresso.",
    tags: ["Biji Robusta & Kopi Lelet"],
    deskripsiLengkap: [
      "Boyo Roastery menghadirkan cita rasa kopi nusantara yang disangrai secara presisi oleh pemuda kreatif Desa Tambakrigadung. Tersedia bubuk giling halus khas tradisi warung kopi Lamongan maupun biji utuh (roasted bean).",
      "Pengunjung juga dapat menikmati seduhan langsung di kedai mini depan Wisata Boyo Sirno sembari bersantai bersama keluarga.",
    ],
    catatanMenu: "Bisa request tingkat gilingan (halus, medium, kasar) sesuai alat seduh",
    menu: [
      {
        id: 1,
        badge: "Favorit Warga",
        nama: "Kopi Bubuk Lelet Halus 200gr",
        deskripsi: "Gilingan ekstra halus beraroma pekat khas tradisi cangkir kopi Lamongan.",
        harga: "Rp 18.000",
      },
      {
        id: 2,
        badge: "Racikan Rempah",
        nama: "Kopi Rempah Kapulaga & Jahe 200gr",
        deskripsi: "Perpaduan kopi robusta medium-dark dengan rempah hangat alami.",
        harga: "Rp 22.000",
      },
      {
        id: 3,
        badge: "Roasted Bean",
        nama: "Biji Kopi Robusta Sangrai 500gr",
        deskripsi: "Biji kopi pilihan untuk kebutuhan kedai kopi maupun seduhan rumah.",
        harga: "Rp 45.000",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Wisata Boyo Sirno Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Terletak tepat di tepi Jalan Poros Raya Tambakrigadung dekat kawasan Wisata Boyo Sirno.",
      fasilitas: [
        "Tersedia Kedai Seduh di Tempat",
        "Gratis Jasa Penggilingan Biji",
        "Area Parkir Sepeda Motor & Mobil",
      ],
    },
  },
  {
    id: 5,
    slug: "bengkel-las-rekayasa-alat-tambak-boyo-teknik",
    nama: "Bengkel Las & Rekayasa Alat Tambak Boyo Teknik",
    kategori: "jasa",
    kategoriLabel: "Fabrikasi & Jasa",
    badgeUtama: "FABRIKASI & JASA",
    ratingLabel: "Garansi & Service",
    statusBuka: "Buka (07.30 - 16.30 WIB)",
    jamOperasional: "Senin – Sabtu, 07.30 – 16.30 WIB",
    dusun: "Dusun Boyo",
    alamat: "Dusun Boyo RT 02, Desa Tambakrigadung, Tikung",
    patokanLokasi: "Dusun Boyo RT 02 (Pertigaan Timur Dusun)",
    pemilik: "Pak Hendro Susilo",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, Transfer Bank Jatim",
    hargaLabel: "Sesuai Rancangan Biaya",
    hargaSatuan: "",
    hargaBadge: "Konsultasi & Survei Gratis",
    hargaMulai: "Sesuai Rancangan",
    tanggal: "2026-02-10",
    image: img("potensi-wisata.jpg"),
    galeri: [img("potensi-wisata.jpg"), img("potensi-tambak.jpg"), img("hero-1.jpg"), img("hero-3.jpg")],
    ringkasan:
      "Jasa fabrikasi rangka kincir air tambak, pintu air irigasi, kanopi rumah, serta modifikasi alat pertanian dengan pengerjaan rapi dan material berstandar SNI.",
    tags: ["Jasa Las Konstruksi & Niaga"],
    deskripsiLengkap: [
      "Boyo Teknik merupakan bengkel las dan rekayasa logam milik warga Dusun Boyo yang berfokus mendukung kebutuhan sarana petambak dan petani di Kecamatan Tikung.",
      "Melayani pembuatan pintu air irigasi tahan karat, dudukan pompa air tambak, gerobak angkut panen, hingga konstruksi kanopi dan pagar rumah tangga.",
    ],
    catatanMenu: "Estimasi biaya menyesuaikan ukuran dimensi dan ketebalan material besi/stainless",
    menu: [
      {
        id: 1,
        badge: "Sarana Tambak",
        nama: "Pintu Air & Saringan Tambak Custom",
        deskripsi: "Konstruksi besi siku tebal berlapis cat anti karat untuk saluran tambak.",
        harga: "Mulai Rp 350.000",
      },
      {
        id: 2,
        badge: "Sarana Tani",
        nama: "Gerobak Dorong Angkut Gabah",
        deskripsi: "Rangka pipa baja kuat dengan roda beban berat untuk jalan usaha tani.",
        harga: "Mulai Rp 750.000",
      },
      {
        id: 3,
        badge: "Konstruksi Rumah",
        nama: "Pemasangan Kanopi & Pagar Minimalis",
        deskripsi: "Pengerjaan rapi lengkap dengan survei pengukuran ke lokasi pemesan.",
        harga: "Per Meter Persegi",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Dusun Boyo Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Berada di jalur utama Dusun Boyo RT 02, mudah diakses kendaraan bak terbuka untuk pengangkutan material.",
      fasilitas: [
        "Survei & Ukur Lokasi Gratis",
        "Garansi Sambungan Las",
        "Layanan Panggilan Perbaikan",
      ],
    },
  },
  {
    id: 6,
    slug: "batik-tulis-canting-motif-sekar-boyo",
    nama: "Batik Tulis Canting Motif Sekar Boyo",
    kategori: "kerajinan",
    kategoriLabel: "Batik & Kerajinan",
    badgeUtama: "KERAJINAN & KAIN",
    statusBuka: "Buka (08.00 - 16.00 WIB)",
    jamOperasional: "Senin – Sabtu, 08.00 – 16.00 WIB",
    dusun: "Dusun Krajan",
    alamat: "Dusun Krajan Timur RT 04, Desa Tambakrigadung, Tikung",
    patokanLokasi: "Dusun Krajan Timur RT 04 (Galeri Ibu Canting)",
    pemilik: "Ibu Fatmawati & Kelompok Ibu-Ibu",
    whatsapp: "6281332837585",
    pembayaran: "Tunai, Transfer Bank, QRIS",
    hargaLabel: "Rp 120.000 – Rp 350.000",
    hargaSatuan: "/ lembar 2,25m",
    hargaBadge: "IG Motif & HKI Desa 2026",
    hargaMulai: "Rp 120.000",
    tanggal: "2026-02-08",
    image: img("potensi-wisata.jpg"),
    galeri: [img("potensi-wisata.jpg"), img("hero-1.jpg"), img("hero-3.jpg"), img("potensi-domba.jpg")],
    ringkasan:
      "Kain batik tulis orisinal bermotif flora air sawah dan riak tambak khas Tikung Lamongan menggunakan pewarna alam ramah lingkungan.",
    tags: ["Pewarna Alami", "Motif Khas Desa"],
    deskripsiLengkap: [
      "Batik Tulis Canting Motif Sekar Boyo merupakan mahakarya kelompok pengrajin perempuan di Dusun Krajan Timur yang mengangkat filosofi keseimbangan alam agraris dan perikanan Tambakrigadung.",
      "Menggunakan kain katun primisima halus dengan proses pencantingan manual dan pewarnaan alami dari ekstrak daun ketapang serta indigo.",
    ],
    catatanMenu: "Menerima pesanan seragam instansi, komunitas, maupun kain eksklusif satuan",
    menu: [
      {
        id: 1,
        badge: "Karya Utama",
        nama: "Kain Batik Tulis Sekar Boyo (2,25m)",
        deskripsi: "Kain katun primisima motif khas Tambakrigadung siap jahit kemeja atau kebaya.",
        harga: "Rp 120.000",
      },
      {
        id: 2,
        badge: "Pewarna Alam",
        nama: "Batik Tulis Eksklusif Indigo & Ketapang",
        deskripsi: "Proses pewarnaan celup alami dengan ketahanan warna tinggi dan motif detail.",
        harga: "Rp 250.000",
      },
      {
        id: 3,
        badge: "Aksesori",
        nama: "Syal & Selendang Batik Canting",
        deskripsi: "Selendang ringan bermotif daun mangrove dan riak air tambak.",
        harga: "Rp 85.000",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
    mapsHref: `${MAPS}${encodeURIComponent("Tambakrigadung Tikung Lamongan")}`,
    petunjukArah: {
      deskripsi:
        "Terletak di Dusun Krajan Timur RT 04, sekitar 400 meter ke arah timur dari Kantor Balai Desa Tambakrigadung.",
      fasilitas: [
        "Galeri Display Kain Lengkap",
        "Workshop Membatik untuk Pengunjung",
        "Kemasan Box Eksklusif",
      ],
    },
  },
];



export const umkm = umkmItems.slice(0, 3);

export const umkmPage = {
  header: {
    badge: "SENTRA EKONOMI KREATIF & PANGAN DESA",
    judulUtama: "Pasar Karya & Rasa",
    judulAksen: "Desa Tambakrigadung",
    deskripsi:
      "Eksplorasi kurasi produk olahan tambak payau, kerajinan tangan canting sekar boyo, olahan rempah, hingga rekayasa alat pertanian garapan tangan terampil warga asli Kecamatan Tikung.",
    summaryTitle: "Kekuatan Usaha Desa",
    summaryBadge: "Terverifikasi BUMDes",
    totalUnit: "34",
    totalUnitLabel: "Unit Usaha Terdata",
    totalDusun: "4 Dusun",
    totalDusunLabel: "Krajan, Boyo, Melik, Turi",
    summaryFoot: "100% Produk Lokal & Kemitraan Warga",
  },
  kategoriTabs: [
    { key: "semua", label: "Semua Katalog", count: 17 },
    { key: "pangan", label: "Pangan & Kudapan" },
    { key: "olahan", label: "Olahan Tambak & Madu" },
    { key: "kerajinan", label: "Batik & Kerajinan" },
    { key: "jasa", label: "Fabrikasi & Jasa" },
  ],
  featured: {
    slug: "batik-tulis-canting-motif-sekar-boyo",
    badge: "KARYA PILIHAN BUMDES BOYO MAKMUR · EDISI 2026",
    judul: "Batik Tulis Canting Motif Sekar Boyo",
    deskripsi:
      "Mahakarya kain batik tulis yang diproduksi secara teliti oleh Kelompok Pengrajin Ibu Canting Lestari. Menampilkan ornamen flora air sawah, riak tambak bandeng, dan daun mangrove dengan pewarnaan alami daun ketapang & indigo.",
    info: [
      { label: "Perajin Utama", value: "Ibu Fatmawati & Kelompok Ibu-Ibu" },
      { label: "Lokasi Sentra", value: "Dusun Krajan Timur RT 04" },
      { label: "Sertifikasi Lokal", value: "IG Motif & HKI Desa 2026" },
    ],
    hargaLabel: "Harga Mulai Terjangkau",
    harga: "Rp 120.000",
    hargaSatuan: "/ lembar 2,25m",
    whatsapp: "6281332837585",
    image: img("potensi-wisata.jpg"),
    imageCaption: "Katalog Pesona 2026 · Karya Ibu Canting",
  },
  items: umkmItems,
  dusunSentra: {
    eyebrow: "GEOGRAFI EKONOMI DESA",
    judul: "Peta Sentra Komoditas 4 Dusun",
    subjudul: "Setiap dusun di Desa Tambakrigadung memiliki karakteristik dan keunggulan komoditas khas.",
    badgeKanan: "Sesuai Dengan Peta Wilayah Desa",
    items: [
      {
        key: "krajan",
        nama: "Dusun Krajan",
        ikon: "sparkles",
        deskripsi: "Sentra Kain Batik Tulis Sekar Boyo, jajanan pasar, dan jamu tradisional.",
        jumlah: "9 Pelaku Usaha Aktif",
      },
      {
        key: "tambakboyo",
        nama: "Dusun Tambakboyo",
        ikon: "fish",
        deskripsi: "Sentra budidaya ikan bandeng & nila, serta terasi udang olahan segar.",
        jumlah: "12 Pelaku Usaha Aktif",
      },
      {
        key: "melik",
        nama: "Dusun Melik",
        ikon: "sprout",
        deskripsi: "Sentra budidaya madu klanceng murni, ternak kambing, dan olahan keripik sayur.",
        jumlah: "8 Pelaku Usaha Aktif",
      },
      {
        key: "boyo",
        nama: "Dusun Boyo",
        ikon: "wrench",
        deskripsi: "Sentra fabrikasi logam, bengkel mesin pompa air tambak, dan kerajinan kayu/bambu.",
        jumlah: "5 Pelaku Usaha Aktif",
      },
    ],
  },
  cta: {
    badge: "BUMDES BOYO MAKMUR PEDULI USAHA WARGA",
    judul: "Punya Usaha Rumahan di Desa Tambakrigadung?",
    deskripsi:
      "Pemerintah Desa Tambakrigadung memfasilitasi secara gratis bagi pelaku UMKM untuk mendapatkan akses promosi gratis, fasilitasi sertifikasi halal & legalitas usaha, pemotretan produk profesional di Balai Desa, serta etalase pameran BUMDes tanpa dipungut biaya.",
    highlights: [
      { ikon: "shield", label: "100% Gratis" },
      { ikon: "award", label: "Tervalidasi Balai Desa" },
      { ikon: "camera", label: "Foto Produk di Balai Desa" },
    ],
    whatsappAdmin: "6281332837585",
  },
  panduan: {
    judul: "Panduan Pendaftaran UMKM",
    subjudul: "Ketentuan dan alur publikasi usaha di portal desa",
    syarat: [
      "Pelaku usaha berdomisili di Desa Tambakrigadung.",
      "Usaha aktif dan memiliki produk atau jasa yang jelas.",
      "Menggunakan foto asli produk atau tempat usaha.",
      "Mencantumkan nomor WhatsApp aktif yang dapat dihubungi pembeli.",
    ],
    alur: [
      {
        nomor: 1,
        judul: "1. Isi Formulir",
        deskripsi: "Lengkapi data usaha, harga, dan deskripsi produk.",
      },
      {
        nomor: 2,
        judul: "2. Unggah Foto",
        deskripsi: "Lampirkan 1–3 foto terbaik agar menarik minat pembeli.",
      },
      {
        nomor: 3,
        judul: "3. Peninjauan Admin Desa",
        deskripsi: "Admin akan memeriksa kelengkapan data dalam 1–2 hari kerja.",
      },
      {
        nomor: 4,
        judul: "4. Tampil di Portal",
        deskripsi: "Setelah disetujui, usaha Anda otomatis muncul di halaman UMKM Desa.",
      },
    ],
  },
};



// Halaman Berita (/berita)
export const beritaItems = [
  {
    id: 1,
    slug: "kerja-bakti-membersihkan-saluran-air-desa-tambakrigadung",
    judul: "Kerja Bakti Membersihkan Saluran Air oleh Seluruh Warga Desa Tambakrigadung",
    kategori: "kegiatan",
    kategoriLabel: "Kegiatan Warga",
    subLabel: "Liputan Desa",
    featured: true,
    tanggal: "2026-02-20",
    penulis: "Humas Pemdes Tambakrigadung",
    waktuBaca: "5 Menit Baca",
    pembaca: 482,
    image: img("hero-1.jpg"),
    caption:
      "Dokumentasi: Warga Dusun Krajan bersama jajaran perangkat desa bergotong-royong membersihkan endapan lumpur dan gulma di saluran irigasi primer menuju area persawahan pada Jumat (20/02/2026).",
    ringkasan:
      "Dalam rangka mengantisipasi musim penghujan dan memastikan kelancaran irigasi lahan pertanian dusun, ratusan warga antusias bergotong-royong menormalisasi saluran air utama desa sepanjang 2 kilometer bersama jajaran...",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Ratusan warga dari tiga dusun di Desa Tambakrigadung, Kecamatan Tikung, Kabupaten Lamongan secara serentak menggelar aksi kerja bakti massal pada Jumat pagi. Agenda gotong royong ini difokuskan pada normalisasi dan pembersihan saluran irigasi primer sepanjang 2,1 kilometer yang melintasi areal persawahan produktif warga.",
      },
      {
        type: "paragraph",
        text: "Kegiatan terpadu yang dikoordinasikan langsung oleh jajaran Pemerintah Desa Tambakrigadung bersama Lembaga Pemberdayaan Masyarakat (LPM), Babinsa, Bhabinkamtibmas, serta kelompok Karang Taruna ini bertujuan memastikan debit pasokan air pertanian lancar menuju 45 hektar sawah tadah hujan dan tambak ikan tawar, sekaligus memitigasi potensi luapan genangan air di pemukiman jelang puncak intensitas musim penghujan.",
      },
      {
        type: "heading",
        text: "Semangat Gotong Royong Jelang Musim Tanam Padi",
      },
      {
        type: "paragraph",
        text: "Sejak pukul 06.30 WIB, warga telah berkumpul di titik kumpul balai dusun membawa peralatan mandiri seperti cangkul, sabit, karung pasir, dan gerobak dorong. Pembagian zona kerja dibagi menjadi empat sektor guna mempercepat pengangkatan sedimentasi lumpur pekat dan tanaman eceng gondok liar yang menyumbat pintu-pintu pembagi air di bendungan saluran sekunder Boyo.",
      },
      {
        type: "quote",
        text: "Inisiatif gotong royong ini membuktikan bahwa kerukunan dan kepedulian warga Tambakrigadung terhadap fasilitas publik tetap terjaga kokoh. Pemerintah desa akan terus mendukung pemeliharaan berkala infrastruktur irigasi dan pintu air agar swasembada pangan lokal terus berdaya saing.",
        author: "Moch. Takim",
        role: "Kepala Desa Tambakrigadung",
      },
      {
        type: "paragraph",
        text: "Selain pembersihan material endapan, para pemuda desa bersama tim teknis desa turut memperkuat tanggul-tanggul tanah yang rawan longsor dengan memasang susunan trucuk bambu serta karung pasir. Kehadiran ibu-ibu PKK yang menyediakan konsumsi mandiri berupa aneka jajanan pasar tradisional dan minuman wedang jahe kian menyemarakkan suasana kebersamaan antargenerasi.",
      },
      {
        type: "paragraph",
        text: "Pemerintah Desa Tambakrigadung menegaskan bahwa program pemeliharaan saluran lingkungan seperti ini akan digulirkan secara bergiliran di dusun lainnya, mencakup Dusun Melik dan Dusun Tambakboyo, dengan dukungan pembiayaan padat karya tunai dari alokasi Dana Desa (APBDes) tahun anggaran 2026.",
      },
    ],
    tags: ["KerjaBakti", "GotongRoyong", "Tambakrigadung", "IrigasiPertanian", "DanaDesa"],
  },
  {
    id: 2,
    slug: "penyaluran-blt-dana-desa-triwulan-1-2026",
    judul: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan I",
    kategori: "pengumuman",
    kategoriLabel: "Pengumuman",
    subLabel: "Informasi Resmi",
    featured: false,
    tanggal: "2026-02-18",
    penulis: "Sekretariat Pemdes",
    waktuBaca: "3 Menit Baca",
    pembaca: 340,
    image: img("hero-3.jpg"),
    caption:
      "Dokumentasi: Proses verifikasi dan penyerahan BLT Dana Desa Triwulan I kepada Keluarga Penerima Manfaat di Balai Desa Tambakrigadung.",
    ringkasan:
      "Pemerintah Desa Tambakrigadung menyalurkan bantuan tunai kepada 65 Keluarga Penerima Manfaat (KPM) secara tertib dan transparan di Balai Desa.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Pemerintah Desa Tambakrigadung kembali merealisasikan program perlindungan sosial berupa penyaluran Bantuan Langsung Tunai (BLT) Dana Desa untuk periode Triwulan I Tahun Anggaran 2026 bertempat di Pendopo Balai Desa Tambakrigadung.",
      },
      {
        type: "paragraph",
        text: "Sebanyak 65 Keluarga Penerima Manfaat (KPM) yang telah ditetapkan melalui Musyawarah Desa Khusus (Musdesus) hadir secara bergiliran dengan membawa dokumen identitas kependudukan untuk memastikan penyaluran berjalan tepat sasaran dan akuntabel.",
      },
      {
        type: "heading",
        text: "Transparansi dan Pendampingan Langsung",
      },
      {
        type: "paragraph",
        text: "Bagi warga lanjut usia atau penerima manfaat yang memiliki keterbatasan mobilitas, perangkat desa bersama Babinsa melakukan pengantaran bantuan secara langsung ke kediaman masing-masing warga.",
      },
    ],
    tags: ["BLTDanaDesa", "Pengumuman", "Bansos2026", "Tambakrigadung"],
  },
  {
    id: 3,
    slug: "panen-raya-bandeng-dan-nila-sentra-budidaya-tambak-boyo",
    judul: "Panen Raya Bandeng dan Nila di Sentra Budidaya Tambak Boyo",
    kategori: "kegiatan",
    kategoriLabel: "Kegiatan Warga",
    subLabel: "Perikanan Desa",
    featured: false,
    tanggal: "2026-02-16",
    penulis: "Pokdakan Tambak Boyo",
    waktuBaca: "4 Menit Baca",
    pembaca: 419,
    image: img("potensi-tambak.jpg"),
    caption:
      "Dokumentasi: Kelompok pembudidaya ikan memanen ikan bandeng dan nila segar di area tambak Dusun Tambakboyo.",
    ringkasan:
      "Kelompok budidaya ikan berhasil memanen lebih dari 1,5 ton ikan dengan kualitas prima berkat dukungan tata kelola pengairan tambak yang terjaga.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Kelompok Pembudidaya Ikan (Pokdakan) Desa Tambakrigadung mencatatkan hasil menggembirakan pada panen raya periode awal tahun ini di kawasan sentra perikanan Tambak Boyo. Total hasil panen mencapai lebih dari 1,5 ton ikan bandeng dan nila konsumsi.",
      },
      {
        type: "paragraph",
        text: "Keberhasilan panen ini tidak lepas dari optimalisasi manajemen pakan mandiri serta kelancaran sirkulasi air tawar hasil pemeliharaan saluran irigasi desa.",
      },
      {
        type: "quote",
        text: "Hasil panen kali ini langsung terserap oleh pasar lokal Lamongan dan mitra pengolah UMKM desa sehingga perputaran ekonomi dirasakan langsung oleh warga.",
        author: "Ketua Pokdakan Tambak Boyo",
        role: "Kelompok Tani & Nelayan Darat",
      },
    ],
    tags: ["Perikanan", "TambakBoyo", "KetahananPangan", "UMKMDesa"],
  },
  {
    id: 4,
    slug: "pengecoran-jalan-usaha-tani-blok-timur-tahap-finishing",
    judul: "Pengecoran Jalan Usaha Tani Blok Timur Masuki Tahap Finishing",
    kategori: "pembangunan",
    kategoriLabel: "Pembangunan",
    subLabel: "Infrastruktur Desa",
    featured: false,
    tanggal: "2026-02-12",
    penulis: "TPK Desa Tambakrigadung",
    waktuBaca: "4 Menit Baca",
    pembaca: 295,
    image: img("potensi-wisata.jpg"),
    caption:
      "Dokumentasi: Pengerjaan rabat beton Jalan Usaha Tani Blok Timur untuk memperlancar distribusi hasil panen warga.",
    ringkasan:
      "Akses transportasi hasil panen petani kini semakin lancar dan efisien setelah pembangunan jalan rabat beton sepanjang 320 meter rampung.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Tim Pelaksana Kegiatan (TPK) Desa Tambakrigadung memastikan pembangunan fisik Jalan Usaha Tani (JUT) Blok Timur telah memasuki tahap akhir pengerjaan dan siap dimanfaatkan oleh para petani setempat.",
      },
      {
        type: "paragraph",
        text: "Peningkatan struktur jalan rabat beton ini memangkas biaya angkut gabah maupun hasil perikanan saat musim hujan tiba, sehingga margin keuntungan petani desa dapat meningkat.",
      },
    ],
    tags: ["PembangunanDesa", "JalanUsahaTani", "APBDes2026", "Infrastruktur"],
  },
  {
    id: 5,
    slug: "pelatihan-pemasaran-digital-dan-sertifikasi-halal-umkm",
    judul: "Pelatihan Pemasaran Digital dan Sertifikasi Halal UMKM Binaan",
    kategori: "kegiatan",
    kategoriLabel: "Kegiatan Warga",
    subLabel: "Pemberdayaan UMKM",
    featured: false,
    tanggal: "2026-02-08",
    penulis: "Paguyuban UMKM Desa",
    waktuBaca: "4 Menit Baca",
    pembaca: 368,
    image: img("potensi-domba.jpg"),
    caption:
      "Dokumentasi: Pelaku UMKM Desa Tambakrigadung mengikuti pendampingan foto produk dan pendaftaran sertifikasi halal.",
    ringkasan:
      "Mendorong pelaku usaha lokal menembus pasar e-commerce dengan pendampingan intensif dari tim fasilitator dan paguyuban UMKM desa.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Sebanyak 25 pelaku usaha mikro dan rumah tangga yang tergabung dalam Paguyuban UMKM Desa Tambakrigadung mengikuti pelatihan peningkatan kapasitas usaha berbasis digital dan fasilitasi pengurusan sertifikasi halal gratis.",
      },
      {
        type: "paragraph",
        text: "Melalui kegiatan ini, produk olahan pangan, keripik hasil perikanan, serta olahan hasil ternak diharapkan memiliki standar kemasan modern dan siap dipromosikan melalui Portal Resmi Desa Tambakrigadung.",
      },
    ],
    tags: ["UMKM", "PemasaranDigital", "SertifikasiHalal", "EkonomiKreatif"],
  },
  {
    id: 6,
    slug: "jadwal-imunisasi-balita-dan-cek-kesehatan-lansia-posyandu-melik",
    judul: "Jadwal Imunisasi Balita dan Cek Kesehatan Lansia Posyandu Melik",
    kategori: "kesehatan",
    kategoriLabel: "Kesehatan",
    subLabel: "Layanan Kesehatan",
    featured: false,
    tanggal: "2026-02-05",
    penulis: "Kader Posyandu & Bidan Desa",
    waktuBaca: "3 Menit Baca",
    pembaca: 254,
    image: img("hero-1.jpg"),
    caption:
      "Dokumentasi: Kader kesehatan desa melakukan penimbangan balita dan pemeriksaan tekanan darah lansia di Posyandu Dusun Melik.",
    ringkasan:
      "Layanan kesehatan berkala untuk memantau tumbuh kembang anak serta skrining penyakit tidak menular bagi warga lanjut usia.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Kader Posyandu Dusun Melik bekerja sama dengan Puskesmas Kecamatan Tikung menyelenggarakan layanan posyandu terintegrasi bagi balita, ibu hamil, dan warga lanjut usia.",
      },
      {
        type: "paragraph",
        text: "Kegiatan meliputi pengukuran tinggi dan berat badan balita sebagai upaya pencegahan stunting, pemberian vitamin A, serta pemeriksaan gula darah dan tekanan darah gratis untuk lansia.",
      },
    ],
    tags: ["Posyandu", "KesehatanDesa", "CegahStunting", "DusunMelik"],
  },
  {
    id: 7,
    slug: "musyawarah-penetapan-rencana-kerja-pemerintah-desa-2026",
    judul: "Musyawarah Penetapan Rencana Kerja Pemerintah Desa 2026",
    kategori: "pengumuman",
    kategoriLabel: "Pengumuman",
    subLabel: "Tata Kelola Desa",
    featured: false,
    tanggal: "2026-01-28",
    penulis: "BPD & Pemdes Tambakrigadung",
    waktuBaca: "5 Menit Baca",
    pembaca: 312,
    image: img("hero-3.jpg"),
    caption:
      "Dokumentasi: Rapat pleno Musyawarah Desa penetapan RKPDes Tahun 2026 bersama BPD dan tokoh masyarakat.",
    ringkasan:
      "BPD bersama Pemdes dan tokoh masyarakat menyepakati program prioritas infrastruktur serta penguatan ketahanan pangan desa.",
    dateline: "TAMBAKRIGADUNG, TIKUNG —",
    konten: [
      {
        type: "paragraph",
        text: "Badan Permusyawaratan Desa (BPD) bersama Pemerintah Desa Tambakrigadung secara resmi menetapkan dokumen Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2026 dalam forum musyawarah terbuka.",
      },
      {
        type: "paragraph",
        text: "Prioritas anggaran diarahkan pada penguatan ketahanan pangan sektor perikanan dan peternakan domba BUMDes, pemeliharaan jalan lingkungan, serta dukungan operasional UMKM.",
      },
    ],
    tags: ["Musdes", "RKPDes2026", "TransparansiDesa", "BPD"],
  },
];

// BeritaSection Homepage (3 berita terbaru)
export const berita = beritaItems.slice(0, 3);

// Halaman Berita (/berita) & Detail Berita (/berita/:slug)
export const beritaPage = {
  header: {
    judul: "Kabar & Artikel Desa",
    deskripsi:
      "Informasi resmi, pengumuman kelembagaan, serta liputan kegiatan pembangunan dan masyarakat Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan.",
    totalLabel: "50+ Artikel Terbit",
    updateLabel: "Diperbarui Setiap Hari",
  },
  kategoriTabs: [
    { key: "semua", label: "Semua Artikel" },
    { key: "pengumuman", label: "Pengumuman" },
    { key: "kegiatan", label: "Kegiatan Warga" },
    { key: "pembangunan", label: "Pembangunan" },
    { key: "kesehatan", label: "Kesehatan" },
  ],
  kategoriSidebar: [
    { key: "kegiatan", label: "Kegiatan Warga", count: 24, ikon: "users" },
    { key: "pengumuman", label: "Pengumuman Resmi", count: 12, ikon: "megaphone" },
    { key: "pembangunan", label: "Pembangunan & Infrastruktur", count: 9, ikon: "hardhat" },
    { key: "pertanian", label: "Pertanian & Perikanan", count: 15, ikon: "sprout" },
    { key: "kesehatan", label: "Kesehatan & Posyandu", count: 7, ikon: "heart" },
  ],
  populer: [
    {
      id: 101,
      slug: "musyawarah-penetapan-rencana-kerja-pemerintah-desa-2026",
      judul: "Hasil Musrenbangdes 2026: Fokus Jalan Tani & BUMDes",
      tanggal: "2026-02-19",
      image: img("hero-3.jpg"),
    },
    {
      id: 102,
      slug: "pengecoran-jalan-usaha-tani-blok-timur-tahap-finishing",
      judul: "Pengembangan Wisata Boyo Sirno Jadi Ikon Edukasi Baru",
      tanggal: "2026-02-14",
      image: img("potensi-wisata.jpg"),
    },
    {
      id: 103,
      slug: "pelatihan-pemasaran-digital-dan-sertifikasi-halal-umkm",
      judul: "Pendaftaran Sertifikasi Usaha Mikro Desa Dibuka Gratis",
      tanggal: "2026-02-10",
      image: img("potensi-tambak.jpg"),
    },
    {
      id: 104,
      slug: "panen-raya-bandeng-dan-nila-sentra-budidaya-tambak-boyo",
      judul: "Peternakan Domba Sistem Ramah Lingkungan Tambakrigadung",
      tanggal: "2026-02-06",
      image: img("potensi-domba.jpg"),
    },
  ],
  items: beritaItems,
};

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
