import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email atau username akun operator desa wajib diisi." })
      .trim()
      .min(1, "Email atau username akun operator desa wajib diisi."),
    password: z
      .string({ required_error: "Kata sandi operator desa wajib diisi." })
      .min(1, "Kata sandi operator desa wajib diisi."),
  }),
});

export const pengaduanSchema = z.object({
  body: z.object({
    nama: z
      .string({ required_error: "Nama lengkap pelapor wajib diisi." })
      .trim()
      .min(2, "Nama lengkap pelapor minimal terdiri dari 2 karakter."),
    whatsapp: z
      .string({ required_error: "Nomor WhatsApp aktif wajib diisi." })
      .trim()
      .regex(/^[0-9+ -]{8,16}$/, "Nomor WhatsApp tidak valid (masukkan format angka, contoh: 08123456789).")
      .min(8, "Nomor WhatsApp minimal terdiri dari 8 digit."),
    dusun: z
      .string({ required_error: "Asal dusun wajib dipilih." })
      .trim()
      .min(1, "Asal dusun wajib dipilih."),
    kategori: z
      .string({ required_error: "Kategori pengaduan atau aspirasi wajib dipilih." })
      .trim()
      .min(1, "Kategori pengaduan atau aspirasi wajib dipilih."),
    prioritas: z
      .enum(["biasa", "penting", "mendesak"], {
        errorMap: () => ({ message: "Tingkat prioritas harus salah satu dari: Biasa, Penting, atau Sangat Mendesak." }),
      })
      .default("biasa"),
    judul: z
      .string({ required_error: "Judul pengaduan atau aspirasi wajib diisi." })
      .trim()
      .min(5, "Judul pengaduan atau aspirasi minimal terdiri dari 5 karakter."),
    kronologi: z
      .string({ required_error: "Uraian kronologi kejadian atau aspirasi wajib diisi." })
      .trim()
      .min(20, "Uraian kronologi pengaduan minimal terdiri dari 20 karakter agar jelas ditindaklanjuti."),
  }),
});

export const umkmPublicDaftarSchema = z.object({
  body: z.object({
    namaUsaha: z
      .string({ required_error: "Nama usaha warga wajib diisi." })
      .trim()
      .min(3, "Nama usaha warga minimal terdiri dari 3 karakter."),
    kategori: z.enum(["pangan", "olahan", "kerajinan", "jasa"], {
      errorMap: () => ({
        message: "Kategori usaha wajib dipilih (Pangan & Kudapan, Olahan Tambak & Madu, Batik & Kerajinan, atau Fabrikasi & Jasa).",
      }),
    }),
    namaPemilik: z
      .string({ required_error: "Nama pemilik usaha wajib diisi." })
      .trim()
      .min(3, "Nama lengkap pemilik usaha minimal terdiri dari 3 karakter."),
    whatsapp: z
      .string({ required_error: "Nomor WhatsApp aktif pemilik usaha wajib diisi." })
      .trim()
      .regex(/^[0-9+ -]{8,16}$/, "Nomor WhatsApp tidak valid (masukkan nomor aktif, contoh: 08123456789).")
      .min(8, "Nomor WhatsApp minimal terdiri dari 8 digit."),
    jamOperasional: z.string().trim().optional(),
    hargaMin: z.string().trim().optional(),
    hargaMax: z.string().trim().optional(),
    alamat: z
      .string({ required_error: "Alamat lengkap atau lokasi dusun usaha wajib diisi." })
      .trim()
      .min(5, "Alamat lengkap usaha minimal terdiri dari 5 karakter."),
    mapsUrl: z
      .string()
      .trim()
      .url("Tautan Google Maps lokasi usaha tidak valid. Harap periksa kembali URL yang dimasukkan.")
      .optional()
      .or(z.literal("")),
    deskripsi: z
      .string({ required_error: "Deskripsi usaha dan produk unggulan wajib diisi." })
      .trim()
      .min(50, "Deskripsi produk dan usaha minimal terdiri dari 50 karakter agar informatif bagi calon pembeli."),
  }),
});

export const beritaCreateSchema = z.object({
  body: z.object({
    slug: z
      .string({ required_error: "Slug artikel berita wajib diisi." })
      .trim()
      .min(3, "Slug artikel berita minimal 3 karakter."),
    judul: z
      .string({ required_error: "Judul artikel berita wajib diisi." })
      .trim()
      .min(5, "Judul artikel berita minimal 5 karakter."),
    kategoriKey: z
      .string({ required_error: "Kategori artikel wajib diisi." })
      .trim()
      .min(1, "Kategori artikel berita wajib dipilih."),
    kategoriLabel: z
      .string({ required_error: "Label kategori artikel wajib diisi." })
      .trim()
      .min(1, "Label kategori artikel wajib diisi."),
    subLabel: z.string().trim().optional(),
    featured: z.boolean().default(false),
    penulis: z
      .string({ required_error: "Nama penulis/humas wajib diisi." })
      .trim()
      .min(2, "Nama penulis atau humas minimal 2 karakter."),
    waktuBaca: z.string().trim().default("4 Menit Baca"),
    image: z
      .string({ required_error: "Tautan gambar cover berita wajib diisi." })
      .trim()
      .url("Tautan gambar cover berita tidak valid."),
    caption: z.string().trim().optional(),
    ringkasan: z
      .string({ required_error: "Ringkasan berita wajib diisi." })
      .trim()
      .min(10, "Ringkasan berita minimal terdiri dari 10 karakter."),
    dateline: z.string().trim().optional(),
    konten: z.array(z.any(), { required_error: "Konten artikel berita wajib diisi." }),
    tags: z.array(z.string()).default([]),
  }),
});
