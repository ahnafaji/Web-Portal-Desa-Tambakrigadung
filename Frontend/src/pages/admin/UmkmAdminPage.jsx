import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  ExternalLink,
  Trash2,
  X,
  Eye,
  Pencil,
  Store,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import "../../styles/admin.css";

const STATUS_BADGE = {
  menunggu: { label: "● Menunggu", cls: "adm-badge--amber" },
  aktif: { label: "● Aktif", cls: "adm-badge--green" },
  ditolak: { label: "● Ditolak", cls: "adm-badge--red" },
};

const normalizeStatusKey = (item) => {
  const raw = String(item?.rawStatus || item?.status || "").toUpperCase();
  if (raw === "APPROVED" || raw === "AKTIF") return "aktif";
  if (raw === "REJECTED" || raw === "DITOLAK") return "ditolak";
  return "menunggu";
};

const resolveImageSrc = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  return `${base}${cleanPath}`;
};

const buildWaHref = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "#";
  if (digits.startsWith("62")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/62${digits.slice(1)}`;
  return `https://wa.me/62${digits}`;
};

export default function UmkmAdminPage() {
  const toast = useAdminToast();

  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [filterStatus, setFilterStatus] = useState("semua");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Modal konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPageError("");

    adminApi
      .getUmkm()
      .then((res) => {
        if (!active) return;
        setUmkmList(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        if (active) setPageError(err.message || "Gagal memuat data UMKM dari server.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedItem = useMemo(
    () => umkmList.find((u) => u.id === selectedId) || null,
    [umkmList, selectedId]
  );

  const counts = useMemo(() => {
    return {
      semua: umkmList.length,
      menunggu: umkmList.filter((u) => normalizeStatusKey(u) === "menunggu").length,
      aktif: umkmList.filter((u) => normalizeStatusKey(u) === "aktif").length,
      ditolak: umkmList.filter((u) => normalizeStatusKey(u) === "ditolak").length,
      sektor: new Set(umkmList.map((u) => u.kategoriLabel || u.kategori).filter(Boolean)).size,
    };
  }, [umkmList]);

  const filteredList = useMemo(() => {
    return umkmList.filter((item) => {
      const statusKey = normalizeStatusKey(item);
      const matchStatus = filterStatus === "semua" || statusKey === filterStatus;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        String(item.namaUsaha || item.nama || "").toLowerCase().includes(q) ||
        String(item.pemilik || "").toLowerCase().includes(q) ||
        String(item.kategoriLabel || item.kategori || "").toLowerCase().includes(q) ||
        String(item.alamat || item.dusun || "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [umkmList, filterStatus, query]);

  const handleUpdateStatus = async (item, nextStatus) => {
    setUpdatingId(item.id);
    try {
      const updated = await adminApi.updateUmkmStatus(item.id, nextStatus);
      setUmkmList((prev) => prev.map((u) => (u.id === item.id ? { ...u, ...updated } : u)));
      toast.success(
        nextStatus === "Aktif"
          ? `"${item.namaUsaha || item.nama}" disetujui dan langsung tayang di katalog publik.`
          : `Pengajuan "${item.namaUsaha || item.nama}" ditolak.`,
        nextStatus === "Aktif" ? "UMKM Disetujui" : "UMKM Ditolak"
      );
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status UMKM.", "Gagal Memperbarui");
    } finally {
      setUpdatingId(null);
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const title = deleteTarget.namaUsaha || deleteTarget.nama;
      await adminApi.deleteUmkm(deleteTarget.id);
      setUmkmList((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setDeleteTarget(null);
      toast.success(`Data UMKM "${title}" berhasil dihapus.`, "UMKM Dihapus");
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus data UMKM.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="adm-mod-page">
      <div className="adm-mod-head">
        <div>
          <div className="adm-mod-title-row">
            <h1 className="adm-mod-title">Daftar &amp; Pengajuan UMKM Desa</h1>
            <span className="adm-badge adm-badge--green">{counts.semua} Terdaftar</span>
          </div>
          <p className="adm-mod-subtitle">
            Kelola katalog UMKM dan tinjau pendaftaran usaha baru dari warga secara transparan.
          </p>
        </div>

        <Link to="/admin/umkm/tambah" className="adm-btn adm-btn--primary">
          <Plus size={16} />
          <span>Tambah UMKM</span>
        </Link>
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

      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">MENUNGGU TINJAUAN</span>
            <p className="adm-kpi-card__value">{counts.menunggu}</p>
            <span className="adm-kpi-card__sub">Perlu diverifikasi</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#fef3c7", color: "#92400e" }}>
            <Clock size={18} />
          </span>
        </div>

        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">UMKM AKTIF</span>
            <p className="adm-kpi-card__value">{counts.aktif}</p>
            <span className="adm-kpi-card__sub">Tayang di portal</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <Store size={18} />
          </span>
        </div>

        <div className="adm-kpi-card">
          <div>
            <span className="adm-kpi-card__label">SEKTOR USAHA</span>
            <p className="adm-kpi-card__value">{counts.sektor}</p>
            <span className="adm-kpi-card__sub">Kategori terdaftar</span>
          </div>
          <span className="adm-kpi-card__icon" style={{ background: "#e2e8f0", color: "#1e293b" }}>
            <Layers size={18} />
          </span>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-filter-pills" role="tablist" aria-label="Filter status UMKM">
          <button
            type="button"
            onClick={() => setFilterStatus("semua")}
            className={`adm-pill-tab${filterStatus === "semua" ? " is-active" : ""}`}
          >
            Semua ({counts.semua})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("menunggu")}
            className={`adm-pill-tab${filterStatus === "menunggu" ? " is-active" : ""}`}
          >
            Menunggu Persetujuan ({counts.menunggu})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("aktif")}
            className={`adm-pill-tab${filterStatus === "aktif" ? " is-active" : ""}`}
          >
            Aktif ({counts.aktif})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("ditolak")}
            className={`adm-pill-tab${filterStatus === "ditolak" ? " is-active" : ""}`}
          >
            Ditolak ({counts.ditolak})
          </button>
        </div>

        <div className="adm-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari usaha atau pemilik..."
          />
        </div>
      </div>

      <section className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            Memuat daftar UMKM desa...
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            Belum ada data UMKM yang sesuai dengan filter atau pencarian.
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>USAHA &amp; PRODUK</th>
                  <th>PEMILIK</th>
                  <th>KATEGORI</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const statusKey = normalizeStatusKey(item);
                  const st = STATUS_BADGE[statusKey] || STATUS_BADGE.menunggu;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <strong style={{ display: "block", color: "#1c241f" }}>
                          {item.namaUsaha || item.nama}
                        </strong>
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                          {item.alamat || item.dusun}
                        </span>
                      </td>
                      <td>{item.pemilik}</td>
                      <td>
                        <span className="adm-badge adm-badge--green">
                          {item.kategoriLabel || item.kategori}
                        </span>
                      </td>
                      <td>
                        <span className={`adm-badge ${st.cls}`}>{st.label}</span>
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <Link
                            to={`/admin/umkm/edit/${item.id}`}
                            className="adm-btn adm-btn--outline"
                            style={{ padding: "6px 10px", fontSize: 12 }}
                          >
                            <Pencil size={13} /> Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            className="adm-btn adm-btn--outline"
                            style={{ padding: "6px 12px", fontSize: 12 }}
                          >
                            <Eye size={14} /> Tinjau
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedItem && (() => {
        const selStatusKey = normalizeStatusKey(selectedItem);
        const selBadge = STATUS_BADGE[selStatusKey] || STATUS_BADGE.menunggu;
        const photos =
          Array.isArray(selectedItem.galeri) && selectedItem.galeri.length > 0
            ? selectedItem.galeri
            : selectedItem.foto
              ? [selectedItem.foto]
              : [];
        const fullDesc =
          Array.isArray(selectedItem.deskripsiLengkap) && selectedItem.deskripsiLengkap.length > 0
            ? selectedItem.deskripsiLengkap.join("\n\n")
            : selectedItem.deskripsi || selectedItem.ringkasan || "-";
        const isBusy = updatingId === selectedItem.id;

        return (
          <div className="adm-overlay" onClick={() => setSelectedId(null)}>
            <aside
              className="adm-drawer"
              aria-labelledby="drawer-umkm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="adm-drawer__head">
                <div>
                  <h2 id="drawer-umkm-title" className="adm-card__title" style={{ fontSize: 18 }}>
                    Detail &amp; Tinjau UMKM
                  </h2>
                  <p className="adm-card__desc" style={{ marginTop: 4 }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>●</span>{" "}
                    {selectedItem.tanggal ? `Terdaftar ${selectedItem.tanggal}` : "Data UMKM Desa"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="adm-btn adm-btn--outline"
                  style={{ padding: 7 }}
                  aria-label="Tutup panel"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="adm-drawer__body">
                <div className="adm-verify-box">
                  <div className="adm-card__head" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569" }}>
                      VERIFIKASI PENGAJUAN
                    </span>
                    <span className={`adm-badge ${selBadge.cls}`}>{selBadge.label}</span>
                  </div>

                  <div className="adm-verify-actions">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(selectedItem, "Aktif")}
                      className="adm-btn adm-btn--primary"
                    >
                      <CheckCircle2 size={15} /> {isBusy ? "Memproses..." : "Setujui & Tayangkan"}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleUpdateStatus(selectedItem, "Ditolak")}
                      className="adm-btn adm-btn--danger-soft"
                    >
                      <XCircle size={15} /> Tolak Pengajuan
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: 11.5, color: "#64748b", lineHeight: 1.45 }}>
                    Jika disetujui, usaha ini akan langsung tayang di halaman katalog UMKM publik Desa Tambakrigadung.
                  </p>
                </div>

                <div>
                  <div className="adm-card__head" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569" }}>
                      INFORMASI USAHA &amp; PEMILIK
                    </span>
                    <span className="adm-badge adm-badge--green">
                      {selectedItem.badgeUtama || "Usaha Warga"}
                    </span>
                  </div>

                  <div className="adm-kv-list">
                    <div className="adm-kv-row">
                      <span>Nama Usaha</span>
                      <strong>{selectedItem.namaUsaha || selectedItem.nama}</strong>
                    </div>
                    <div className="adm-kv-row">
                      <span>Nama Pemilik</span>
                      <strong>{selectedItem.pemilik}</strong>
                    </div>
                    <div className="adm-kv-row">
                      <span>WhatsApp / Telepon</span>
                      <a
                        href={buildWaHref(selectedItem.whatsapp || selectedItem.telepon)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2f704b", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}
                      >
                        <Phone size={13} /> {selectedItem.whatsapp || selectedItem.telepon || "-"}
                      </a>
                    </div>
                    <div className="adm-kv-row">
                      <span>Kategori Usaha</span>
                      <span className="adm-badge adm-badge--green">
                        {selectedItem.kategoriLabel || selectedItem.kategori}
                      </span>
                    </div>
                    <div className="adm-kv-row">
                      <span>Jam Operasional</span>
                      <strong>{selectedItem.jamOperasional || "-"}</strong>
                    </div>
                    <div className="adm-kv-row">
                      <span>Rentang Harga</span>
                      <strong style={{ color: "#2f704b" }}>
                        {selectedItem.hargaLabel || selectedItem.hargaMulai || "Harga Menyesuaikan"}
                      </strong>
                    </div>
                    <div className="adm-kv-row" style={{ borderBottom: 0 }}>
                      <span>Lokasi / Dusun</span>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ display: "block" }}>
                          {selectedItem.alamat || selectedItem.dusun}
                        </strong>
                        {selectedItem.mapsUrl && (
                          <a
                            href={selectedItem.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#2f704b", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 3 }}
                          >
                            <MapPin size={12} /> Buka Lokasi di Maps <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569", marginBottom: 8 }}>
                    DESKRIPSI USAHA &amp; PRODUK UNGGULAN
                  </span>
                  <div className="adm-desc-quote" style={{ whiteSpace: "pre-line" }}>
                    {fullDesc}
                  </div>
                </div>

                <div>
                  <div className="adm-card__head" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569" }}>
                      FOTO PRODUK TERLAMPIR ({photos.length} FOTO)
                    </span>
                  </div>
                  <div className="adm-photo-pair">
                    {photos.map((src, idx) => (
                      <img
                        key={idx}
                        src={resolveImageSrc(src)}
                        alt={`${selectedItem.namaUsaha || selectedItem.nama} ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="adm-drawer__foot">
                <button
                  type="button"
                  onClick={() => openDeleteModal(selectedItem)}
                  className="adm-btn adm-btn--ghost-danger"
                >
                  <Trash2 size={14} /> Hapus UMKM
                </button>
                <div style={{ display: "inline-flex", gap: 8 }}>
                  <Link
                    to={`/admin/umkm/edit/${selectedItem.id}`}
                    className="adm-btn adm-btn--outline"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="adm-btn adm-btn--outline"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </aside>
          </div>
        );
      })()}

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Data UMKM?"
        description={
          deleteTarget && (
            <>
              Anda yakin ingin menghapus{" "}
              <strong style={{ color: "#0f172a" }}>
                {deleteTarget.namaUsaha || deleteTarget.nama}
              </strong>{" "}
              secara permanen dari katalog UMKM desa?
            </>
          )
        }
        confirmLabel="Ya, Hapus UMKM"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}