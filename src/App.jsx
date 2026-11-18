import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Halaman berikutnya (dibangun setelah desain Figma halaman dalam selesai) */}
          <Route path="/potensi" element={<ComingSoon title="Potensi Desa" />} />
          <Route path="/umkm" element={<ComingSoon title="UMKM & Produk Unggulan" />} />
          <Route path="/galeri" element={<ComingSoon title="Galeri Dokumentasi" />} />
          <Route path="/berita" element={<ComingSoon title="Berita & Informasi" />} />
          <Route path="/kontak" element={<ComingSoon title="Kontak & Lokasi" />} />
          <Route path="*" element={<ComingSoon title="Halaman tidak ditemukan" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
