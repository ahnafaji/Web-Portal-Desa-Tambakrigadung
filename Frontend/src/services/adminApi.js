const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  const directToken = localStorage.getItem('token') || localStorage.getItem('admin_token') || '';
  if (directToken) return directToken;

  try {
    const authData =
      localStorage.getItem('tambakrigadung_admin_auth') ||
      sessionStorage.getItem('tambakrigadung_admin_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed?.token || '';
    }
  } catch {
    return '';
  }
  return '';
};

async function request(endpoint, { method = 'GET', body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Gagal memproses permintaan (${response.status})`);
  }
  return payload.data !== undefined ? payload.data : payload;
}

export const adminApi = {
  // Dashboard
  getDashboardSummary: () => request('/admin/dashboard'),

  // Pengaduan Warga
  getPengaduan: (params = '') => request(`/pengaduan${params ? `?${params}` : ''}`),
  updatePengaduanStatus: (id, status) =>
    request(`/pengaduan/${id}/status`, { method: 'PATCH', body: { status } }),
  deletePengaduan: (id) => request(`/pengaduan/${id}`, { method: 'DELETE' }),

  // UMKM
  getUmkm: (params = '') => {
    const query = params ? `admin=true&${params}` : 'admin=true';
    return request(`/umkm?${query}`);
  },
  getUmkmById: async (id) => {
    const data = await request(`/umkm/${id}`);
    return data?.item ? data.item : data;
  },
  createUmkm: (formData) => request('/umkm', { method: 'POST', body: formData, isFormData: true }),
  updateUmkm: (id, formData) =>
    request(`/umkm/${id}`, { method: 'PUT', body: formData, isFormData: true }),
  updateUmkmStatus: (id, status) =>
    request(`/umkm/${id}/status`, { method: 'PATCH', body: { status } }),
  deleteUmkm: (id) => request(`/umkm/${id}`, { method: 'DELETE' }),

  // Galeri Foto
  getGaleri: (params = '') => request(`/galeri${params ? `?${params}` : ''}`),
  getGaleriById: (id) => request(`/galeri/${id}`),
  createGaleri: (formData) =>
    request('/galeri', { method: 'POST', body: formData, isFormData: true }),
  updateGaleri: (id, formData) =>
    request(`/galeri/${id}`, { method: 'PUT', body: formData, isFormData: true }),
  deleteGaleri: (id) => request(`/galeri/${id}`, { method: 'DELETE' }),

  // APBD Desa
  getApbd: (tahun) => request(`/apbd?tahun=${tahun || 2026}&admin=true`),
  createApbdItem: (data) => request('/apbd', { method: 'POST', body: data }),
  updateApbdItem: (id, data) => request(`/apbd/${id}`, { method: 'PUT', body: data }),
  deleteApbdItem: (id) => request(`/apbd/${id}`, { method: 'DELETE' }),
  uploadApbdPdf: (tahun, formData) =>
    request(`/apbd/${tahun}/dokumen`, { method: 'POST', body: formData, isFormData: true }),

  // Berita & Artikel
  getBerita: (params = '') => request(`/berita${params ? `?${params}` : ''}`),
  getBeritaById: (id) => request(`/berita/${id}`),
  createBerita: (formData) =>
    request('/berita', { method: 'POST', body: formData, isFormData: true }),
  updateBerita: (id, formData) =>
    request(`/berita/${id}`, { method: 'PUT', body: formData, isFormData: true }),
  deleteBerita: (id) => request(`/berita/${id}`, { method: 'DELETE' }),
};

export function exportToCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((key) => `"${String(row[key] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}