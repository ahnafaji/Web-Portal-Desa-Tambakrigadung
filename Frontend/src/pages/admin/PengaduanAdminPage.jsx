import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Wrench,
  CheckCircle2,
  Search,
  Check,
  X,
  Trash2,
  Phone,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../services/adminapi';

export default function PengaduanAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [draftStatus, setDraftStatus] = useState('Menunggu');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getPengaduan()
      .then((res) => {
        if (Array.isArray(res)) setItems(res);
        else if (res && Array.isArray(res.items)) setItems(res.items);
        else setItems([]);
      })
      .catch((err) => {
        console.error('Gagal memuat daftar pengaduan:', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      Semua: items.length,
      Menunggu: items.filter((i) => i.status === 'Menunggu').length,
      Diproses: items.filter((i) => i.status === 'Diproses').length,
      Selesai: items.filter((i) => i.status === 'Selesai').length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchTab = activeTab === 'Semua' || item.status === activeTab;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        item.subjek.toLowerCase().includes(q) ||
        item.pelapor.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.dusun.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [items, activeTab, search]);

  const openDetail = (item) => {
    setSelected(item);
    setDraftStatus(item.status);
  };

  const handleSaveStatus = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminApi.updatePengaduanStatus(selected.id, draftStatus).catch(() => {});
      setItems((prev) =>
        prev.map((item) => (item.id === selected.id ? { ...item, status: draftStatus } : item))
      );
      setSelected((prev) => (prev ? { ...prev, status: draftStatus } : null));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus laporan pengaduan ini secara permanen?')) return;
    await adminApi.deletePengaduan(id).catch(() => {});
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="admin-pill is-success-soft">
            Kecamatan Tikung • Kabupaten Lamongan
          </span>
          <h2 className="admin-page-title mt-1">Daftar Pengaduan &amp; Aspirasi Warga</h2>
          <p className="admin-page-subtitle">
            Pantau laporan warga dan perbarui status penanganannya secara transparan dan berkala.
          </p>
        </div>
      </div>

      {/* Metrik Status */}
      <div className="admin-grid-3">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Menunggu Tinjauan</span>
            <span className="admin-stat-icon is-warning">
              <Clock size={17} />
            </span>
          </div>
          <div className="admin-stat-value">
            {counts.Menunggu} <small>Tiket</small>
          </div>
          <p className="admin-stat-hint">• Perlu segera ditindaklanjuti</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Sedang Diproses</span>
            <span className="admin-stat-icon is-info">
              <Wrench size={17} />
            </span>
          </div>
          <div className="admin-stat-value">
            {counts.Diproses} <small>Tiket</small>
          </div>
          <p className="admin-stat-hint">• Dalam penanganan tim teknis</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Telah Selesai</span>
            <span className="admin-stat-icon is-success">
              <CheckCircle2 size={17} />
            </span>
          </div>
          <div className="admin-stat-value">
            {counts.Selesai} <small>Tiket</small>
          </div>
          <p className="admin-stat-hint">• Laporan tertangani tuntas</p>
        </div>
      </div>

      {/* Filter, Tabel */}
      <section className="admin-card">
        <div className="admin-tabs">
          {['Semua', 'Menunggu', 'Diproses', 'Selesai'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`admin-tab ${activeTab === tab ? 'is-active' : ''}`}
            >
              <span>{tab}</span>
              <span className="admin-tab-count">{counts[tab]}</span>
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
              placeholder="Cari subjek aduan, nama pelapor, atau nomor tiket..."
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PELAPOR</th>
                <th>KATEGORI</th>
                <th>SUBJEK &amp; RINGKASAN</th>
                <th>STATUS</th>
                <th className="text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">
                    Memuat data pengaduan...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">
                    Belum ada laporan pengaduan warga.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-avatar-row">
                      <span className="admin-initials">{item.inisial}</span>
                      <div className="cell-stack">
                        <strong>{item.pelapor}</strong>
                        <span>{item.telepon}</span>
                        <span className="admin-pill is-neutral is-xs">{item.dusun}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-pill is-success-soft">{item.kategori}</span>
                  </td>
                  <td>
                    <div className="cell-stack">
                      <strong>{item.subjek}</strong>
                      <span className="text-truncate-2">{item.ringkasan}</span>
                      <code className="admin-code">#{item.id}</code>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-pill ${
                        item.status === 'Menunggu'
                          ? 'is-warning-soft'
                          : item.status === 'Diproses'
                            ? 'is-info-soft'
                            : 'is-success-soft'
                      }`}
                    >
                      • {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => openDetail(item)}
                      className="btn-admin-primary btn-admin-sm"
                    >
                      <Eye size={14} />
                      <span>Tinjau</span>
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide-Over Detail Drawer */}
      {selected && (
        <div className="admin-drawer-overlay" onClick={() => setSelected(null)}>
          <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-head">
              <div>
                <h3>Detail Pengaduan</h3>
                <p>
                  Tiket: <strong>#{selected.id}</strong> • Masuk {selected.tanggal}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="admin-icon-btn"
                aria-label="Tutup panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-drawer-body">
              <div className="admin-status-box">
                <label className="admin-field-label">STATUS PENANGANAN</label>
                <div className="admin-status-row">
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveStatus}
                    className="btn-admin-primary"
                  >
                    <Check size={16} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>
                </div>
                <small className="text-muted">
                  Perubahan status akan diperbarui otomatis pada data portal desa.
                </small>
              </div>

              <div className="admin-kv-section">
                <div className="admin-kv-head">
                  <span className="admin-field-label">INFORMASI PELAPOR</span>
                  <span className="admin-pill is-success-soft">Warga Terdaftar</span>
                </div>
                <div className="admin-kv-row">
                  <span>Nama Pelapor</span>
                  <strong>{selected.pelapor}</strong>
                </div>
                <div className="admin-kv-row">
                  <span>WhatsApp / Telepon</span>
                  <strong>
                    <Phone size={13} className="inline-icon" /> {selected.telepon}
                  </strong>
                </div>
                <div className="admin-kv-row">
                  <span>Dusun / Domisili</span>
                  <strong>{selected.dusun}</strong>
                </div>
                <div className="admin-kv-row">
                  <span>Kategori Aduan</span>
                  <span className="admin-pill is-success-soft">{selected.kategori}</span>
                </div>
                <div className="admin-kv-row">
                  <span>Waktu Laporan</span>
                  <strong>{selected.tanggal}</strong>
                </div>
                <div className="admin-kv-row">
                  <span>Tingkat Urgensi</span>
                  <span className="admin-pill is-warning-soft">{selected.urgensi}</span>
                </div>
              </div>

              <div className="admin-report-section">
                <span className="admin-field-label">ISI LAPORAN / PENGADUAN WARGA</span>
                <h4>{selected.subjek}</h4>
                <blockquote className="admin-report-quote">“{selected.ringkasan}”</blockquote>
              </div>

              {selected.foto && (
                <div className="admin-report-section">
                  <div className="admin-kv-head">
                    <span className="admin-field-label">FOTO BUKTI TERLAMPIR (1 FOTO)</span>
                    <small className="text-muted">{selected.fotoSize}</small>
                  </div>
                  <img
                    src={selected.foto}
                    alt="Bukti pengaduan"
                    className="admin-evidence-img"
                  />
                </div>
              )}
            </div>

            <div className="admin-drawer-foot">
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                className="btn-admin-danger-ghost"
              >
                <Trash2 size={15} />
                <span>Hapus Laporan</span>
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-admin-outline"
              >
                Tutup
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}