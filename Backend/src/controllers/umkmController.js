import * as umkmService from "../services/umkmService.js";
import { sendResponse } from "../utils/response.js";
import { logAudit } from "../middlewares/auditLogger.js";

export const getUmkmList = async (req, res, next) => {
  try {
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
    const data = await umkmService.getUmkmDetail(req.params.slug);
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
