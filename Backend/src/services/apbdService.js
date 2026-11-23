import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { uploadToSupabase } from "./storageService.js";

/**
 * Convert BigInt safe integer for JSON serialization
 */
const toNum = (val) => (val !== undefined && val !== null ? Number(val) : 0);

export const recalculateApbdTotals = async (apbdTahunId) => {
  if (!apbdTahunId) return;
  const [pendapatanItems, belanjaItems, realisasiItems] = await Promise.all([
    prisma.apbdPendapatan.findMany({ where: { apbdTahunId } }),
    prisma.apbdBelanja.findMany({ where: { apbdTahunId } }),
    prisma.apbdRealisasi.findMany({ where: { apbdTahunId } }),
  ]);

  const totalPendapatan = pendapatanItems.reduce((acc, cur) => acc + cur.nominal, 0n);
  const sumRealisasi = realisasiItems.reduce((acc, cur) => acc + cur.pagu, 0n);
  const sumBelanja = belanjaItems.reduce((acc, cur) => acc + cur.nominal, 0n);
  const totalBelanja = sumRealisasi > 0n ? sumRealisasi : sumBelanja;
  const silpa = totalPendapatan - totalBelanja;

  await prisma.apbdTahun.update({
    where: { id: apbdTahunId },
    data: {
      pendapatan: totalPendapatan,
      belanja: totalBelanja,
      silpa,
    },
  });
};

export const getApbdSummary = async (tahunQuery) => {
  const currentYear = tahunQuery ? parseInt(tahunQuery, 10) : 2026;
  const apbd = await prisma.apbdTahun.findUnique({
    where: { tahun: currentYear },
  });

  if (!apbd) {
    return { tahun: currentYear, pendapatan: 0, pengeluaran: 0 };
  }

  return {
    tahun: apbd.tahun,
    pendapatan: toNum(apbd.pendapatan),
    pengeluaran: toNum(apbd.belanja),
  };
};

/**
 * Returns formatted array of items matching Frontend ApbdAdminPage expectations:
 * [ { id, tahun, jenis, kode, uraian, keterangan, anggaran, realisasi } ]
 */
export const getAdminApbdList = async (tahunQuery) => {
  const currentYear = tahunQuery ? parseInt(tahunQuery, 10) : 2026;

  let apbd = await prisma.apbdTahun.findUnique({
    where: { tahun: currentYear },
    include: {
      itemsPendapatan: true,
      itemsBelanja: true,
      realisasiTabel: true,
    },
  });

  if (!apbd) {
    return [];
  }

  const result = [];

  // 1. Items Pendapatan
  apbd.itemsPendapatan.forEach((p, idx) => {
    result.push({
      id: p.id,
      tahun: String(apbd.tahun),
      jenis: "Pendapatan",
      kode: `0${idx + 1}`,
      uraian: p.sumber,
      keterangan: "Penerimaan Pendapatan Desa",
      anggaran: toNum(p.nominal),
      realisasi: toNum(p.nominal),
    });
  });

  // 2. Items Belanja: Prioritize realisasiTabel if exists to avoid doubling numbers
  if (apbd.realisasiTabel.length > 0) {
    apbd.realisasiTabel.forEach((r) => {
      result.push({
        id: r.id,
        tahun: String(apbd.tahun),
        jenis: "Belanja",
        kode: r.kode,
        uraian: r.kegiatan,
        keterangan: r.detail,
        anggaran: toNum(r.pagu),
        realisasi: toNum(r.realisasi),
      });
    });
  } else {
    apbd.itemsBelanja.forEach((b, idx) => {
      result.push({
        id: b.id,
        tahun: String(apbd.tahun),
        jenis: "Belanja",
        kode: b.bidang.split(".")[0]?.trim() || `0${idx + 1}`,
        uraian: b.bidang,
        keterangan: "Alokasi anggaran belanja bidang desa",
        anggaran: toNum(b.nominal),
        realisasi: toNum(b.nominal),
      });
    });
  }

  return result;
};

export const getApbdPage = async (tahunQuery) => {
  const currentYear = tahunQuery ? parseInt(tahunQuery, 10) : 2026;
  const apbd = await prisma.apbdTahun.findUnique({
    where: { tahun: currentYear },
    include: {
      itemsPendapatan: true,
      itemsBelanja: true,
      realisasiTabel: true,
    },
  });

  if (!apbd) {
    throw new AppError(`Data APBD tahun ${currentYear} belum tersedia.`, 404);
  }

  return {
    header: {
      judul: `Transparansi APBD Desa Tambakrigadung ${apbd.tahun}`,
      deskripsi:
        "Rincian Anggaran Pendapatan dan Belanja Desa (APBDes) sebagai wujud keterbukaan informasi publik dan akuntabilitas tata kelola pemerintahan desa.",
    },
    summary: [
      {
        key: "pendapatan",
        ikon: "arrowDown",
        label: "Total Pendapatan Desa",
        nominal: toNum(apbd.pendapatan),
        keterangan: "Target terealisasi 100% dari penetapan APBDes murni",
      },
      {
        key: "belanja",
        ikon: "arrowUp",
        label: "Total Belanja Desa",
        nominal: toNum(apbd.belanja),
        keterangan: "Terserap untuk pembangunan fisik & pemberdayaan warga",
      },
      {
        key: "silpa",
        ikon: "wallet",
        label: "Surplus / Sisa Lebih (SiLPA)",
        nominal: toNum(apbd.silpa),
        keterangan: "Dialokasikan sebagai dana cadangan darurat & SiLPA berjalan",
      },
    ],
    pendapatan: {
      judul: "Rincian Pendapatan Desa",
      badge: `Total Rp ${(Number(apbd.pendapatan) / 1_000_000).toFixed(0)} Juta`,
      items: apbd.itemsPendapatan.map((p) => ({ sumber: p.sumber, nominal: toNum(p.nominal) })),
      catatan: "Komposisi pendapatan terbesar bersumber dari alokasi langsung APBN dan APBD Kabupaten.",
    },
    belanja: {
      judul: "Rincian Belanja per Bidang",
      badge: `Total Rp ${(Number(apbd.belanja) / 1_000_000).toFixed(0)} Juta`,
      items: apbd.itemsBelanja.map((b) => ({ bidang: b.bidang, nominal: toNum(b.nominal) })),
      catatan: "Fokus belanja dialokasikan pada infrastruktur konektivitas pertanian & saluran drainase warga.",
    },
    tabel: {
      judul: `Tabel Rincian Anggaran & Realisasi Kegiatan ${apbd.tahun}`,
      subjudul: "Monitoring realisasi belanja per bidang dan sub-kegiatan fisik/non-fisik",
      rows: apbd.realisasiTabel.map((r) => ({
        kode: r.kode,
        kegiatan: r.kegiatan,
        detail: r.detail,
        pagu: toNum(r.pagu),
        realisasi: toNum(r.realisasi),
      })),
      keterangan: `Keterangan: Data diperbarui secara berkala untuk Tahun Anggaran ${apbd.tahun} oleh BPD & Seksi Perencanaan Pembangunan Desa.`,
    },
  };
};

/**
 * Create new APBD Item from Admin Panel
 */
export const createApbdItem = async (data) => {
  const tahunNum = parseInt(data.tahun || 2026, 10);
  const anggaranBig = BigInt(parseInt(String(data.anggaran || 0).replace(/\D/g, ""), 10) || 0);
  const realisasiBig = BigInt(parseInt(String(data.realisasi || 0).replace(/\D/g, ""), 10) || 0);

  let apbdYear = await prisma.apbdTahun.findUnique({ where: { tahun: tahunNum } });
  if (!apbdYear) {
    apbdYear = await prisma.apbdTahun.create({
      data: {
        tahun: tahunNum,
        pendapatan: BigInt(969000000),
        belanja: BigInt(955050000),
        silpa: BigInt(13950000),
      },
    });
  }

  if (data.jenis === "Pendapatan") {
    const item = await prisma.apbdPendapatan.create({
      data: {
        apbdTahunId: apbdYear.id,
        sumber: data.uraian || "Penerimaan Pendapatan Desa",
        nominal: realisasiBig > 0n ? realisasiBig : anggaranBig,
      },
    });

    await recalculateApbdTotals(apbdYear.id);

    return {
      id: item.id,
      tahun: String(tahunNum),
      jenis: "Pendapatan",
      kode: data.kode || "01",
      uraian: item.sumber,
      keterangan: data.keterangan || "Penerimaan kas pendapatan desa",
      anggaran: toNum(item.nominal),
      realisasi: toNum(item.nominal),
    };
  }

  // Otherwise, default to Belanja (create in apbdRealisasi)
  const item = await prisma.apbdRealisasi.create({
    data: {
      apbdTahunId: apbdYear.id,
      kode: data.kode || "01",
      kegiatan: data.uraian || "Kegiatan Belanja APBD",
      detail: data.keterangan || "Rincian pos kegiatan anggaran desa",
      pagu: anggaranBig,
      realisasi: realisasiBig,
    },
  });

  await recalculateApbdTotals(apbdYear.id);

  return {
    id: item.id,
    tahun: String(tahunNum),
    jenis: "Belanja",
    kode: item.kode,
    uraian: item.kegiatan,
    keterangan: item.detail,
    anggaran: toNum(item.pagu),
    realisasi: toNum(item.realisasi),
  };
};

export const updateApbdItem = async (id, data) => {
  // 1. Check in apbdRealisasi
  const item = await prisma.apbdRealisasi.findUnique({ where: { id } });
  if (item) {
    const updated = await prisma.apbdRealisasi.update({
      where: { id },
      data: {
        kode: data.kode !== undefined ? data.kode : item.kode,
        kegiatan: data.uraian !== undefined ? data.uraian : item.kegiatan,
        detail: data.keterangan !== undefined ? data.keterangan : item.detail,
        pagu: data.anggaran !== undefined ? BigInt(parseInt(String(data.anggaran).replace(/\D/g, ""), 10)) : item.pagu,
        realisasi: data.realisasi !== undefined ? BigInt(parseInt(String(data.realisasi).replace(/\D/g, ""), 10)) : item.realisasi,
      },
    });

    await recalculateApbdTotals(item.apbdTahunId);

    return {
      id: updated.id,
      jenis: "Belanja",
      kode: updated.kode,
      uraian: updated.kegiatan,
      keterangan: updated.detail,
      anggaran: toNum(updated.pagu),
      realisasi: toNum(updated.realisasi),
    };
  }

  // 2. Check in apbdPendapatan
  const pendapatan = await prisma.apbdPendapatan.findUnique({ where: { id } });
  if (pendapatan) {
    const nominalVal = data.realisasi !== undefined ? data.realisasi : data.anggaran;
    const updated = await prisma.apbdPendapatan.update({
      where: { id },
      data: {
        sumber: data.uraian || pendapatan.sumber,
        nominal: nominalVal !== undefined ? BigInt(parseInt(String(nominalVal).replace(/\D/g, ""), 10)) : pendapatan.nominal,
      },
    });

    await recalculateApbdTotals(pendapatan.apbdTahunId);

    return {
      id: updated.id,
      jenis: "Pendapatan",
      kode: data.kode || "01",
      uraian: updated.sumber,
      keterangan: data.keterangan || "Penerimaan kas pendapatan desa",
      anggaran: toNum(updated.nominal),
      realisasi: toNum(updated.nominal),
    };
  }

  // 3. Check in itemsBelanja
  const belanja = await prisma.apbdBelanja.findUnique({ where: { id } });
  if (belanja) {
    const updated = await prisma.apbdBelanja.update({
      where: { id },
      data: {
        bidang: data.uraian || belanja.bidang,
        nominal: data.anggaran !== undefined ? BigInt(parseInt(String(data.anggaran).replace(/\D/g, ""), 10)) : belanja.nominal,
      },
    });

    await recalculateApbdTotals(belanja.apbdTahunId);

    return {
      id: updated.id,
      jenis: "Belanja",
      kode: data.kode || "01",
      uraian: updated.bidang,
      keterangan: data.keterangan || "",
      anggaran: toNum(updated.nominal),
      realisasi: toNum(updated.nominal),
    };
  }

  throw new AppError("Item pos anggaran tidak ditemukan.", 404);
};

export const deleteApbdItem = async (id) => {
  // Check apbdRealisasi
  const item = await prisma.apbdRealisasi.findUnique({ where: { id } });
  if (item) {
    await prisma.apbdRealisasi.delete({ where: { id } });
    await recalculateApbdTotals(item.apbdTahunId);
    return { success: true };
  }

  // Check apbdPendapatan
  const pend = await prisma.apbdPendapatan.findUnique({ where: { id } });
  if (pend) {
    await prisma.apbdPendapatan.delete({ where: { id } });
    await recalculateApbdTotals(pend.apbdTahunId);
    return { success: true };
  }

  // Check apbdBelanja
  const bel = await prisma.apbdBelanja.findUnique({ where: { id } });
  if (bel) {
    await prisma.apbdBelanja.delete({ where: { id } });
    await recalculateApbdTotals(bel.apbdTahunId);
    return { success: true };
  }

  throw new AppError("Item pos anggaran tidak ditemukan.", 404);
};

export const uploadApbdDokumen = async (tahun, file) => {
  if (!file) {
    throw new AppError("Berkas dokumen salinan PDF perdes wajib diunggah.", 400);
  }

  const pdfUrl = await uploadToSupabase(file, "apbd-dokumen");
  return {
    tahun,
    dokumenUrl: pdfUrl,
    message: "Salinan dokumen resmi APBDes berhasil diunggah ke penyimpanan cloud.",
  };
};
