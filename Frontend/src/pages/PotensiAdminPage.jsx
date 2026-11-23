import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Leaf,
  Layers,
  Save,
  Check,
  X,
} from "lucide-react";
import "../styles/admin.css";

const STORAGE_POTENSI_KEY = "tambakrigadung_admin_potensi_v1";
const STORAGE_ANGKA_KEY = "tambakrigadung_admin_potensi_angka_v1";

const DEFAULT_POTENSI = [
  {
    id: "pot-1",
    kategoriKey: "wisata",
    kategoriLabel: "Wisata Alam & Budaya",
    nama: "Wisata Boyo Sirno: Destinasi Rekreasi Desa Tambakrigadung",
    lokasi: "Desa Tambakrigadung, Kec. Tikung",
    deskripsi:
      "Destinasi rekreasi alam dan budaya yang dikelola bersama masyarakat sebagai ruang wisata keluarga dan penggerak ekonomi lokal.",
    image: "/images/potensi-wisata.jpg",
    tag1: "Anggaran APBDes 2026: Rp15.000.000",
    tag2: "Jarak: ± 2 km ke Kab. Lamongan",
  },
  {
    id: "pot-2",
    kategoriKey: "perikanan",
    kategoriLabel: "Perikanan & Budidaya",
    nama: "Budidaya Ikan Air Tawar: Tambak Khas Lamongan",
    lokasi: "Desa Tambakrigadung, Kec. Tikung",
    deskripsi:
      "Sentra budidaya perikanan air tawar unggulan warga yang memasok kebutuhan ikan konsumsi segar bagi pasar lokal dan regional.",
    image: "/images/potensi-tambak.jpg",
    tag1: "Komoditas: Lele, Nila, Bandeng",
    tag2: "Dukungan 2026: Saluran air Dusun Tambakboyo",
  },
  {
    id: "pot-3",
    kategoriKey: "peternakan",
    kategoriLabel: "Peternakan Terintegrasi",
    nama: "Peternakan Domba Kolektif BUMDes Tambakrigadung",
    lokasi: "Desa Tambakrigadung, Kec. Tikung",
    deskripsi:
      "Unit usaha peternakan domba kolektif yang dikelola BUMDes untuk memperkuat ketahanan ekonomi dan pemberdayaan warga desa.",
    image: "/images/potensi-domba.jpg",
    tag1: "Komoditas: Domba & kambing",
    tag2: "Pengelola: BUMDes Tambakrigadung",
  },
];

const DEFAULT_ANGKA = [
  { id: "luas", label: "LUAS WILAYAH", value: "421 Ha", sub: "4,21 km² • 7,38% luas Kec. Tikung" },
  { id: "penduduk", label: "PENDUDUK", value: "6.644 Jiwa", sub: "13,95% penduduk Kec. Tikung" },
  { id: "warung", label: "WARUNG & TOKO", value: "45 Unit", sub: "20 warung makan-minum + 25 toko" },
  { id: "belanja", label: "BELANJA PEMBANGUNAN", value: "Rp227,3 jt", sub: "24,5% dari total belanja APBDes" },
];

const FILTER_TABS = [
  { key: "semua", label: "Semua Potensi" },
  { key: "wisata", label: "Wisata & Rekreasi" },
  { key: "perikanan", label: "Perikanan & Tambak" },
  { key: "peternakan", label: "Peternakan" },
];

const KATEGORI_OPTIONS = [
  { key: "wisata", label: "Wisata Alam & Budaya" },
  { key: "perikanan", label: "Perikanan & Budidaya" },
  { key: "peternakan", label: "Peternakan Terintegrasi" },
];

export default function PotensiAdminPage() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POTENSI_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_POTENSI;
    } catch {
      return DEFAULT_POTENSI;
    }
  });

  const [angkaList, setAngkaList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANGKA_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ANGKA;
    } catch {
      return DEFAULT_ANGKA;
    }
  });

  const [aktifFilter, setAktifFilter] = useState("semua");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState({
    nama: "",
    kategoriKey: "wisata",
    lokasi: "Desa Tambakrigadung, Kec. Tikung",
    deskripsi: "",
    image: "/images/potensi-wisata.jpg",
    tag1: "",
    tag2: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = aktifFilter === "semua" || item.kategoriKey === aktifFilter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [items, aktifFilter, query]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      nama: "",
      kategoriKey: "wisata",
      lokasi: "Desa Tambakrigadung, Kec. Tikung",
      deskripsi: "",
      image: "/images/potensi-wisata.jpg",
      tag1: "",
      tag2: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      nama: item.nama,
      kategoriKey: item.kategoriKey,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      image: item.image,
      tag1: item.tag1 || "",
      tag2: item.tag2 || "",
    });
    setModalOpen(true);
  };

  const handleSavePotensi = (e) => {
    e.preventDefault();
    if (!formState.nama.trim()) return;
    const katObj = KATEGORI_OPTIONS.find((k) => k.key === formState.kategoriKey) || KATEGORI_OPTIONS[0];

    let updated;
    if (editingItem) {
      updated = items.map((it) =>
        it.id === editingItem.id
          ? { ...it, ...formState, kategoriLabel: katObj.label }
          : it
      );
      showToast("Potensi desa berhasil diperbarui.");
    } else {
      const newItem = {
        id: `pot-${Date.now()}`,
        ...formState,
        kategoriLabel: katObj.label,
      };
      updated = [newItem, ...items];
      showToast("Potensi unggulan baru berhasil ditambahkan.");
    }

    setItems(updated);
    localStorage.setItem(STORAGE_POTENSI_KEY, JSON.stringify(updated));
    setModalOpen(false);
  };

  const handleDeletePotensi = (item) => {
    if (!window.confirm(`Hapus "${item.nama}" dari daftar potensi desa?`)) return;
    const updated = items.filter((it) => it.id !== item.id);
    setItems(updated);
    localStorage.setItem(STORAGE_POTENSI_KEY, JSON.stringify(updated));
    showToast("Potensi desa dihapus.");
  };

  const handleAngkaChange = (id, field, val) => {
    setAngkaList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleSaveAngka = () => {
    localStorage.setItem(STORAGE_ANGKA_KEY, JSON.stringify(angkaList));
    showToast("Ringkasan Potensi Desa dalam Angka berhasil disimpan.");
  };

  const jumlahSektor = new Set(items.map((i) => i.kategoriKey)).size;

  return (
    <div className="adm-mod-page">
      <div className="adm-mod-head">
        <div>
          <h1 className="adm-mod-title">Kelola Potensi Unggulan Desa</h1>
          <p className="adm-mod-subtitle">
            Atur daftar potensi wisata, perikanan, peternakan, serta ringkasan data potensi desa dalam angka.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className="adm-btn adm-btn--primary">
          <Plus size={16} />
          <span>Tambah Potensi</span>
        </button>
      </div>

      {toast && (
        <div className="adm-badge adm-badge--green" role="status" style={{ padding: "10px 14px", borderRadius: 10 }}>
          <Check size={15} /> {toast}
        </div>
      )}

      {/* 3 KPI Summary Cards */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">TOTAL POTENSI AKTIF</span>
            <p className="adm-kpi-card__value">{items.length} Bidang</p>
            <span className="adm-kpi-card__sub">Tayang di halaman utama &amp; potensi</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <Leaf size={18} />
          </span>
        </div>

        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">KATEGORI TERDAFTAR</span>
            <p className="adm-kpi-card__value">{jumlahSektor} Sektor</p>
            <span className="adm-kpi-card__sub">Wisata, Perikanan, Peternakan</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#e2e8f0", color: "#1e293b" }}>
            <Layers size={18} />
          </span>
        </div>

        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">SUMBER DATA ANGKA</span>
            <p className="adm-kpi-card__value" style={{ fontSize: 19 }}>BPS &amp; APBDes 2026</p>
            <span className="adm-kpi-card__sub">{angkaList.length} indikator wilayah aktif</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#f1f5f9", color: "#64748b" }} />
        </div>
      </div>

      {/* Toolbar Pencarian & Filter */}
      <div className="adm-toolbar">
        <div className="adm-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama potensi atau lokasi..."
          />
        </div>

        <div className="adm-filter-pills" role="tablist" aria-label="Filter sektor potensi">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={aktifFilter === tab.key}
              onClick={() => setAktifFilter(tab.key)}
              className={`adm-pill-tab${aktifFilter === tab.key ? " is-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kartu Potensi */}
      <div className="adm-potensi-grid">
        {filteredItems.map((item) => (
          <article className="adm-potensi-card" key={item.id}>
            <div className="adm-potensi-card__media">
              <span className="adm-potensi-card__cat">{item.kategoriLabel}</span>
              <img src={item.image} alt={item.nama} />
            </div>

            <div className="adm-potensi-card__body">
              <h3 className="adm-potensi-card__title">{item.nama}</h3>
              <span className="adm-potensi-card__loc">
                <MapPin size={13} /> {item.lokasi}
              </span>
              <p className="adm-potensi-card__desc">{item.deskripsi}</p>

              <div className="adm-potensi-card__tags">
                {item.tag1 && <div className="adm-potensi-tag">{item.tag1}</div>}
                {item.tag2 && <div className="adm-potensi-tag">{item.tag2}</div>}
              </div>

              <div className="adm-potensi-card__foot">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="adm-btn adm-btn--ghost"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePotensi(item)}
                  className="adm-btn adm-btn--ghost-danger"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Potensi Desa dalam Angka */}
      <section className="adm-card" aria-labelledby="potensi-angka-heading">
        <div className="adm-card__head">
          <div className="adm-mod-title-row">
            <h2 id="potensi-angka-heading" className="adm-card__title">
              Potensi Desa dalam Angka
            </h2>
            <span className="adm-badge adm-badge--green">Data BPS 2023 &amp; APBDes 2026</span>
          </div>

          <button type="button" onClick={handleSaveAngka} className="adm-btn adm-btn--primary">
            <Save size={15} />
            <span>Simpan Angka</span>
          </button>
        </div>

        <div className="adm-angka-grid">
          {angkaList.map((row) => (
            <div className="adm-angka-tile" key={row.id}>
              <span className="adm-angka-tile__lbl">{row.label}</span>
              <input
                type="text"
                className="adm-angka-tile__val-input"
                value={row.value}
                onChange={(e) => handleAngkaChange(row.id, "value", e.target.value)}
                aria-label={`Nilai ${row.label}`}
              />
              <input
                type="text"
                className="adm-angka-tile__sub-input"
                value={row.sub}
                onChange={(e) => handleAngkaChange(row.id, "sub", e.target.value)}
                aria-label={`Keterangan ${row.label}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal Tambah / Edit Potensi */}
      {modalOpen && (
        <div className="adm-overlay adm-overlay--center" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-card__head">
              <h3 className="adm-card__title">
                {editingItem ? "Edit Potensi Desa" : "Tambah Potensi Desa Baru"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="adm-btn adm-btn--ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePotensi} className="adm-form-stack">
              <div className="adm-field">
                <label>Judul Potensi Unggulan</label>
                <input
                  type="text"
                  required
                  value={formState.nama}
                  onChange={(e) => setFormState({ ...formState, nama: e.target.value })}
                  placeholder="Contoh: Wisata Boyo Sirno Desa Tambakrigadung"
                />
              </div>

              <div className="adm-field">
                <label>Sektor Kategori</label>
                <select
                  value={formState.kategoriKey}
                  onChange={(e) => setFormState({ ...formState, kategoriKey: e.target.value })}
                >
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adm-field">
                <label>Lokasi</label>
                <input
                  type="text"
                  value={formState.lokasi}
                  onChange={(e) => setFormState({ ...formState, lokasi: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label>Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  required
                  value={formState.deskripsi}
                  onChange={(e) => setFormState({ ...formState, deskripsi: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label>Path Gambar (contoh: /images/potensi-wisata.jpg)</label>
                <input
                  type="text"
                  value={formState.image}
                  onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label>Info Sorotan 1 (Anggaran / Komoditas)</label>
                <input
                  type="text"
                  value={formState.tag1}
                  onChange={(e) => setFormState({ ...formState, tag1: e.target.value })}
                  placeholder="Komoditas: Lele, Nila, Bandeng"
                />
              </div>

              <div className="adm-field">
                <label>Info Sorotan 2 (Pengelola / Dukungan)</label>
                <input
                  type="text"
                  value={formState.tag2}
                  onChange={(e) => setFormState({ ...formState, tag2: e.target.value })}
                  placeholder="Pengelola: BUMDes Tambakrigadung"
                />
              </div>

              <div className="adm-mod-actions" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" onClick={() => setModalOpen(false)} className="adm-btn adm-btn--outline">
                  Batal
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  <Save size={15} /> Simpan Potensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}