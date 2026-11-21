import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function ApbdHeader({ header }) {
  return (
    <header className="apbd-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">APBD Desa</span>
      </nav>

      <div className="apbd-head__title-box">
        <h1 className="text-heading-lg">{header.judul}</h1>
        <p>{header.deskripsi}</p>
      </div>
    </header>
  );
}