import * as umkmService from "../services/umkmService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getUmkmList = async (req, res, next) => {
  try {
    if (req.user || req.query.status || req.query.admin === "true") {
      const data = await umkmService.getAdminUmkmList(req.query);
      return sendResponse(res, 200, "Katalog UMKM berhasil dimuat.", data);
    }
    const data = await umkmService.getUmkmList(req.query);
    return sendResponse(res, 200, "Katalog UMKM berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getUmkmPage = async (req, res, next) => {
  try {
    const data = await umkmService.getUmkmPage();
    return sendResponse(res, 200, "Halaman sentra UMKM berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getUmkmDetail = async (req, res, next) => {
  try {
    const data = await umkmService.getUmkmDetail(req.params.slug || req.params.id);
    return sendResponse(res, 200, "Detail profil UMKM berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const submitDaftarUmkm = async (req, res, next) => {
  try {
    const result = await umkmService.registerUmkmPublic(req.body, req.files);
    return sendResponse(res, 201, result.message, result);
  } catch (err) {
    next(err);
  }
};

export const createUmkm = async (req, res, next) => {
  try {
    const data = await umkmService.createUmkm(req.body, req.files);
    await logAudit({
      req,
      action: "CREATE",
      entity: "UMKM",
      entityId: data.id,
      details: { namaUsaha: data.namaUsaha, pemilik: data.pemilik },
    });
    return sendResponse(res, 201, "Unit UMKM warga berhasil ditambahkan.", data);
  } catch (err) {
    next(err);
  }
};

export const updateUmkm = async (req, res, next) => {
  try {
    const data = await umkmService.updateUmkm(req.params.id, req.body, req.files);
    await logAudit({
      req,
      action: "UPDATE",
      entity: "UMKM",
      entityId: data.id,
      details: { namaUsaha: data.namaUsaha },
    });
    return sendResponse(res, 200, "Data UMKM berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const deleteUmkm = async (req, res, next) => {
  try {
    await umkmService.deleteUmkm(req.params.id);
    await logAudit({
      req,
      action: "DELETE",
      entity: "UMKM",
      entityId: req.params.id,
    });
    return sendResponse(res, 200, "Data UMKM berhasil dihapus.");
  } catch (err) {
    next(err);
  }
};

export const verifyUmkm = async (req, res, next) => {
  try {
    const { status } = req.body;
    const data = await umkmService.verifyUmkm(req.params.id, status);
    await logAudit({
      req,
      action: "VERIFY",
      entity: "UMKM",
      entityId: data.id,
      details: { status },
    });
    return sendResponse(res, 200, `Status usaha berhasil diubah menjadi ${status}.`, data);
  } catch (err) {
    next(err);
  }
};