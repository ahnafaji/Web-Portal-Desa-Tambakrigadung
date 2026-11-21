import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";
import SectionHead from "../common/SectionHead.jsx";
import ContentCard from "../common/ContentCard.jsx";

export default function UmkmSection() {
  const state = useFetch(api.getUmkm);
  return (
    <section className="section container">
      <SectionHead title="UMKM Unggulan Desa Tambakrigadung" subtitle="Layanan yang disediakan promosi produk UMKM Desa sehingga mampu meningkatkan perekonomian masyarakat Desa" to="/umkm" cta="Lihat Semua UMKM" />
      <AsyncBlock state={state} minHeight={260}>
        {(items) => (
          <div className="cards">
            {items.map((u) => <ContentCard key={u.id} image={u.image} title={u.nama} date={u.tanggal} to={`/umkm/${u.slug}`} />)}
          </div>
        )}
      </AsyncBlock>
    </section>
  );
}
