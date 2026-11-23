import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Store,
  Image as ImageIcon,
  Newspaper,
  Megaphone,
  Wallet,
  Users,
  UserCog,
  ExternalLink,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminToastProvider } from '../../context/AdminToastContext';
import '../../styles/admin.css';

const NAV_GROUPS = [
  {
    label: 'UTAMA',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'KONTEN PORTAL',
    items: [
      { to: '/admin/potensi', label: 'Potensi Desa', icon: Sprout },
      { to: '/admin/umkm', label: 'UMKM', icon: Store },
      { to: '/admin/galeri', label: 'Galeri Foto', icon: ImageIcon },
      { to: '/admin/berita', label: 'Berita & Artikel', icon: Newspaper },
    ],
  },
  {
    label: 'LAYANAN & DATA',
    items: [
      { to: '/admin/pengaduan', label: 'Pengaduan Warga', icon: Megaphone, badge: 4 },
      { to: '/admin/apbd', label: 'APBD Desa', icon: Wallet },
      { to: '/admin/kependudukan', label: 'Data Kependudukan', icon: Users },
      { to: '/admin/profil', label: 'Profil & Perangkat', icon: UserCog },
    ],
  },
];

const PAGE_TITLES = {
  '/admin/dashboard': 'Ringkasan Dashboard',
  '/admin/pengaduan': 'Manajemen Pengaduan Warga',
  '/admin/umkm': 'Manajemen UMKM Desa',
  '/admin/umkm/tambah': 'Manajemen UMKM Desa',
  '/admin/galeri': 'Kelola Galeri Foto',
  '/admin/galeri/tambah': 'Kelola Galeri Foto',
  '/admin/apbd': 'Portal Administrasi Desa',
  '/admin/berita': 'Kelola Berita & Artikel',
  '/admin/berita/tambah': 'Kelola Berita & Artikel',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const currentTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/umkm')
      ? 'Manajemen UMKM Desa'
      : location.pathname.includes('/galeri')
        ? 'Kelola Galeri Foto'
        : location.pathname.includes('/berita')
          ? 'Kelola Berita & Artikel'
          : 'Panel Kendali Desa');

  const handleLogout = () => {
    if (typeof auth?.logout === 'function') {
      auth.logout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminToastProvider>
      <div className="admin-shell">
        {sidebarOpen && (
          <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-kecamatan.png`}
                alt="Logo Kecamatan Tikung"
              />
            </div>
            <div className="admin-brand-text">
              <strong>Desa Tambakrigadung</strong>
              <span>PANEL ADMIN</span>
            </div>
            <button
              type="button"
              className="admin-mobile-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="admin-nav">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="admin-nav-group">
                <p className="admin-nav-label">{group.label}</p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `admin-nav-link ${isActive ? 'is-active' : ''}`
                      }
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span className="admin-nav-badge">{item.badge}</span>
                      ) : null}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-avatar">
              <User size={16} />
            </div>
            <div className="admin-user-meta">
              <strong>Admin Desa</strong>
              <span>Operator Utama</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-icon-btn"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                type="button"
                className="admin-mobile-trigger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="admin-topbar-title">{currentTitle}</h1>
            </div>

            <div className="admin-topbar-right">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn-admin-outline btn-admin-sm"
              >
                <span>Lihat Website</span>
                <ExternalLink size={14} />
              </a>
              <div className="admin-topbar-avatar">
                <User size={16} />
              </div>
            </div>
          </header>

          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminToastProvider>
  );
}