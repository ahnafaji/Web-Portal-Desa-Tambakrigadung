import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getBeritaList = async ({ limit, kategori, q }) => {
  const where = { isPublished: true };
  if (kategori && kategori !== "semua") {
    where.kategoriKey = kategori;
  }
  if (q) {
    where.OR = [
      { judul: { contains: q, mode: "insensitive" } },
      { ringkasan: { contains: q, mode: "insensitive" } },
    ];
  }

  const take = limit ? parseInt(limit, 10) : undefined;

  return prisma.berita.findMany({
    where,
    take,
    orderBy: { tanggal: "desc" },
  });
};

export const getBeritaPage = async () => {
  const items = await prisma.berita.findMany({
    where: { isPublished: true },
    orderBy: { tanggal: "desc" },
  });

  const populer = await prisma.berita.findMany({
    where: { isPublished: true },
    orderBy: { pembaca: "desc" },
    take: 4,
    select: {
      id: true,
      slug: true,
      judul: true,
      tanggal: true,
      image: true,
    },
  });

  const categories = [
    { key: "kegiatan", label: "Kegiatan Warga", ikon: "users" },
    { key: "pengumuman", label: "Pengumuman Resmi", ikon: "megaphone" },
    { key: "pembangunan", label: "Pembangunan & Infrastruktur", ikon: "hardhat" },
    { key: "pertanian", label: "Pertanian & Perikanan", ikon: "sprout" },
    { key: "kesehatan", label: "Kesehatan & Posyandu", ikon: "heart" },
  ];

  const kategoriSidebar = await Promise.all(
    categories.map(async (c) => {
      const count = await prisma.berita.count({
        where: { isPublished: true, kategoriKey: c.key },
      });
      return { ...c, count };
    })
  );

  return {
    header: {
      judul: "Kabar & Artikel Desa",
      deskripsi:
        "Informasi resmi, pengumuman kelembagaan, serta liputan kegiatan pembangunan dan masyarakat Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan.",
      totalLabel: `${items.length}+ Artikel Terbit`,
      updateLabel: "Diperbarui Berkala",
    },
    kategoriTabs: [
      { key: "semua", label: "Semua Artikel" },
      { key: "pengumuman", label: "Pengumuman" },
      { key: "kegiatan", label: "Kegiatan Warga" },
      { key: "pembangunan", label: "Pembangunan" },
      { key: "kesehatan", label: "Kesehatan" },
    ],
    kategoriSidebar,
    populer,
    items,
  };
};

export const getBeritaDetail = async (slug) => {
  const article = await prisma.berita.findUnique({
    where: { slug },
  });

  if (!article) {
    throw new AppError("Artikel berita tidak ditemukan.", 404);
  }

  // Increment reader count
  await prisma.berita.update({
    where: { id: article.id },
    data: { pembaca: { increment: 1 } },
  });

  const related = await prisma.berita.findMany({
    where: {
      isPublished: true,
      id: { not: article.id },
      kategoriKey: article.kategoriKey,
    },
    take: 3,
    orderBy: { tanggal: "desc" },
  });

  const pageData = await getBeritaPage();

  return {
    article,
    related: related.length ? related : pageData.items.filter((i) => i.id !== article.id).slice(0, 3),
    populer: pageData.populer,
    kategoriSidebar: pageData.kategoriSidebar,
  };
};

export const createBerita = async (data) => {
  return prisma.berita.create({ data });
};

export const updateBerita = async (id, data) => {
  return prisma.berita.update({
    where: { id },
    data,
  });
};

export const deleteBerita = async (id) => {
  return prisma.berita.delete({ where: { id } });
};
