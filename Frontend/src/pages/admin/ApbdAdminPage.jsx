import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Scale,
  Plus,
  FileText,
  Upload,
  Download,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { adminApi } from '../../services/adminapi';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num || 0);

export default function ApbdAdminPage() {
  const [tahunList, setTahunList] = useState(['2026', '2025']);
  const [tahun, setTahun] = useState('2026');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Belanja');
  const [search, setSearch] = useState('');
  const [showOnHome, setShowOnHome] = useState(true);
  const [pdfMeta, setPdfMeta] = useState({
    name: 'Dokumen_APBDes_Tambakrigadung_2026.pdf',
    size: '2.4 MB',
    updated: 'Diperbarui 15 Jan 2026 • Format Salinan Keputusan BPD',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formModal, setFormModal] = useState({
    jenis: 'Belanja',
    kode: '',
    uraian: '',
    keterangan: '',
    anggaran: '',
    realisasi: '',
  });

  useEffect(() => {
    setLoading(true);
    adminApi
      .getApbd(tahun)
      .then((res) => {
        if (Array.isArray(res)) setItems(res);
        else if (res && Array.isArray(res.items)) setItems(res.items);
        else setItems([]);
      })
      .catch((err) => {
        console.error('Gagal memuat pos APBD:', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [tahun]);

  const yearItems = useMemo(() => items.filter((i) => i.tahun === tahun), [items, tahun]);

  const totals = useMemo(() => {
    const pendapatan = yearItems
      .filter((i) => i.jenis === 'Pendapatan')
      .reduce((s, i) => s + Number(i.anggaran), 0);
    const belanja = yearItems
      .filter((i) => i.jenis === 'Belanja')
      .reduce((s, i) => s + Number(i.anggaran), 0);
    return {
      pendapatan,
      belanja,
      surplus: pendapatan - belanja,
    };
  }, [yearItems]);

  const visibleRows = useMemo(() => {
    return yearItems.filter((i) => {
      const matchTab = i.jenis === activeTab;
      const q = search.toLowerCase();
      const matchQuery =
        !q || i.kode.toLowerCase().includes(q) || i.uraian.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [yearItems, activeTab, search]);

  const tabTotalAnggaran = visibleRows.reduce((s, i) => s + Number(i.anggaran), 0);
  const tabTotalRealisasi = visibleRows.reduce((s, i) => s + Number(i.realisasi), 0);

  const handleAddYear = () => {
    const nextYear = String(Math.max(...tahunList.map(Number)) + 1);
    setTahunList((prev) => [nextYear, ...prev]);
    setTahun(nextYear);
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormModal(
      item
        ? {
            jenis: item.jenis,
            kode: item.kode,
            uraian: item.uraian,
            keterangan: item.keterangan,
            anggaran: String(item.anggaran),
            realisasi: String(item.realisasi),
          }
        : {
            jenis: activeTab,
            kode: '',
            uraian: '',
            keterangan: '',
            anggaran: '',
            realisasi: '',
          }
    );
    setModalOpen(true);
  };

  const handleSaveRincian = async (e) => {
    e.preventDefault();
    const payload = {
      ...formModal,
      tahun,
      anggaran: Number(formModal.anggaran) || 0,
      realisasi: Number(formModal.realisasi) || 0,
    };

    try {
      if (editingItem) {
        const updated = await adminApi.updateApbdItem(editingItem.id, payload);
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated, ...payload } : i))
        );
      } else {
        const created = await adminApi.createApbdItem(payload);
        if (created) {
          setItems((prev) => [...prev, created]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan pos rincian APBD.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pos rincian anggaran ini?')) return;
    try {
      await adminApi.deleteApbdItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message || 'Gagal menghapus pos rincian APBD.');
    }
  };

  const handlePdfChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('dokumen', file);
    await adminApi.uploadApbdPdf(tahun, fd).catch(() => {});
    setPdfMeta({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      updated: 'Baru saja diperbarui • Format Salinan Keputusan BPD',
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <nav className="admin-breadcrumb">
            <span>Layanan &amp; Data</span> <span>/</span> <strong>Transparansi APBD Desa</strong>
          </nav>
          <h2 className="admin-page-title">Transparansi APBD Desa {tahun}</h2>
          <p className="admin-page-subtitle">
            Atur rincian anggaran pendapatan, belanja desa, dan dokumen PDF resmi per tahun anggaran.
          </p>
        </div>
        <div className="admin-head-actions">
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="admin-select"
          >
            {tahunList.map((y) => (
              <option key={y} value={y}>
                Tahun: {y}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddYear} className="btn-admin-outline">
            + Tahun Baru
          </button>
          <button type="button" onClick={() => openModal()} className="btn-admin-primary">
            <Plus size={16} />
            <span>Tambah Rincian</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Anggaran Card */}
      <div className="admin-grid-3">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL PENDAPATAN</span>
            <span className="admin-stat-icon is-success">
              <TrendingUp size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{formatRupiah(totals.pendapatan)}</div>
          <p className="admin-stat-hint">
            {yearItems.filter((i) => i.jenis === 'Pendapatan').length} pos pendapatan desa
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">TOTAL PENGELUARAN / BELANJA</span>
            <span className="admin-stat-icon is-info">
              <Wallet size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{formatRupiah(totals.belanja)}</div>
          <p className="admin-stat-hint">
            {yearItems.filter((i) => i.jenis === 'Belanja').length} bidang belanja operasional &amp;
            fisik
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">SURPLUS / PEMBIAYAAN NETTO</span>
            <span className="admin-stat-icon is-success">
              <Scale size={17} />
            </span>
          </div>
          <div className="admin-stat-value">{formatRupiah(totals.surplus)}</div>
          <span className="admin-pill is-success-soft">• Dipublikasikan (Live)</span>
        </div>
      </div>

      {/* Dokumen PDF */}
      <div className="admin-pdf-bar">
        <div className="admin-pdf-info">
          <span className="admin-pdf-badge">
            <FileText size={20} />
          </span>
          <div>
            <strong>{pdfMeta.name}</strong>
            <p>
              {pdfMeta.size} • {pdfMeta.updated}
            </p>
          </div>
        </div>
        <div className="admin-head-actions">
          <label className="btn-admin-outline btn-admin-sm cursor-pointer">
            <Upload size={14} />
            <span>Ganti File PDF</span>
            <input type="file" accept="application/pdf" hidden onChange={handlePdfChange} />
          </label>
          <button type="button" className="btn-admin-outline btn-admin-sm">
            <Download size={14} />
            <span>Unduh</span>
          </button>
        </div>
      </div>

      {/* Rincian Anggaran */}
      <section className="admin-card">
        <div className="admin-tabs">
          {[
            { key: 'Belanja', label: 'Belanja Desa' },
            { key: 'Pendapatan', label: 'Pendapatan Desa' },
            { key: 'Pembiayaan', label: 'Pembiayaan Desa' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`admin-tab ${activeTab === t.key ? 'is-active' : ''}`}
            >
              <span>{t.label}</span>
              <span className="admin-tab-count">
                {yearItems.filter((i) => i.jenis === t.key).length}
              </span>
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
              placeholder="Cari kode atau uraian bidang..."
            />
          </div>
          <label className="admin-switch-label">
            <span>Tampilkan di Halaman Utama Portal</span>
            <input
              type="checkbox"
              checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
            />
          </label>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>KODE</th>
                <th>URAIAN BIDANG / KEGIATAN</th>
                <th className="text-right">ANGGARAN (RP)</th>
                <th className="text-right">REALISASI (RP)</th>
                <th className="text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">
                    Memuat data rincian pos APBD...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">
                    Belum ada data rincian pos anggaran untuk kategori {activeTab}.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                <tr key={row.id}>
                  <td className="text-muted">{row.kode}</td>
                  <td>
                    <div className="cell-stack">
                      <strong>{row.uraian}</strong>
                      <span>{row.keterangan}</span>
                    </div>
                  </td>
                  <td className="text-right font-semibold">{formatRupiah(row.anggaran)}</td>
                  <td className="text-right">{formatRupiah(row.realisasi)}</td>
                  <td className="text-right">
                    <div className="admin-action-group">
                      <button
                        type="button"
                        onClick={() => openModal(row)}
                        className="admin-icon-btn"
                        title="Edit rincian"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="admin-icon-btn is-danger"
                        title="Hapus rincian"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <strong>Total {activeTab} Desa</strong>
                </td>
                <td className="text-right">
                  <strong>{formatRupiah(tabTotalAnggaran)}</strong>
                </td>
                <td className="text-right text-success-strong">
                  <strong>{formatRupiah(tabTotalRealisasi)}</strong>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Tambah/Edit Rincian */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <form
            onSubmit={handleSaveRincian}
            onClick={(e) => e.stopPropagation()}
            className="admin-modal"
          >
            <div className="admin-drawer-head">
              <h3>{editingItem ? 'Edit Rincian APBDes' : 'Tambah Rincian APBDes'}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="admin-icon-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-field-row-2">
                <div className="admin-field">
                  <label>Jenis Pos *</label>
                  <select
                    value={formModal.jenis}
                    onChange={(e) => setFormModal((p) => ({ ...p, jenis: e.target.value }))}
                  >
                    <option value="Belanja">Belanja Desa</option>
                    <option value="Pendapatan">Pendapatan Desa</option>
                    <option value="Pembiayaan">Pembiayaan Desa</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Kode Bidang *</label>
                  <input
                    type="text"
                    required
                    value={formModal.kode}
                    onChange={(e) => setFormModal((p) => ({ ...p, kode: e.target.value }))}
                    placeholder="Contoh: 06"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Uraian Bidang / Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={formModal.uraian}
                  onChange={(e) => setFormModal((p) => ({ ...p, uraian: e.target.value }))}
                  placeholder="Nama bidang atau pos anggaran"
                />
              </div>

              <div className="admin-field">
                <label>Sub-Keterangan</label>
                <input
                  type="text"
                  value={formModal.keterangan}
                  onChange={(e) => setFormModal((p) => ({ ...p, keterangan: e.target.value }))}
                  placeholder="Rincian penggunaan dana"
                />
              </div>

              <div className="admin-field-row-2">
                <div className="admin-field">
                  <label>Pagu Anggaran (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formModal.anggaran}
                    onChange={(e) => setFormModal((p) => ({ ...p, anggaran: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label>Realisasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formModal.realisasi}
                    onChange={(e) => setFormModal((p) => ({ ...p, realisasi: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="admin-drawer-foot">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-admin-outline"
              >
                Batal
              </button>
              <button type="submit" className="btn-admin-primary">
                Simpan Rincian
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}