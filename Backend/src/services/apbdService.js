import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

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
    pendapatan: apbd.pendapatan,
    pengeluaran: apbd.belanja,
  };
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
        nominal: apbd.pendapatan,
        keterangan: "Target terealisasi 100% dari penetapan APBDes murni",
      },
      {
        key: "belanja",
        ikon: "arrowUp",
        label: "Total Belanja Desa",
        nominal: apbd.belanja,
        keterangan: "Terserap untuk pembangunan fisik & pemberdayaan warga",
      },
      {
        key: "silpa",
        ikon: "wallet",
        label: "Surplus / Sisa Lebih (SiLPA)",
        nominal: apbd.silpa,
        keterangan: "Dialokasikan sebagai dana cadangan darurat & SiLPA berjalan",
      },
    ],
    pendapatan: {
      judul: "Rincian Pendapatan Desa",
      badge: `Total Rp ${(Number(apbd.pendapatan) / 1_000_000).toFixed(0)} Juta`,
      items: apbd.itemsPendapatan.map((p) => ({ sumber: p.sumber, nominal: p.nominal })),
      catatan: "Komposisi pendapatan terbesar bersumber dari alokasi langsung APBN dan APBD Kabupaten.",
    },
    belanja: {
      judul: "Rincian Belanja per Bidang",
      badge: `Total Rp ${(Number(apbd.belanja) / 1_000_000).toFixed(0)} Juta`,
      items: apbd.itemsBelanja.map((b) => ({ bidang: b.bidang, nominal: b.nominal })),
      catatan: "Fokus belanja dialokasikan pada infrastruktur konektivitas pertanian & saluran drainase warga.",
    },
    tabel: {
      judul: `Tabel Rincian Anggaran & Realisasi Kegiatan ${apbd.tahun}`,
      subjudul: "Monitoring realisasi belanja per bidang dan sub-kegiatan fisik/non-fisik",
      rows: apbd.realisasiTabel.map((r) => ({
        kode: r.kode,
        kegiatan: r.kegiatan,
        detail: r.detail,
        pagu: r.pagu,
        realisasi: r.realisasi,
      })),
      keterangan: `Keterangan: Data diperbarui secara berkala untuk Tahun Anggaran ${apbd.tahun} oleh BPD & Seksi Perencanaan Pembangunan Desa.`,
    },
  };
};
