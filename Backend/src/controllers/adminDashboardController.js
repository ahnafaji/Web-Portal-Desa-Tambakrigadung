import * as adminDashboardService from "../services/adminDashboardService.js";
import { sendResponse } from "../utils/response.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await adminDashboardService.getDashboardSummary();
    return sendResponse(res, 200, "Ringkasan metrik dashboard admin berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminDashboardService.getAuditLogs(req.query);
    return sendResponse(res, 200, "Riwayat audit aktivitas admin berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};
