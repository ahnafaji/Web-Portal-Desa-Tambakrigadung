import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const formatGaleri = (g) => {
  const fotos = g.fotos || [];
  return {
    id: g.id,
    slug: g.slug,
    judul: g.judul,
    judulLengkap: g.judulLengkap || g.judul,
    kategori: g.kategoriLabel || g.kategori,
    kategoriKey: g.kategori,
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

  if (kategori && kategori !== "Semua" && kategori !== "semua") {
    where.OR = [
      { kategori: { equals: kategori, mode: "insensitive" } },
      { kategoriLabel: { contains: kategori, mode: "insensitive" } },
    ];
  }

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

  return items.map(formatGaleri);
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
      { key: "wisata", label: "Wisata" },
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

  const related = await prisma.galeri.findMany({
    where: {
      id: { not: item.id },
      kategori: item.kategori,
    },
    take: 3,
    include: { fotos: { orderBy: { urutan: "asc" } } },
    orderBy: { tanggal: "desc" },
  });

  return {
    ...formatGaleri(item),
    item: formatGaleri(item),
    related: related.map(formatGaleri),
  };
};

export const createGaleri = async (data, files = []) => {
  let photoUrls = [];

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

  const coverImage = photoUrls[0] || data.cover || "/images/hero-1.jpg";

  const created = await prisma.galeri.create({
    data: {
      slug,
      judul: data.judul,
      judulLengkap: data.judulLengkap || data.judul,
      kategori: (data.kategori || "kegiatan").toLowerCase().replace(/\s+/g, "-"),
      kategoriLabel: data.kategori || "Kegiatan Warga",
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

  let photoUrls = [];
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
    updateData.kategoriLabel = data.kategori;
    updateData.kategori = data.kategori.toLowerCase().replace(/\s+/g, "-");
  }
  if (data.tanggal) updateData.tanggal = new Date(data.tanggal);
  if (data.lokasi) updateData.lokasi = data.lokasi;
  if (photoUrls.length > 0) {
    updateData.image = photoUrls[0];
  }

  await prisma.galeri.update({
    where: { id },
    data: updateData,
    include: { fotos: true },
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
  return prisma.galeri.delete({ where: { id } });
};
