import { useState } from "react";
import {
  Users,
  User,
  UserRound,
  ShoppingCart,
  Trophy,
  Landmark,
  UsersRound,
  RotateCcw,
  Check,
  Info,
} from "lucide-react";
import { formatAngka } from "../../utils/format.js";
import "../../styles/admin.css";

const STORAGE_KEY = "tambakrigadung_admin_statistik_v1";

const DEFAULT_STATS = {
  totalJiwa: 2039,
  kepalaKeluarga: 733,
  lakiLaki: 1080,
  perempuan: 939,
  produkUmkm: 14,
  potensiDesa: 11,
  fasilitasDesa: 10,
  aparaturDesa: 44,
};

const PREVIEW_CONFIG = [
  { key: "totalJiwa", label: "Total Jiwa", color: "#2f704b", bg: "#d9ede0", Icon: Users },
  { key: "kepalaKeluarga", label: "Kepala Keluarga", color: "#dc2626", bg: "#fee2e2", Icon: User },
  { key: "lakiLaki", label: "Laki-Laki", color: "#2563eb", bg: "#dbeafe", Icon: UserRound },
  { key: "perempuan", label: "Perempuan", color: "#d946ef", bg: "#fae8ff", Icon: UserRound },
  { key: "produkUmkm", label: "Produk UMKM", color: "#1e293b", bg: "#e2e8f0", Icon: ShoppingCart },
  { key: "potensiDesa", label: "Potensi Desa", color: "#1e293b", bg: "#e2e8f0", Icon: Trophy },
  { key: "fasilitasDesa", label: "Fasilitas Desa", color: "#1e293b", bg: "#e2e8f0", Icon: Landmark },
  { key: "aparaturDesa", label: "Aparatur Desa", color: "#1e293b", bg: "#e2e8f0", Icon: UsersRound },
];

export default function DataKependudukanAdminPage() {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });
  const [savedSnapshot, setSavedSnapshot] = useState(stats);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (key, raw) => {
    const clean = Number(String(raw).replace(/\D/g, "")) || 0;
    setStats((prev) => ({ ...prev, [key]: clean }));
  };

  const handleReset = () => {
    setStats(savedSnapshot);
    setStatusMsg("Nilai dikembalikan ke data tersimpan terakhir.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    setSavedSnapshot(stats);
    setStatusMsg("Data kependudukan & statistik desa berhasil disimpan.");
    setTimeout(() => setStatusMsg(""), 3500);
  };

  return (
    <div className="adm-mod-page">
      <div className="adm-mod-head">
        <div>
          <h1 className="adm-mod-title">Kelola Data Kependudukan &amp; Statistik Desa</h1>
          <p className="adm-mod-subtitle">
            Perbarui angka ringkasan demografi dan statistik desa yang tampil di halaman beranda portal publik.
          </p>
        </div>

        <div className="adm-mod-actions">
          <button type="button" onClick={handleReset} className="adm-btn adm-btn--outline">
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
          <button type="submit" form="form-kependudukan" className="adm-btn adm-btn--primary">
            <Check size={16} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="adm-badge adm-badge--green" role="status" style={{ padding: "10px 14px", borderRadius: 10 }}>
          <Check size={15} /> {statusMsg}
        </div>
      )}

      <section className="adm-card" aria-labelledby="preview-kependudukan-heading">
        <div className="adm-card__head">
          <h2 id="preview-kependudukan-heading" className="adm-card__title">
            Pratinjau Tampilan Beranda
          </h2>
          <span className="adm-badge adm-badge--green">● Live Preview</span>
        </div>

        <div className="adm-stats-preview-grid">
          {PREVIEW_CONFIG.map(({ key, label, color, bg, Icon }) => (
            <div className="adm-stat-tile" key={key}>
              <span className="adm-stat-tile__icon" style={{ background: bg, color }}>
                <Icon size={19} />
              </span>
              <div>
                <p className="adm-stat-tile__val" style={{ color }}>
                  {formatAngka(stats[key])}
                </p>
                <p className="adm-stat-tile__lbl">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <form id="form-kependudukan" onSubmit={handleSave} className="adm-card">
        <h2 className="adm-card__title">Ubah Angka Statistik</h2>

        <p className="adm-stats-group-label">DEMOGRAFI PENDUDUK</p>
        <div className="adm-stats-form-grid">
          <div className="adm-field">
            <label htmlFor="stat-total-jiwa">Total Jiwa</label>
            <div className="adm-input-icon-wrap">
              <Users size={16} color="#2f704b" />
              <input
                id="stat-total-jiwa"
                type="number"
                min="0"
                value={stats.totalJiwa}
                onChange={(e) => handleChange("totalJiwa", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-kk">Kepala Keluarga</label>
            <div className="adm-input-icon-wrap">
              <User size={16} color="#dc2626" />
              <input
                id="stat-kk"
                type="number"
                min="0"
                value={stats.kepalaKeluarga}
                onChange={(e) => handleChange("kepalaKeluarga", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-laki">Laki-Laki</label>
            <div className="adm-input-icon-wrap">
              <UserRound size={16} color="#2563eb" />
              <input
                id="stat-laki"
                type="number"
                min="0"
                value={stats.lakiLaki}
                onChange={(e) => handleChange("lakiLaki", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-perempuan">Perempuan</label>
            <div className="adm-input-icon-wrap">
              <UserRound size={16} color="#d946ef" />
              <input
                id="stat-perempuan"
                type="number"
                min="0"
                value={stats.perempuan}
                onChange={(e) => handleChange("perempuan", e.target.value)}
              />
            </div>
          </div>
        </div>

        <p className="adm-stats-group-label">STATISTIK POTENSI &amp; KELEMBAGAAN</p>
        <div className="adm-stats-form-grid">
          <div className="adm-field">
            <label htmlFor="stat-umkm">Produk UMKM</label>
            <div className="adm-input-icon-wrap">
              <ShoppingCart size={16} color="#334155" />
              <input
                id="stat-umkm"
                type="number"
                min="0"
                value={stats.produkUmkm}
                onChange={(e) => handleChange("produkUmkm", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-potensi">Potensi Desa</label>
            <div className="adm-input-icon-wrap">
              <Trophy size={16} color="#334155" />
              <input
                id="stat-potensi"
                type="number"
                min="0"
                value={stats.potensiDesa}
                onChange={(e) => handleChange("potensiDesa", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-fasilitas">Fasilitas Desa</label>
            <div className="adm-input-icon-wrap">
              <Landmark size={16} color="#334155" />
              <input
                id="stat-fasilitas"
                type="number"
                min="0"
                value={stats.fasilitasDesa}
                onChange={(e) => handleChange("fasilitasDesa", e.target.value)}
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="stat-aparatur">Aparatur Desa</label>
            <div className="adm-input-icon-wrap">
              <UsersRound size={16} color="#334155" />
              <input
                id="stat-aparatur"
                type="number"
                min="0"
                value={stats.aparaturDesa}
                onChange={(e) => handleChange("aparaturDesa", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="adm-mod-note">
          <Info size={15} />
          <span>Perubahan angka akan langsung disinkronkan ke halaman Beranda publik setelah disimpan.</span>
        </div>
      </form>
    </div>
  );
}