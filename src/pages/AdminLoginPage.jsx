import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Landmark, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck,
} from "lucide-react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PANEL_STATS = [
  { value: "100%", label: "Transparansi APBD" },
  { value: "54+", label: "Warta & Berita Terbit" },
  { value: "24 Jam", label: "Layanan Pengaduan" },
];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@tambakrigadung.desa.id");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotInfo, setForgotInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Silakan masukkan email/username dan kata sandi operator desa.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.loginAdmin({ email, password });
      login({ ...res.user, token: res.token }, remember);
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk ke dashboard. Periksa kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Kolom Kiri: Form Login */}
      <section className="admin-login-left" aria-labelledby="login-heading">
        <header className="admin-login-topbar">
          <Link to="/" className="admin-login-brand">
            <span className="admin-login-brand__icon">
              <Landmark size={17} aria-hidden="true" />
            </span>
            <div>
              <small>PORTAL RESMI</small>
              <strong>Desa Tambakrigadung</strong>
            </div>
          </Link>

          <span className="admin-version-pill">
            <span className="admin-version-pill__dot" aria-hidden="true" />
            v1.0 Stabil
          </span>
        </header>

        <div className="admin-login-form-wrap">
          <span className="admin-auth-badge">
            <Lock size={12} aria-hidden="true" /> AUTENTIKASI TERENKRIPSI
          </span>

          <h1 id="login-heading" className="text-heading-lg admin-login-title">
            Masuk ke Dashboard
          </h1>
          <p className="admin-login-subtitle">
            Gunakan akun operator resmi pemerintah desa untuk mengelola modul informasi publik.
          </p>

          {errorMsg && (
            <div className="form-alert" role="alert">
              {errorMsg}
            </div>
          )}

          {forgotInfo && (
            <div className="admin-info-box" role="status">
              Untuk pengaturan ulang kata sandi akun operator, silakan hubungi{" "}
              <strong>Sekretaris Desa / Admin Sistem</strong> di Kantor Balai Desa Tambakrigadung.
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
            <div className="admin-field">
              <label htmlFor="admin-email">EMAIL ATAU USERNAME</label>
              <div className="admin-input-box">
                <Mail size={16} className="admin-input-box__icon" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tambakrigadung.desa.id"
                  required
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">KATA SANDI</label>
              <div className="admin-input-box">
                <Lock size={16} className="admin-input-box__icon" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  className="admin-input-box__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-login-options">
              <label className="admin-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>

              <button
                type="button"
                className="admin-forgot-btn"
                onClick={() => setForgotInfo((prev) => !prev)}
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              className="btn-pill btn-pill--primary admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                "Memverifikasi Akun..."
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <Link to="/" className="admin-back-portal">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Kembali ke Halaman Utama Portal</span>
          </Link>
        </div>
      </section>

      {/* Kolom Kanan: Panel Visual Sistem Informasi Desa */}
      <aside className="admin-login-right" aria-label="Informasi Sistem Desa">
        <div className="admin-login-right__top">
          <span className="admin-sid-pill">
            <span className="admin-sid-pill__dot" aria-hidden="true" />
            Sistem Informasi Desa
          </span>
          <span className="admin-region-tag">KEC. TIKUNG • KAB. LAMONGAN</span>
        </div>

        <div className="admin-login-right__center">
          <span className="admin-shield-box">
            <ShieldCheck size={24} aria-hidden="true" />
          </span>

          <h2 className="text-heading-lg">
            Kelola Informasi Desa Lebih Mudah &amp; Transparan
          </h2>
          <p>
            Platform tata kelola terintegrasi untuk pembaruan potensi desa, verifikasi direktori UMKM warga, pelaporan keuangan APBDes, dan kurasi warta publik Desa Tambakrigadung.
          </p>

          <div className="admin-stat-row">
            {PANEL_STATS.map((st) => (
              <div className="admin-stat-tile" key={st.label}>
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="admin-login-right__foot">
          © 2026 Pemerintah Desa Tambakrigadung. Dikembangkan bersama Mahasiswa Manajemen Informatika UNESA Angkatan 2024 (Kelompok 13).
        </footer>
      </aside>
    </div>
  );
}