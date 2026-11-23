import * as galeriService from "../services/galeriService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getGaleriList = async (req, res, next) => {
  try {
    const data = await galeriService.getGaleriList(req.query);
    return sendResponse(res, 200, "Daftar galeri desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getGaleriPage = async (req, res, next) => {
  try {
    const data = await galeriService.getGaleriPage();
    return sendResponse(res, 200, "Arsip galeri desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getGaleriDetail = async (req, res, next) => {
  try {
    const data = await galeriService.getGaleriDetail(req.params.slug || req.params.id);
    return sendResponse(res, 200, "Detail album galeri berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const createGaleri = async (req, res, next) => {
  try {
    const data = await galeriService.createGaleri(req.body, req.files);
    await logAudit({
      req,
      action: "CREATE",
      entity: "GALERI",
      entityId: data.id,
      details: { judul: data.judul },
    });
    return sendResponse(res, 201, "Album galeri foto berhasil diterbitkan.", data);
  } catch (err) {
    next(err);
  }
};

export const updateGaleri = async (req, res, next) => {
  try {
    const data = await galeriService.updateGaleri(req.params.id, req.body, req.files);
    await logAudit({
      req,
      action: "UPDATE",
      entity: "GALERI",
      entityId: data.id,
      details: { judul: data.judul },
    });
    return sendResponse(res, 200, "Album galeri foto berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const deleteGaleri = async (req, res, next) => {
  try {
    await galeriService.deleteGaleri(req.params.id);
    await logAudit({
      req,
      action: "DELETE",
      entity: "GALERI",
      entityId: req.params.id,
    });
    return sendResponse(res, 200, "Album galeri berhasil dihapus.");
  } catch (err) {
    next(err);
  }
};
