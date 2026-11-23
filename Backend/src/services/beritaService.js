import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const formatBerita = (b) => {
  return {
    id: b.id,
    slug: b.slug,
    judul: b.judul,
    ringkasan: b.ringkasan,
    isi: Array.isArray(b.konten)
      ? b.konten.map((k) => k.text || "").join("\n\n")
      : typeof b.konten === "string"
        ? b.konten
        : "",
    konten: b.konten,
    kategori: b.kategoriLabel || b.kategoriKey,
    kategoriKey: b.kategoriKey,
    penulis: b.penulis,
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(b.tanggal || b.createdAt)),
    status: b.isPublished ? "Terbit" : "Draf",
    isPublished: b.isPublished,
    pembaca: b.pembaca || 0,
    gambar: b.image,
    image: b.image,
    caption: b.caption || "",
    featured: b.featured,
    tags: b.tags || [],
  };
};

export const getBeritaList = async (query = {}) => {
  const { limit, kategori, q, status } = query;
  const where = {};

  if (status && status !== "Semua") {
    where.isPublished = status === "Terbit" || status === "published" || status === "true";
  }

  if (kategori && kategori !== "semua" && kategori !== "Semua") {
    where.OR = [
      { kategoriKey: { equals: kategori, mode: "insensitive" } },
      { kategoriLabel: { contains: kategori, mode: "insensitive" } },
    ];
  }

  if (q) {
    where.OR = [
      { judul: { contains: q, mode: "insensitive" } },
      { ringkasan: { contains: q, mode: "insensitive" } },
      { penulis: { contains: q, mode: "insensitive" } },
    ];
  }

  const take = limit ? parseInt(limit, 10) : undefined;

  const items = await prisma.berita.findMany({
    where,
    take,
    orderBy: { tanggal: "desc" },
  });

  return items.map(formatBerita);
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

export const getBeritaDetail = async (identifier) => {
  const article = await prisma.berita.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
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
    ...formatBerita(article),
    article,
    related: related.length ? related : pageData.items.filter((i) => i.id !== article.id).slice(0, 3),
    populer: pageData.populer,
    kategoriSidebar: pageData.kategoriSidebar,
  };
};

export const createBerita = async (data, file) => {
  let imageUrl = data.image || data.gambar || "/images/hero-1.jpg";

  if (file) {
    imageUrl = await uploadToSupabase(file, "berita");
  }

  const baseSlug = (data.judul || "berita")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = data.slug || `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const isPublished = data.status === "Terbit" || data.status === "published" || data.isPublished === true;

  // Process konten
  let kontenArray = [];
  if (Array.isArray(data.konten)) {
    kontenArray = data.konten;
  } else if (data.isi) {
    kontenArray = data.isi.split("\n\n").map((par) => ({
      type: "paragraph",
      text: par.trim(),
    }));
  } else {
    kontenArray = [{ type: "paragraph", text: data.ringkasan || "" }];
  }

  const created = await prisma.berita.create({
    data: {
      slug,
      judul: data.judul,
      kategoriKey: data.kategoriKey || (data.kategori || "kegiatan").toLowerCase().replace(/\s+/g, "-"),
      kategoriLabel: data.kategori || "Kegiatan Warga",
      subLabel: data.subLabel || "Warta Desa",
      featured: data.featured === true || data.featured === "true",
      penulis: data.penulis || "Humas Desa",
      waktuBaca: data.waktuBaca || "3 Menit Baca",
      image: imageUrl,
      caption: data.caption || `Dokumentasi: ${data.judul}`,
      ringkasan: data.ringkasan || (data.isi ? data.isi.slice(0, 150) + "..." : ""),
      dateline: data.dateline || "TAMBAKRIGADUNG —",
      konten: kontenArray,
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? String(data.tags).split(",") : ["DesaTambakrigadung"],
      isPublished,
    },
  });

  return formatBerita(created);
};

export const updateBerita = async (id, data, file) => {
  const existing = await prisma.berita.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Artikel berita tidak ditemukan.", 404);
  }

  let imageUrl = existing.image;
  if (file) {
    imageUrl = await uploadToSupabase(file, "berita");
  } else if (data.gambar || data.image) {
    imageUrl = data.gambar || data.image;
  }

  const updateData = {};
  if (data.judul) updateData.judul = data.judul;
  if (data.kategori) {
    updateData.kategoriLabel = data.kategori;
    updateData.kategoriKey = data.kategoriKey || data.kategori.toLowerCase().replace(/\s+/g, "-");
  }
  if (data.penulis) updateData.penulis = data.penulis;
  if (data.ringkasan) updateData.ringkasan = data.ringkasan;
  if (imageUrl) updateData.image = imageUrl;
  if (data.caption !== undefined) updateData.caption = data.caption;
  if (data.status !== undefined) {
    updateData.isPublished = data.status === "Terbit" || data.status === "published" || data.status === true;
  }
  if (data.isi) {
    updateData.konten = data.isi.split("\n\n").map((par) => ({
      type: "paragraph",
      text: par.trim(),
    }));
  } else if (data.konten) {
    updateData.konten = data.konten;
  }

  const updated = await prisma.berita.update({
    where: { id },
    data: updateData,
  });

  return formatBerita(updated);
};

export const deleteBerita = async (id) => {
  return prisma.berita.delete({ where: { id } });
};
