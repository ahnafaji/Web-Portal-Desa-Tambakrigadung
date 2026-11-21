import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const MENU_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Potensi", to: "/potensi" },
  { label: "UMKM", to: "/umkm" },
  { label: "Galeri", to: "/galeri" },
  { label: "Berita", to: "/berita" },
  { label: "Kontak", to: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Pertahankan desain logo & tulisan Desa Tambakrigadung */}
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img
            src="/images/logo-kecamatan.png"
            alt="Logo Desa Tambakrigadung"
            className="navbar__logo"
          />
          <span>Desa Tambakrigadung</span>
        </Link>

        <ul className="navbar__links">
          {MENU_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bagian Kanan: Tombol Akun / Login Admin */}
        <div className="navbar__actions" ref={accountRef}>
          {isAuthenticated ? (
            <div className="navbar-account">
              <button
                type="button"
                className="navbar__account-btn is-logged-in"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
                aria-label="Menu akun operator desa"
                title={`Operator: ${user?.nama || "Admin Desa"}`}
              >
                <User size={16} aria-hidden="true" />
                <span className="navbar__account-dot" aria-hidden="true" />
              </button>

              {accountMenuOpen && (
                <div className="account-popover" role="menu">
                  <div className="account-popover__head">
                    <strong>{user?.nama || "Operator Desa"}</strong>
                    <span>{user?.email || "admin@tambakrigadung.desa.id"}</span>
                  </div>
                  <Link
                    to="/admin/dashboard"
                    className="account-popover__item"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    <LayoutDashboard size={14} aria-hidden="true" />
                    <span>Dashboard Admin</span>
                  </Link>
                  <button
                    type="button"
                    className="account-popover__item account-popover__item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} aria-hidden="true" />
                    <span>Keluar Sesi</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="navbar__account-btn"
              aria-label="Masuk ke Dashboard Admin Desa"
              title="Login Operator Desa"
              onClick={() => setOpen(false)}
            >
              <User size={16} aria-hidden="true" />
            </Link>
          )}

          <button
            type="button"
            className="navbar__account-btn navbar__toggle"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {open && (
          <nav className="navbar__mobile" aria-label="Menu mobile">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}