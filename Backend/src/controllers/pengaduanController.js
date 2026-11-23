import * as pengaduanService from "../services/pengaduanService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getPengaduanList = async (req, res, next) => {
  try {
    const data = await pengaduanService.getPengaduanList(req.query);
    return sendResponse(res, 200, "Daftar laporan pengaduan berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const submitPengaduan = async (req, res, next) => {
  try {
    const result = await pengaduanService.createPengaduan(req.body, req.file);
    return sendResponse(res, 201, result.message, { tiket: result.tiket, ...result.data });
  } catch (err) {
    next(err);
  }
};

export const trackPengaduan = async (req, res, next) => {
  try {
    const data = await pengaduanService.trackPengaduan(req.params.tiket);
    return sendResponse(res, 200, "Status pengaduan berhasil ditemukan.", data);
  } catch (err) {
    next(err);
  }
};

export const updateStatusPengaduan = async (req, res, next) => {
  try {
    const data = await pengaduanService.updateStatusPengaduan(req.params.id, req.body);
    await logAudit({
      req,
      action: "DISPOSISI",
      entity: "PENGADUAN",
      entityId: data.id,
      details: { status: req.body.status, tanggapan: req.body.tanggapan },
    });
    return sendResponse(res, 200, "Status tindak lanjut pengaduan berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const deletePengaduan = async (req, res, next) => {
  try {
    await pengaduanService.deletePengaduan(req.params.id);
    await logAudit({
      req,
      action: "DELETE",
      entity: "PENGADUAN",
      entityId: req.params.id,
    });
    return sendResponse(res, 200, "Laporan pengaduan warga berhasil dihapus.");
  } catch (err) {
    next(err);
  }
};
