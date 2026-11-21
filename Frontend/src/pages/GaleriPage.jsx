import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import GaleriHeader from "../components/galeri/GaleriHeader.jsx";
import GaleriCard from "../components/galeri/GaleriCard.jsx";
import BeritaPagination from "../components/berita/BeritaPagination.jsx";

const PER_PAGE = 9;

export default function GaleriPage() {
  const state = useFetch(api.getGaleriPage);
  const [params, setParams] = useSearchParams();

  const aktifKategori = params.get("kategori") || "semua";
  const currentPage = Math.max(1, Number(params.get("page")) || 1);

  const updateParams = (next) => {
    const updated = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "semua" || (k === "page" && Number(v) === 1)) {
        updated.delete(k);
      } else {
        updated.set(k, String(v));
      }
    });
    setParams(updated);
  };

  return (
    <div className="page galeri-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={560}>
          {(d) => (
            <GaleriContent
              d={d}
              aktifKategori={aktifKategori}
              currentPage={currentPage}
              onSelectKategori={(kategori) => updateParams({ kategori, page: 1 })}
              onPageChange={(page) => {
                updateParams({ page });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </AsyncBlock>
      </div>
    </div>
  );
}

function GaleriContent({ d, aktifKategori, currentPage, onSelectKategori, onPageChange }) {
  const filteredItems = useMemo(() => {
    if (aktifKategori === "semua") return d.items;
    return d.items.filter((item) => item.kategori === aktifKategori);
  }, [d.items, aktifKategori]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <>
      <GaleriHeader header={d.header} />

      {/* Filter Kategori */}
      <div className="chips galeri-chips" role="tablist" aria-label="Filter kategori galeri">
        {d.kategoriTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={aktifKategori === t.key}
            className={`chip${aktifKategori === t.key ? " is-active" : ""}`}
            onClick={() => onSelectKategori(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid Kartu Foto 3 Kolom */}
      {paginatedItems.length === 0 ? (
        <div className="berita-empty">
          <p className="state-msg">Belum ada dokumentasi foto pada kategori ini.</p>
          <button
            type="button"
            className="btn-pill btn-pill--soft"
            onClick={() => onSelectKategori("semua")}
          >
            Tampilkan Semua Foto
          </button>
        </div>
      ) : (
        <div className="galeri-grid">
          {paginatedItems.map((item) => (
            <GaleriCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <BeritaPagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}