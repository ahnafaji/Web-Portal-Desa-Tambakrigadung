import { useState, useRef } from "react";
import { Upload, X, Send, CheckCircle2, Copy, Check } from "lucide-react";
import { api } from "../../services/api.js";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export default function PengaduanForm({ dusunOptions, kategoriOptions, prioritasOptions }) {
  const fileRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [tiketResult, setTiketResult] = useState(null);
  const [copiedTiket, setCopiedTiket] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    dusun: dusunOptions[0] || "",
    kategori: kategoriOptions[0] || "",
    prioritas: prioritasOptions[0]?.key || "biasa",
    judul: "",
    kronologi: "",
    setuju: false,
  });

  const [lampiran, setLampiran] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    setErrorMsg("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg("Format berkas harus JPG, PNG, atau PDF.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg("Ukuran berkas bukti maksimal 5MB.");
      return;
    }
    setLampiran({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.nama.trim() || !form.whatsapp.trim() || !form.judul.trim()) {
      setErrorMsg("Harap lengkapi Nama Lengkap, Nomor WhatsApp, dan Judul Aspirasi/Laporan.");
      return;
    }
    if (form.kronologi.trim().length < 20) {
      setErrorMsg("Uraian kronologi laporan minimal 20 karakter agar mudah ditindaklanjuti.");
      return;
    }
    if (!form.setuju) {
      setErrorMsg("Harap centang pernyataan kebenaran informasi sebelum mengirim.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => payload.append(k, String(v)));
      if (lampiran?.file) payload.append("bukti", lampiran.file);

      const res = await api.submitPengaduan(payload);
      setTiketResult(res);
    } catch (err) {
      setErrorMsg(err.message || "Gagal mengirim pengaduan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTiket = async () => {
    if (!tiketResult?.tiket) return;
    try {
      await navigator.clipboard.writeText(tiketResult.tiket);
      setCopiedTiket(true);
      setTimeout(() => setCopiedTiket(false), 2000);
    } catch {
      setCopiedTiket(false);
    }
  };

  if (tiketResult) {
    return (
      <section className="pengaduan-card pengaduan-success" aria-live="polite">
        <span className="pengaduan-success__icon">
          <CheckCircle2 size={36} aria-hidden="true" />
        </span>
        <h2 className="text-heading-md">Pengaduan Berhasil Terkirim!</h2>
        <p>
          Terima kasih, <strong>{form.nama}</strong>. Laporan Anda telah masuk ke sistem pengawasan pamong desa dan akan segera diverifikasi oleh sekretariat.
        </p>

        <div className="tiket-box">
          <span>NOMOR TIKET PENGADUAN ANDA</span>
          <div className="tiket-box__row">
            <strong>{tiketResult.tiket}</strong>
            <button type="button" onClick={handleCopyTiket} className="btn-pill btn-pill--soft btn-pill--xs">
              {copiedTiket ? <><Check size={13} /> Tersalin</> : <><Copy size={13} /> Salin Tiket</>}
            </button>
          </div>
          <small>Simpan nomor tiket ini untuk memantau progres penanganan via WhatsApp resmi desa.</small>
        </div>

        <button
          type="button"
          className="btn-pill btn-pill--primary"
          onClick={() => {
            setTiketResult(null);
            setLampiran(null);
            setForm((prev) => ({
              ...prev,
              judul: "",
              kronologi: "",
              setuju: false,
            }));
          }}
        >
          Kirim Laporan Lainnya
        </button>
      </section>
    );
  }

  return (
    <form className="pengaduan-card" onSubmit={handleSubmit} noValidate>
      <div className="form-section__head">
        <h2>Formulir Aspirasi &amp; Pengaduan Warga</h2>
        <p>
          Silakan lengkapi formulir di bawah ini dengan jelas mengenai aspirasi atau aduan. Laporan Anda tercatat langsung ke sistem pengawasan pamong desa.
        </p>
      </div>

      {errorMsg && (
        <div className="form-alert" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="aduan-nama">Nama Lengkap (Sesuai KTP) <span>*</span></label>
          <input
            id="aduan-nama"
            name="nama"
            type="text"
            required
            value={form.nama}
            onChange={handleChange}
            placeholder="Contoh: Ahmad Budi Santoso"
          />
        </div>

        <div className="form-group">
          <label htmlFor="aduan-wa">Nomor WhatsApp / Telepon <span>*</span></label>
          <input
            id="aduan-wa"
            name="whatsapp"
            type="tel"
            required
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
          />
        </div>

        <div className="form-group">
          <label htmlFor="aduan-dusun">Asal Dusun / Alamat <span>*</span></label>
          <select id="aduan-dusun" name="dusun" value={form.dusun} onChange={handleChange}>
            {dusunOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="aduan-kategori">Kategori Aduan <span>*</span></label>
          <select id="aduan-kategori" name="kategori" value={form.kategori} onChange={handleChange}>
            {kategoriOptions.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Pilihan Tingkat Urgensi / Prioritas Aduan */}
        <div className="form-group form-group--full">
          <label>Tingkat Urgensi / Prioritas Aduan <span>*</span></label>
          <div className="priority-grid" role="radiogroup" aria-label="Tingkat urgensi aduan">
            {prioritasOptions.map((opt) => {
              const active = form.prioritas === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`priority-card${active ? " is-active" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, prioritas: opt.key }))}
                >
                  <strong>{opt.label}</strong>
                  <span>{opt.estimasi}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="aduan-judul">Judul Aspirasi / Ringkasan Pokok Laporan <span>*</span></label>
          <input
            id="aduan-judul"
            name="judul"
            type="text"
            required
            value={form.judul}
            onChange={handleChange}
            placeholder="Contoh: Perbaikan Lampu Penerangan Jalan (PJU) Dusun Tambakboyo"
          />
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="aduan-kronologi">Uraian Kronologi / Detail Laporan <span>*</span></label>
          <textarea
            id="aduan-kronologi"
            name="kronologi"
            rows={4}
            required
            value={form.kronologi}
            onChange={handleChange}
            placeholder="Tuliskan lokasi spesifik, waktu kejadian, serta detail kondisi yang perlu ditindaklanjuti..."
          />
          <small>Gunakan bahasa yang sopan, informatif, dan objektif.</small>
        </div>

        <div className="form-group form-group--full">
          <label>Unggah Foto / Bukti Pendukung <em>(Opsional)</em></label>
          <div
            className="upload-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files?.[0]);
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              hidden
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <span className="upload-dropzone__icon">
              <Upload size={20} aria-hidden="true" />
            </span>
            <strong>Klik untuk memilih berkas atau seret foto ke sini</strong>
            <span>Format JPG, PNG, atau PDF (Maksimal 5MB)</span>
          </div>

          {lampiran && (
            <div className="uploaded-item" style={{ marginTop: "8px" }}>
              <div className="uploaded-item__meta">
                <strong>{lampiran.name}</strong>
                <span>{lampiran.size} • <em>Siap dikirim</em></span>
              </div>
              <button
                type="button"
                className="uploaded-item__remove"
                onClick={() => setLampiran(null)}
                aria-label="Hapus lampiran"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <label className="form-checkbox">
        <input
          type="checkbox"
          name="setuju"
          checked={form.setuju}
          onChange={handleChange}
        />
        <span>
          Saya menyatakan bahwa informasi yang disampaikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan untuk kepentingan pelayanan publik Desa Tambakrigadung.
        </span>
      </label>

      <button
        type="submit"
        className="btn-pill btn-pill--primary pengaduan-submit-btn"
        disabled={submitting}
      >
        {submitting ? "Mengirim Pengaduan..." : (
          <>Kirim Pengaduan &amp; Dapatkan Nomor Tiket <Send size={14} aria-hidden="true" /></>
        )}
      </button>
    </form>
  );
}