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
} from 'lucide-react';
import { adminApi, exportToCsv } from '../../services/adminapi';

const INITIAL_UMKM = [
  {
    id: 1,
    namaUsaha: 'Keripik Ikan Tambak Bu Siti',
    pemilik: 'Siti Aminah',
    telepon: '0813-4567-8910',
    kategori: 'Kuliner',
    dusun: 'Dusun Tambakrigadung RT 03/02',
    tanggal: '26 Feb 2026, 14:20',
    status: 'Menunggu',
    foto: '/images/potensi-tambak.jpg',
  },
  {
    id: 2,
    namaUsaha: 'Madu Hutan Klanceng Pak Joko',
    pemilik: 'Joko Susilo',
    telepon: '0852-9876-2211',
    kategori: 'Pertanian',
    dusun: 'Dusun Melik RT 01/02',
    tanggal: '25 Feb 2026, 09:15',
    status: 'Menunggu',
    foto: '/images/potensi-domba.jpg',
  },
  {
    id: 3,
    namaUsaha: 'Kerajinan Tas Anyaman Eceng',
    pemilik: 'Lilik Nuriyati',
    telepon: '0878-1234-9090',
    kategori: 'Kerajinan',
    dusun: 'Dusun Krajan RT 02/01',
    tanggal: '24 Feb 2026, 17:40',
    status: 'Menunggu',
    foto: '/images/potensi-wisata.jpg',
  },
  {
    id: 4,
    namaUsaha: 'Ayam Geprek Korek Slamet',
    pemilik: 'Slamet Riyadi',
    telepon: '0812-3499-1122',
    kategori: 'Kuliner',
    dusun: 'Dusun Krajan RT 02/01',
    tanggal: '18 Jan 2026, 11:00',
    status: 'Aktif',
    foto: '/images/hero-1.jpg',
  },
  {
    id: 5,
    namaUsaha: 'Pupuk Organik Hayati Makmur',
    pemilik: 'Suparman',
    telepon: '0819-7622-4400',
    kategori: 'Pertanian',
    dusun: 'Dusun Tambakboyo RT 01/03',
    tanggal: '12 Jan 2026, 08:30',
    status: 'Aktif',
    foto: '/images/hero-3.jpg',
  },
];

export default function UmkmAdminPage() {
  const [umkmList, setUmkmList] = useState(INITIAL_UMKM);
  const [statusTab, setStatusTab] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi
      .getUmkm()
      .then((res) => {
        if (Array.isArray(res) && res.length) setUmkmList(res);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(
    () => ({
      total: umkmList.length,
      menunggu: umkmList.filter((u) => u.status === 'Menunggu').length,
      aktif: umkmList.filter((u) => u.status === 'Aktif').length,
      ditolak: umkmList.filter((u) => u.status === 'Ditolak').length,
      kuliner: umkmList.filter((u) => u.kategori === 'Kuliner').length,
    }),
    [umkmList]
  );

  const filtered = useMemo(() => {
    return umkmList.filter((u) => {
      const matchStatus = statusTab === 'Semua' || u.status === statusTab;
      const matchCat = kategoriFilter === 'Semua' || u.kategori === kategoriFilter;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        u.namaUsaha.toLowerCase().includes(q) ||
        u.pemilik.toLowerCase().includes(q) ||
        u.dusun.toLowerCase().includes(q);
      return matchStatus && matchCat && matchQuery;
    });
  }, [umkmList, statusTab, kategoriFilter, search]);

  const handleApprove = async (id) => {
    await adminApi.updateUmkmStatus(id, 'Aktif').catch(() => {});
    setUmkmList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Aktif' } : u)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data UMKM ini?')) return;
    await adminApi.deleteUmkm(id).catch(() => {});
    setUmkmList((prev) => prev.filter((u) => u.id !== id));
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
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-thumb-row">
                      <img src={item.foto} alt={item.namaUsaha} className="admin-thumb-sm" />
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
                      className={`admin-pill ${
                        item.status === 'Menunggu'
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
                        onClick={() => handleDelete(item.id)}
                        className="admin-icon-btn is-danger"
                        title="Hapus UMKM"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}