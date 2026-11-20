import { Link } from "react-router-dom";
import { Home, ChevronRight, Newspaper, RefreshCw } from "lucide-react";

export default function BeritaHeader({ header }) {
  return (
    <header className="berita-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">Kabar &amp; Artikel</span>
      </nav>

      <div className="berita-head__top">
        <div className="berita-head__title-box">
          <h1 className="text-heading-lg berita-head__title">{header.judul}</h1>
          <p className="berita-head__desc">{header.deskripsi}</p>
        </div>

        <div className="berita-head__badges">
          <span className="berita-stat-badge berita-stat-badge--white">
            <Newspaper size={15} aria-hidden="true" /> {header.totalLabel}
          </span>
          <span className="berita-stat-badge berita-stat-badge--green">
            <RefreshCw size={14} aria-hidden="true" /> {header.updateLabel}
          </span>
        </div>
      </div>
    </header>
  );
}