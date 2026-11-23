import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import ApbdDetailPage from "./pages/ApbdDetailPage.jsx";
import PotensiPage from "./pages/PotensiPage.jsx";
import UmkmPage from "./pages/UmkmPage.jsx";
import UmkmDetailPage from "./pages/UmkmDetailPage.jsx";
import UmkmDaftarPage from "./pages/UmkmDaftarPage.jsx";
import GaleriPage from "./pages/GaleriPage.jsx";
import GaleriDetailPage from "./pages/GaleriDetailPage.jsx";
import BeritaPage from "./pages/BeritaPage.jsx";
import BeritaDetailPage from "./pages/BeritaDetailPage.jsx";
import KontakPage from "./pages/KontakPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import DashboardAdminPage from "./pages/admin/DashboardAdminPage.jsx";
import PengaduanAdminPage from "./pages/admin/PengaduanAdminPage.jsx";
import UmkmAdminPage from "./pages/admin/UmkmAdminPage.jsx";
import UmkmFormPage from "./pages/admin/UmkmFormPage.jsx";
import GaleriAdminPage from "./pages/admin/GaleriAdminPage.jsx";
import GaleriFormPage from "./pages/admin/GaleriFormPage.jsx";
import ApbdAdminPage from "./pages/admin/ApbdAdminPage.jsx";
import BeritaAdminPage from "./pages/admin/BeritaAdminPage.jsx";
import BeritaFormPage from "./pages/admin/BeritaFormPage.jsx";
import DataKependudukanAdminPage from "./pages/admin/DataKependudukanAdminPage.jsx";
import PotensiAdminPage from "./pages/admin/PotensiAdminPage.jsx";
import ProfilPerangkatAdminPage from "./pages/admin/ProfilPerangkatAdminPage.jsx";

export default function App() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardAdminPage />} />
            <Route path="pengaduan" element={<PengaduanAdminPage />} />
            <Route path="umkm" element={<UmkmAdminPage />} />
            <Route path="umkm/tambah" element={<UmkmFormPage />} />
            <Route path="umkm/edit/:id" element={<UmkmFormPage />} />
            <Route path="galeri" element={<GaleriAdminPage />} />
            <Route path="galeri/tambah" element={<GaleriFormPage />} />
            <Route path="galeri/edit/:id" element={<GaleriFormPage />} />
            <Route path="apbd" element={<ApbdAdminPage />} />
            <Route path="berita" element={<BeritaAdminPage />} />
            <Route path="berita/tambah" element={<BeritaFormPage />} />
            <Route path="berita/edit/:id" element={<BeritaFormPage />} />
            <Route path="potensi" element={<PotensiAdminPage />} />
            <Route path="kependudukan" element={<DataKependudukanAdminPage />} />
            <Route path="profil" element={<ProfilPerangkatAdminPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apbd" element={<ApbdDetailPage />} />
          <Route path="/potensi" element={<PotensiPage />} />
          <Route path="/umkm" element={<UmkmPage />} />
          <Route path="/umkm/daftar" element={<UmkmDaftarPage />} />
          <Route path="/umkm/:slug" element={<UmkmDetailPage />} />
          <Route path="/galeri" element={<GaleriPage />} />
          <Route path="/galeri/:slug" element={<GaleriDetailPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:slug" element={<BeritaDetailPage />} />
          <Route path="/kontak" element={<KontakPage />} />
          <Route path="*" element={<ComingSoon title="Halaman tidak ditemukan" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
