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
} from 'lucide-react';
import { adminApi } from '../../services/adminapi';

const INITIAL_ALBUMS = [
  {
    id: 1,
    judul: 'Kerja Bakti Membersihkan Saluran Irigasi',
    kategori: 'Kegiatan Warga',
    deskripsi:
      'Normalisasi dan pembersihan aliran air Dusun Tambakboyo menjelang musim penghujan.',
    tanggal: '20 Feb 2026',
    lokasi: 'Dusun Tambakboyo',
    jumlahFoto: 8,
    status: 'Terbit',
    cover: '/images/hero-1.jpg',
  },
  {
    id: 2,
    judul: 'Pengembangan Fasilitas Area Wisata Desa',
    kategori: 'Wisata & Budaya',
    deskripsi:
      'Penambahan gazebo istirahat keluarga dan penataan lanskap hijau taman bermain anak.',
    tanggal: '15 Feb 2026',
    lokasi: 'Dusun Krajan',
    jumlahFoto: 12,
    status: 'Terbit',
    cover: '/images/potensi-wisata.jpg',
  },
  {
    id: 3,
    judul: 'Panen Raya Tambak Ikan Air Tawar',
    kategori: 'Kegiatan Warga',
    deskripsi:
      'Hasil panen budidaya ikan lele dan nila kelompok budidaya air tawar Dusun Melik.',
    tanggal: '10 Feb 2026',
    lokasi: 'Dusun Melik',
    jumlahFoto: 6,
    status: 'Terbit',
    cover: '/images/potensi-tambak.jpg',
  },
  {
    id: 4,
    judul: 'Progres Pavingisasi Jalan Usaha Tani',
    kategori: 'Pembangunan',
    deskripsi:
      'Peningkatan akses transportasi pengangkutan hasil pertanian warga RT 03 RW 01.',
    tanggal: '04 Feb 2026',
    lokasi: 'Dusun Krajan',
    jumlahFoto: 10,
    status: 'Terbit',
    cover: '/images/hero-3.jpg',
  },
  {
    id: 5,
    judul: 'Musrenbangdes Penetapan RKPDes 2026',
    kategori: 'Pemerintahan',
    deskripsi:
      'Rapat koordinasi bersama BPD, LPMD, dan tokoh masyarakat di Balai Desa Tambakrigadung.',
    tanggal: '28 Jan 2026',
    lokasi: 'Balai Desa',
    jumlahFoto: 15,
    status: 'Terbit',
    cover: '/images/kades.jpeg',
  },
  {
    id: 6,
    judul: 'Pelatihan Pengemasan Produk UMKM',
    kategori: 'Kegiatan Warga',
    deskripsi:
      'Dokumentasi pelatihan desain kemasan pangan higienis dan sertifikasi halal bersama dinas.',
    tanggal: '24 Jan 2026',
    lokasi: 'Balai Dusun Melik',
    jumlahFoto: 4,
    status: 'Draft',
    cover: '/images/potensi-domba.jpg',
  },
];

const CATEGORIES = [
  'Semua',
  'Kegiatan Warga',
  'Pembangunan',
  'Wisata & Budaya',
  'Pemerintahan',
];

export default function GaleriAdminPage() {
  const [albums, setAlbums] = useState(INITIAL_ALBUMS);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi
      .getGaleri()
      .then((res) => {
        if (Array.isArray(res) && res.length) setAlbums(res);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return albums.filter((album) => {
      const matchCat = activeCategory === 'Semua' || album.kategori === activeCategory;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        album.judul.toLowerCase().includes(q) ||
        album.lokasi.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [albums, activeCategory, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus album dokumentasi ini?')) return;
    await adminApi.deleteGaleri(id).catch(() => {});
    setAlbums((prev) => prev.filter((a) => a.id !== id));
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
          <div className="admin-stat-value">Kegiatan Warga</div>
          <p className="admin-stat-hint">Dokumentasi partisipasi masyarakat desa</p>
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

      {/* Filter Pills, Search */}
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
      <div className="admin-grid-3">
        {filtered.map((album) => (
          <article key={album.id} className="admin-album-card">
            <div className="admin-album-media">
              <img src={album.cover} alt={album.judul} />
              <span
                className={`admin-pill admin-album-status ${
                  album.status === 'Terbit' ? 'is-success-soft' : 'is-neutral'
                }`}
              >
                • {album.status}
              </span>
              <span className="admin-album-count">
                <Camera size={13} /> {album.jumlahFoto} Foto
              </span>
            </div>

            <div className="admin-album-body">
              <span className="admin-album-cat">{album.kategori.toUpperCase()}</span>
              <h4>{album.judul}</h4>
              <p>{album.deskripsi}</p>
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
                onClick={() => handleDelete(album.id)}
                className="btn-admin-danger-ghost btn-admin-sm"
              >
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
            </div>
          </article>
        ))}
      </div>

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
    </div>
  );
}