import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const KATEGORI_MAP = {
  kegiatan: { key: "kegiatan", label: "Kegiatan Warga" },
  pembangunan: { key: "pembangunan", label: "Pembangunan" },
  wisata: { key: "wisata", label: "Wisata & Budaya" },
  pemerintahan: { key: "pemerintahan", label: "Pemerintahan" },
};

const normalizeKategori = (val) => {
  const lower = String(val || "").toLowerCase().trim();
  if (lower.includes("pembangunan")) return KATEGORI_MAP.pembangunan;
  if (lower.includes("wisata") || lower.includes("budaya")) return KATEGORI_MAP.wisata;
  if (lower.includes("pemerintah")) return KATEGORI_MAP.pemerintahan;
  return KATEGORI_MAP.kegiatan;
};

const formatGaleri = (g) => {
  const fotos = g.fotos || [];
  const kat = normalizeKategori(g.kategoriLabel || g.kategori);

  return {
    id: g.id,
    slug: g.slug,
    judul: g.judul,
    judulLengkap: g.judulLengkap || g.judul,
    kategori: kat.label,
    kategoriKey: kat.key,
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(g.tanggal || g.createdAt)),
    rawTanggal: g.tanggal ? new Date(g.tanggal).toISOString().slice(0, 10) : "",
    lokasi: g.lokasi,
    dokumentator: g.dokumentator || "Humas & Pamong Desa",
    keterangan: g.ringkasan?.capaian || (g.highlights && g.highlights[0]?.value) || "",
    deskripsi: g.ringkasan?.capaian || "",
    jumlahFoto: fotos.length,
    status: "Terbit",
    cover: g.image,
    image: g.image,
    fotos: fotos.map((f) => ({
      id: f.id,
      src: f.src,
      caption: f.caption || "",
    })),
    highlights: g.highlights || [],
    ringkasan: g.ringkasan || null,
  };
};

export const getGaleriList = async (query = {}) => {
  const { kategori, search } = query;
  const where = {};

  if (search) {
    where.OR = [
      { judul: { contains: search, mode: "insensitive" } },
      { lokasi: { contains: search, mode: "insensitive" } },
    ];
  }

  const items = await prisma.galeri.findMany({
    where,
    include: { fotos: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });

  let formatted = items.map(formatGaleri);
  if (kategori && kategori !== "Semua" && kategori !== "semua") {
    const targetKey = normalizeKategori(kategori).key;
    formatted = formatted.filter((item) => item.kategoriKey === targetKey);
  }

  return formatted;
};

export const getGaleriPage = async () => {
  const items = await prisma.galeri.findMany({
    include: {
      fotos: { orderBy: { urutan: "asc" } },
    },
    orderBy: { tanggal: "desc" },
  });

  const formattedItems = items.map(formatGaleri);

  return {
    header: {
      badge: "Arsip Publik Tambakrigadung",
      judul: "Galeri Foto Desa Tambakrigadung",
      deskripsi:
        "Dokumentasi visual berbagai kegiatan warga, pembangunan infrastruktur, dan keindahan desa.",
      stats: [
        {
          ikon: "camera",
          value: `${formattedItems.reduce((acc, c) => acc + c.jumlahFoto, 0)}+`,
          label: "Foto Dokumentasi",
        },
        { ikon: "compass", value: "4 Dusun", label: "Wilayah Terliput" },
      ],
    },
    kategoriTabs: [
      { key: "semua", label: "Semua" },
      { key: "kegiatan", label: "Kegiatan Warga" },
      { key: "pembangunan", label: "Pembangunan" },
      { key: "wisata", label: "Wisata & Budaya" },
      { key: "pemerintahan", label: "Pemerintahan" },
    ],
    items: formattedItems,
  };
};

export const getGaleriDetail = async (identifier) => {
  const item = await prisma.galeri.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      fotos: { orderBy: { urutan: "asc" } },
    },
  });

  if (!item) {
    throw new AppError("Dokumentasi galeri tidak ditemukan.", 404);
  }

  const formatted = formatGaleri(item);
  const allOther = await prisma.galeri.findMany({
    where: { id: { not: item.id } },
    include: { fotos: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });

  const related = allOther
    .map(formatGaleri)
    .filter((g) => g.kategoriKey === formatted.kategoriKey)
    .slice(0, 3);

  return {
    ...formatted,
    item: formatted,
    related,
  };
};

export const createGaleri = async (data, files = []) => {
  const photoUrls = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const url = await uploadToSupabase(file, "galeri");
      photoUrls.push(url);
    }
  }

  const baseSlug = (data.judul || "galeri")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const kat = normalizeKategori(data.kategori);
  const coverImage = photoUrls[0] || data.cover || "/images/hero-1.jpg";

  const created = await prisma.galeri.create({
    data: {
      slug,
      judul: data.judul,
      judulLengkap: data.judulLengkap || data.judul,
      kategori: kat.key,
      kategoriLabel: kat.label,
      tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
      lokasi: data.lokasi || "Desa Tambakrigadung",
      dokumentator: data.dokumentator || "Humas & Pamong Desa",
      image: coverImage,
      ringkasan: {
        tanggal: data.tanggal || new Date().toISOString().slice(0, 10),
        lokasi: data.lokasi || "Desa Tambakrigadung",
        partisipan: "Warga Desa Tambakrigadung",
        penyelenggara: "Pemerintah Desa Tambakrigadung",
        capaian: data.keterangan || data.deskripsi || "Dokumentasi publik kegiatan desa.",
      },
      fotos: {
        create: photoUrls.map((url, idx) => ({
          src: url,
          caption: `Foto dokumentasi ${idx + 1}: ${data.judul}`,
          urutan: idx + 1,
        })),
      },
    },
    include: { fotos: true },
  });

  return formatGaleri(created);
};

export const updateGaleri = async (id, data, files = []) => {
  const existing = await prisma.galeri.findUnique({ where: { id }, include: { fotos: true } });
  if (!existing) {
    throw new AppError("Album galeri tidak ditemukan.", 404);
  }

  const photoUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const url = await uploadToSupabase(file, "galeri");
      photoUrls.push(url);
    }
  }

  const updateData = {};
  if (data.judul) {
    updateData.judul = data.judul;
    updateData.judulLengkap = data.judulLengkap || data.judul;
  }
  if (data.kategori) {
    const kat = normalizeKategori(data.kategori);
    updateData.kategori = kat.key;
    updateData.kategoriLabel = kat.label;
  }
  if (data.tanggal) updateData.tanggal = new Date(data.tanggal);
  if (data.lokasi) updateData.lokasi = data.lokasi;
  if (photoUrls.length > 0) {
    updateData.image = photoUrls[0];
  }

  if (data.keterangan !== undefined || data.deskripsi !== undefined || data.tanggal || data.lokasi) {
    const prevRingkasan =
      existing.ringkasan && typeof existing.ringkasan === "object" ? existing.ringkasan : {};
    updateData.ringkasan = {
      ...prevRingkasan,
      tanggal: data.tanggal || prevRingkasan.tanggal || new Date().toISOString().slice(0, 10),
      lokasi: data.lokasi || prevRingkasan.lokasi || existing.lokasi,
      capaian:
        data.keterangan !== undefined
          ? data.keterangan
          : data.deskripsi !== undefined
            ? data.deskripsi
            : prevRingkasan.capaian || "",
    };
  }

  await prisma.galeri.update({
    where: { id },
    data: updateData,
  });

  if (photoUrls.length > 0) {
    await prisma.galeriFoto.createMany({
      data: photoUrls.map((url, idx) => ({
        galeriId: id,
        src: url,
        caption: `Foto dokumentasi ${existing.fotos.length + idx + 1}`,
        urutan: existing.fotos.length + idx + 1,
      })),
    });
  }

  const refreshed = await prisma.galeri.findUnique({
    where: { id },
    include: { fotos: { orderBy: { urutan: "asc" } } },
  });

  return formatGaleri(refreshed);
};

export const deleteGaleri = async (id) => {
  const existing = await prisma.galeri.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Album galeri tidak ditemukan.", 404);
  }

  await prisma.galeriFoto.deleteMany({ where: { galeriId: id } });
  return prisma.galeri.delete({ where: { id } });
};