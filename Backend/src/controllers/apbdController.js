import * as apbdService from "../services/apbdService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getApbd = async (req, res, next) => {
  try {
    // If request comes from Admin Panel (e.g., query tahun or admin token), returns list of items
    if (req.user || req.query.admin === "true") {
      const data = await apbdService.getAdminApbdList(req.query.tahun);
      return sendResponse(res, 200, "Daftar rincian pos APBD berhasil dimuat.", data);
    }

    const data = await apbdService.getApbdSummary(req.query.tahun);
    return sendResponse(res, 200, "Ringkasan APBD berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getApbdAdminList = async (req, res, next) => {
  try {
    const data = await apbdService.getAdminApbdList(req.query.tahun);
    return sendResponse(res, 200, "Daftar rincian pos APBD berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getApbdPage = async (req, res, next) => {
  try {
    const data = await apbdService.getApbdPage(req.query.tahun);
    return sendResponse(res, 200, "Transparansi APBD lengkap berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const createApbdItem = async (req, res, next) => {
  try {
    const data = await apbdService.createApbdItem(req.body);
    await logAudit({
      req,
      action: "CREATE",
      entity: "APBD",
      entityId: String(data.id),
      details: { uraian: data.uraian, anggaran: data.anggaran },
    });
    return sendResponse(res, 201, "Pos rincian APBDes berhasil ditambahkan.", data);
  } catch (err) {
    next(err);
  }
};

export const updateApbdItem = async (req, res, next) => {
  try {
    const data = await apbdService.updateApbdItem(req.params.id, req.body);
    await logAudit({
      req,
      action: "UPDATE",
      entity: "APBD",
      entityId: req.params.id,
      details: { uraian: data.uraian, anggaran: data.anggaran },
    });
    return sendResponse(res, 200, "Pos rincian APBDes berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};


export const deleteApbdItem = async (req, res, next) => {
  try {
    await apbdService.deleteApbdItem(req.params.id);
    await logAudit({
      req,
      action: "DELETE",
      entity: "APBD",
      entityId: req.params.id,
    });
    return sendResponse(res, 200, "Pos rincian APBDes berhasil dihapus.");
  } catch (err) {
    next(err);
  }
};

export const uploadApbdDokumen = async (req, res, next) => {
  try {
    const data = await apbdService.uploadApbdDokumen(req.params.tahun, req.file);
    await logAudit({
      req,
      action: "UPLOAD_DOKUMEN",
      entity: "APBD",
      entityId: req.params.tahun,
      details: { file: req.file?.originalname },
    });
    return sendResponse(res, 200, data.message, data);
  } catch (err) {
    next(err);
  }
};
