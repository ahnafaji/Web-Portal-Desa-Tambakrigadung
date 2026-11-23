import { prisma } from "../config/prisma.js";

/**
 * Returns summary statistics for Admin Dashboard
 */
export const getDashboardSummary = async () => {
  const [
    totalUmkm,
    menungguUmkm,
    aktifUmkm,
    ditolakUmkm,
    totalPengaduan,
    menungguPengaduan,
    diprosesPengaduan,
    selesaiPengaduan,
    totalBerita,
    totalGaleri,
    recentAudits,
  ] = await Promise.all([
    prisma.umkm.count(),
    prisma.umkm.count({ where: { status: "PENDING" } }),
    prisma.umkm.count({ where: { status: "APPROVED" } }),
    prisma.umkm.count({ where: { status: "REJECTED" } }),

    prisma.pengaduan.count(),
    prisma.pengaduan.count({ where: { status: "MENUNGGU" } }),
    prisma.pengaduan.count({ where: { status: "DIPROSES" } }),
    prisma.pengaduan.count({ where: { status: "SELESAI" } }),

    prisma.berita.count(),
    prisma.galeri.count(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { timestamp: "desc" },
      include: {
        admin: {
          select: { nama: true, username: true, role: true },
        },
      },
    }),
  ]);

  return {
    umkm: {
      total: totalUmkm,
      menunggu: menungguUmkm,
      aktif: aktifUmkm,
      ditolak: ditolakUmkm,
    },
    pengaduan: {
      total: totalPengaduan,
      menunggu: menungguPengaduan,
      diproses: diprosesPengaduan,
      selesai: selesaiPengaduan,
    },
    berita: {
      total: totalBerita,
    },
    galeri: {
      total: totalGaleri,
    },
    recentAudits,
  };
};

/**
 * List audit logs for Super Admin
 */
export const getAuditLogs = async ({ limit = 50, page = 1 }) => {
  const take = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * take;

  const [total, items] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.findMany({
      skip,
      take,
      orderBy: { timestamp: "desc" },
      include: {
        admin: { select: { nama: true, username: true, role: true } },
      },
    }),
  ]);

  return {
    total,
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / take),
    items,
  };
};
