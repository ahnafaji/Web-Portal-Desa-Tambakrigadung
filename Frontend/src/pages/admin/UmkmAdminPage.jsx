import { useMemo, useState } from "react";
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
  Store,
  Clock,
  Layers,
  Check,
} from "lucide-react";
import "../../styles/admin.css";

const STORAGE_UMKM_KEY = "tambakrigadung_admin_umkm_v1";

const DEFAULT_UMKM_LIST = [
  {
    id: "umkm-1",
    namaUsaha: "Keripik Ikan Tambak Bu Siti",
    pemilik: "Siti Aminah",
    telepon: "0812-4567-8910",
    kategori: "Pangan & Kudapan",
    jamOperasional: "Senin - Sabtu, 08.00 - 17.00 WIB",
    rentangHarga: "Rp 15.000 – Rp 35.000",
    lokasi: "Dusun Tambakboyo, RT 03 / RW 02",
    mapsUrl: "https://maps.google.com/?q=Tambakrigadung+Tikung+Lamongan",
    status: "menunggu",
    sumber: "Pendaftaran Mandiri",
    tanggalMasuk: "Masuk 23 Nov 2026, 14.29",
    deskripsi:
      "Olahan keripik renyah dari hasil budidaya ikan tambak air tawar segar khas Tambakrigadung. Diproduksi secara higienis tanpa bahan pengawet dengan resep rempah tradisional warga. Telah memiliki izin edar P-IRT dan kemasan kedap udara ziplock siap kirim keluar kota.",
    fotos: ["/images/potensi-tambak.jpg", "/images/hero-1.jpg"],
  },
  {
    id: "umkm-2",
    namaUsaha: "Madu Hutan Klanceng Pak Joko",
    pemilik: "Joko Widodo",
    telepon: "0857-3312-9081",
    kategori: "Hasil Ternak & Tani",
    jamOperasional: "Setiap Hari, 07.00 - 18.00 WIB",
    rentangHarga: "Rp 45.000 – Rp 120.000",
    lokasi: "Dusun Rigadung, RT 01 / RW 01",
    mapsUrl: "https://maps.google.com/?q=Tambakrigadung+Tikung+Lamongan",
    status: "menunggu",
    sumber: "Pendaftaran Mandiri",
    tanggalMasuk: "Masuk 22 Nov 2026, 10.15",
    deskripsi:
      "Madu murni lebah klanceng (trigona) hasil budidaya pekarangan warga Desa Tambakrigadung dengan cita rasa asam-manis alami dan kaya propolis.",
    fotos: ["/images/potensi-domba.jpg", "/images/potensi-wisata.jpg"],
  },
  {
    id: "umkm-3",
    namaUsaha: "Kerajinan Tas Anyaman Eceng",
    pemilik: "Suparti",
    telepon: "0813-9821-4410",
    kategori: "Kriya & Anyaman",
    jamOperasional: "Senin - Jumat, 08.00 - 16.00 WIB",
    rentangHarga: "Rp 35.000 – Rp 95.000",
    lokasi: "Dusun Tambakrigadung, RT 02 / RW 03",
    mapsUrl: "https://maps.google.com/?q=Tambakrigadung+Tikung+Lamongan",
    status: "aktif",
    sumber: "Kurasi Desa",
    tanggalMasuk: "Terdaftar 12 Okt 2026",
    deskripsi:
      "Kerajinan tangan tas belanja, keranjang, dan dekorasi rumah berbahan serat alam anyaman rapi karya kelompok ibu-ibu PKK Tambakrigadung.",
    fotos: ["/images/potensi-wisata.jpg", "/images/hero-3.jpg"],
  },
  {
    id: "umkm-4",
    namaUsaha: "Ayam Geprek Korek Slamet",
    pemilik: "Slamet Riadi",
    telepon: "0821-7745-1209",
    kategori: "Kuliner Siap Saji",
    jamOperasional: "Setiap Hari, 10.00 - 21.00 WIB",
    rentangHarga: "Rp 12.000 – Rp 22.000",
    lokasi: "Jl. Poros Desa Tambakrigadung",
    mapsUrl: "https://maps.google.com/?q=Tambakrigadung+Tikung+Lamongan",
    status: "aktif",
    sumber: "Kurasi Desa",
    tanggalMasuk: "Terdaftar 03 Okt 2026",
    deskripsi:
      "Kuliner ayam geprek sambal korek bawang segar dengan pilihan tingkat kepedasan dan paket nasi kotak untuk acara warga.",
    fotos: ["/images/hero-1.jpg", "/images/potensi-tambak.jpg"],
  },
];

const STATUS_BADGE = {
  menunggu: { label: "● Menunggu", cls: "adm-badge--amber" },
  aktif: { label: "● Aktif", cls: "adm-badge--green" },
  ditolak: { label: "● Ditolak", cls: "adm-badge--red" },
};

export default function UmkmAdminPage() {
  const [umkmList, setUmkmList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UMKM_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_UMKM_LIST;
    } catch {
      return DEFAULT_UMKM_LIST;
    }
  });

  const [filterStatus, setFilterStatus] = useState("semua");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const selectedItem = useMemo(
    () => umkmList.find((u) => u.id === selectedId) || null,
    [umkmList, selectedId]
  );

  const counts = useMemo(() => {
    return {
      semua: umkmList.length,
      menunggu: umkmList.filter((u) => u.status === "menunggu").length,
      aktif: umkmList.filter((u) => u.status === "aktif").length,
      ditolak: umkmList.filter((u) => u.status === "ditolak").length,
      sektor: new Set(umkmList.map((u) => u.kategori)).size,
    };
  }, [umkmList]);

  const filteredList = useMemo(() => {
    return umkmList.filter((item) => {
      const matchStatus = filterStatus === "semua" || item.status === filterStatus;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.namaUsaha.toLowerCase().includes(q) ||
        item.pemilik.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [umkmList, filterStatus, query]);

  const updateStatus = (id, newStatus) => {
    const updated = umkmList.map((u) => (u.id === id ? { ...u, status: newStatus } : u));
    setUmkmList(updated);
    localStorage.setItem(STORAGE_UMKM_KEY, JSON.stringify(updated));
    showToast(
      newStatus === "aktif"
        ? "UMKM disetujui dan langsung tayang di katalog publik."
        : "Pengajuan UMKM ditolak."
    );
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Hapus "${item.namaUsaha}" secara permanen?`)) return;
    const updated = umkmList.filter((u) => u.id !== item.id);
    setUmkmList(updated);
    localStorage.setItem(STORAGE_UMKM_KEY, JSON.stringify(updated));
    if (selectedId === item.id) setSelectedId(null);
    showToast("Data UMKM berhasil dihapus.");
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

      {toast && (
        <div className="adm-badge adm-badge--green" role="status" style={{ padding: "10px 14px", borderRadius: 10 }}>
          <Check size={15} /> {toast}
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
                const st = STATUS_BADGE[item.status] || STATUS_BADGE.menunggu;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong style={{ display: "block", color: "#1c241f" }}>{item.namaUsaha}</strong>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{item.lokasi}</span>
                    </td>
                    <td>{item.pemilik}</td>
                    <td>
                      <span className="adm-badge adm-badge--green">{item.kategori}</span>
                    </td>
                    <td>
                      <span className={`adm-badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td
                      style={{ textAlign: "right" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className="adm-btn adm-btn--outline"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                      >
                        <Eye size={14} /> Tinjau
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedItem && (
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
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>●</span> Pengajuan Warga •{" "}
                  {selectedItem.tanggalMasuk}
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
                  <span className={`adm-badge ${(STATUS_BADGE[selectedItem.status] || STATUS_BADGE.menunggu).cls}`}>
                    {(STATUS_BADGE[selectedItem.status] || STATUS_BADGE.menunggu).label}
                  </span>
                </div>

                <div className="adm-verify-actions">
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedItem.id, "aktif")}
                    className="adm-btn adm-btn--primary"
                  >
                    <CheckCircle2 size={15} /> Setujui &amp; Tayangkan
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedItem.id, "ditolak")}
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
                  <span className="adm-badge adm-badge--green">{selectedItem.sumber}</span>
                </div>

                <div className="adm-kv-list">
                  <div className="adm-kv-row">
                    <span>Nama Usaha</span>
                    <strong>{selectedItem.namaUsaha}</strong>
                  </div>
                  <div className="adm-kv-row">
                    <span>Nama Pemilik</span>
                    <strong>{selectedItem.pemilik}</strong>
                  </div>
                  <div className="adm-kv-row">
                    <span>WhatsApp / Telepon</span>
                    <a
                      href={`https://wa.me/62${selectedItem.telepon.replace(/\D/g, "").replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2f704b", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      <Phone size={13} /> {selectedItem.telepon}
                    </a>
                  </div>
                  <div className="adm-kv-row">
                    <span>Kategori Usaha</span>
                    <span className="adm-badge adm-badge--green">{selectedItem.kategori}</span>
                  </div>
                  <div className="adm-kv-row">
                    <span>Jam Operasional</span>
                    <strong>{selectedItem.jamOperasional}</strong>
                  </div>
                  <div className="adm-kv-row">
                    <span>Rentang Harga</span>
                    <strong style={{ color: "#2f704b" }}>{selectedItem.rentangHarga}</strong>
                  </div>
                  <div className="adm-kv-row" style={{ borderBottom: 0 }}>
                    <span>Lokasi / Dusun</span>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ display: "block" }}>{selectedItem.lokasi}</strong>
                      <a
                        href={selectedItem.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "#2f704b", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 3 }}
                      >
                        <MapPin size={12} /> Buka Lokasi di Maps <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569", marginBottom: 8 }}>
                  DESKRIPSI USAHA &amp; PRODUK UNGGULAN
                </span>
                <div className="adm-desc-quote">{selectedItem.deskripsi}</div>
              </div>

              <div>
                <div className="adm-card__head" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#475569" }}>
                    FOTO PRODUK TERLAMPIR ({selectedItem.fotos?.length || 0} FOTO)
                  </span>
                  <span style={{ fontSize: 11.5, color: "#64748b" }}>Terverifikasi Asli</span>
                </div>
                <div className="adm-photo-pair">
                  {(selectedItem.fotos || []).map((src, idx) => (
                    <img key={idx} src={src} alt={`${selectedItem.namaUsaha} ${idx + 1}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-drawer__foot">
              <button
                type="button"
                onClick={() => handleDelete(selectedItem)}
                className="adm-btn adm-btn--ghost-danger"
              >
                <Trash2 size={14} /> Hapus UMKM
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="adm-btn adm-btn--outline"
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