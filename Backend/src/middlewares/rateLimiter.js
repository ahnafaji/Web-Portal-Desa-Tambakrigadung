import rateLimit from "express-rate-limit";

// Global limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan dari alamat IP ini. Silakan coba lagi beberapa saat.",
  },
});

// Strict limiter for admin login: max 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan masuk yang gagal. Silakan tunggu 15 menit.",
  },
});

// Strict limiter for public submissions (UMKM & Pengaduan): max 5 submissions per hour
export const publicUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Batas pengiriman laporan/pendaftaran tercapai. Silakan coba lagi dalam 1 jam.",
  },
});
