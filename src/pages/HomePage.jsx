import HeroSlider from "../components/home/HeroSlider.jsx";
import StatsSection from "../components/home/StatsSection.jsx";
import ProfilSection from "../components/home/ProfilSection.jsx";
import SambutanSection from "../components/home/SambutanSection.jsx";
import PotensiSection from "../components/home/PotensiSection.jsx";
import ApbdSection from "../components/home/ApbdSection.jsx";
import UmkmSection from "../components/home/UmkmSection.jsx";
import BeritaSection from "../components/home/BeritaSection.jsx";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsSection />
      <ProfilSection />
      <SambutanSection />
      <PotensiSection />
      <ApbdSection />
      <UmkmSection />
      <BeritaSection />
    </>
  );
}
