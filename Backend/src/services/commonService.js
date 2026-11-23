import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";
import { checkMagicBytes } from "../middlewares/uploadValidator.js";

const STAT_META = [
  { key: "jiwa", label: "Total Jiwa", icon: "users", color: "#79a98a", urutan: 1 },
  { key: "kk", label: "Kepala Keluarga", icon: "user", color: "#e53935", urutan: 2 },
  { key: "laki", label: "Laki-Laki", icon: "male", color: "#3b82f6", urutan: 3 },
  { key: "perempuan", label: "Perempuan", icon: "female", color: "#e91ee9", urutan: 4 },
  { key: "umkm", label: "Produk UMKM", icon: "cart", color: "#2b2825", urutan: 5 },
  { key: "potensi", label: "Potensi Desa", icon: "trophy", color: "#2b2825", urutan: 6 },
  { key: "fasilitas", label: "Fasilitas Desa", icon: "building", color: "#2b2825", urutan: 7 },
  { key: "aparatur", label: "Aparatur Desa", icon: "group", color: "#2b2825", urutan: 8 },
];

const ALLOWED_SOTK = ["Pimpinan", "Sekretariat", "Kaur", "Kasi", "Kasun"];
const ALLOWED_STATUS_PERANGKAT = ["Aktif Menjabat", "Plt / Penjabat"];

const sanitizeFotoUrl = (url) => {
  const clean = String(url || "").trim();
  if (!clean) return "";
  if (clean.startsWith("/") || clean.startsWith("https://") || clean.startsWith("http://")) {
    return clean;
  }
  throw new AppError("URL foto harus diawali '/', 'http://', atau 'https://'.", 400);
};

export const getSlider = async () => {
  return prisma.heroSlider.findMany({
    where: { isActive: true },
    orderBy: { urutan: "asc" },
  });
};

export const getStatistik = async () => {
  return prisma.statistikDesa.findMany({
    orderBy: { urutan: "asc" },
  });
};

export const updateStatistik = async (payload = {}) => {
  const ops = STAT_META.map((meta) => {
    if (payload[meta.key] === undefined) return null;
    const num = Number(payload[meta.key]);
    if (!Number.isInteger(num) || num < 0) {
      throw new AppError(`Nilai statistik "${meta.label}" harus berupa angka bulat >= 0.`, 400);
    }
    return prisma.statistikDesa.upsert({
      where: { key: meta.key },
      update: { value: num },
      create: { ...meta, value: num },
    });
  }).filter(Boolean);

  if (!ops.length) {
    throw new AppError("Tidak ada data statistik yang valid untuk diperbarui.", 400);
  }

  await prisma.$transaction(ops);
  return getStatistik();
};

export const getProfil = async () => {
  const profil = await prisma.profilDesa.findFirst();
  const kepalaDesa = await prisma.kepalaDesaRiwayat.findMany({
    orderBy: { urutan: "asc" },
  });

  return {
    sejarah: profil?.sejarah || "",
    kepalaDesa,
    visi: profil?.visi || "",
    misi: profil?.misi || [],
    runningText: profil?.runningText || "",
  };
};

export const updateProfil = async (payload = {}) => {
  const sejarah = String(payload.sejarah ?? "").trim();
  const visi = String(payload.visi ?? "").trim();
  const misi = Array.isArray(payload.misi)
    ? payload.misi.map((m) => String(m ?? "").trim()).filter(Boolean)
    : [];

  if (!sejarah || !visi) {
    throw new AppError("Sejarah desa dan visi pembangunan wajib diisi.", 400);
  }
  if (!misi.length) {
    throw new AppError("Minimal harus ada 1 poin misi desa.", 400);
  }

  const existing = await prisma.profilDesa.findFirst();
  if (existing) {
    await prisma.profilDesa.update({
      where: { id: existing.id },
      data: {
        sejarah,
        visi,
        misi,
        ...(payload.runningText !== undefined
          ? { runningText: String(payload.runningText).trim() }
          : {}),
      },
    });
  } else {
    await prisma.profilDesa.create({
      data: {
        sejarah,
        visi,
        misi,
        runningText:
          String(payload.runningText || "").trim() ||
          "Selamat Datang Di Website Resmi Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
      },
    });
  }

  return getProfil();
};

export const getPerangkat = async () => {
  return prisma.perangkatDesa.findMany({
    orderBy: [{ urutan: "asc" }, { createdAt: "asc" }],
  });
};

export const createPerangkat = async (data = {}, file = null) => {
  const nama = String(data.nama || "").trim();
  const jabatan = String(data.jabatan || "").trim();
  if (!nama || !jabatan) {
    throw new AppError("Nama lengkap dan jabatan perangkat desa wajib diisi.", 400);
  }

  let foto = null;
  if (file) {
    if (!checkMagicBytes(file.buffer, file.mimetype)) {
      throw new AppError("Isi berkas foto tidak valid atau rusak.", 400);
    }
    foto = await uploadToSupabase(file, "perangkat");
  } else if (data.foto) {
    foto = sanitizeFotoUrl(data.foto) || null;
  }

  const posisiSotk = ALLOWED_SOTK.includes(data.posisiSotk) ? data.posisiSotk : "Kaur";
  const status = ALLOWED_STATUS_PERANGKAT.includes(data.status) ? data.status : "Aktif Menjabat";
  const count = await prisma.perangkatDesa.count();

  return prisma.perangkatDesa.create({
    data: {
      nama,
      nipd: String(data.nipd || "").trim() || null,
      jabatan,
      posisiSotk,
      status,
      foto,
      urutan: Number.isInteger(Number(data.urutan)) ? Number(data.urutan) : count + 1,
    },
  });
};

export const updatePerangkat = async (id, data = {}, file = null) => {
  const existing = await prisma.perangkatDesa.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Data perangkat desa tidak ditemukan.", 404);
  }

  const nama = data.nama !== undefined ? String(data.nama).trim() : existing.nama;
  const jabatan = data.jabatan !== undefined ? String(data.jabatan).trim() : existing.jabatan;
  if (!nama || !jabatan) {
    throw new AppError("Nama lengkap dan jabatan perangkat desa wajib diisi.", 400);
  }

  let foto = existing.foto;
  if (file) {
    if (!checkMagicBytes(file.buffer, file.mimetype)) {
      throw new AppError("Isi berkas foto tidak valid atau rusak.", 400);
    }
    foto = await uploadToSupabase(file, "perangkat");
  } else if (data.removeFoto === "true" || data.removeFoto === true) {
    foto = null;
  } else if (data.foto !== undefined) {
    foto = sanitizeFotoUrl(data.foto) || null;
  }

  const posisiSotk =
    data.posisiSotk && ALLOWED_SOTK.includes(data.posisiSotk)
      ? data.posisiSotk
      : existing.posisiSotk;
  const status =
    data.status && ALLOWED_STATUS_PERANGKAT.includes(data.status)
      ? data.status
      : existing.status;

  return prisma.perangkatDesa.update({
    where: { id },
    data: {
      nama,
      nipd: data.nipd !== undefined ? String(data.nipd).trim() || null : existing.nipd,
      jabatan,
      posisiSotk,
      status,
      foto,
    },
  });
};

export const deletePerangkat = async (id) => {
  const existing = await prisma.perangkatDesa.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Data perangkat desa tidak ditemukan.", 404);
  }
  return prisma.perangkatDesa.delete({ where: { id } });
};

export const getSambutan = async () => {
  return {
    nama: "Moch. Takim",
    jabatan: "Kepala Desa",
    foto: "/images/kades.jpeg",
    teks: "Assalamu’alaikum warahmatullahi wabarakatuh, Salam sejahtera untuk kita semua. Puji syukur kita panjatkan ke hadirat Allah SWT, karena pada hari ini kita dapat terus melayani kemajuan Desa Tambakrigadung secara transparan, akuntabel, dan berkeadilan bagi seluruh lapisan masyarakat.",
  };
};

export const getPotensi = async ({ limit }) => {
  const take = limit ? parseInt(limit, 10) : 3;
  return prisma.potensiDesa.findMany({
    take,
    orderBy: { urutan: "asc" },
  });
};

export const getPotensiPage = async () => {
  const items = await prisma.potensiDesa.findMany({
    orderBy: { urutan: "asc" },
  });

  return {
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
    items,
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
      sumber: "Sumber: Profil Desa Tambakrigadung; BPS Kab. Lamongan; Perdes APBDes 2026.",
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
};

export const getKontak = async () => {
  return {
    nama: "Pemerintah Desa Tambakrigadung",
    alamat: "VC9G+67Q, Jl. Raya Tambak Boyo, Tikung, Tambakboyo, Kec. Tikung, Kabupaten Lamongan, Jawa Timur 62281",
    kodeWilayah: "35.24.23.2011",
    telepon: "+123 3888 994 838",
    email: "tambakrigadung@gmail.com",
    nomorPengurus: [
      { label: "Pak Moch. Takim (Kepala Desa)", href: "#" },
      { label: "Pak (Sekretaris)", href: "#" },
      { label: "Pak (Babinsa)", href: "#" },
    ],
    jelajahi: [
      { label: "Website Kecamatan Tikung", href: "https://tikung.lamongankab.go.id/" },
      { label: "Website Provinsi", href: "https://jatimprov.go.id/" },
      { label: "Cek DPT Online", href: "https://cekdptonline.kpu.go.id/" },
      { label: "Cek Bansos Kemensos", href: "https://cekbansos.kemensos.go.id/" },
    ],
  };
};

export const getKontakPage = async () => {
  const pamongItems = await prisma.pamongKontak.findMany({
    orderBy: { urutan: "asc" },
  });

  return {
    header: {
      badge: "HUBUNGI PEMERINTAH DESA",
      judul: "Kontak Resmi & Pusat Bantuan Warga",
      deskripsi:
        "Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan. Akses cepat dan langsung ke seluruh saluran komunikasi, pamong desa, posko darurat, dan layanan aduan masyarakat.",
      jamPiket: "Jam Kerja Piket Pelayanan Aktif (08.00 - 15.00 WIB)",
      komitmenBadge: "Transparan, Akuntabel & Bebas Pungli",
    },
    channels: [
      {
        key: "balai",
        varian: "default",
        ikon: "landmark",
        status: "Buka 08.00 - 15.00",
        judul: "Kantor Balai Desa",
        deskripsi: "VC9G+67Q, Jl. Raya Tambak Boyo, Dusun Tambakboyo, Tambakrigadung, Kec. Tikung, Lamongan 62281",
        highlight: "Kode Wilayah: 35.24.23.2011",
        ctaLabel: "Petunjuk Arah Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Balai%20Desa%20Tambakrigadung%20Tikung%20Lamongan",
        external: true,
      },
      {
        key: "whatsapp",
        varian: "featured",
        ikon: "phone",
        status: "Hotline 24 Jam",
        judul: "WhatsApp Pengaduan Cepat",
        deskripsi: "Layanan pesan singkat langsung ke operator Pamong Desa Tambakrigadung.",
        highlight: "+62 813-3283-7585",
        ctaLabel: "Chat WhatsApp Sekarang",
        href: "https://wa.me/6281332837585?text=Halo%20Admin%20Desa%20Tambakrigadung,%20saya%20ingin%20menyampaikan%20pengaduan/pertanyaan.",
        external: true,
      },
      {
        key: "darurat",
        varian: "warning",
        ikon: "shield",
        status: "Siaga 24 Jam",
        judul: "Posko Darurat & Kamtibmas",
        deskripsi: "Hubungi Piket Babinsa, Bhabinkamtibmas, atau Tim Siaga Bencana Desa.",
        highlight: "Darurat: +62 3888 994 838",
        ctaLabel: "Hubungi Call Center Darurat",
        href: "tel:+623888994838",
        external: false,
      },
      {
        key: "email",
        varian: "info",
        ikon: "mail",
        status: "Administratif",
        judul: "Email & Persuratan Resmi",
        deskripsi: "pemdes@tambakrigadung.desa.id tambakrigadung@gmail.com",
        highlight: "Pelayanan surat-menyurat & dokumen instansi.",
        ctaLabel: "Kirim Surat Elektronik",
        href: "mailto:tambakrigadung@gmail.com?subject=Permohonan%20Informasi%20/%20Persuratan%20Desa",
        external: false,
      },
    ],
    pamong: {
      eyebrow: "DIREKTORI KONTAK LANGSUNG PAMONG DESA",
      judul: "Pejabat & Pengurus Desa Siaga",
      subjudul: "Hubungi aparatur desa terkait langsung via panggilan atau WhatsApp sesuai bidang kebutuhan layanan Anda.",
      items: pamongItems,
    },
    sop: {
      eyebrow: "STANDAR OPERASIONAL PROSEDUR (SOP)",
      judul: "Alur Penanganan Pengaduan & Aspirasi Warga",
      subjudul: "Setiap laporan diproses secara transparan dengan estimasi kepastian tindak lanjut terukur oleh perangkat desa.",
      steps: [
        { nomor: "01", ikon: "megaphone", judul: "Penyampaian Aduan/Aspirasi", deskripsi: "Warga mengisi formulir digital maupun menghubungi saluran resmi desa." },
        { nomor: "02", ikon: "file", judul: "Verifikasi Sekretariat", deskripsi: "Operator sekretariat memverifikasi laporan & menerbitkan Nomor Tiket Aduan." },
        { nomor: "03", ikon: "users", judul: "Tindak Lanjut Lapangan", deskripsi: "Disposisi kepada Kepala Dusun atau teknis terkait untuk penanganan." },
        { nomor: "04", ikon: "check", judul: "Publikasi & Konfirmasi", deskripsi: "Pelapor mendapatkan konfirmasi penyelesaian laporan." },
      ],
    },
    dusunOptions: ["Dusun Krajan", "Dusun Tambakboyo", "Dusun Melik", "Dusun Boyo"],
    kategoriAduanOptions: [
      "Infrastruktur & Jalan Desa",
      "Administrasi & Kependudukan",
      "Saluran Irigasi & Pertanian",
      "Keamanan & Ketertiban (Kamtibmas)",
      "Kesehatan & Sosial (Posyandu/Bansos)",
      "Usulan Pembangunan / Aspirasi Warga",
    ],
    prioritasOptions: [
      { key: "biasa", label: "Biasa", estimasi: "3–5 Hari Kerja" },
      { key: "penting", label: "Penting", estimasi: "1–2 Hari Kerja" },
      { key: "mendesak", label: "Sangat Mendesak", estimasi: "Penanganan Segera" },
    ],
    sidebar: {
      lokasi: {
        badge: "Pusat Layanan",
        judul: "Lokasi Balai Desa",
        deskripsi: "Jl. Raya Tambak Boyo, Tikung, Tambakboyo, Kec. Tikung, Kab. Lamongan, Jawa Timur 62281.",
        koordinat: "-7.143821, 112.398412",
        mapEmbedUrl: "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed",
        mapsHref: "https://www.google.com/maps/search/?api=1&query=Balai%20Desa%20Tambakrigadung%20Tikung%20Lamongan",
      },
      sosmed: {
        judul: "Media Sosial & Informasi Resmi",
        deskripsi: "Ikuti kanal informasi resmi desa untuk pengumuman dan kegiatan terbaru secara daring.",
        items: [
          { ikon: "camera", nama: "@desatambakrigadung", platform: "Instagram Official", href: "https://instagram.com" },
          { ikon: "users", nama: "Pemerintah Desa Tambakrigadung", platform: "Halaman Facebook", href: "https://facebook.com" },
          { ikon: "eye", nama: "Tambakrigadung TV", platform: "Kanal YouTube", href: "https://youtube.com" },
        ],
      },
      bantuanLangsung: {
        judul: "Butuh Bantuan Langsung?",
        deskripsi: "Apabila mengalami kendala pengisian formulir dalam sistem, hubungi operator kantor desa secara langsung.",
        telepon: "+62 3888 994 838",
        href: "tel:+623888994838",
      },
    },
    maklumat: {
      badge: "Maklumat Pelayanan Publik Resmi",
      judul: "Komitmen Bebas Pungutan Liar (Pungli) & Pelayanan Transparan",
      kutipan:
        "“Dengan ini kami segenap Pemerintah Desa Tambakrigadung menyatakan sanggup menyelenggarakan pelayanan prima kepada seluruh warga masyarakat desa serta segala bentuk pengaduan cepat, ramah, dan transparan sesuai dengan peraturan perundang-undangan.”",
      catatan: "Sesuai Keputusan Kepala Desa Tambakrigadung tentang Standar Pelayanan Minimal (SPM) Desa.",
      pejabat: "Pak Moh. Takim",
      jabatan: "Kepala Desa Tambakrigadung",
    },
  };
};