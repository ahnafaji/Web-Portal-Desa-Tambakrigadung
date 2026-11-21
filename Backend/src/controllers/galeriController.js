import * as galeriService from "../services/galeriService.js";
import { sendResponse } from "../utils/response.js";

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
    const data = await galeriService.getGaleriDetail(req.params.slug);
    return sendResponse(res, 200, "Detail album galeri berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};
