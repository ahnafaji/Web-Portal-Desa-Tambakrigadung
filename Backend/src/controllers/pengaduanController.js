import * as pengaduanService from "../services/pengaduanService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const submitPengaduan = async (req, res, next) => {
  try {
    const result = await pengaduanService.createPengaduan(req.body, req.file);
    return sendResponse(res, 201, result.message, { tiket: result.tiket });
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
