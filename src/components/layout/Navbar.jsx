import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/potensi", label: "Potensi" },
  { to: "/umkm", label: "UMKM" },
  { to: "/galeri", label: "Galeri" },
  { to: "/berita", label: "Berita" },
  { to: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Navigasi utama">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src="/images/logo-kecamatan.png" alt="" className="navbar__logo" /> Desa Tambakrigadung
        </NavLink>

        <ul className="navbar__links">
          {LINKS.map((l) => (
            <li key={l.to}><NavLink to={l.to} end={l.to === "/"} className={linkClass}>{l.label}</NavLink></li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button className="icon-btn" aria-label="Cari"><Search size={16} /></button>
          <button className="icon-btn navbar__toggle" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {open && (
          <div className="navbar__mobile">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass} onClick={() => setOpen(false)}>{l.label}</NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
