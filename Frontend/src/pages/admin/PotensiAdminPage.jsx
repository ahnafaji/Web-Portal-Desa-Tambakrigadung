import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Leaf,
  Layers,
  Save,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import "../../styles/admin.css";

const FILTER_TABS = [
  { key: "semua", label: "Semua Potensi" },
  { key: "wisata", label: "Wisata & Rekreasi" },
  { key: "perikanan", label: "Perikanan & Tambak" },
  { key: "peternakan", label: "Peternakan" },
];

const KATEGORI_OPTIONS = [
  { key: "wisata", label: "Wisata Alam & Budaya", defaultImage: "/images/potensi-wisata.jpg" },
  { key: "perikanan", label: "Perikanan & Budidaya", defaultImage: "/images/potensi-tambak.jpg" },
  { key: "peternakan", label: "Peternakan Terintegrasi", defaultImage: "/images/potensi-domba.jpg" },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Resolver gambar agar path /images/... bekerja dengan base path Vite maupun URL Supabase
const resolveImageSrc = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  return `${base}${cleanPath}`;
};

export default function PotensiAdminPage() {
  const toast = useAdminToast();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [angkaList, setAngkaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [savingAngka, setSavingAngka] = useState(false);

  const [aktifFilter, setAktifFilter] = useState("semua");
  const [query, setQuery] = useState("");

  // Modal Tambah/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [savingPotensi, setSavingPotensi] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [formState, setFormState] = useState({
    nama: "",
    kategoriKey: "wisata",
    lokasi: "Desa Tambakrigadung, Kec. Tikung",
    deskripsi: "",
    tag1: "",
    tag2: "",
  });

  // Modal Konfirmasi Hapus
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPageError("");

    adminApi
      .getPotensiPage()
      .then((res) => {
        if (!active) return;
        setItems(Array.isArray(res?.items) ? res.items : []);
        const statsItems = Array.isArray(res?.statistik?.items) ? res.statistik.items : [];
        setAngkaList(
          statsItems.map((row) => ({
            id: row.id || row.key,
            key: row.key || row.id,
            label: String(row.label || "").toUpperCase(),
            value: row.value || "",
            sub: row.sub || row.caption || "",
          }))
        );
      })
      .catch((err) => {
        if (active) setPageError(err.message || "Gagal memuat data potensi desa.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = aktifFilter === "semua" || item.kategoriKey === aktifFilter;
      const q = query.trim().toLowerCase();
      const deskStr = Array.isArray(item.deskripsi)
        ? item.deskripsi.join(" ")
        : String(item.deskripsi || "");
      const matchQuery =
        !q ||
        String(item.nama || item.judul || "").toLowerCase().includes(q) ||
        String(item.lokasi || "").toLowerCase().includes(q) ||
        deskStr.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [items, aktifFilter, query]);

  const resetImageState = (initialSrc = "") => {
    setImageFile(null);
    setImagePreview(initialSrc);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      nama: "",
      kategoriKey: "wisata",
      lokasi: "Desa Tambakrigadung, Kec. Tikung",
      deskripsi: "",
      tag1: "",
      tag2: "",
    });
    resetImageState("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      nama: item.nama || item.judul || "",
      kategoriKey: item.kategoriKey || "wisata",
      lokasi: item.lokasi || "Desa Tambakrigadung, Kec. Tikung",
      deskripsi:
        item.deskripsiText ||
        (Array.isArray(item.deskripsi) ? item.deskripsi.join("\n\n") : String(item.deskripsi || "")),
      tag1: item.tag1 || "",
      tag2: item.tag2 || "",
    });
    resetImageState(item.image || "");
    setModalOpen(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Format foto harus berupa JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Ukuran file foto maksimal 5 MB.");
      e.target.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSavePotensi = async (e) => {
    e.preventDefault();
    if (!formState.nama.trim()) return;
    setSavingPotensi(true);

    try {
      const formData = new FormData();
      formData.append("judul", formState.nama.trim());
      formData.append("nama", formState.nama.trim());
      formData.append("kategoriKey", formState.kategoriKey);
      formData.append("lokasi", formState.lokasi.trim());
      formData.append("deskripsi", formState.deskripsi.trim());
      formData.append("tag1", formState.tag1.trim());
      formData.append("tag2", formState.tag2.trim());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingItem) {
        const updated = await adminApi.updatePotensi(editingItem.id, formData);
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
        toast.success(`"${updated.judul}" berhasil diperbarui.`, "Potensi Diperbarui");
      } else {
        const created = await adminApi.createPotensi(formData);
        setItems((prev) => [...prev, created]);
        toast.success(`"${created.judul}" berhasil ditambahkan.`, "Potensi Ditambahkan");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan potensi desa.", "Gagal Menyimpan");
    } finally {
      setSavingPotensi(false);
    }
  };

  const openDeleteModal = (item) => {
    setDeleteError("");
    setDeleteTarget(item);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDeletePotensi = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const targetTitle = deleteTarget.nama || deleteTarget.judul;
      await adminApi.deletePotensi(deleteTarget.id);
      setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(`Potensi "${targetTitle}" berhasil dihapus.`, "Potensi Dihapus");
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus potensi desa.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAngkaChange = (id, field, val) => {
    setAngkaList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleSaveAngka = async () => {
    setSavingAngka(true);
    try {
      await adminApi.updatePotensiAngka(angkaList);
      toast.success(
        "Ringkasan Potensi Desa dalam Angka berhasil disimpan dan tampil di halaman Potensi.",
        "Data Angka Disimpan"
      );
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data potensi dalam angka.", "Gagal Menyimpan");
    } finally {
      setSavingAngka(false);
    }
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

        <button
          type="button"
          disabled={loading}
          onClick={openCreateModal}
          className="adm-btn adm-btn--primary"
        >
          <Plus size={16} />
          <span>Tambah Potensi</span>
        </button>
      </div>

      {pageError && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "0.9rem",
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{pageError}</span>
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
      {loading ? (
        <div className="adm-card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          Memuat daftar potensi unggulan desa...
        </div>
      ) : (
        <div className="adm-potensi-grid">
          {filteredItems.map((item) => {
            const judul = item.nama || item.judul;
            const ringkasan = Array.isArray(item.deskripsi)
              ? item.deskripsi[0] || ""
              : String(item.deskripsi || "");

            return (
              <article className="adm-potensi-card" key={item.id}>
                <div className="adm-potensi-card__media">
                  <span className="adm-potensi-card__cat">{item.kategoriLabel}</span>
                  <img src={resolveImageSrc(item.image)} alt={judul} />
                </div>

                <div className="adm-potensi-card__body">
                  <h3 className="adm-potensi-card__title">{judul}</h3>
                  <span className="adm-potensi-card__loc">
                    <MapPin size={13} /> {item.lokasi}
                  </span>
                  <p className="adm-potensi-card__desc">{ringkasan}</p>

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
                      onClick={() => openDeleteModal(item)}
                      className="adm-btn adm-btn--ghost-danger"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Potensi Desa dalam Angka */}
      <section className="adm-card" aria-labelledby="potensi-angka-heading">
        <div className="adm-card__head">
          <div className="adm-mod-title-row">
            <h2 id="potensi-angka-heading" className="adm-card__title">
              Potensi Desa dalam Angka
            </h2>
            <span className="adm-badge adm-badge--green">Data BPS 2023 &amp; APBDes 2026</span>
          </div>

          <button
            type="button"
            disabled={loading || savingAngka}
            onClick={handleSaveAngka}
            className="adm-btn adm-btn--primary"
          >
            <Save size={15} />
            <span>{savingAngka ? "Menyimpan..." : "Simpan Angka"}</span>
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
        <div
          className="adm-overlay adm-overlay--center"
          onClick={() => !savingPotensi && setModalOpen(false)}
        >
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-card__head">
              <h3 className="adm-card__title">
                {editingItem ? "Edit Potensi Desa" : "Tambah Potensi Desa Baru"}
              </h3>
              <button
                type="button"
                disabled={savingPotensi}
                onClick={() => setModalOpen(false)}
                className="adm-btn adm-btn--ghost"
              >
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
                <label>Deskripsi Potensi (pisahkan paragraf dengan Enter)</label>
                <textarea
                  rows={3}
                  required
                  value={formState.deskripsi}
                  onChange={(e) => setFormState({ ...formState, deskripsi: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label htmlFor="potensi-image-input">Foto Potensi (JPG / PNG / WEBP, Maks. 5 MB)</label>
                <input
                  ref={fileInputRef}
                  id="potensi-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px dashed #cbd5e1",
                    background: "#f8fafc",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={resolveImageSrc(imagePreview)}
                      alt="Pratinjau foto potensi"
                      style={{
                        width: 64,
                        height: 48,
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 48,
                        borderRadius: "8px",
                        background: "#e2e8f0",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Leaf size={20} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="adm-btn adm-btn--outline"
                      style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                    >
                      <Upload size={14} />
                      <span>{imagePreview ? "Ganti Foto" : "Pilih File Foto"}</span>
                    </button>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "0.75rem",
                        color: "#64748b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {imageFile
                        ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)`
                        : imagePreview
                          ? "Foto tersimpan saat ini"
                          : "Opsional — otomatis memakai foto bawaan kategori"}
                    </p>
                  </div>
                </div>

                {imageError && (
                  <span style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: 4 }}>{imageError}</span>
                )}
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
                <button
                  type="button"
                  disabled={savingPotensi}
                  onClick={() => setModalOpen(false)}
                  className="adm-btn adm-btn--outline"
                >
                  Batal
                </button>
                <button type="submit" disabled={savingPotensi} className="adm-btn adm-btn--primary">
                  <Save size={15} /> {savingPotensi ? "Menyimpan..." : "Simpan Potensi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Potensi Desa?"
        description={
          deleteTarget && (
            <>
              Anda yakin ingin menghapus{" "}
              <strong style={{ color: "#0f172a" }}>{deleteTarget.nama || deleteTarget.judul}</strong>{" "}
              dari daftar potensi unggulan desa?
            </>
          )
        }
        confirmLabel="Ya, Hapus Potensi"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDeletePotensi}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}