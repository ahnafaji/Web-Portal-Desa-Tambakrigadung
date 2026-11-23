// src/pages/admin/UmkmAdminPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Store,
  Utensils,
  XCircle,
  Download,
  Plus,
  Search,
  Pencil,
  Eye,
  Trash2,
  AlertTriangle,
  X,
  AlertCircle,
} from 'lucide-react';
import { adminApi, exportToCsv } from '../../services/adminApi';

export default function UmkmAdminPage() {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [statusTab, setStatusTab] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  // State Pop-up Konfirmasi Hapus
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchUmkm = () => {
    setLoading(true);
    setPageError('');
    adminApi
      .getUmkm()
      .then((res) => {
        setUmkmList(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        setPageError(err.message || 'Gagal memuat daftar UMKM dari server.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUmkm();
  }, []);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!deleteTarget) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !deleting) {
        setDeleteTarget(null);
        setDeleteError('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteTarget, deleting]);

  const stats = useMemo(
    () => ({
      total: umkmList.length,
      menunggu: umkmList.filter((u) => u.status === 'Menunggu').length,
      aktif: umkmList.filter((u) => u.status === 'Aktif').length,
      ditolak: umkmList.filter((u) => u.status === 'Ditolak').length,
      kuliner: umkmList.filter((u) =>
        String(u.kategori || '').toLowerCase().includes('kuliner') ||
        String(u.kategori || '').toLowerCase().includes('pangan')
      ).length,
    }),
    [umkmList]
  );

  const filtered = useMemo(() => {
    return umkmList.filter((u) => {
      const matchStatus = statusTab === 'Semua' || u.status === statusTab;
      const matchCat =
        kategoriFilter === 'Semua' ||
        String(u.kategori || '').toLowerCase() === kategoriFilter.toLowerCase();
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        String(u.namaUsaha || '').toLowerCase().includes(q) ||
        String(u.pemilik || '').toLowerCase().includes(q) ||
        String(u.dusun || '').toLowerCase().includes(q);
      return matchStatus && matchCat && matchQuery;
    });
  }, [umkmList, statusTab, kategoriFilter, search]);

  const handleApprove = async (id) => {
    setPageError('');
    try {
      await adminApi.updateUmkmStatus(id, 'Aktif');
      setUmkmList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Aktif' } : u)));
    } catch (err) {
      setPageError(err.message || 'Gagal menyetujui UMKM.');
    }
  };

  const openDeleteModal = (item) => {
    setDeleteError('');
    setDeleteTarget(item);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await adminApi.deleteUmkm(deleteTarget.id);
      setUmkmList((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus data UMKM. Pastikan Anda login sebagai Super Admin.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-title-inline">
            <h2 className="admin-page-title">Daftar &amp; Pengajuan UMKM Desa</h2>
            <span className="admin-pill is-success-soft">{stats.total} Terdaftar</span>
          </div>
          <p className="admin-page-subtitle">
            Kelola katalog UMKM dan tinjau pendaftaran usaha baru dari warga secara transparan.
          </p>
        </div>
        <div className="admin-head-actions">
          <button
            type="button"
            onClick={() => exportToCsv('data-umkm-tambakrigadung.csv', filtered)}
            className="btn-admin-outline"
          >
            <Download size={16} />
            <span>Ekspor Data</span>
          </button>
          <Link to="/admin/umkm/tambah" className="btn-admin-primary">
            <Plus size={16} />
            <span>Tambah UMKM</span>
          </Link>
        </div>
      </div>

      {pageError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{pageError}</span>
        </div>
      )}

      {/* 4 Kartu Metrik */}
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">MENUNGGU TINJAUAN</span>
            <span className="admin-stat-icon is-danger">
              <Clock size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.menunggu}</div>
          <p className="admin-stat-hint text-danger">! Perlu diverifikasi</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">UMKM AKTIF</span>
            <span className="admin-stat-icon is-success">
              <Store size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.aktif}</div>
          <p className="admin-stat-hint">Tayang di portal</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">SEKTOR KULINER</span>
            <span className="admin-stat-icon is-info">
              <Utensils size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.kuliner}</div>
          <p className="admin-stat-hint">Komoditas dominan</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL PENOLAKAN</span>
            <span className="admin-stat-icon is-neutral">
              <XCircle size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.ditolak}</div>
          <p className="admin-stat-hint">Data tidak lengkap</p>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-tabs">
          {[
            { key: 'Semua', label: 'Semua', count: stats.total },
            { key: 'Menunggu', label: 'Menunggu Persetujuan', count: stats.menunggu },
            { key: 'Aktif', label: 'Aktif', count: stats.aktif },
            { key: 'Ditolak', label: 'Ditolak', count: stats.ditolak },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatusTab(t.key)}
              className={`admin-tab ${statusTab === t.key ? 'is-active' : ''}`}
            >
              <span>{t.label}</span>
              <span className="admin-tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari usaha, pemilik, dusun..."
            />
          </div>
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Perikanan">Perikanan</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Jasa">Jasa</option>
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>USAHA &amp; PEMILIK</th>
                <th>KATEGORI</th>
                <th>LOKASI DUSUN</th>
                <th>TANGGAL DAFTAR</th>
                <th>STATUS</th>
                <th className="text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Memuat data UMKM...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Belum ada data UMKM yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cell-thumb-row">
                        <img
                          src={item.foto || '/images/hero-1.jpg'}
                          alt={item.namaUsaha}
                          className="admin-thumb-sm"
                        />
                        <div className="cell-stack">
                          <strong>{item.namaUsaha}</strong>
                          <span>
                            {item.pemilik} • {item.telepon}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-pill is-neutral">{item.kategori}</span>
                    </td>
                    <td>{item.dusun}</td>
                    <td className="text-muted">{item.tanggal}</td>
                    <td>
                      <span
                        className={`admin-pill ${item.status === 'Menunggu'
                            ? 'is-warning-soft'
                            : item.status === 'Aktif'
                              ? 'is-success-soft'
                              : 'is-danger-soft'
                          }`}
                      >
                        • {item.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-action-group">
                        {item.status === 'Menunggu' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id)}
                            className="btn-admin-primary btn-admin-sm"
                            title="Setujui & Tayangkan"
                          >
                            <Eye size={14} />
                            <span>Tinjau</span>
                          </button>
                        )}
                        <Link
                          to={`/admin/umkm/edit/${item.id}`}
                          className="admin-icon-btn"
                          title="Edit UMKM"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="admin-icon-btn is-danger"
                          title="Hapus UMKM"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pop-up Konfirmasi Hapus */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-hapus-umkm-title"
          onClick={closeDeleteModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
              border: '1px solid #e2e8f0',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              aria-label="Tutup"
              className="admin-icon-btn"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>

              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h3
                  id="modal-hapus-umkm-title"
                  style={{
                    margin: '0 0 6px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Hapus Data UMKM?
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: '#475569' }}>
                  Anda yakin ingin menghapus{' '}
                  <strong style={{ color: '#0f172a' }}>{deleteTarget.namaUsaha}</strong> milik{' '}
                  <strong style={{ color: '#0f172a' }}>{deleteTarget.pemilik}</strong>? Data yang
                  dihapus akan hilang permanen dari portal publik.
                </p>
              </div>
            </div>

            {deleteError && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.83rem',
                }}
              >
                {deleteError}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '22px',
              }}
            >
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="btn-admin-outline"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: deleting ? '#f87171' : '#dc2626',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                <Trash2 size={15} />
                <span>{deleting ? 'Menghapus...' : 'Ya, Hapus UMKM'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}