import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";
import SectionHead from "../common/SectionHead.jsx";
import ContentCard from "../common/ContentCard.jsx";

export default function BeritaSection() {
  const state = useFetch(api.getBerita);
  return (
    <section className="section container">
      <SectionHead title="Kabar & Artikel Desa" subtitle="Informasi, Pengumuman, dan liputan kegiatan terbaru" to="/berita" cta="Lihat Semua Berita" />
      <AsyncBlock state={state} minHeight={260}>
        {(items) => (
          <div className="cards">
            {items.map((b) => <ContentCard key={b.id} image={b.image} title={b.judul} date={b.tanggal} to={`/berita/${b.slug}`} />)}
          </div>
        )}
      </AsyncBlock>
    </section>
  );
}
