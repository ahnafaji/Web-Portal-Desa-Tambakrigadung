import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getGaleriPage = async () => {
  const items = await prisma.galeri.findMany({
    include: {
      fotos: { orderBy: { urutan: "asc" } },
    },
    orderBy: { tanggal: "desc" },
  });

  // Transform into frontend format including jumlahFoto
  const formattedItems = items.map((g) => ({
    ...g,
    jumlahFoto: g.fotos.length,
  }));

  return {
    header: {
      badge: "Arsip Publik Tambakrigadung",
      judul: "Galeri Foto Desa Tambakrigadung",
      deskripsi:
        "Dokumentasi visual berbagai kegiatan warga, pembangunan infrastruktur, dan keindahan desa.",
      stats: [
        { ikon: "camera", value: `${formattedItems.reduce((acc, c) => acc + c.jumlahFoto, 0)}+`, label: "Foto Dokumentasi" },
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

export const getGaleriDetail = async (slug) => {
  const item = await prisma.galeri.findUnique({
    where: { slug },
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
    item: { ...item, jumlahFoto: item.fotos.length },
    related: related.map((r) => ({ ...r, jumlahFoto: r.fotos.length })),
  };
};
