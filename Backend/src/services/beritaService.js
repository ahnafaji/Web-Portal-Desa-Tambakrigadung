import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const DEFAULT_COVER = "/images/hero-1.jpg";

const KATEGORI_LIST = {
  kegiatan: { key: "kegiatan", label: "Kegiatan Warga", ikon: "users" },
  pengumuman: { key: "pengumuman", label: "Pengumuman", ikon: "megaphone" },
  pertanian: { key: "pertanian", label: "Pertanian & Perikanan", ikon: "sprout" },
  pembangunan: { key: "pembangunan", label: "Pembangunan", ikon: "hardhat" },
};

const normalizeKategori = (val) => {
  const lower = String(val || "").toLowerCase().trim();
  if (lower.includes("pengumuman")) return KATEGORI_LIST.pengumuman;
  if (lower.includes("tani") || lower.includes("ikan") || lower.includes("tambak")) {
    return KATEGORI_LIST.pertanian;
  }
  if (lower.includes("bangun") || lower.includes("infrastruktur")) {
    return KATEGORI_LIST.pembangunan;
  }
  return KATEGORI_LIST.kegiatan;
};

const formatBerita = (b) => {
  const kat = normalizeKategori(b.kategoriLabel || b.kategoriKey);

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
    kategori: kat.label,
    kategoriKey: kat.key,
    kategoriLabel: kat.label,
    penulis: b.penulis,
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(b.tanggal || b.createdAt)),
    status: b.isPublished ? "Terbit" : "Draft",
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
    orderBy: { tanggal: "desc" },
  });

  let formatted = items.map(formatBerita);
  if (kategori && kategori !== "semua" && kategori !== "Semua") {
    const targetKey = normalizeKategori(kategori).key;
    formatted = formatted.filter((item) => item.kategoriKey === targetKey);
  }

  return take ? formatted.slice(0, take) : formatted;
};

export const getBeritaPage = async () => {
  const rawItems = await prisma.berita.findMany({
    where: { isPublished: true },
    orderBy: { tanggal: "desc" },
  });

  // Pertahankan field asli Prisma (termasuk tanggal ISO) sambil menormalisasi kategori
  const items = rawItems.map((b) => {
    const kat = normalizeKategori(b.kategoriLabel || b.kategoriKey);
    return {
      ...b,
      kategori: kat.key,
      kategoriKey: kat.key,
      kategoriLabel: kat.label,
    };
  });

  const populer = [...items]
    .sort((a, b) => (b.pembaca || 0) - (a.pembaca || 0))
    .slice(0, 4)
    .map((b) => ({
      id: b.id,
      slug: b.slug,
      judul: b.judul,
      tanggal: b.tanggal,
      image: b.image,
    }));

  const categories = Object.values(KATEGORI_LIST);
  const kategoriSidebar = categories.map((c) => ({
    ...c,
    count: items.filter((item) => item.kategoriKey === c.key).length,
  }));

  return {
    header: {
      judul: "Kabar & Artikel Desa",
      deskripsi:
        "Informasi resmi, pengumuman kelembagaan, serta liputan kegiatan pembangunan dan masyarakat Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan.",
      totalLabel: `${items.length} Artikel Terbit`,
      updateLabel: "Diperbarui Berkala",
    },
    kategoriTabs: [
      { key: "semua", label: "Semua Artikel" },
      ...categories.map((c) => ({ key: c.key, label: c.label })),
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

  // Increment reader count hanya jika diakses lewat slug publik (bukan edit by id)
  if (identifier === article.slug) {
    await prisma.berita.update({
      where: { id: article.id },
      data: { pembaca: { increment: 1 } },
    });
  }

  const kat = normalizeKategori(article.kategoriLabel || article.kategoriKey);
  const normalizedArticle = {
    ...article,
    kategori: kat.key,
    kategoriKey: kat.key,
    kategoriLabel: kat.label,
  };

  const pageData = await getBeritaPage();
  const sameCategory = pageData.items.filter(
    (i) => i.id !== article.id && i.kategoriKey === kat.key
  );
  const related = (
    sameCategory.length ? sameCategory : pageData.items.filter((i) => i.id !== article.id)
  ).slice(0, 3);

  return {
    ...formatBerita(article),
    article: normalizedArticle,
    related,
    populer: pageData.populer,
    kategoriSidebar: pageData.kategoriSidebar,
  };
};

export const createBerita = async (data, file) => {
  let imageUrl = data.image || data.gambar || DEFAULT_COVER;

  if (file) {
    imageUrl = await uploadToSupabase(file, "berita");
  }

  const baseSlug = (data.judul || "berita")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = data.slug || `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const kat = normalizeKategori(data.kategori || data.kategoriKey);
  const isPublished =
    data.status === "Terbit" || data.status === "published" || data.isPublished === true;

  let kontenArray = [];
  if (Array.isArray(data.konten)) {
    kontenArray = data.konten;
  } else if (data.isi) {
    kontenArray = data.isi
      .split("\n\n")
      .map((par) => ({ type: "paragraph", text: par.trim() }))
      .filter((p) => p.text);
  } else {
    kontenArray = [{ type: "paragraph", text: data.ringkasan || "" }];
  }

  const created = await prisma.berita.create({
    data: {
      slug,
      judul: data.judul,
      kategoriKey: kat.key,
      kategoriLabel: kat.label,
      subLabel: data.subLabel || "Warta Desa",
      featured: data.featured === true || data.featured === "true",
      penulis: data.penulis || "Humas Desa",
      waktuBaca: data.waktuBaca || "3 Menit Baca",
      image: imageUrl,
      caption: data.caption || `Dokumentasi: ${data.judul}`,
      ringkasan: data.ringkasan || (data.isi ? data.isi.slice(0, 150) + "..." : ""),
      dateline: data.dateline || "TAMBAKRIGADUNG —",
      konten: kontenArray,
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
          ? String(data.tags).split(",")
          : ["DesaTambakrigadung"],
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

  const updateData = {};
  if (data.judul) updateData.judul = data.judul;
  if (data.kategori || data.kategoriKey) {
    const kat = normalizeKategori(data.kategori || data.kategoriKey);
    updateData.kategoriKey = kat.key;
    updateData.kategoriLabel = kat.label;
  }
  if (data.penulis) updateData.penulis = data.penulis;
  if (data.ringkasan) updateData.ringkasan = data.ringkasan;
  if (data.caption !== undefined) updateData.caption = data.caption;

  if (file) {
    updateData.image = await uploadToSupabase(file, "berita");
  } else if (data.removeCover === "true" || data.removeCover === true) {
    updateData.image = DEFAULT_COVER;
  }

  if (data.status !== undefined) {
    updateData.isPublished =
      data.status === "Terbit" || data.status === "published" || data.status === true;
  }
  if (data.isi !== undefined) {
    updateData.konten = data.isi
      .split("\n\n")
      .map((par) => ({ type: "paragraph", text: par.trim() }))
      .filter((p) => p.text);
  } else if (Array.isArray(data.konten)) {
    updateData.konten = data.konten;
  }

  const updated = await prisma.berita.update({
    where: { id },
    data: updateData,
  });

  return formatBerita(updated);
};

export const deleteBerita = async (id) => {
  const existing = await prisma.berita.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Artikel berita tidak ditemukan.", 404);
  }
  return prisma.berita.delete({ where: { id } });
};