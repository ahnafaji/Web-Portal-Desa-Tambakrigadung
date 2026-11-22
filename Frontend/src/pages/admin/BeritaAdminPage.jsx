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
} from 'lucide-react';
import { adminApi, exportToCsv } from '../../services/adminapi';

const INITIAL_BERITA = [
  {
    id: 1,
    judul: 'Kerja Bakti Membersihkan Saluran Air oleh Seluruh Warga Desa',
    ringkasan:
      'Normalisasi saluran irigasi pertanian sepanjang 2 KM menjelang musim penghujan.',
    kategori: 'Kegiatan Warga',
    penulis: 'Humas Desa',
    tanggal: '20 Feb 2026',
    status: 'Terbit',
    pembaca: 3420,
    gambar: '/images/hero-1.jpg',
  },
  {
    id: 2,
    judul: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Triwulan I',
    ringkasan:
      'Pemerintah desa menyalurkan BLT DD secara transparan kepada 65 KPM di Balai Desa.',
    kategori: 'Pengumuman',
    penulis: 'Kaur Kesra',
    tanggal: '18 Feb 2026',
    status: 'Terbit',
    pembaca: 4180,
    gambar: '/images/kades.jpeg',
  },
  {
    id: 3,
    judul: 'Panen Raya Bandeng dan Nila di Sentra Budidaya Tambak Boyo',
    ringkasan:
      'Hasil panen kolam binaan kelompok tani mencapai 15 ton dengan mutu komoditas unggul.',
    kategori: 'Pertanian & Perikanan',
    penulis: 'Pendamping Desa',
    tanggal: '16 Feb 2026',
    status: 'Terbit',
    pembaca: 2890,
    gambar: '/images/potensi-tambak.jpg',
  },
  {
    id: 4,
    judul: 'Pengecoran Jalan Usaha Tani Blok Timur Masuki Tahap Finishing',
    ringkasan:
      'Akses mobilitas pengangkutan gabah dan sarana produksi tani kini semakin lancar.',
    kategori: 'Pembangunan',
    penulis: 'Kaur Perencanaan',
    tanggal: '12 Feb 2026',
    status: 'Terbit',
    pembaca: 2150,
    gambar: '/images/hero-3.jpg',
  },
  {
    id: 5,
    judul: 'Draf: Rencana Penataan Taman Terbuka Hijau & Ruang Bermain Dusun Melik',
    ringkasan:
      'Usulan rencana penataan fasilitas umum dan ruang terbuka interaksi warga.',
    kategori: 'Pembangunan',
    penulis: 'Sekretariat',
    tanggal: '26 Feb 2026',
    status: 'Draft',
    pembaca: 0,
    gambar: '/images/potensi-wisata.jpg',
  },
];

export default function BeritaAdminPage() {
  const [articles, setArticles] = useState(INITIAL_BERITA);
  const [statusTab, setStatusTab] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi
      .getBerita()
      .then((res) => {
        if (Array.isArray(res) && res.length) setArticles(res);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(
    () => ({
      total: articles.length,
      terbit: articles.filter((a) => a.status === 'Terbit').length,
      draft: articles.filter((a) => a.status === 'Draft').length,
      pembaca: articles.reduce((s, a) => s + (a.pembaca || 0), 0),
    }),
    [articles]
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchStatus = statusTab === 'Semua' || a.status === statusTab;
      const matchCat = kategoriFilter === 'Semua' || a.kategori === kategoriFilter;
      const q = search.toLowerCase();
      const matchQuery =
        !q || a.judul.toLowerCase().includes(q) || a.penulis.toLowerCase().includes(q);
      return matchStatus && matchCat && matchQuery;
    });
  }, [articles, statusTab, kategoriFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus berita/artikel ini?')) return;
    await adminApi.deleteBerita(id).catch(() => {});
    setArticles((prev) => prev.filter((a) => a.id !== id));
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
          <p className="admin-stat-hint text-success">↗ +18% dari bln lalu</p>
        </div>
      </div>

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
            <option value="Kegiatan Warga">Kegiatan Warga</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Pertanian & Perikanan">Pertanian &amp; Perikanan</option>
            <option value="Pembangunan">Pembangunan</option>
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
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-thumb-row">
                      <img src={item.gambar} alt={item.judul} className="admin-thumb-wide" />
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
                      className={`admin-pill ${
                        item.status === 'Terbit' ? 'is-success-soft' : 'is-neutral'
                      }`}
                    >
                      • {item.status}
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
                        onClick={() => handleDelete(item.id)}
                        className="admin-icon-btn is-danger"
                        title="Hapus artikel"
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