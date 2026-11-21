import * as apbdService from "../services/apbdService.js";
import { sendResponse } from "../utils/response.js";

export const getApbdSummary = async (req, res, next) => {
  try {
    const data = await apbdService.getApbdSummary(req.query.tahun);
    return sendResponse(res, 200, "Ringkasan APBD berhasil dimuat.", data);
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
