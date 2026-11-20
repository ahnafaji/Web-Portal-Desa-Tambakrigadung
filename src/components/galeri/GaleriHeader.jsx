import { Link } from "react-router-dom";
import { Home, ChevronRight, FolderArchive } from "lucide-react";
import { getIcon } from "../../utils/icons.js";

export default function GaleriHeader({ header }) {
  return (
    <header className="galeri-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">Galeri</span>
      </nav>

      <div className="galeri-head__top">
        <div className="galeri-head__intro">
          <p className="pill pill--green">
            <FolderArchive size={13} aria-hidden="true" /> {header.badge}
          </p>
          <h1 className="text-heading-lg galeri-head__title">{header.judul}</h1>
          <p className="galeri-head__desc">{header.deskripsi}</p>
        </div>

        <div className="galeri-head__stats">
          {header.stats.map((s) => {
            const Icon = getIcon(s.ikon);
            return (
              <div className="galeri-stat-card" key={s.label}>
                <span className="galeri-stat-card__icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}