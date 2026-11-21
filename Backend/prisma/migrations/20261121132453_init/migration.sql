-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'OPERATOR_DESA');

-- CreateEnum
CREATE TYPE "UmkmStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AduanPrioritas" AS ENUM ('BIASA', 'PENTING', 'MENDESAK');

-- CreateEnum
CREATE TYPE "AduanStatus" AS ENUM ('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR_DESA',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berita" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "kategoriKey" TEXT NOT NULL,
    "kategoriLabel" TEXT NOT NULL,
    "subLabel" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penulis" TEXT NOT NULL,
    "waktuBaca" TEXT NOT NULL DEFAULT '4 Menit Baca',
    "pembaca" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "ringkasan" TEXT NOT NULL,
    "dateline" TEXT,
    "konten" JSONB NOT NULL,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "potensi_desa" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kategoriKey" TEXT NOT NULL,
    "kategoriLabel" TEXT NOT NULL,
    "ikon" TEXT,
    "lokasi" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "deskripsi" TEXT[],
    "info" JSONB NOT NULL,
    "aksi" JSONB,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "potensi_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umkm" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "kategoriLabel" TEXT NOT NULL,
    "badgeUtama" TEXT,
    "ratingLabel" TEXT,
    "statusBuka" TEXT,
    "jamOperasional" TEXT,
    "dusun" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "patokanLokasi" TEXT,
    "pemilik" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "pembayaran" TEXT,
    "hargaLabel" TEXT,
    "hargaSatuan" TEXT,
    "hargaBadge" TEXT,
    "hargaMulai" TEXT,
    "hargaMin" DECIMAL(12,2),
    "hargaMax" DECIMAL(12,2),
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "galeri" TEXT[],
    "ringkasan" TEXT NOT NULL,
    "tags" TEXT[],
    "deskripsiLengkap" TEXT[],
    "catatanMenu" TEXT,
    "mapEmbedUrl" TEXT,
    "mapsHref" TEXT,
    "petunjukArah" JSONB,
    "status" "UmkmStatus" NOT NULL DEFAULT 'APPROVED',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "umkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umkm_menus" (
    "id" TEXT NOT NULL,
    "umkmId" TEXT NOT NULL,
    "badge" TEXT,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "umkm_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "judulLengkap" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "kategoriLabel" TEXT NOT NULL,
    "arsipBadge" TEXT NOT NULL DEFAULT 'Arsip Resmi Desa',
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lokasi" TEXT NOT NULL,
    "dokumentator" TEXT NOT NULL,
    "beritaSlug" TEXT,
    "image" TEXT NOT NULL,
    "highlights" JSONB,
    "ringkasan" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri_fotos" (
    "id" TEXT NOT NULL,
    "galeriId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "caption" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "galeri_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaduan" (
    "id" TEXT NOT NULL,
    "tiket" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "dusun" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "prioritas" "AduanPrioritas" NOT NULL DEFAULT 'BIASA',
    "judul" TEXT NOT NULL,
    "kronologi" TEXT NOT NULL,
    "lampiran" TEXT,
    "status" "AduanStatus" NOT NULL DEFAULT 'MENUNGGU',
    "tanggapan" TEXT,
    "ditanganiOleh" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apbd_tahun" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "pendapatan" BIGINT NOT NULL,
    "belanja" BIGINT NOT NULL,
    "silpa" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apbd_tahun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apbd_pendapatan" (
    "id" TEXT NOT NULL,
    "apbdTahunId" TEXT NOT NULL,
    "sumber" TEXT NOT NULL,
    "nominal" BIGINT NOT NULL,

    CONSTRAINT "apbd_pendapatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apbd_belanja" (
    "id" TEXT NOT NULL,
    "apbdTahunId" TEXT NOT NULL,
    "bidang" TEXT NOT NULL,
    "nominal" BIGINT NOT NULL,

    CONSTRAINT "apbd_belanja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apbd_realisasi" (
    "id" TEXT NOT NULL,
    "apbdTahunId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "pagu" BIGINT NOT NULL,
    "realisasi" BIGINT NOT NULL,

    CONSTRAINT "apbd_realisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profil_desa" (
    "id" TEXT NOT NULL,
    "sejarah" TEXT NOT NULL,
    "visi" TEXT NOT NULL,
    "misi" TEXT[],
    "runningText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profil_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kepala_desa_riwayat" (
    "id" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "periode" TEXT NOT NULL,

    CONSTRAINT "kepala_desa_riwayat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pamong_kontak" (
    "id" TEXT NOT NULL,
    "inisial" TEXT NOT NULL,
    "warna" TEXT NOT NULL DEFAULT 'green',
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "bidang" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "wa" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pamong_kontak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_sliders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "hero_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistik_desa" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2b2825',
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "statistik_desa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE INDEX "audit_logs_adminId_idx" ON "audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "berita_slug_key" ON "berita"("slug");

-- CreateIndex
CREATE INDEX "berita_kategoriKey_idx" ON "berita"("kategoriKey");

-- CreateIndex
CREATE INDEX "berita_isPublished_tanggal_idx" ON "berita"("isPublished", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "potensi_desa_slug_key" ON "potensi_desa"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "umkm_slug_key" ON "umkm"("slug");

-- CreateIndex
CREATE INDEX "umkm_kategori_idx" ON "umkm"("kategori");

-- CreateIndex
CREATE INDEX "umkm_status_idx" ON "umkm"("status");

-- CreateIndex
CREATE INDEX "umkm_menus_umkmId_idx" ON "umkm_menus"("umkmId");

-- CreateIndex
CREATE UNIQUE INDEX "galeri_slug_key" ON "galeri"("slug");

-- CreateIndex
CREATE INDEX "galeri_kategori_idx" ON "galeri"("kategori");

-- CreateIndex
CREATE INDEX "galeri_fotos_galeriId_idx" ON "galeri_fotos"("galeriId");

-- CreateIndex
CREATE UNIQUE INDEX "pengaduan_tiket_key" ON "pengaduan"("tiket");

-- CreateIndex
CREATE INDEX "pengaduan_tiket_idx" ON "pengaduan"("tiket");

-- CreateIndex
CREATE INDEX "pengaduan_status_idx" ON "pengaduan"("status");

-- CreateIndex
CREATE UNIQUE INDEX "apbd_tahun_tahun_key" ON "apbd_tahun"("tahun");

-- CreateIndex
CREATE UNIQUE INDEX "statistik_desa_key_key" ON "statistik_desa"("key");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umkm_menus" ADD CONSTRAINT "umkm_menus_umkmId_fkey" FOREIGN KEY ("umkmId") REFERENCES "umkm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galeri" ADD CONSTRAINT "galeri_beritaSlug_fkey" FOREIGN KEY ("beritaSlug") REFERENCES "berita"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galeri_fotos" ADD CONSTRAINT "galeri_fotos_galeriId_fkey" FOREIGN KEY ("galeriId") REFERENCES "galeri"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apbd_pendapatan" ADD CONSTRAINT "apbd_pendapatan_apbdTahunId_fkey" FOREIGN KEY ("apbdTahunId") REFERENCES "apbd_tahun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apbd_belanja" ADD CONSTRAINT "apbd_belanja_apbdTahunId_fkey" FOREIGN KEY ("apbdTahunId") REFERENCES "apbd_tahun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apbd_realisasi" ADD CONSTRAINT "apbd_realisasi_apbdTahunId_fkey" FOREIGN KEY ("apbdTahunId") REFERENCES "apbd_tahun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
