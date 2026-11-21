import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for Portal Desa Tambakrigadung...");

  // 1. Initial Super Admin Account
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@tambakrigadung.desa.id";
  const adminUsername = process.env.SUPER_ADMIN_USERNAME || "admin";
  const rawPassword = process.env.SUPER_ADMIN_PASSWORD || "AdminTambakrigadung2026!#";
  const adminNama = process.env.SUPER_ADMIN_NAME || "Administrator Pemdes Tambakrigadung";

  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      nama: adminNama,
      username: adminUsername,
      role: "SUPER_ADMIN",
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      nama: adminNama,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Super Admin created/verified: ${admin.email}`);

  // 2. Hero Slider
  await prisma.heroSlider.deleteMany();
  await prisma.heroSlider.createMany({
    data: [
      { urutan: 1, title: "Desa Tambakrigadung", subtitle: "Kec. Tikung, Kab. Lamongan, Prov. Jawa Timur", image: "/images/hero-1.jpg", isActive: true },
      { urutan: 2, title: "Balai Desa Tambakrigadung", subtitle: "Melayani dengan sepenuh hati", image: "/images/hero-3.jpg", isActive: true },
      { urutan: 3, title: "Potensi Perikanan dan Peternakan", subtitle: "Penggerak ekonomi warga desa", image: "/images/potensi-tambak.jpg", isActive: true },
    ],
  });
  console.log("✅ Hero Slider seeded");

  // 3. Statistik Desa
  await prisma.statistikDesa.deleteMany();
  await prisma.statistikDesa.createMany({
    data: [
      { key: "jiwa", label: "Total Jiwa", value: 2039, icon: "users", color: "#79a98a", urutan: 1 },
      { key: "kk", label: "Kepala Keluarga", value: 733, icon: "user", color: "#e53935", urutan: 2 },
      { key: "laki", label: "Laki-Laki", value: 1080, icon: "male", color: "#3b82f6", urutan: 3 },
      { key: "perempuan", label: "Perempuan", value: 939, icon: "female", color: "#e91ee9", urutan: 4 },
      { key: "umkm", label: "Produk UMKM", value: 14, icon: "cart", color: "#2b2825", urutan: 5 },
      { key: "potensi", label: "Potensi Desa", value: 11, icon: "trophy", color: "#2b2825", urutan: 6 },
      { key: "fasilitas", label: "Fasilitas Desa", value: 10, icon: "building", color: "#2b2825", urutan: 7 },
      { key: "aparatur", label: "Aparatur Desa", value: 44, icon: "group", color: "#2b2825", urutan: 8 },
    ],
  });
  console.log("✅ Statistik Desa seeded");

  // 4. Profil Desa & Kepala Desa Riwayat
  await prisma.profilDesa.deleteMany();
  await prisma.profilDesa.create({
    data: {
      sejarah:
        "Desa Tambakrigadung merupakan salah satu desa yang berada di wilayah Kecamatan Tikung, Kabupaten Lamongan, Provinsi Jawa Timur. Perjalanan pemerintahan desa mengalami beberapa pergantian kepemimpinan dari masa ke masa.",
      visi: "Terwujudnya Desa Tambakrigadung Yang Mandiri, Berdaya Saing, Agamis, dan Berketahanan Iklim Berbasis Gotong Royong.",
      misi: [
        "Meningkatkan Kualitas Tata Kelola Pemerintahan Desa.",
        "Memperkuat Kemandirian Ekonomi dan Ketahanan Pangan.",
        "Meningkatkan Pembangunan Infrastruktur Dasar yang Merata.",
      ],
      runningText: "Selamat Datang Di Website Resmi Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
    },
  });

  await prisma.kepalaDesaRiwayat.deleteMany();
  await prisma.kepalaDesaRiwayat.createMany({
    data: [
      { urutan: 1, nama: "Asikin Demang", periode: "1932 - 1965" },
      { urutan: 2, nama: "Supardi", periode: "1966 - 1990" },
      { urutan: 3, nama: "Supardi", periode: "1990 - 1998" },
      { urutan: 4, nama: "H. Baris", periode: "1998 - 2007" },
      { urutan: 5, nama: "H. Baris", periode: "2007 - 2013" },
      { urutan: 6, nama: "Mugiharto", periode: "2013 - 2019" },
      { urutan: 7, nama: "Moch. Takim", periode: "2019 - Sekarang" },
    ],
  });
  console.log("✅ Profil & Riwayat Kades seeded");

  // 5. Pamong Kontak
  await prisma.pamongKontak.deleteMany();
  await prisma.pamongKontak.createMany({
    data: [
      { inisial: "MT", warna: "green", nama: "Pak Moh. Takim", jabatan: "Kepala Desa", bidang: "Kebijakan Umum", telepon: "+62 813-3283-7585", wa: "6281332837585", urutan: 1 },
      { inisial: "SD", warna: "emerald", nama: "Sekretaris Desa", jabatan: "Pelayanan Administrasi", bidang: "Persuratan", telepon: "+62 3888 994 838", wa: "6281332837585", urutan: 2 },
      { inisial: "BK", warna: "amber", nama: "Babinsa & Bhabinkamtibmas", jabatan: "Keamanan & Ketertiban", bidang: "Kamtibmas 24J", telepon: "+62 812-3456-7891", wa: "6281332837585", urutan: 3 },
      { inisial: "BPD", warna: "slate", nama: "Ketua BPD", jabatan: "Badan Permusyawaratan", bidang: "Aspirasi Warga", telepon: "+62 812-3456-7892", wa: "6281332837585", urutan: 4 },
    ],
  });
  console.log("✅ Pamong Kontak seeded");

  // 6. APBD Desa 2026
  await prisma.apbdTahun.deleteMany();
  const apbd = await prisma.apbdTahun.create({
    data: {
      tahun: 2026,
      pendapatan: BigInt(969000000),
      belanja: BigInt(955050000),
      silpa: BigInt(13950000),
      itemsPendapatan: {
        create: [
          { sumber: "Dana Desa (DD) - APBN", nominal: BigInt(480000000) },
          { sumber: "Alokasi Dana Desa (ADD) APBD Kab. Lamongan", nominal: BigInt(320000000) },
          { sumber: "Pendapatan Asli Desa (PADes)", nominal: BigInt(95000000) },
          { sumber: "Bagi Hasil Pajak & Retribusi Daerah (BHPR)", nominal: BigInt(74000000) },
        ],
      },
      itemsBelanja: {
        create: [
          { bidang: "1. Pelaksanaan Pembangunan Desa", nominal: BigInt(425000000) },
          { bidang: "2. Penyelenggaraan Pemerintahan Desa", nominal: BigInt(280000000) },
          { bidang: "3. Pembinaan Kemasyarakatan Desa", nominal: BigInt(110050000) },
          { bidang: "4. Pemberdayaan Masyarakat Desa", nominal: BigInt(90000000) },
          { bidang: "5. Penanggulangan Bencana & Mendesak", nominal: BigInt(50000000) },
        ],
      },
      realisasiTabel: {
        create: [
          { kode: "2.2.01", kegiatan: "Pembangunan & Normalisasi Saluran Irigasi Boyo", detail: "Dusun Tambakboyo RT 02 / RW 01 • Padat Karya", pagu: BigInt(185000000), realisasi: BigInt(185000000) },
          { kode: "2.2.04", kegiatan: "Pengecoran Jalan Usaha Tani Blok Timur", detail: "Konektivitas Jalan Pertanian Dusun Ngadung (320m)", pagu: BigInt(140000000), realisasi: BigInt(105000000) },
          { kode: "1.1.02", kegiatan: "Operasional & Insentif RT/RW/Pamong Desa", detail: "Tunjangan aparatur desa tahunan", pagu: BigInt(180000000), realisasi: BigInt(120000000) },
          { kode: "4.3.01", kegiatan: "Bantuan Langsung Tunai (BLT) Dana Desa", detail: "Penyaluran bagi KPM prasejahtera triwulan I & II", pagu: BigInt(72000000), realisasi: BigInt(72000000) },
          { kode: "3.1.05", kegiatan: "Pengembangan Sentra Budidaya Perikanan", detail: "Revitalisasi kolam tambak ikan air tawar", pagu: BigInt(55000000), realisasi: BigInt(22000000) },
          { kode: "4.2.02", kegiatan: "Pelatihan & Bantuan Sarana UMKM Binaan", detail: "Fasilitasi sertifikasi halal & kemasan produk", pagu: BigInt(35000000), realisasi: BigInt(28000000) },
        ],
      },
    },
  });
  console.log(`✅ APBD 2026 seeded: ID ${apbd.id}`);

  // 7. Potensi Desa
  await prisma.potensiDesa.deleteMany();
  await prisma.potensiDesa.createMany({
    data: [
      {
        slug: "wisata-boyo-sirno",
        kategoriKey: "wisata",
        kategoriLabel: "Wisata Alam & Budaya",
        ikon: "trees",
        lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
        judul: "Wisata Boyo Sirno: Destinasi Rekreasi Desa Tambakrigadung",
        image: "/images/potensi-wisata.jpg",
        deskripsi: [
          "Wisata Boyo Sirno merupakan salah satu potensi wisata unggulan Desa Tambakrigadung. Nama Boyo Sirno juga dikenal dalam filosofi lambang desa.",
          "Pemerintah desa mendukung pengembangan wisata ini melalui APBDes 2026 dengan alokasi dari Dana Desa.",
        ],
        info: [
          { ikon: "banknote", label: "Anggaran APBDes 2026", value: "Rp15.000.000 · Pembangunan Desa Wisata" },
          { ikon: "route", label: "Jarak ke Pusat Kabupaten", value: "± 2 km ke ibu kota Kab. Lamongan" },
        ],
        aksi: [
          { label: "Petunjuk Rute / Lokasi", href: "https://www.google.com/maps", ikon: "navigation", primary: true },
          { label: "Lihat Galeri Foto", to: "/galeri", ikon: "image" },
        ],
        urutan: 1,
      },
      {
        slug: "budidaya-ikan-air-tawar",
        kategoriKey: "perikanan",
        kategoriLabel: "Perikanan & Budidaya",
        ikon: "fish",
        lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
        judul: "Budidaya Ikan Air Tawar: Tambak Khas Lamongan",
        image: "/images/potensi-tambak.jpg",
        deskripsi: [
          "Kondisi dataran rendah serta keberadaan embung dan tambak darat menjadikan perikanan darat sebagai potensi utama desa.",
        ],
        info: [
          { ikon: "fish", label: "Komoditas Utama", value: "Lele, Nila, dan Bandeng" },
          { ikon: "banknote", label: "Dukungan Desa 2026", value: "Pemeliharaan saluran air Dusun Tambakboyo" },
        ],
        aksi: [
          { label: "Hubungi Pemerintah Desa", to: "/kontak", ikon: "phone", primary: true },
          { label: "Lihat UMKM Desa", to: "/umkm", ikon: "store" },
        ],
        urutan: 2,
      },
      {
        slug: "peternakan-domba-kolektif",
        kategoriKey: "peternakan",
        kategoriLabel: "Peternakan Terintegrasi",
        ikon: "paw",
        lokasi: "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
        judul: "Peternakan Domba Kolektif BUMDes Tambakrigadung",
        image: "/images/potensi-domba.jpg",
        deskripsi: [
          "Peternakan merupakan sektor unggulan dengan pengelolaan kolektif melalui inovasi peternakan domba BUMDes.",
        ],
        info: [
          { ikon: "paw", label: "Komoditas Ternak", value: "Domba, kambing, dan ternak potong" },
          { ikon: "landmark", label: "Pengelola", value: "BUMDes Tambakrigadung" },
        ],
        aksi: [
          { label: "Hubungi Pemerintah Desa", to: "/kontak", ikon: "phone", primary: true },
          { label: "Lihat Galeri Foto", to: "/galeri", ikon: "image" },
        ],
        urutan: 3,
      },
    ],
  });
  console.log("✅ Potensi Desa seeded");

  // 8. Berita Desa
  await prisma.berita.deleteMany();
  await prisma.berita.create({
    data: {
      slug: "kerja-bakti-membersihkan-saluran-air-desa-tambakrigadung",
      judul: "Kerja Bakti Membersihkan Saluran Air oleh Seluruh Warga Desa Tambakrigadung",
      kategoriKey: "kegiatan",
      kategoriLabel: "Kegiatan Warga",
      subLabel: "Liputan Desa",
      featured: true,
      penulis: "Humas Pemdes Tambakrigadung",
      waktuBaca: "5 Menit Baca",
      pembaca: 482,
      image: "/images/hero-1.jpg",
      caption: "Dokumentasi gotong royong warga normalisasi saluran irigasi.",
      ringkasan: "Dalam rangka mengantisipasi musim penghujan, ratusan warga antusias bergotong-royong menormalisasi saluran air utama.",
      dateline: "TAMBAKRIGADUNG, TIKUNG —",
      konten: [
        { type: "paragraph", text: "Ratusan warga dari tiga dusun di Desa Tambakrigadung menggelar aksi kerja bakti massal pada Jumat pagi." },
        { type: "heading", text: "Semangat Gotong Royong Jelang Musim Tanam" },
        { type: "quote", text: "Inisiatif gotong royong ini membuktikan kerukunan warga tetap terjaga kokoh.", author: "Moch. Takim", role: "Kepala Desa" },
      ],
      tags: ["KerjaBakti", "GotongRoyong", "Tambakrigadung"],
      isPublished: true,
    },
  });
  console.log("✅ Sample Berita seeded");

  // 9. Sample UMKM
  await prisma.umkm.deleteMany();
  await prisma.umkm.create({
    data: {
      slug: "ayam-geprek-pak-slamet",
      nama: "Ayam Geprek Pak Slamet",
      kategori: "pangan",
      kategoriLabel: "Kuliner & Kudapan",
      badgeUtama: "KULINER LOKAL",
      statusBuka: "Buka (09.00 - 21.00 WIB)",
      jamOperasional: "Setiap Hari, 09.00 – 21.00 WIB",
      dusun: "Dusun Tambakrigadung",
      alamat: "RT 03 / RW 01, Dusun Tambakrigadung, Tikung, Lamongan",
      pemilik: "Pak Slamet (Cak Slamet)",
      whatsapp: "6281332837585",
      hargaLabel: "Rp 12.000 – Rp 25.000",
      hargaSatuan: "/ porsi",
      hargaBadge: "Harga Ramah Warga",
      image: "/images/hero-1.jpg",
      galeri: ["/images/hero-1.jpg", "/images/hero-3.jpg"],
      ringkasan: "Usaha kuliner ayam krispi favorit warga dengan racikan sambal bawang segar ulek dadakan.",
      tags: ["Pedas Lv 1–5", "Dibuat per Pesanan"],
      deskripsiLengkap: ["Ayam Geprek Pak Slamet berawal dari inisiatif keluarga sederhana di Dusun Tambakrigadung."],
      status: "APPROVED",
      menus: {
        create: [
          { badge: "Paling Laris", nama: "Paket Geprek Sambal Bawang", deskripsi: "Nasi hangat + Ayam Geprek + Es Teh", harga: "Rp 15.000", urutan: 1 },
          { badge: "Favorit Remaja", nama: "Paket Geprek Mozarella", deskripsi: "Nasi + Ayam krispi keju leleh", harga: "Rp 20.000", urutan: 2 },
        ],
      },
    },
  });
  console.log("✅ Sample UMKM seeded");

  console.log("🎉 All Initial Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
