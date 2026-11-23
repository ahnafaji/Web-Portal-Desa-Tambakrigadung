// src/pages/admin/GaleriAdminPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Users,
  Clock,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
  Camera,
  Info,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminToast } from '../../context/AdminToastContext';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';

const CATEGORIES = [
  'Semua',
  'Kegiatan Warga',
  'Pembangunan',
  'Wisata & Budaya',
  'Pemerintahan',
];

export default function GaleriAdminPage() {
  const toast = useAdminToast();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
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
      .getGaleri()
      .then((res) => {
        if (active) setAlbums(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        if (active) setPageError(err.message || 'Gagal memuat daftar galeri dari server.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const topCategory = useMemo(() => {
    if (!albums.length) return '-';
    const counts = albums.reduce((acc, a) => {
      const key = a.kategori || 'Kegiatan Warga';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [albums]);

  const filtered = useMemo(() => {
    return albums.filter((album) => {
      const matchCat = activeCategory === 'Semua' || album.kategori === activeCategory;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        String(album.judul || '').toLowerCase().includes(q) ||
        String(album.lokasi || '').toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [albums, activeCategory, search]);

  const openDeleteModal = (album) => {
    setDeleteError('');
    setDeleteTarget(album);
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
      await adminApi.deleteGaleri(deleteTarget.id);
      setAlbums((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(`Album "${deletedTitle}" berhasil dihapus.`, 'Galeri Dihapus');
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus album galeri.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">Dokumentasi &amp; Galeri Desa</h2>
          <p className="admin-page-subtitle">
            Kelola album foto kegiatan warga, pembangunan, dan wisata desa Tambakrigadung.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link to="/admin/galeri/tambah" className="btn-admin-primary">
            <Plus size={16} />
            <span>Tambah Galeri</span>
          </Link>
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

      <div className="admin-grid-3">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL ALBUM TERBIT</span>
            <span className="admin-stat-icon is-success">
              <ImageIcon size={17} />
            </span>
          </div>
          <div className="admin-stat-value">
            {albums.filter((a) => a.status === 'Terbit').length} <small>Album Aktif</small>
          </div>
          <p className="admin-stat-hint">
            {albums.reduce((acc, a) => acc + (a.jumlahFoto || 0), 0)} total foto tersimpan di server
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">KATEGORI TERBANYAK</span>
            <span className="admin-stat-icon is-success">
              <Users size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{topCategory}</div>
          <p className="admin-stat-hint">Dokumentasi terbanyak di portal desa</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">MENUNGGU REVIEW</span>
            <span className="admin-stat-icon is-danger">
              <Clock size={17} />
            </span>
          </div>
          <div className="admin-stat-value">
            {albums.filter((a) => a.status === 'Draft').length} <small>Draft Album</small>
          </div>
          <p className="admin-stat-hint">Perlu konfirmasi tanggal &amp; pemilihan foto</p>
        </div>
      </div>

      {/* Filter Pills & Search */}
      <div className="admin-filter-strip">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul dokumentasi atau kegiatan..."
          />
        </div>
        <div className="admin-pill-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`admin-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Album Grid Card */}
      {loading ? (
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Memuat album galeri...
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Belum ada album galeri yang sesuai.
        </div>
      ) : (
        <div className="admin-grid-3">
          {filtered.map((album) => (
            <article key={album.id} className="admin-album-card">
              <div className="admin-album-media">
                <img src={album.cover || '/images/hero-1.jpg'} alt={album.judul} />
                <span
                  className={`admin-pill admin-album-status ${album.status === 'Terbit' ? 'is-success-soft' : 'is-neutral'
                    }`}
                >
                  • {album.status}
                </span>
                <span className="admin-album-count">
                  <Camera size={13} /> {album.jumlahFoto || 0} Foto
                </span>
              </div>

              <div className="admin-album-body">
                <span className="admin-album-cat">
                  {String(album.kategori || 'Kegiatan Warga').toUpperCase()}
                </span>
                <h4>{album.judul}</h4>
                <p>{album.deskripsi || album.keterangan || 'Dokumentasi kegiatan desa.'}</p>
                <div className="admin-album-meta">
                  <span>
                    <Calendar size={13} /> {album.tanggal}
                  </span>
                  <span>• {album.lokasi}</span>
                </div>
              </div>

              <div className="admin-album-foot">
                <Link to={`/admin/galeri/edit/${album.id}`} className="admin-link-subtle">
                  <Pencil size={14} />
                  <span>Edit Album</span>
                </Link>
                <button
                  type="button"
                  onClick={() => openDeleteModal(album)}
                  className="btn-admin-danger-ghost btn-admin-sm"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-callout-success">
        <Info size={18} />
        <div>
          <strong>Ketentuan Unggah Foto Galeri</strong>
          <p>
            Maksimal ukuran per file foto adalah <strong>5 MB</strong> dalam format JPG, JPEG, PNG,
            atau WebP. Pastikan rasio foto beresolusi minimal <strong>1280 × 720 px</strong> untuk
            ketajaman tampilan pada portal publik warga.
          </p>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Album Galeri?"
        description={
          deleteTarget && (
            <>
              Anda yakin ingin menghapus album{' '}
              <strong style={{ color: '#0f172a' }}>{deleteTarget.judul}</strong> (
              {deleteTarget.jumlahFoto || 0} foto)? Data yang dihapus akan hilang permanen dari
              galeri publik.
            </>
          )
        }
        confirmLabel="Ya, Hapus Album"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}