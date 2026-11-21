import * as beritaService from "../services/beritaService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getBeritaList = async (req, res, next) => {
  try {
    const data = await beritaService.getBeritaList(req.query);
    return sendResponse(res, 200, "Data berita berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getBeritaPage = async (req, res, next) => {
  try {
    const data = await beritaService.getBeritaPage();
    return sendResponse(res, 200, "Halaman berita berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getBeritaDetail = async (req, res, next) => {
  try {
    const data = await beritaService.getBeritaDetail(req.params.slug);
    return sendResponse(res, 200, "Detail artikel berita berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const createBerita = async (req, res, next) => {
  try {
    const data = await beritaService.createBerita(req.body);
    await logAudit({
      req,
      action: "CREATE",
      entity: "BERITA",
      entityId: data.id,
      details: { judul: data.judul },
    });
    return sendResponse(res, 201, "Berita berhasil diterbitkan.", data);
  } catch (err) {
    next(err);
  }
};

export const updateBerita = async (req, res, next) => {
  try {
    const data = await beritaService.updateBerita(req.params.id, req.body);
    await logAudit({
      req,
      action: "UPDATE",
      entity: "BERITA",
      entityId: data.id,
      details: { judul: data.judul },
    });
    return sendResponse(res, 200, "Berita berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const deleteBerita = async (req, res, next) => {
  try {
    const data = await beritaService.deleteBerita(req.params.id);
    await logAudit({
      req,
      action: "DELETE",
      entity: "BERITA",
      entityId: req.params.id,
    });
    return sendResponse(res, 200, "Berita berhasil dihapus.", data);
  } catch (err) {
    next(err);
  }
};
