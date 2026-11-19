import * as mock from "../data/mock.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const delay = (data, ms = 300) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

async function request(path, { signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`);
  const json = await res.json();
  // Backend diharapkan membalas { data: ... }. Jika langsung array/objek, tetap diterima.
  return json && json.data !== undefined ? json.data : json;
}

const get = (path, mockData) => (opts) => (USE_MOCK ? delay(mockData) : request(path, opts));

export const api = {
  getSlider: get("/slider", mock.slider),
  getStatistik: get("/statistik", mock.statistik),
  getProfil: get("/profil", mock.profil),
  getSambutan: get("/sambutan", mock.sambutan),
  getPotensi: get("/potensi?limit=3", mock.potensi),
  getPotensiPage: get("/potensi/halaman", mock.potensiPage),
  getApbd: get("/apbd", mock.apbd),
  getUmkm: get("/umkm?limit=3", mock.umkm),
  getBerita: get("/berita?limit=3", mock.berita),
  getKontak: get("/kontak", mock.kontak),
};
