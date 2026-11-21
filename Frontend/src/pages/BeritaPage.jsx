import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import BeritaHeader from "../components/berita/BeritaHeader.jsx";
import BeritaFeatured from "../components/berita/BeritaFeatured.jsx";
import BeritaCard from "../components/berita/BeritaCard.jsx";
import BeritaPagination from "../components/berita/BeritaPagination.jsx";
import BeritaSidebar from "../components/berita/BeritaSidebar.jsx";

const PER_PAGE = 6;

export default function BeritaPage() {
  const state = useFetch(api.getBeritaPage);
  const [params, setParams] = useSearchParams();

  const aktifKategori = params.get("kategori") || "semua";
  const query = params.get("q") || "";
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
    <div className="page berita-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={560}>
          {(d) => (
            <BeritaContent
              d={d}
              aktifKategori={aktifKategori}
              query={query}
              currentPage={currentPage}
              onSelectKategori={(key) => updateParams({ kategori: key, page: 1 })}
              onSearch={(q) => updateParams({ q, page: 1 })}
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

function BeritaContent({
  d,
  aktifKategori,
  query,
  currentPage,
  onSelectKategori,
  onSearch,
  onPageChange,
}) {
  const featured = useMemo(() => d.items.find((i) => i.featured) || d.items[0], [d.items]);

  // Sembunyikan banner Berita Utama ketika user sedang memfilter kategori tertentu atau mencari kata kunci
  const showFeatured = aktifKategori === "semua" && !query && currentPage === 1;

  const filteredItems = useMemo(() => {
    return d.items.filter((item) => {
      if (showFeatured && featured && item.id === featured.id) return false;
      const matchKat = aktifKategori === "semua" || item.kategori === aktifKategori;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        item.judul.toLowerCase().includes(q) ||
        item.ringkasan.toLowerCase().includes(q) ||
        item.kategoriLabel.toLowerCase().includes(q);
      return matchKat && matchQuery;
    });
  }, [d.items, featured, showFeatured, aktifKategori, query]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <>
      <BeritaHeader header={d.header} />

      {showFeatured && <BeritaFeatured item={featured} />}

      <div className="berita-layout">
        <div className="berita-main">
          {/* Tabs Filter Kategori */}
          <div className="chips berita-chips" role="tablist" aria-label="Filter kategori berita">
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

          {query && (
            <p className="berita-search-info">
              Menampilkan hasil pencarian untuk: <strong>&ldquo;{query}&rdquo;</strong> ({filteredItems.length} artikel)
            </p>
          )}

          {paginatedItems.length === 0 ? (
            <div className="berita-empty">
              <p className="state-msg">Tidak ada artikel yang sesuai dengan filter atau pencarian Anda.</p>
              <button
                type="button"
                className="btn-pill btn-pill--soft"
                onClick={() => {
                  onSelectKategori("semua");
                  onSearch("");
                }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="berita-grid">
              {paginatedItems.map((item) => (
                <BeritaCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <BeritaPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        <BeritaSidebar
          searchTitle="Cari Berita"
          searchPlaceholder="Cari berita atau agenda..."
          kategoriTitle="Kategori Artikel"
          query={query}
          onSearch={onSearch}
          populer={d.populer}
          kategoriList={d.kategoriSidebar}
          aktifKategori={aktifKategori}
          onSelectKategori={onSelectKategori}
        />
      </div>
    </>
  );
}