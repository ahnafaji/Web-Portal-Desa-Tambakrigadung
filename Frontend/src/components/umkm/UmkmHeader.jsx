import { Link } from "react-router-dom";
import { Home, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

export default function UmkmHeader({ header }) {
  return (
    <header className="umkm-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">UMKM &amp; Produk Unggulan Desa</span>
      </nav>

      <div className="umkm-head__top">
        <div className="umkm-head__intro">
          <p className="pill pill--green">
            <Sparkles size={13} aria-hidden="true" /> {header.badge}
          </p>
          <h1 className="text-heading-lg umkm-head__title">
            <span>{header.judulUtama}</span>
            <em className="umkm-head__accent">{header.judulAksen}</em>
          </h1>
          <p className="umkm-head__desc">{header.deskripsi}</p>
        </div>

        <aside className="umkm-summary" aria-label="Ringkasan statistik UMKM desa">
          <div className="umkm-summary__head">
            <span className="umkm-summary__title">{header.summaryTitle}</span>
            <span className="umkm-summary__verified">{header.summaryBadge}</span>
          </div>

          <div className="umkm-summary__grid">
            <div className="umkm-summary__box">
              <strong className="text-heading-sm">{header.totalUnit}</strong>
              <span>{header.totalUnitLabel}</span>
            </div>
            <div className="umkm-summary__box">
              <strong className="text-heading-sm">{header.totalDusun}</strong>
              <span>{header.totalDusunLabel}</span>
            </div>
          </div>

          <p className="umkm-summary__foot">
            <ShieldCheck size={14} aria-hidden="true" /> {header.summaryFoot}
          </p>
        </aside>
      </div>
    </header>
  );
}