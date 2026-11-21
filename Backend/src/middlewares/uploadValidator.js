import multer from "multer";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

// Supported MIME types
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const PDF_MIME = "application/pdf";

export const uploadImagesOnly = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file max
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    if (IMAGE_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Format berkas harus berupa JPG, PNG, atau WEBP.", 400), false);
    }
  },
});

export const uploadPengaduanAttachment = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if ([...IMAGE_MIMES, PDF_MIME].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Lampiran bukti pengaduan harus berupa berkas JPG, PNG, WEBP, atau PDF.", 400), false);
    }
  },
});

/**
 * Validates magic bytes / buffer header to prevent renamed malicious payloads
 */
export const checkMagicBytes = (buffer, mimetype) => {
  if (!buffer || buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // PNG: 89 50 4E 47
  if (mimetype === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  // WEBP: RIFF ... WEBP (52 49 46 46)
  if (mimetype === "image/webp") {
    return buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  }
  // PDF: %PDF (25 50 44 46)
  if (mimetype === "application/pdf") {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  return false;
};
