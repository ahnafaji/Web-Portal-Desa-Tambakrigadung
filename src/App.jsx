import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import PotensiPage from "./pages/PotensiPage.jsx";
import UmkmPage from "./pages/UmkmPage.jsx";
import UmkmDetailPage from "./pages/UmkmDetailPage.jsx";
import UmkmDaftarPage from "./pages/UmkmDaftarPage.jsx";
import GaleriPage from "./pages/GaleriPage.jsx";
import GaleriDetailPage from "./pages/GaleriDetailPage.jsx";
import BeritaPage from "./pages/BeritaPage.jsx";
import BeritaDetailPage from "./pages/BeritaDetailPage.jsx";
import KontakPage from "./pages/KontakPage.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
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