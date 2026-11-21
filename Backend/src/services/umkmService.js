import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

export const getUmkmList = async ({ limit, kategori }) => {
  const where = { status: "APPROVED" };
  if (kategori && kategori !== "semua") {
    where.kategori = kategori;
  }
  const take = limit ? parseInt(limit, 10) : undefined;

  return prisma.umkm.findMany({
    where,
    take,
    include: { menus: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });
};

export const getUmkmPage = async () => {
  const items = await prisma.umkm.findMany({
    where: { status: "APPROVED" },
    include: { menus: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });

  const featured = items[0] || null;

  return {
    header: {
      badge: "SENTRA EKONOMI KREATIF & PANGAN DESA",
      judulUtama: "Pasar Karya & Rasa",
      judulAksen: "Desa Tambakrigadung",
      deskripsi:
        "Eksplorasi kurasi produk olahan tambak payau, kerajinan tangan canting sekar boyo, olahan rempah, hingga rekayasa alat pertanian garapan tangan terampil warga asli Kecamatan Tikung.",
      summaryTitle: "Kekuatan Usaha Desa",
      summaryBadge: "Terverifikasi BUMDes",
      totalUnit: `${items.length}`,
      totalUnitLabel: "Unit Usaha Terdata",
      totalDusun: "4 Dusun",
      totalDusunLabel: "Krajan, Boyo, Melik, Turi",
      summaryFoot: "100% Produk Lokal & Kemitraan Warga",
    },
    kategoriTabs: [
      { key: "semua", label: "Semua Katalog", count: items.length },
      { key: "pangan", label: "Pangan & Kudapan" },
      { key: "olahan", label: "Olahan Tambak & Madu" },
      { key: "kerajinan", label: "Batik & Kerajinan" },
      { key: "jasa", label: "Fabrikasi & Jasa" },
    ],
    featured: featured
      ? {
          slug: featured.slug,
          badge: "KARYA PILIHAN BUMDES BOYO MAKMUR",
          judul: featured.nama,
          deskripsi: featured.ringkasan,
          info: [
            { label: "Perajin Utama", value: featured.pemilik },
            { label: "Lokasi Sentra", value: featured.dusun },
            { label: "Status Buka", value: featured.statusBuka || "Setiap Hari" },
          ],
          hargaLabel: featured.hargaBadge || "Harga Mulai Terjangkau",
          harga: featured.hargaMulai || "Sesuai Pesanan",
          hargaSatuan: featured.hargaSatuan || "",
          whatsapp: featured.whatsapp,
          image: featured.image,
          imageCaption: `Katalog Pesona Desa · Karya ${featured.pemilik}`,
        }
      : null,
    items,
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
          jumlah: "Pelaku Usaha Aktif",
        },
        {
          key: "tambakboyo",
          nama: "Dusun Tambakboyo",
          ikon: "fish",
          deskripsi: "Sentra budidaya ikan bandeng & nila, serta terasi udang olahan segar.",
          jumlah: "Pelaku Usaha Aktif",
        },
        {
          key: "melik",
          nama: "Dusun Melik",
          ikon: "sprout",
          deskripsi: "Sentra budidaya madu klanceng murni, ternak kambing, dan olahan keripik sayur.",
          jumlah: "Pelaku Usaha Aktif",
        },
        {
          key: "boyo",
          nama: "Dusun Boyo",
          ikon: "wrench",
          deskripsi: "Sentra fabrikasi logam, bengkel mesin pompa air tambak, dan kerajinan kayu/bambu.",
          jumlah: "Pelaku Usaha Aktif",
        },
      ],
    },
    cta: {
      badge: "BUMDES BOYO MAKMUR PEDULI USAHA WARGA",
      judul: "Punya Usaha Rumahan di Desa Tambakrigadung?",
      deskripsi:
        "Pemerintah Desa Tambakrigadung memfasilitasi secara gratis bagi pelaku UMKM untuk mendapatkan promosi, sertifikasi halal, dan pembinaan berkala.",
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
        { nomor: 1, judul: "1. Isi Formulir", deskripsi: "Lengkapi data usaha, harga, dan deskripsi produk." },
        { nomor: 2, judul: "2. Unggah Foto", deskripsi: "Lampirkan 1–3 foto terbaik agar menarik minat pembeli." },
        { nomor: 3, judul: "3. Peninjauan Admin Desa", deskripsi: "Admin akan memeriksa kelengkapan data dalam 1–2 hari kerja." },
        { nomor: 4, judul: "4. Tampil di Portal", deskripsi: "Setelah disetujui, usaha Anda otomatis muncul di halaman UMKM Desa." },
      ],
    },
  };
};

export const getUmkmDetail = async (slug) => {
  const item = await prisma.umkm.findUnique({
    where: { slug },
    include: { menus: { orderBy: { urutan: "asc" } } },
  });

  if (!item || item.status !== "APPROVED") {
    throw new AppError("Profil usaha UMKM tidak ditemukan atau belum disetujui.", 404);
  }

  const related = await prisma.umkm.findMany({
    where: {
      status: "APPROVED",
      id: { not: item.id },
      kategori: item.kategori,
    },
    take: 3,
    orderBy: { tanggal: "desc" },
  });

  return { item, related };
};

export const registerUmkmPublic = async (data, files) => {
  if (!files || files.length === 0) {
    throw new AppError("Harap unggah minimal 1 foto produk atau tempat usaha.", 400);
  }

  // Upload all attached photos to Supabase Storage
  const photoUrls = [];
  for (const file of files) {
    const url = await uploadToSupabase(file, "umkm");
    photoUrls.push(url);
  }

  const baseSlug = data.namaUsaha
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const kategoriMap = {
    pangan: "Kuliner & Kudapan",
    olahan: "Olahan Tambak & Madu",
    kerajinan: "Batik & Kerajinan",
    jasa: "Fabrikasi & Jasa",
  };

  const cleanWa = data.whatsapp.replace(/\D/g, "");
  const normalizedWa = cleanWa.startsWith("0") ? `62${cleanWa.slice(1)}` : cleanWa.startsWith("62") ? cleanWa : `62${cleanWa}`;

  const created = await prisma.umkm.create({
    data: {
      slug,
      nama: data.namaUsaha,
      kategori: data.kategori,
      kategoriLabel: kategoriMap[data.kategori] || "UMKM Desa",
      badgeUtama: "USAHA WARGA",
      jamOperasional: data.jamOperasional || "Setiap Hari",
      statusBuka: data.jamOperasional ? `Buka (${data.jamOperasional})` : "Buka",
      dusun: data.alamat.includes("Dusun") ? data.alamat.split(",")[0] : "Desa Tambakrigadung",
      alamat: data.alamat,
      pemilik: data.namaPemilik,
      whatsapp: normalizedWa,
      hargaMin: data.hargaMin ? parseFloat(data.hargaMin.replace(/\D/g, "")) : null,
      hargaMax: data.hargaMax ? parseFloat(data.hargaMax.replace(/\D/g, "")) : null,
      hargaLabel: data.hargaMin && data.hargaMax ? `Rp ${data.hargaMin} – Rp ${data.hargaMax}` : "Harga Menyesuaikan",
      image: photoUrls[0],
      galeri: photoUrls,
      ringkasan: data.deskripsi.slice(0, 150) + (data.deskripsi.length > 150 ? "..." : ""),
      deskripsiLengkap: [data.deskripsi],
      mapsHref: data.mapsUrl || null,
      status: "PENDING", // Must be approved by Admin
    },
  });

  return {
    status: "pending_verification",
    message: "Pendaftaran usaha berhasil dikirim dan sedang menunggu verifikasi Admin Desa (1–2 hari kerja).",
    id: created.id,
  };
};

export const verifyUmkm = async (id, status) => {
  return prisma.umkm.update({
    where: { id },
    data: {
      status,
      verifiedAt: status === "APPROVED" ? new Date() : null,
    },
  });
};
