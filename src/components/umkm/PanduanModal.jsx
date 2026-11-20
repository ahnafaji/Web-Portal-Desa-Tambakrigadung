import { useEffect } from "react";
import { BookOpen, X, CheckCircle2 } from "lucide-react";

export default function PanduanModal({ open, onClose, panduan }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !panduan) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panduan-modal-title"
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card__head">
          <div className="modal-card__head-left">
            <span className="modal-card__icon">
              <BookOpen size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="panduan-modal-title" className="modal-card__title">{panduan.judul}</h2>
              <p className="modal-card__sub">{panduan.subjudul}</p>
            </div>
          </div>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Tutup panduan">
            <X size={18} />
          </button>
        </div>

        <div className="modal-card__body">
          <section className="modal-section">
            <h3 className="modal-section__title">Syarat Pendaftaran</h3>
            <ul className="syarat-list">
              {panduan.syarat.map((s) => (
                <li key={s}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="modal-section">
            <h3 className="modal-section__title">Alur Pendaftaran &amp; Verifikasi</h3>
            <ol className="alur-list">
              {panduan.alur.map((step) => (
                <li key={step.nomor} className="alur-item">
                  <span className="alur-item__num">{step.nomor}</span>
                  <div>
                    <strong>{step.judul}</strong>
                    <p>{step.deskripsi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="modal-card__foot">
          <span>Butuh bantuan? Kunjungi Balai Desa.</span>
          <button type="button" className="btn-pill btn-pill--primary btn-pill--xs" onClick={onClose}>
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}