import { prisma } from "../config/prisma.js";

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
