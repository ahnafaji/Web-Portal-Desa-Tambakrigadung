import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarDays, Camera, ArrowRight, X } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";
import { getIcon } from "../../utils/icons.js";

function formatTanggalPendek(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BeritaSidebar({
  searchTitle = "Cari Berita",
  searchPlaceholder = "Cari berita atau agenda...",
  kategoriTitle = "Kategori Artikel",
  query = "",
  onSearch,
  populer = [],
  kategoriList = [],
  aktifKategori = "semua",
  onSelectKategori,
  showGaleriCta = false,
}) {
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(input.trim());
  };

  const handleClear = () => {
    setInput("");
    onSearch?.("");
  };

  return (
    <aside className="berita-sidebar" aria-label="Sidebar informasi berita">
      {/* 1. Widget Cari Berita */}
      <div className="sidebar-widget">
        <h3 className="sidebar-widget__title">{searchTitle}</h3>
        <form className="sidebar-search" onSubmit={handleSubmit}>
          <div className="sidebar-search__input-wrap">
            <Search size={15} className="sidebar-search__icon" aria-hidden="true" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchTitle}
            />
            {input && (
              <button
                type="button"
                className="sidebar-search__clear"
                onClick={handleClear}
                aria-label="Hapus kata kunci"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-pill btn-pill--primary btn-pill--xs">
            Cari
          </button>
        </form>
      </div>

      {/* 2. Widget Berita Populer */}
      <div className="sidebar-widget">
        <h3 className="sidebar-widget__title">Berita Populer</h3>
        <ul className="populer-list">
          {populer.map((p) => (
            <li key={p.id}>
              <Link to={`/berita/${p.slug}`} className="populer-item">
                <div className="populer-item__thumb">
                  <SmartImage src={p.image} alt={p.judul} />
                </div>
                <div className="populer-item__info">
                  <h4 className="populer-item__title">{p.judul}</h4>
                  <span className="populer-item__date">
                    <CalendarDays size={12} aria-hidden="true" /> {formatTanggalPendek(p.tanggal)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Widget Kategori */}
      <div className="sidebar-widget">
        <h3 className="sidebar-widget__title">{kategoriTitle}</h3>
        <ul className="kategori-list">
          {kategoriList.map((k) => {
            const Icon = getIcon(k.ikon);
            const active = aktifKategori === k.key;
            return (
              <li key={k.key}>
                <button
                  type="button"
                  className={`kategori-item${active ? " is-active" : ""}`}
                  onClick={() => onSelectKategori?.(active ? "semua" : k.key)}
                >
                  <span className="kategori-item__left">
                    <Icon size={15} aria-hidden="true" />
                    <span>{k.label}</span>
                  </span>
                  <span className="kategori-item__count">{k.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 4. Widget Dokumentasi Foto (Muncul di halaman detail berita) */}
      {showGaleriCta && (
        <div className="sidebar-galeri-card">
          <div className="sidebar-galeri-card__icon">
            <Camera size={22} aria-hidden="true" />
          </div>
          <h3>Dokumentasi Foto</h3>
          <p>
            Lihat dokumentasi lengkap kegiatan kerja bakti dan acara lainnya di galeri foto desa.
          </p>
          <Link to="/galeri" className="btn-pill btn-pill--white btn-pill--xs">
            Buka Galeri Foto <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </aside>
  );
}