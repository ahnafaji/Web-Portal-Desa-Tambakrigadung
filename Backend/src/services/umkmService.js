import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const KATEGORI_LIST = {
  pangan: { key: "pangan", label: "Pangan & Kudapan" },
  olahan: { key: "olahan", label: "Olahan Tambak & Madu" },
  kerajinan: { key: "kerajinan", label: "Batik & Kerajinan" },
  jasa: { key: "jasa", label: "Fabrikasi & Jasa" },
};

const normalizeKategori = (val) => {
  const lower = String(val || "").toLowerCase().trim();
  if (lower === "pangan" || lower.includes("pangan") || lower.includes("kuliner") || lower.includes("kudapan")) {
    return KATEGORI_LIST.pangan;
  }
  if (
    lower === "olahan" ||
    lower.includes("olahan") ||
    lower.includes("tambak") ||
    lower.includes("madu") ||
    lower.includes("ikan") ||
    lower.includes("tani")
  ) {
    return KATEGORI_LIST.olahan;
  }
  if (lower === "kerajinan" || lower.includes("batik") || lower.includes("rajin")) {
    return KATEGORI_LIST.kerajinan;
  }
  if (lower === "jasa" || lower.includes("fabrikasi") || lower.includes("dagang")) {
    return KATEGORI_LIST.jasa;
  }
  return KATEGORI_LIST.pangan;
};

// Helper map enum
const mapStatusToDb = (status) => {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (s === "menunggu" || s === "pending" || s === "draft" || s === "draf") return "PENDING";
  if (s === "aktif" || s === "approved") return "APPROVED";
  if (s === "ditolak" || s === "rejected") return "REJECTED";
  return status.toUpperCase();
};

const mapStatusToFrontend = (status) => {
  if (status === "PENDING") return "Menunggu";
  if (status === "APPROVED") return "Aktif";
  if (status === "REJECTED") return "Ditolak";
  return status;
};

const formatUmkmItem = (u) => {
  const min = u.hargaMin ? Number(u.hargaMin) : 0;
  const max = u.hargaMax ? Number(u.hargaMax) : 0;
  const kat = normalizeKategori(u.kategori || u.kategoriLabel);

  let deskripsiLengkapArr = [];
  if (Array.isArray(u.deskripsiLengkap) && u.deskripsiLengkap.length > 0) {
    deskripsiLengkapArr = u.deskripsiLengkap;
  } else if (typeof u.deskripsiLengkap === "string" && u.deskripsiLengkap.trim()) {
    deskripsiLengkapArr = [u.deskripsiLengkap.trim()];
  } else if (u.ringkasan) {
    deskripsiLengkapArr = [u.ringkasan];
  } else {
    deskripsiLengkapArr = ["Informasi profil usaha desa."];
  }

  const menusFormatted = (u.menus || []).map((m) => ({
    id: m.id,
    badge: m.badge || "Menu Pilihan",
    nama: m.nama,
    deskripsi: m.deskripsi || "",
    harga: m.harga,
    urutan: m.urutan,
  }));

  let petunjukArahObj = u.petunjukArah;
  if (typeof petunjukArahObj === "string") {
    try {
      petunjukArahObj = JSON.parse(petunjukArahObj);
    } catch {
      petunjukArahObj = { deskripsi: petunjukArahObj, fasilitas: [] };
    }
  }
  if (!petunjukArahObj || typeof petunjukArahObj !== "object") {
    petunjukArahObj = {
      deskripsi: u.patokanLokasi || `Berada di wilayah ${u.dusun || "Desa Tambakrigadung"}, akses jalan desa mudah dijangkau.`,
      fasilitas: ["Parkir Kendaraan", "Akses Jalan Utama", "Pelayanan Ramah"],
    };
  }
  if (!Array.isArray(petunjukArahObj.fasilitas)) {
    petunjukArahObj.fasilitas = ["Parkir Kendaraan", "Akses Jalan Utama"];
  }

  const defaultMapsHref =
    u.mapsHref ||
    (u.alamat
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${u.nama} ${u.alamat} Tambakrigadung Tikung Lamongan`
      )}`
      : "https://maps.google.com");
  const defaultEmbed =
    u.mapEmbedUrl ||
    "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed";

  return {
    id: u.id,
    slug: u.slug,
    namaUsaha: u.nama,
    nama: u.nama,
    pemilik: u.pemilik,
    telepon: u.whatsapp,
    whatsapp: u.whatsapp,
    kategori: kat.key,
    kategoriLabel: kat.label,
    kategoriKey: kat.key,
    badgeUtama: u.badgeUtama || "USAHA DESA",
    ratingLabel: u.ratingLabel || null,
    statusBuka: u.statusBuka || (u.jamOperasional ? `Buka (${u.jamOperasional})` : "Buka"),
    jamOperasional: u.jamOperasional || "Setiap Hari, 08.00 – 17.00 WIB",
    dusun: u.dusun || "Desa Tambakrigadung",
    alamat: u.alamat || "Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan",
    patokanLokasi: u.patokanLokasi || `${u.dusun || "Desa Tambakrigadung"} (Akses Jalan Utama)`,
    pembayaran: u.pembayaran || "Tunai / Transfer",
    hargaLabel:
      u.hargaLabel ||
      (min && max
        ? `Rp ${min.toLocaleString("id-ID")} – Rp ${max.toLocaleString("id-ID")}`
        : "Harga Menyesuaikan"),
    hargaSatuan: u.hargaSatuan || "/ porsi",
    hargaBadge: u.hargaBadge || null,
    hargaMulai: u.hargaMulai || (min ? `Rp ${min.toLocaleString("id-ID")}` : "Menyesuaikan"),
    hargaMin: min,
    hargaMax: max,
    rawMapsUrl: u.mapsHref || "",
    mapsUrl: defaultMapsHref,
    mapsHref: defaultMapsHref,
    mapEmbedUrl: defaultEmbed,
    petunjukArah: petunjukArahObj,
    deskripsi: u.ringkasan || deskripsiLengkapArr[0] || "",
    ringkasan: u.ringkasan || deskripsiLengkapArr[0] || "",
    deskripsiLengkap: deskripsiLengkapArr,
    catatanMenu: u.catatanMenu || null,
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(u.tanggal || u.createdAt)),
    status: mapStatusToFrontend(u.status),
    rawStatus: u.status,
    foto: u.image || "/images/hero-1.jpg",
    image: u.image || "/images/hero-1.jpg",
    galeri: u.galeri && u.galeri.length > 0 ? u.galeri : [u.image || "/images/hero-1.jpg"],
    menus: menusFormatted,
    menu: menusFormatted,
  };
};

/**
 * Public List: only APPROVED items
 */
export const getUmkmList = async ({ limit, kategori, status, q }) => {
  const where = {};

  if (status && status !== "Semua") {
    where.status = mapStatusToDb(status);
  } else {
    where.status = "APPROVED";
  }

  if (q) {
    where.OR = [
      { nama: { contains: q, mode: "insensitive" } },
      { pemilik: { contains: q, mode: "insensitive" } },
      { dusun: { contains: q, mode: "insensitive" } },
    ];
  }

  const take = limit ? parseInt(limit, 10) : undefined;

  const items = await prisma.umkm.findMany({
    where,
    include: { menus: { orderBy: { urutan: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  let formatted = items.map(formatUmkmItem);
  if (kategori && kategori !== "semua" && kategori !== "Semua") {
    const targetKey = normalizeKategori(kategori).key;
    formatted = formatted.filter((item) => item.kategori === targetKey);
  }

  return take ? formatted.slice(0, take) : formatted;
};

/**
 * Admin List: includes ALL statuses (Menunggu, Aktif, Ditolak)
 */
export const getAdminUmkmList = async (query = {}) => {
  const { status, kategori, search } = query;
  const where = {};

  if (status && status !== "Semua") {
    where.status = mapStatusToDb(status);
  }

  if (search) {
    where.OR = [
      { nama: { contains: search, mode: "insensitive" } },
      { pemilik: { contains: search, mode: "insensitive" } },
      { dusun: { contains: search, mode: "insensitive" } },
    ];
  }

  const items = await prisma.umkm.findMany({
    where,
    include: { menus: { orderBy: { urutan: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  let formatted = items.map(formatUmkmItem);
  if (kategori && kategori !== "Semua" && kategori !== "semua") {
    const targetKey = normalizeKategori(kategori).key;
    formatted = formatted.filter((item) => item.kategori === targetKey);
  }

  return formatted;
};

export const getUmkmPage = async () => {
  const rawItems = await prisma.umkm.findMany({
    where: { status: "APPROVED" },
    include: { menus: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });

  const items = rawItems.map(formatUmkmItem);
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

export const getUmkmDetail = async (identifier) => {
  const item = await prisma.umkm.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: { menus: { orderBy: { urutan: "asc" } } },
  });

  if (!item) {
    throw new AppError("Profil usaha UMKM tidak ditemukan.", 404);
  }

  const formattedItem = formatUmkmItem(item);
  const allApproved = await prisma.umkm.findMany({
    where: {
      status: "APPROVED",
      id: { not: item.id },
    },
    orderBy: { tanggal: "desc" },
  });

  const related = allApproved
    .map(formatUmkmItem)
    .filter((u) => u.kategori === formattedItem.kategori)
    .slice(0, 3);

  return { item: formattedItem, related };
};

export const createUmkm = async (data, files = []) => {
  let photoUrls = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const url = await uploadToSupabase(file, "umkm");
      photoUrls.push(url);
    }
  }

  const baseSlug = (data.namaUsaha || data.nama || "umkm")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const cleanWa = (data.whatsapp || data.telepon || "").replace(/\D/g, "");
  const normalizedWa = cleanWa.startsWith("0")
    ? `62${cleanWa.slice(1)}`
    : cleanWa.startsWith("62")
      ? cleanWa
      : `62${cleanWa}`;

  const kat = normalizeKategori(data.kategori);
  const statusDb = mapStatusToDb(data.status) || "APPROVED";
  const minVal = data.hargaMin ? parseFloat(String(data.hargaMin).replace(/\D/g, "")) : null;
  const maxVal = data.hargaMax ? parseFloat(String(data.hargaMax).replace(/\D/g, "")) : null;

  const created = await prisma.umkm.create({
    data: {
      slug,
      nama: data.namaUsaha || data.nama,
      kategori: kat.key,
      kategoriLabel: kat.label,
      badgeUtama: "USAHA WARGA",
      jamOperasional: data.jamOperasional || "Setiap Hari",
      statusBuka: data.jamOperasional ? `Buka (${data.jamOperasional})` : "Buka",
      dusun:
        data.dusun ||
        (data.alamat && data.alamat.includes("Dusun") ? data.alamat.split(",")[0] : "Desa Tambakrigadung"),
      alamat: data.alamat,
      pemilik: data.pemilik || data.namaPemilik,
      whatsapp: normalizedWa,
      hargaMin: minVal,
      hargaMax: maxVal,
      hargaLabel:
        minVal && maxVal
          ? `Rp ${minVal.toLocaleString("id-ID")} – Rp ${maxVal.toLocaleString("id-ID")}`
          : minVal
            ? `Mulai Rp ${minVal.toLocaleString("id-ID")}`
            : "Harga Menyesuaikan",
      hargaMulai: minVal ? `Rp ${minVal.toLocaleString("id-ID")}` : "Menyesuaikan",
      image: photoUrls[0] || data.foto || "/images/hero-1.jpg",
      galeri: photoUrls.length ? photoUrls : data.foto ? [data.foto] : ["/images/hero-1.jpg"],
      ringkasan: (data.deskripsi || "").slice(0, 150) + ((data.deskripsi || "").length > 150 ? "..." : ""),
      deskripsiLengkap: [data.deskripsi || ""],
      mapsHref: data.mapsUrl || null,
      status: statusDb,
    },
    include: { menus: true },
  });

  return formatUmkmItem(created);
};

export const updateUmkm = async (id, data, files = []) => {
  const existing = await prisma.umkm.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Data UMKM tidak ditemukan.", 404);
  }

  let photoUrls = existing.galeri || [];
  let photosChanged = false;

  if (data.existingPhotos !== undefined) {
    photosChanged = true;
    try {
      const parsed =
        typeof data.existingPhotos === "string"
          ? JSON.parse(data.existingPhotos)
          : data.existingPhotos;
      photoUrls = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      photoUrls = [];
    }
  }

  if (files && files.length > 0) {
    photosChanged = true;
    const newUrls = [];
    for (const file of files) {
      const url = await uploadToSupabase(file, "umkm");
      newUrls.push(url);
    }
    photoUrls = [...photoUrls, ...newUrls];
  }

  const updatePayload = {};
  if (data.namaUsaha || data.nama) updatePayload.nama = data.namaUsaha || data.nama;
  if (data.kategori) {
    const kat = normalizeKategori(data.kategori);
    updatePayload.kategori = kat.key;
    updatePayload.kategoriLabel = kat.label;
  }
  if (data.pemilik || data.namaPemilik) updatePayload.pemilik = data.pemilik || data.namaPemilik;
  if (data.whatsapp || data.telepon) {
    const cleanWa = (data.whatsapp || data.telepon).replace(/\D/g, "");
    updatePayload.whatsapp = cleanWa.startsWith("0")
      ? `62${cleanWa.slice(1)}`
      : cleanWa.startsWith("62")
        ? cleanWa
        : `62${cleanWa}`;
  }
  if (data.jamOperasional !== undefined) {
    updatePayload.jamOperasional = data.jamOperasional;
    updatePayload.statusBuka = data.jamOperasional ? `Buka (${data.jamOperasional})` : "Buka";
  }
  if (data.alamat) {
    updatePayload.alamat = data.alamat;
    if (!data.dusun && data.alamat.includes("Dusun")) {
      updatePayload.dusun = data.alamat.split(",")[0].trim();
    }
  }
  if (data.dusun) updatePayload.dusun = data.dusun;
  if (data.mapsUrl !== undefined) updatePayload.mapsHref = data.mapsUrl || null;
  if (data.deskripsi) {
    updatePayload.ringkasan =
      data.deskripsi.slice(0, 150) + (data.deskripsi.length > 150 ? "..." : "");
    updatePayload.deskripsiLengkap = [data.deskripsi];
  }

  const nextMin =
    data.hargaMin !== undefined
      ? data.hargaMin
        ? parseFloat(String(data.hargaMin).replace(/\D/g, ""))
        : null
      : existing.hargaMin
        ? Number(existing.hargaMin)
        : null;
  const nextMax =
    data.hargaMax !== undefined
      ? data.hargaMax
        ? parseFloat(String(data.hargaMax).replace(/\D/g, ""))
        : null
      : existing.hargaMax
        ? Number(existing.hargaMax)
        : null;

  if (data.hargaMin !== undefined) updatePayload.hargaMin = nextMin;
  if (data.hargaMax !== undefined) updatePayload.hargaMax = nextMax;
  if (data.hargaMin !== undefined || data.hargaMax !== undefined) {
    updatePayload.hargaLabel =
      nextMin && nextMax
        ? `Rp ${nextMin.toLocaleString("id-ID")} – Rp ${nextMax.toLocaleString("id-ID")}`
        : nextMin
          ? `Mulai Rp ${nextMin.toLocaleString("id-ID")}`
          : "Harga Menyesuaikan";
    updatePayload.hargaMulai = nextMin ? `Rp ${nextMin.toLocaleString("id-ID")}` : "Menyesuaikan";
  }

  if (data.status) {
    updatePayload.status = mapStatusToDb(data.status);
  }
  if (photosChanged) {
    updatePayload.image = photoUrls[0] || "/images/hero-1.jpg";
    updatePayload.galeri = photoUrls;
  }

  const updated = await prisma.umkm.update({
    where: { id },
    data: updatePayload,
    include: { menus: true },
  });

  return formatUmkmItem(updated);
};

export const deleteUmkm = async (id) => {
  const existing = await prisma.umkm.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Data UMKM tidak ditemukan.", 404);
  }

  await prisma.umkm.update({
    where: { id },
    data: { menus: { deleteMany: {} } },
  });

  return prisma.umkm.delete({ where: { id } });
};

export const verifyUmkm = async (id, status) => {
  const statusDb = mapStatusToDb(status);
  const updated = await prisma.umkm.update({
    where: { id },
    data: {
      status: statusDb,
      verifiedAt: statusDb === "APPROVED" ? new Date() : null,
    },
  });
  return formatUmkmItem(updated);
};

export const registerUmkmPublic = async (data, files) => {
  if (!files || files.length === 0) {
    throw new AppError("Harap unggah minimal 1 foto produk atau tempat usaha.", 400);
  }

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

  const cleanWa = data.whatsapp.replace(/\D/g, "");
  const normalizedWa = cleanWa.startsWith("0")
    ? `62${cleanWa.slice(1)}`
    : cleanWa.startsWith("62")
      ? cleanWa
      : `62${cleanWa}`;

  const kat = normalizeKategori(data.kategori);
  const minVal = data.hargaMin ? parseFloat(data.hargaMin.replace(/\D/g, "")) : null;
  const maxVal = data.hargaMax ? parseFloat(data.hargaMax.replace(/\D/g, "")) : null;

  const created = await prisma.umkm.create({
    data: {
      slug,
      nama: data.namaUsaha,
      kategori: kat.key,
      kategoriLabel: kat.label,
      badgeUtama: "USAHA WARGA",
      jamOperasional: data.jamOperasional || "Setiap Hari",
      statusBuka: data.jamOperasional ? `Buka (${data.jamOperasional})` : "Buka",
      dusun: data.alamat.includes("Dusun") ? data.alamat.split(",")[0] : "Desa Tambakrigadung",
      alamat: data.alamat,
      pemilik: data.namaPemilik,
      whatsapp: normalizedWa,
      hargaMin: minVal,
      hargaMax: maxVal,
      hargaLabel:
        minVal && maxVal
          ? `Rp ${minVal.toLocaleString("id-ID")} – Rp ${maxVal.toLocaleString("id-ID")}`
          : minVal
            ? `Mulai Rp ${minVal.toLocaleString("id-ID")}`
            : "Harga Menyesuaikan",
      hargaMulai: minVal ? `Rp ${minVal.toLocaleString("id-ID")}` : "Menyesuaikan",
      image: photoUrls[0],
      galeri: photoUrls,
      ringkasan: data.deskripsi.slice(0, 150) + (data.deskripsi.length > 150 ? "..." : ""),
      deskripsiLengkap: [data.deskripsi],
      mapsHref: data.mapsUrl || null,
      status: "PENDING",
    },
  });

  return {
    status: "pending_verification",
    message: "Pendaftaran usaha berhasil dikirim dan sedang menunggu verifikasi Admin Desa (1–2 hari kerja).",
    id: created.id,
  };
};