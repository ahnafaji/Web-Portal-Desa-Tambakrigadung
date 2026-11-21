import { Link } from "react-router-dom";
import { Home, ChevronRight, Leaf, BadgeCheck } from "lucide-react";

// Breadcrumb, judul halaman, kartu jumlah bidang, dan filter kategori.
export default function PotensiHeader({ header, kategori, jumlahBidang, aktif, onPilih }) {
  const tabs = [{ key: "semua", label: "Semua Potensi" }, ...kategori];
  return (
    <header className="potensi-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><Home size={14} aria-hidden="true" /> Beranda</Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span aria-current="page">Potensi Desa</span>
      </nav>

      <div className="potensi-head__top">
        <div>
          <p className="pill pill--green"><Leaf size={14} aria-hidden="true" /> {header.badge}</p>
          <h1 className="text-heading-lg potensi-head__title">{header.judul}</h1>
          <p className="potensi-head__desc">{header.deskripsi}</p>
        </div>
        <div className="bidang-card">
          <span className="bidang-card__icon"><BadgeCheck size={22} aria-hidden="true" /></span>
          <div>
            <p className="text-heading-sm bidang-card__num">{jumlahBidang} Bidang</p>
            <p className="bidang-card__label">{header.labelBidang}</p>
          </div>
        </div>
      </div>

      <div className="chips" role="tablist" aria-label="Filter kategori potensi">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={aktif === t.key} className={`chip${aktif === t.key ? " is-active" : ""}`} onClick={() => onPilih(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
    </header>
  );
}
