import * as commonService from "../services/commonService.js";
import { sendResponse } from "../utils/response.js";

export const getSlider = async (req, res, next) => {
  try {
    const data = await commonService.getSlider();
    return sendResponse(res, 200, "Slider berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getStatistik = async (req, res, next) => {
  try {
    const data = await commonService.getStatistik();
    return sendResponse(res, 200, "Statistik desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const updateStatistik = async (req, res, next) => {
  try {
    const data = await commonService.updateStatistik(req.body);
    return sendResponse(res, 200, "Statistik desa berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const getProfil = async (req, res, next) => {
  try {
    const data = await commonService.getProfil();
    return sendResponse(res, 200, "Profil desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const updateProfil = async (req, res, next) => {
  try {
    const data = await commonService.updateProfil(req.body);
    return sendResponse(res, 200, "Profil desa berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const getPerangkat = async (req, res, next) => {
  try {
    const data = await commonService.getPerangkat();
    return sendResponse(res, 200, "Daftar perangkat desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const createPerangkat = async (req, res, next) => {
  try {
    const data = await commonService.createPerangkat(req.body, req.file);
    return sendResponse(res, 201, "Perangkat desa berhasil ditambahkan.", data);
  } catch (err) {
    next(err);
  }
};

export const updatePerangkat = async (req, res, next) => {
  try {
    const data = await commonService.updatePerangkat(req.params.id, req.body, req.file);
    return sendResponse(res, 200, "Data perangkat desa berhasil diperbarui.", data);
  } catch (err) {
    next(err);
  }
};

export const deletePerangkat = async (req, res, next) => {
  try {
    await commonService.deletePerangkat(req.params.id);
    return sendResponse(res, 200, "Data perangkat desa berhasil dihapus.");
  } catch (err) {
    next(err);
  }
};

export const getSambutan = async (req, res, next) => {
  try {
    const data = await commonService.getSambutan();
    return sendResponse(res, 200, "Sambutan kades berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getPotensi = async (req, res, next) => {
  try {
    const data = await commonService.getPotensi(req.query);
    return sendResponse(res, 200, "Potensi desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getPotensiPage = async (req, res, next) => {
  try {
    const data = await commonService.getPotensiPage();
    return sendResponse(res, 200, "Halaman potensi desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getKontak = async (req, res, next) => {
  try {
    const data = await commonService.getKontak();
    return sendResponse(res, 200, "Kontak desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};

export const getKontakPage = async (req, res, next) => {
  try {
    const data = await commonService.getKontakPage();
    return sendResponse(res, 200, "Halaman kontak desa berhasil dimuat.", data);
  } catch (err) {
    next(err);
  }
};