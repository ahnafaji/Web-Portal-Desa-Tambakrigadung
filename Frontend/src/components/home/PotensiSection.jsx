import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";

const NAMA_POTENSI_DEFAULT = [
  "Potensi Wisata Boyo Sirno Desa Tambakrigadung",
  "Potensi Tambak Ikan Desa Tambakrigadung",
  "Potensi Ternak Domba Desa Tambakrigadung",
];

export default function PotensiSection() {
  const state = useFetch(api.getPotensi);
  return (
    <section className="section container center" aria-labelledby="judul-potensi">
      <h2 className="section-title section-title--green" id="judul-potensi">Potensi Desa</h2>
      <p className="section-subtitle">Informasi tentang potensi dan kemajuan desa di berbagai bidang seperti ekonomi, pariwisata, industri kreatif, dan kelestarian lingkungan</p>
      <AsyncBlock state={state} minHeight={260}>
        {(items) => (
          <div className="potensi">
            {items.map((p, index) => {
              const namaPotensi =
                p.nama || p.judul || p.title || NAMA_POTENSI_DEFAULT[index] || "Potensi Desa Tambakrigadung";

              return (
                <div className="potensi__item" key={p.id || index}>
                  <img className="potensi__img" src={p.image} alt={namaPotensi} loading="lazy" />
                  <h3 className="potensi__name">{namaPotensi}</h3>
                </div>
              );
            })}
          </div>
        )}
      </AsyncBlock>
    </section>
  );
}