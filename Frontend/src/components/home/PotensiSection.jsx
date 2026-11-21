import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";

export default function PotensiSection() {
  const state = useFetch(api.getPotensi);
  return (
    <section className="section container center" aria-labelledby="judul-potensi">
      <h2 className="section-title section-title--green" id="judul-potensi">Potensi Desa</h2>
      <p className="section-subtitle">Informasi tentang potensi dan kemajuan desa di berbagai bidang seperti ekonomi, pariwisata, industri kreatif, dan kelestarian lingkungan</p>
      <AsyncBlock state={state} minHeight={260}>
        {(items) => (
          <div className="potensi">
            {items.map((p) => (
              <div className="potensi__item" key={p.id}>
                <img className="potensi__img" src={p.image} alt={p.nama} loading="lazy" />
                <h3 className="potensi__name">{p.nama}</h3>
              </div>
            ))}
          </div>
        )}
      </AsyncBlock>
    </section>
  );
}
