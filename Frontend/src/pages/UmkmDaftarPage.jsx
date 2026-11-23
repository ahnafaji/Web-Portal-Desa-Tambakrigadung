import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, ChevronRight, BookOpen, MapPin, Upload, X, ShieldCheck, Send,
  Headset, MessageCircle, CheckCircle2, ArrowLeft, AlertCircle, ArrowUp,
} from "lucide-react";
import { api } from "../services/api.js";
import { umkmPage } from "../data/mock.js";
import PanduanModal from "../components/umkm/PanduanModal.jsx";

const KATEGORI_OPTIONS = [
  { value: "pangan", label: "Pangan & Kudapan" },
  { value: "olahan", label: "Olahan Tambak & Madu" },
  { value: "kerajinan", label: "Batik & Kerajinan" },
  { value: "jasa", label: "Fabrikasi & Jasa" },
];

const MAX_FILES = 3;
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UmkmDaftarPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const topErrorRef = useRef(null);

  const [panduanOpen, setPanduanOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorDetails, setErrorDetails] = useState([]);
  const [shortError, setShortError] = useState("");

  const [form, setForm] = useState({
    namaUsaha: "",
    kategori: "",
    namaPemilik: "",
    whatsapp: "",
    jamOperasional: "",
    hargaMin: "",
    hargaMax: "",
    alamat: "",
    mapsUrl: "",
    deskripsi: "",
    setuju: false,
  });

  const [files, setFiles] = useState([]);

  const clearErrors = () => {
    setErrorDetails([]);
    setShortError("");
  };

  const scrollToTopError = () => {
    if (topErrorRef.current) {
      topErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFiles = (incomingList) => {
    clearErrors();
    const incoming = Array.from(incomingList || []);
    if (!incoming.length) return;

    const next = [...files];
    const fileErrors = [];

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        fileErrors.push(`Maksimal hanya dapat melampirkan ${MAX_FILES} foto produk.`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        fileErrors.push(`Format "${file.name}" tidak didukung. Gunakan JPG, JPEG, atau PNG.`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        fileErrors.push(`Ukuran "${file.name}" melebihi batas maksimal 2MB.`);
        continue;
      }
      next.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        preview: URL.createObjectURL(file),
      });
    }

    if (fileErrors.length > 0) {
      setErrorDetails(fileErrors);
      setShortError("Berkas foto tidak valid. Periksa format (JPG/PNG) dan ukuran maksimal 2MB.");
    }
    setFiles(next);
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const validateForm = () => {
    const errors = [];

    if (form.namaUsaha.trim().length < 3) {
      errors.push("Nama usaha wajib diisi (minimal 3 karakter).");
    }
    if (!form.kategori) {
      errors.push("Kategori usaha wajib dipilih.");
    }
    if (form.namaPemilik.trim().length < 3) {
      errors.push("Nama pemilik usaha wajib diisi (minimal 3 karakter).");
    }
    const cleanWa = form.whatsapp.trim();
    if (!/^[0-9+ -]{8,16}$/.test(cleanWa) || cleanWa.replace(/\D/g, "").length < 8) {
      errors.push("Nomor WhatsApp aktif tidak valid (minimal 8 digit angka).");
    }
    if (form.alamat.trim().length < 5) {
      errors.push("Alamat lengkap / lokasi dusun wajib diisi (minimal 5 karakter).");
    }
    if (form.mapsUrl.trim()) {
      try {
        new URL(form.mapsUrl.trim());
      } catch {
        errors.push("Tautan Google Maps tidak valid (harus diawali https://...).");
      }
    }
    if (form.deskripsi.trim().length < 50) {
      errors.push(
        `Deskripsi usaha minimal 50 karakter (saat ini ${form.deskripsi.trim().length} karakter).`
      );
    }
    if (files.length === 0) {
      errors.push("Harap unggah minimal 1 foto produk atau tempat usaha Anda.");
    }
    if (!form.setuju) {
      errors.push("Harap centang pernyataan kebenaran data usaha terlebih dahulu.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorDetails(validationErrors);
      setShortError(
        validationErrors.length === 1
          ? validationErrors[0]
          : `Terdapat ${validationErrors.length} isian yang belum valid. Harap periksa detail di atas sebelum mengirim.`
      );
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, String(v)));
      files.forEach((f) => payload.append("foto", f.file));

      await api.submitUmkm(payload);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err.message || "Terjadi kesalahan saat mengirim formulir.";
      setErrorDetails([msg]);
      setShortError("Pendaftaran gagal dikirim. Periksa kembali isian formulir di atas.");
    } finally {
      setSubmitting(false);
    }
  };

  const waAdminUrl = `https://wa.me/${umkmPage.cta.whatsappAdmin}?text=${encodeURIComponent(
    "Halo Admin Desa Tambakrigadung, saya membutuhkan bantuan terkait pendaftaran UMKM di website desa."
  )}`;

  return (
    <div className="page umkm-daftar-page">
      <div className="container umkm-daftar-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/umkm">UMKM</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">Daftarkan Usaha</span>
        </nav>

        {/* Header */}
        <header className="daftar-head">
          <div>
            <h1 className="text-heading-lg daftar-head__title">Daftarkan Usaha Anda</h1>
            <p className="daftar-head__desc">
              Promosikan produk dan jasa usaha warga di portal resmi Desa Tambakrigadung secara gratis, transparan, dan terpercaya.
            </p>
          </div>
          <button
            type="button"
            className="btn-panduan"
            onClick={() => setPanduanOpen(true)}
          >
            <BookOpen size={15} aria-hidden="true" /> Panduan Pendaftaran
          </button>
        </header>

        {/* Stepper 2 Tahap */}
        <div className="daftar-stepper" aria-label="Tahapan pendaftaran">
          <div className="stepper-node is-active">
            <span className="stepper-node__num">1</span>
            <div>
              <strong>Formulir Mandiri</strong>
              <span>Lengkapi detail &amp; foto</span>
            </div>
          </div>

          <div className={`stepper-line${submitted ? " is-full" : ""}`} aria-hidden="true" />

          <div className={`stepper-node${submitted ? " is-active" : ""}`}>
            <span className="stepper-node__num">2</span>
            <div>
              <strong>Verifikasi Admin</strong>
              <span>1–2 Hari Kerja</span>
            </div>
          </div>
        </div>

        {/* Tampilan Sukses setelah Submit */}
        {submitted ? (
          <section className="daftar-success-card" aria-live="polite">
            <span className="daftar-success-card__icon">
              <CheckCircle2 size={36} aria-hidden="true" />
            </span>
            <h2 className="text-heading-md">Pendaftaran Usaha Berhasil Dikirim!</h2>
            <p>
              Terima kasih, <strong>{form.namaPemilik}</strong>. Pengajuan usaha{" "}
              <strong>&ldquo;{form.namaUsaha}&rdquo;</strong> telah masuk ke sistem kurasi Admin Desa Tambakrigadung dan akan diverifikasi dalam <strong>1–2 hari kerja</strong>.
            </p>
            <div className="daftar-success-card__actions">
              <Link to="/umkm" className="btn-pill btn-pill--primary">
                <ArrowLeft size={15} aria-hidden="true" /> Kembali ke Katalog UMKM
              </Link>
              <button
                type="button"
                className="btn-pill btn-pill--soft"
                onClick={() => {
                  setSubmitted(false);
                  clearErrors();
                  setFiles([]);
                  setForm({
                    namaUsaha: "",
                    kategori: "",
                    namaPemilik: "",
                    whatsapp: "",
                    jamOperasional: "",
                    hargaMin: "",
                    hargaMax: "",
                    alamat: "",
                    mapsUrl: "",
                    deskripsi: "",
                    setuju: false,
                  });
                }}
              >
                Daftarkan Usaha Lainnya
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Form Utama */}
            <form className="daftar-form-card" onSubmit={handleSubmit} noValidate>
              {/* Detail Kesalahan Lengkap di Bagian Atas */}
              {errorDetails.length > 0 && (
                <div ref={topErrorRef} className="form-alert" role="alert">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                    <div>
                      <strong style={{ display: "block", marginBottom: errorDetails.length > 1 ? "6px" : 0 }}>
                        {errorDetails.length > 1
                          ? "Mohon perbaiki isian formulir berikut:"
                          : errorDetails[0]}
                      </strong>
                      {errorDetails.length > 1 && (
                        <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.6 }}>
                          {errorDetails.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bagian 1: Informasi Usaha */}
              <section className="form-section">
                <div className="form-section__head">
                  <h2>1. Informasi Usaha</h2>
                  <p>Lengkapi data identitas dan operasional usaha Anda secara akurat sesuai keadaan riil di lapangan.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group form-group--full">
                    <label htmlFor="namaUsaha">Nama Usaha <span>*</span></label>
                    <input
                      id="namaUsaha"
                      name="namaUsaha"
                      type="text"
                      required
                      value={form.namaUsaha}
                      onChange={handleChange}
                      placeholder="Contoh: Keripik Ikan Tambak Bu Siti"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="kategori">Kategori Usaha <span>*</span></label>
                    <select
                      id="kategori"
                      name="kategori"
                      required
                      value={form.kategori}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori Bidang</option>
                      {KATEGORI_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="namaPemilik">Nama Pemilik Usaha <span>*</span></label>
                    <input
                      id="namaPemilik"
                      name="namaPemilik"
                      type="text"
                      required
                      value={form.namaPemilik}
                      onChange={handleChange}
                      placeholder="Nama lengkap sesuai KTP"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="whatsapp">Nomor WhatsApp Aktif <span>*</span></label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix">+62</span>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        required
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="812-3456-7890"
                      />
                    </div>
                    <small>Digunakan untuk tombol pesanan warga &amp; konfirmasi admin.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="jamOperasional">Jam Operasional</label>
                    <input
                      id="jamOperasional"
                      name="jamOperasional"
                      type="text"
                      value={form.jamOperasional}
                      onChange={handleChange}
                      placeholder="Contoh: Senin - Sabtu, 08.00 - 17.00 WIB"
                    />
                    <small>Informasi waktu buka pelayanan bagi calon pembeli.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hargaMin">Rentang Harga Minimum (Rp)</label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix input-prefix--plain">Rp</span>
                      <input
                        id="hargaMin"
                        name="hargaMin"
                        type="text"
                        inputMode="numeric"
                        value={form.hargaMin}
                        onChange={handleChange}
                        placeholder="15.000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hargaMax">Rentang Harga Maksimum (Rp)</label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix input-prefix--plain">Rp</span>
                      <input
                        id="hargaMax"
                        name="hargaMax"
                        type="text"
                        inputMode="numeric"
                        value={form.hargaMax}
                        onChange={handleChange}
                        placeholder="35.000"
                      />
                    </div>
                  </div>

                  <div className="form-group form-group--full">
                    <label htmlFor="alamat">Alamat Lengkap / Lokasi Dusun <span>*</span></label>
                    <input
                      id="alamat"
                      name="alamat"
                      type="text"
                      required
                      value={form.alamat}
                      onChange={handleChange}
                      placeholder="Contoh: Dusun Tambakrigadung, RT 03 / RW 02"
                    />
                  </div>

                  <div className="form-group form-group--full">
                    <div className="label-row">
                      <label htmlFor="mapsUrl">
                        Tautan Google Maps Usaha <em>(Opsional)</em>
                      </label>
                      <span className="label-hint">
                        <MapPin size={12} aria-hidden="true" /> Bantu navigasi pembeli
                      </span>
                    </div>
                    <input
                      id="mapsUrl"
                      name="mapsUrl"
                      type="url"
                      value={form.mapsUrl}
                      onChange={handleChange}
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </div>
                </div>
              </section>

              {/* Bagian 2: Deskripsi & Foto Usaha */}
              <section className="form-section">
                <div className="form-section__head">
                  <h2>2. Deskripsi &amp; Foto Usaha</h2>
                  <p>Ceritakan keunggulan produk dan unggah foto dokumentasi usaha yang menarik perhatian warga dan wisatawan.</p>
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="deskripsi">Deskripsi Usaha &amp; Produk Unggulan <span>*</span></label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows={4}
                    maxLength={500}
                    required
                    value={form.deskripsi}
                    onChange={handleChange}
                    placeholder="Jelaskan produk yang Anda jual, bahan baku khas lokal, keunggulan rasa/kualitas, dan layanan pengiriman yang disediakan..."
                  />
                  <div className="textarea-foot">
                    <small>Minimal 50 karakter untuk deskripsi informatif.</small>
                    <small>{form.deskripsi.length} / 500</small>
                  </div>
                </div>

                <div className="form-group form-group--full">
                  <label>Foto Produk atau Tempat Usaha <span>*</span></label>
                  <div
                    className={`upload-dropzone${dragActive ? " is-drag" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      handleAddFiles(e.dataTransfer.files);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      multiple
                      hidden
                      onChange={(e) => handleAddFiles(e.target.files)}
                    />
                    <span className="upload-dropzone__icon">
                      <Upload size={22} aria-hidden="true" />
                    </span>
                    <strong>Klik atau seret foto ke sini</strong>
                    <span>Format JPG, JPEG, atau PNG, maksimal 2MB per foto (hingga 3 foto dokumentasi terbaik).</span>
                  </div>

                  {files.length > 0 && (
                    <div className="uploaded-list">
                      <p className="uploaded-list__label">
                        Foto terlampir ({files.length} dari {MAX_FILES}):
                      </p>
                      {files.map((item) => (
                        <div className="uploaded-item" key={item.id}>
                          <img src={item.preview} alt={item.name} />
                          <div className="uploaded-item__meta">
                            <strong>{item.name}</strong>
                            <span>{item.size} • <em>Siap diunggah</em></span>
                          </div>
                          <button
                            type="button"
                            className="uploaded-item__remove"
                            onClick={() => handleRemoveFile(item.id)}
                            aria-label={`Hapus ${item.name}`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Box Info Proses Kurasi Desa */}
              <div className="kurasi-box">
                <ShieldCheck size={20} className="kurasi-box__icon" aria-hidden="true" />
                <div>
                  <strong>Proses Kurasi Desa</strong>
                  <p>
                    Pengajuan Anda akan diverifikasi oleh Admin Desa Tambakrigadung maksimal 1–2 hari kerja sebelum ditampilkan secara resmi di halaman katalog UMKM desa. Pastikan nomor WhatsApp aktif untuk menerima notifikasi status.
                  </p>
                </div>
              </div>

              {/* Checkbox Pernyataan */}
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="setuju"
                  checked={form.setuju}
                  onChange={handleChange}
                />
                <span>
                  Saya menyatakan bahwa seluruh data usaha yang diisi adalah benar, sah, dan merupakan unit usaha warga Desa Tambakrigadung serta bersedia mematuhi norma layanan masyarakat desa.
                </span>
              </label>

              {/* Tombol Aksi */}
              <div className="daftar-form-card__actions">
                <button
                  type="button"
                  className="btn-pill btn-pill--muted"
                  onClick={() => navigate("/umkm")}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-pill btn-pill--primary"
                  disabled={submitting}
                >
                  {submitting ? "Mengirim Data..." : (
                    <>Kirim Pendaftaran Usaha <Send size={14} aria-hidden="true" /></>
                  )}
                </button>
              </div>
            </form>

            {/* Pesan Error Singkat di Bawah Card Form & Di Atas Card Kendala Teknis */}
            {shortError && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "14px 18px",
                  margin: "16px 0",
                  borderRadius: "14px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
                  <span>
                    <strong>Pengiriman belum dapat diproses:</strong> {shortError}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={scrollToTopError}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "1px solid #fca5a5",
                    backgroundColor: "#ffffff",
                    color: "#b91c1c",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <ArrowUp size={13} aria-hidden="true" /> Lihat Detail
                </button>
              </div>
            )}
          </>
        )}

        {/* Kartu Bantuan Teknis */}
        <aside className="daftar-help-card">
          <div className="daftar-help-card__left">
            <span className="daftar-help-card__icon">
              <Headset size={20} aria-hidden="true" />
            </span>
            <div>
              <h3>Mengalami Kendala Teknis?</h3>
              <p>Hubungi tim pendamping desa atau kunjungi Balai Desa Tambakrigadung pada jam kerja.</p>
            </div>
          </div>

          <a
            href={waAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-panduan"
          >
            <MessageCircle size={15} aria-hidden="true" /> Tanya Admin
          </a>
        </aside>
      </div>

      {/* Modal Panduan Pendaftaran UMKM */}
      <PanduanModal
        open={panduanOpen}
        onClose={() => setPanduanOpen(false)}
        panduan={umkmPage.panduan}
      />
    </div>
  );
}