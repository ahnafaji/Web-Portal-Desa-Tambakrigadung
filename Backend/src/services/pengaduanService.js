import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

const mapStatusToDb = (status) => {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (s === "menunggu") return "MENUNGGU";
  if (s === "diproses") return "DIPROSES";
  if (s === "selesai") return "SELESAI";
  if (s === "ditolak") return "DITOLAK";
  return status.toUpperCase();
};

const mapStatusToFrontend = (status) => {
  if (status === "MENUNGGU") return "Menunggu";
  if (status === "DIPROSES") return "Diproses";
  if (status === "SELESAI") return "Selesai";
  if (status === "DITOLAK") return "Ditolak";
  return status;
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
};

const formatPengaduan = (p) => {
  return {
    id: p.tiket,
    realId: p.id,
    tiket: p.tiket,
    pelapor: p.nama,
    inisial: getInitials(p.nama),
    telepon: p.whatsapp,
    whatsapp: p.whatsapp,
    dusun: p.dusun,
    kategori: p.kategori,
    subjek: p.judul,
    ringkasan: p.kronologi,
    tanggal: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(p.createdAt)),
    urgensi: p.prioritas === "MENDESAK" ? "Mendesak" : p.prioritas === "PENTING" ? "Cukup Mendesak" : "Normal",
    status: mapStatusToFrontend(p.status),
    foto: p.lampiran,
    lampiran: p.lampiran,
    tanggapan: p.tanggapan,
    ditanganiOleh: p.ditanganiOleh,
  };
};

export const getPengaduanList = async (query = {}) => {
  const { status, search } = query;
  const where = {};

  if (status && status !== "Semua") {
    where.status = mapStatusToDb(status);
  }

  if (search) {
    where.OR = [
      { judul: { contains: search, mode: "insensitive" } },
      { nama: { contains: search, mode: "insensitive" } },
      { tiket: { contains: search, mode: "insensitive" } },
      { dusun: { contains: search, mode: "insensitive" } },
    ];
  }

  const items = await prisma.pengaduan.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return items.map(formatPengaduan);
};

export const createPengaduan = async (data, file) => {
  let lampiranUrl = null;

  if (file) {
    lampiranUrl = await uploadToSupabase(file, "pengaduan");
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const tiket = `ADU-${new Date().getFullYear()}-${randomNum}`;

  const cleanWa = (data.whatsapp || "").replace(/\D/g, "");
  const normalizedWa = cleanWa.startsWith("0") ? `62${cleanWa.slice(1)}` : cleanWa.startsWith("62") ? cleanWa : `62${cleanWa}`;

  const prioritasEnumMap = {
    biasa: "BIASA",
    normal: "BIASA",
    penting: "PENTING",
    mendesak: "MENDESAK",
  };

  const aduan = await prisma.pengaduan.create({
    data: {
      tiket,
      nama: data.nama || data.pelapor,
      whatsapp: normalizedWa,
      dusun: data.dusun,
      kategori: data.kategori,
      prioritas: prioritasEnumMap[data.prioritas?.toLowerCase()] || prioritasEnumMap[data.urgensi?.toLowerCase()] || "BIASA",
      judul: data.judul || data.subjek,
      kronologi: data.kronologi || data.ringkasan,
      lampiran: lampiranUrl,
      status: "MENUNGGU",
    },
  });

  return {
    tiket: aduan.tiket,
    message: "Laporan aspirasi/pengaduan berhasil tercatat dalam sistem pamong desa.",
    data: formatPengaduan(aduan),
  };
};

export const trackPengaduan = async (tiket) => {
  const aduan = await prisma.pengaduan.findUnique({
    where: { tiket },
  });

  if (!aduan) {
    throw new AppError("Nomor tiket pengaduan tidak ditemukan dalam sistem.", 404);
  }

  return formatPengaduan(aduan);
};

export const updateStatusPengaduan = async (identifier, { status, tanggapan, ditanganiOleh }) => {
  const statusDb = mapStatusToDb(status);

  // find by tiket or uuid
  const existing = await prisma.pengaduan.findFirst({
    where: {
      OR: [{ id: identifier }, { tiket: identifier }],
    },
  });

  if (!existing) {
    throw new AppError("Data pengaduan tidak ditemukan.", 404);
  }

  const updated = await prisma.pengaduan.update({
    where: { id: existing.id },
    data: {
      status: statusDb || existing.status,
      tanggapan: tanggapan !== undefined ? tanggapan : existing.tanggapan,
      ditanganiOleh: ditanganiOleh !== undefined ? ditanganiOleh : existing.ditanganiOleh,
    },
  });

  return formatPengaduan(updated);
};

export const deletePengaduan = async (identifier) => {
  const existing = await prisma.pengaduan.findFirst({
    where: {
      OR: [{ id: identifier }, { tiket: identifier }],
    },
  });

  if (!existing) {
    throw new AppError("Pengaduan tidak ditemukan.", 404);
  }

  return prisma.pengaduan.delete({ where: { id: existing.id } });
};
