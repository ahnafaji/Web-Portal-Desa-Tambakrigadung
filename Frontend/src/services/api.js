import * as mock from "../data/mock.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const APP_BASE_URL = import.meta.env.BASE_URL;

const delay = (data, ms = 300) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

function resolveImagePaths(value) {
  if (typeof value === "string") {
    return value.startsWith("/images/")
      ? `${APP_BASE_URL}${value.slice(1)}`
      : value;
  }
  if (Array.isArray(value)) return value.map(resolveImagePaths);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, resolveImagePaths(child)])
    );
  }
  return value;
}

async function request(path, { signal } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    signal,
    headers: { Accept: "application/json" },
    credentials: "include", // Essential for HttpOnly Cookie authentication
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Gagal memuat data (${res.status})`);
  }
  const json = await res.json();
  return resolveImagePaths(json && json.data !== undefined ? json.data : json);
}

const get = (path, mockData) => (opts) => (USE_MOCK ? delay(mockData) : request(path, opts));

function getMockBeritaDetail(slug) {
  const all = mock.beritaPage.items;
  const article = all.find((item) => item.slug === slug) || all[0];
  const related = all.filter((item) => item.slug !== article.slug).slice(0, 3);
  return {
    article,
    related,
    populer: mock.beritaPage.populer,
    kategoriSidebar: mock.beritaPage.kategoriSidebar,
  };
}

function getMockUmkmDetail(slug) {
  const all = mock.umkmPage.items;
  const item = all.find((u) => u.slug === slug) || all[0];
  const related = all.filter((u) => u.slug !== item.slug).slice(0, 3);
  return { item, related };
}

function getMockGaleriDetail(slug) {
  const all = mock.galeriPage.items;
  const item = all.find((g) => g.slug === slug) || all[0];
  const related = all.filter((g) => g.slug !== item.slug).slice(0, 3);
  return { item, related };
}

async function postForm(path, formData) {
  if (USE_MOCK) {
    await delay(null, 650);
    return {
      status: "pending_verification",
      message: "Pendaftaran usaha berhasil dikirim dan sedang menunggu verifikasi Admin Desa (1–2 hari kerja).",
    };
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Gagal mengirim formulir (${res.status})`);
  return json && json.data !== undefined ? json.data : json;
}

export const api = {
  getSlider: get("/slider", mock.slider),
  getStatistik: get("/statistik", mock.statistik),
  getProfil: get("/profil", mock.profil),
  getSambutan: get("/sambutan", mock.sambutan),
  getPotensi: get("/potensi?limit=3", mock.potensi),
  getPotensiPage: get("/potensi/halaman", mock.potensiPage),
  getApbd: get("/apbd", mock.apbd),
  getApbdPage: get("/apbd/halaman", mock.apbdPage),
  getUmkm: get("/umkm?limit=3", mock.umkm),
  getUmkmPage: get("/umkm/halaman", mock.umkmPage),
  getUmkmDetail: (slug, opts) => USE_MOCK ? delay(getMockUmkmDetail(slug)) : request(`/umkm/${slug}`, opts),
  submitUmkm: (formData) => postForm("/umkm/daftar", formData),
  getBerita: get("/berita?limit=3", mock.berita),
  getBeritaPage: get("/berita/halaman", mock.beritaPage),
  getBeritaDetail: (slug, opts) => USE_MOCK ? delay(getMockBeritaDetail(slug)) : request(`/berita/${slug}`, opts),
  getKontak: get("/kontak", mock.kontak),
  getGaleriPage: get("/galeri/halaman", mock.galeriPage),
  getGaleriDetail: (slug, opts) => USE_MOCK ? delay(getMockGaleriDetail(slug)) : request(`/galeri/${slug}`, opts),
  getKontakPage: get("/kontak/halaman", mock.kontakPage),
  submitPengaduan: async (formData) => {
    if (USE_MOCK) {
      await delay(null, 650);
      const kode = `ADU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        tiket: kode,
        message: "Laporan aspirasi/pengaduan berhasil tercatat dalam sistem pamong desa.",
      };
    }
    const res = await fetch(`${BASE_URL}/pengaduan`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || `Gagal mengirim pengaduan (${res.status})`);
    return json && json.data !== undefined ? json.data : json;
  },
  loginAdmin: async ({ email, password }) => {
    if (USE_MOCK) {
      await delay(null, 550);
      if (!email.trim() || !password.trim()) {
        throw new Error("Email/username dan kata sandi wajib diisi.");
      }
      return {
        token: "mock-jwt-token-tambakrigadung-2026",
        user: {
          nama: "Operator Pemdes Tambakrigadung",
          email: email.includes("@") ? email : "admin@tambakrigadung.desa.id",
          role: "operator_desa",
        },
      };
    }
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include", // Stores HttpOnly Cookie
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Email atau kata sandi salah.");
    return json && json.data !== undefined ? json.data : json;
  },
  getMe: async () => {
    return request("/auth/me");
  },
  logoutAdmin: async () => {
    if (USE_MOCK) return;
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
  },
};
