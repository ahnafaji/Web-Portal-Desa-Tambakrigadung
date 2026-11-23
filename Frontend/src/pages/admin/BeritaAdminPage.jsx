// src/pages/admin/BeritaAdminPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Globe,
  FileEdit,
  Eye,
  Download,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { adminApi, exportToCsv } from '../../services/adminApi';
import { useAdminToast } from '../../context/AdminToastContext';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';

const KATEGORI_OPTIONS = [
  'Kegiatan Warga',
  'Pengumuman',
  'Pertanian & Perikanan',
  'Pembangunan',
];

export default function BeritaAdminPage() {
  const toast = useAdminToast();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [statusTab, setStatusTab] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  // State modal konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPageError('');

    adminApi
      .getBerita()
      .then((res) => {
        if (active) setArticles(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        if (active) setPageError(err.message || 'Gagal memuat daftar berita dari server.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: articles.length,
      terbit: articles.filter((a) => a.status === 'Terbit').length,
      draft: articles.filter((a) => a.status === 'Draft' || a.status === 'Draf').length,
      pembaca: articles.reduce((s, a) => s + (a.pembaca || 0), 0),
    }),
    [articles]
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const normalizedStatus = a.status === 'Draf' ? 'Draft' : a.status;
      const matchStatus = statusTab === 'Semua' || normalizedStatus === statusTab;
      const matchCat = kategoriFilter === 'Semua' || a.kategori === kategoriFilter;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        String(a.judul || '').toLowerCase().includes(q) ||
        String(a.penulis || '').toLowerCase().includes(q);
      return matchStatus && matchCat && matchQuery;
    });
  }, [articles, statusTab, kategoriFilter, search]);

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
      const deletedTitle = deleteTarget.judul;
      await adminApi.deleteBerita(deleteTarget.id);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(`Artikel "${deletedTitle}" berhasil dihapus.`, 'Berita Dihapus');
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus artikel berita.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL BERITA</span>
            <span className="admin-stat-icon is-info">
              <Newspaper size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.total}</div>
          <p className="admin-stat-hint">• {stats.terbit} terbit online</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">BERITA TERBIT</span>
            <span className="admin-stat-icon is-success">
              <Globe size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.terbit}</div>
          <p className="admin-stat-hint">Aktif di portal publik</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">DRAF ARTIKEL</span>
            <span className="admin-stat-icon is-neutral">
              <FileEdit size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.draft}</div>
          <p className="admin-stat-hint">Perlu diselesaikan</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL PEMBACA</span>
            <span className="admin-stat-icon is-success">
              <Eye size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{stats.pembaca.toLocaleString('id-ID')}</div>
          <p className="admin-stat-hint">Akumulasi pembaca artikel</p>
        </div>
      </div>

      {pageError && (
        <div
          role="alert"
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

      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">Daftar Kabar &amp; Artikel Desa</h2>
          <p className="admin-page-subtitle">
            Tulis, perbarui, dan publikasikan informasi resmi desa secara transparan dan berkala.
          </p>
        </div>
        <div className="admin-head-actions">
          <button
            type="button"
            onClick={() => exportToCsv('berita-desa-tambakrigadung.csv', filtered)}
            className="btn-admin-outline"
          >
            <Download size={16} />
            <span>Ekspor Data</span>
          </button>
          <Link to="/admin/berita/tambah" className="btn-admin-primary">
            <Plus size={16} />
            <span>Tulis Berita</span>
          </Link>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-tabs">
          {[
            { key: 'Semua', count: stats.total },
            { key: 'Terbit', count: stats.terbit },
            { key: 'Draft', count: stats.draft },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatusTab(t.key)}
              className={`admin-tab ${statusTab === t.key ? 'is-active' : ''}`}
            >
              <span>{t.key}</span>
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
              placeholder="Cari judul berita, penulis, topik..."
            />
          </div>
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="admin-select"
          >
            <option value="Semua">Semua Kategori</option>
            {KATEGORI_OPTIONS.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ARTIKEL &amp; TOPIK</th>
                <th>KATEGORI</th>
                <th>PENULIS</th>
                <th>STATUS</th>
                <th className="text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Memuat daftar berita...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    Belum ada artikel berita yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cell-thumb-row">
                        <img
                          src={item.gambar || '/images/hero-1.jpg'}
                          alt={item.judul}
                          className="admin-thumb-wide"
                        />
                        <div className="cell-stack">
                          <strong>{item.judul}</strong>
                          <span className="text-truncate-2">{item.ringkasan}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-pill is-info-soft">{item.kategori}</span>
                    </td>
                    <td>
                      <div className="cell-stack">
                        <strong>{item.penulis}</strong>
                        <span>{item.tanggal}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`admin-pill ${item.status === 'Terbit' ? 'is-success-soft' : 'is-neutral'
                          }`}
                      >
                        • {item.status === 'Draf' ? 'Draft' : item.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-action-group">
                        <Link
                          to={`/admin/berita/edit/${item.id}`}
                          className="admin-icon-btn"
                          title="Edit artikel"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="admin-icon-btn is-danger"
                          title="Hapus artikel"
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

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Artikel Berita?"
        description={
          deleteTarget && (
            <>
              Anda yakin ingin menghapus artikel{' '}
              <strong style={{ color: '#0f172a' }}>{deleteTarget.judul}</strong>? Artikel yang
              dihapus akan hilang permanen dari portal berita warga.
            </>
          )
        }
        confirmLabel="Ya, Hapus Berita"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}