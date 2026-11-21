import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

export const createPengaduan = async (data, file) => {
  let lampiranUrl = null;

  if (file) {
    lampiranUrl = await uploadToSupabase(file, "pengaduan");
  }

  // Generate standardized random ticket code: ADU-2026-XXXX
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const tiket = `ADU-${new Date().getFullYear()}-${randomNum}`;

  const cleanWa = data.whatsapp.replace(/\D/g, "");
  const normalizedWa = cleanWa.startsWith("0") ? `62${cleanWa.slice(1)}` : cleanWa.startsWith("62") ? cleanWa : `62${cleanWa}`;

  const prioritasEnumMap = {
    biasa: "BIASA",
    penting: "PENTING",
    mendesak: "MENDESAK",
  };

  const aduan = await prisma.pengaduan.create({
    data: {
      tiket,
      nama: data.nama,
      whatsapp: normalizedWa,
      dusun: data.dusun,
      kategori: data.kategori,
      prioritas: prioritasEnumMap[data.prioritas?.toLowerCase()] || "BIASA",
      judul: data.judul,
      kronologi: data.kronologi,
      lampiran: lampiranUrl,
      status: "MENUNGGU",
    },
  });

  return {
    tiket: aduan.tiket,
    message: "Laporan aspirasi/pengaduan berhasil tercatat dalam sistem pamong desa.",
    data: aduan,
  };
};

export const trackPengaduan = async (tiket) => {
  const aduan = await prisma.pengaduan.findUnique({
    where: { tiket },
    select: {
      tiket: true,
      judul: true,
      kategori: true,
      dusun: true,
      prioritas: true,
      status: true,
      tanggapan: true,
      ditanganiOleh: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!aduan) {
    throw new AppError("Nomor tiket pengaduan tidak ditemukan dalam sistem.", 404);
  }

  return aduan;
};

export const updateStatusPengaduan = async (id, { status, tanggapan, ditanganiOleh }) => {
  return prisma.pengaduan.update({
    where: { id },
    data: {
      status,
      tanggapan,
      ditanganiOleh,
    },
  });
};
