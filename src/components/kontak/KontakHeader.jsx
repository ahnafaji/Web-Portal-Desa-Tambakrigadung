import { Link } from "react-router-dom";
import { Home, ChevronRight, Phone, Clock, ShieldCheck } from "lucide-react";

export default function KontakHeader({ header }) {
  return (
    <header className="kontak-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">Kontak, Layanan &amp; Aduan Warga</span>
      </nav>

      <div className="kontak-head__top">
        <div className="kontak-head__intro">
          <p className="pill pill--green">
            <Phone size={12} aria-hidden="true" /> {header.badge}
          </p>
          <h1 className="text-heading-lg kontak-head__title">{header.judul}</h1>
          <p className="kontak-head__desc">{header.deskripsi}</p>
        </div>

        <div className="kontak-head__badges">
          <span className="status-badge">
            <span className="status-badge__dot" aria-hidden="true" />
            <Clock size={13} aria-hidden="true" /> {header.jamPiket}
          </span>
          <span className="pill pill--green">
            <ShieldCheck size={13} aria-hidden="true" /> {header.komitmenBadge}
          </span>
        </div>
      </div>
    </header>
  );
}