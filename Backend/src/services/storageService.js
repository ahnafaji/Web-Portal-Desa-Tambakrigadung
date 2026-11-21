import { v4 as uuidv4 } from "uuid";
import path from "path";
import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { checkMagicBytes } from "../middlewares/uploadValidator.js";

/**
 * Uploads a validated memory file buffer to Supabase Storage and returns its public URL
 */
export const uploadToSupabase = async (file, folder = "uploads") => {
  if (!file || !file.buffer) {
    throw new AppError("Berkas tidak valid atau tidak ditemukan.", 400);
  }

  // Validate magic bytes to stop malicious extensions/forged MIME
  const isMagicValid = checkMagicBytes(file.buffer, file.mimetype);
  if (!isMagicValid) {
    throw new AppError(`Integritas berkas "${file.originalname}" tidak lolos verifikasi magic bytes.`, 400);
  }

  const ext = path.extname(file.originalname).toLowerCase() || (file.mimetype === "application/pdf" ? ".pdf" : ".jpg");
  const fileName = `${folder}/${uuidv4()}${ext}`;

  const { data, error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Supabase Storage Upload Error:", error);
    throw new AppError(`Gagal mengunggah berkas ke penyimpanan awan: ${error.message}`, 500);
  }

  const { data: publicData } = supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicData.publicUrl;
};
