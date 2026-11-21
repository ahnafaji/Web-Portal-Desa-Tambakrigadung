import { Link } from "react-router-dom";
import { Store, BookOpen, Sparkles } from "lucide-react";
import { getIcon } from "../../utils/icons.js";

export default function UmkmCta({ cta, onOpenPanduan, variant = "banner" }) {
  if (variant === "compact") {
    return (
      <section className="umkm-cta-strip" aria-label="Ajakan pendaftaran UMKM">
        <div className="umkm-cta-strip__left">
          <span className="umkm-cta-strip__icon">
            <Store size={20} aria-hidden="true" />
          </span>
          <div>
            <h3>Punya Usaha di Desa Tambakrigadung?</h3>
            <p>
              Daftarkan usaha atau produk rumahan Anda ke BUMDes untuk mendapatkan promosi gratis di portal resmi desa.
            </p>
          </div>
        </div>
        <Link to="/umkm/daftar" className="btn-pill btn-pill--white btn-pill--xs">
          Daftar Jadi Mitra UMKM
        </Link>
      </section>
    );
  }

  return (
    <section className="umkm-cta" aria-labelledby="umkm-cta-title">
      <div className="umkm-cta__body">
        <span className="pill pill--glass">
          <Sparkles size={13} aria-hidden="true" /> {cta.badge}
        </span>

        <h2 id="umkm-cta-title" className="text-heading-md">{cta.judul}</h2>
        <p className="umkm-cta__desc">{cta.deskripsi}</p>

        {cta.highlights?.length > 0 && (
          <div className="umkm-cta__highlights">
            {cta.highlights.map((h) => {
              const Icon = getIcon(h.ikon);
              return (
                <span key={h.label}>
                  <Icon size={14} aria-hidden="true" /> {h.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="umkm-cta__actions">
        <Link to="/umkm/daftar" className="btn-pill btn-pill--white">
          Daftarkan Usaha Saya
        </Link>
        {onOpenPanduan && (
          <button type="button" className="btn-pill btn-pill--glass" onClick={onOpenPanduan}>
            <BookOpen size={15} aria-hidden="true" /> Panduan Pendaftaran
          </button>
        )}
      </div>
    </section>
  );
}