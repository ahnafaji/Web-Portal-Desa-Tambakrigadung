import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import UmkmHeader from "../components/umkm/UMKMHeader.jsx";
import UmkmFeatured from "../components/umkm/UmkmFeatured.jsx";
import UmkmCard from "../components/umkm/UmkmCard.jsx";
import UmkmCta from "../components/umkm/UmkmCta.jsx";
import PanduanModal from "../components/umkm/PanduanModal.jsx";
import BeritaPagination from "../components/berita/BeritaPagination.jsx";
import { getIcon } from "../utils/icons.js";

const PER_PAGE = 5;

export default function UmkmPage() {
  const state = useFetch(api.getUmkmPage);
  const [params, setParams] = useSearchParams();
  const [panduanOpen, setPanduanOpen] = useState(false);

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
    <div className="page umkm-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={600}>
          {(d) => (
            <>
              <UmkmContent
                d={d}
                aktifKategori={aktifKategori}
                query={query}
                currentPage={currentPage}
                onSelectKategori={(kategori) => updateParams({ kategori, page: 1 })}
                onSearch={(q) => updateParams({ q, page: 1 })}
                onPageChange={(page) => {
                  updateParams({ page });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenPanduan={() => setPanduanOpen(true)}
              />
              <PanduanModal
                open={panduanOpen}
                onClose={() => setPanduanOpen(false)}
                panduan={d.panduan}
              />
            </>
          )}
        </AsyncBlock>
      </div>
    </div>
  );
}

function UmkmContent({
  d,
  aktifKategori,
  query,
  currentPage,
  onSelectKategori,
  onSearch,
  onPageChange,
  onOpenPanduan,
}) {
  const [searchInput, setSearchInput] = useState(query);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase();
    return d.items.filter((item) => {
      const matchKat = aktifKategori === "semua" || item.kategori === aktifKategori;
      const matchQuery =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.ringkasan.toLowerCase().includes(q) ||
        item.dusun.toLowerCase().includes(q) ||
        item.kategoriLabel.toLowerCase().includes(q);
      return matchKat && matchQuery;
    });
  }, [d.items, aktifKategori, query]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  const showBentoLayout = aktifKategori === "semua" && !query && safePage === 1 && paginatedItems.length >= 2;
  const topRowItems = showBentoLayout ? paginatedItems.slice(0, 2) : [];
  const gridItems = showBentoLayout ? paginatedItems.slice(2) : paginatedItems;

  return (
    <>
      <UmkmHeader header={d.header} />

      {/* Search & Filter Bar */}
      <div className="umkm-toolbar">
        <form className="umkm-search" onSubmit={handleSubmit}>
          <Search size={16} className="umkm-search__icon" aria-hidden="true" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (e.target.value === "") onSearch("");
            }}
            placeholder="Cari nama komoditas, pangan olahan, atau dusun..."
            aria-label="Cari produk UMKM"
          />
          {searchInput && (
            <button
              type="button"
              className="umkm-search__clear"
              onClick={() => {
                setSearchInput("");
                onSearch("");
              }}
              aria-label="Hapus pencarian"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className="umkm-tabs" role="tablist" aria-label="Filter kategori UMKM">
          {d.kategoriTabs.map((t) => {
            const active = aktifKategori === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                className={`chip${active ? " is-active" : ""}`}
                onClick={() => onSelectKategori(t.key)}
              >
                {t.label}
                {t.count ? ` (${t.count})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Karya Pilihan BUMDes */}
      {aktifKategori === "semua" && !query && safePage === 1 && (
        <UmkmFeatured featured={d.featured} />
      )}

      {/* Katalog Pelaku Usaha Warga */}
      <section className="umkm-catalog" aria-labelledby="catalog-heading">
        <div className="umkm-catalog__head">
          <div>
            <h2 id="catalog-heading" className="text-heading-sm">Katalog Pelaku Usaha Warga</h2>
            <p>Produk pilihan dapat langsung dipesan maupun pemesanan partai besar</p>
          </div>
          <span className="umkm-catalog__count">
            Menampilkan {paginatedItems.length} komoditas unggulan
          </span>
        </div>

        {paginatedItems.length === 0 ? (
          <div className="berita-empty">
            <p className="state-msg">Belum ada UMKM yang sesuai dengan pencarian atau kategori tersebut.</p>
            <button
              type="button"
              className="btn-pill btn-pill--soft"
              onClick={() => {
                setSearchInput("");
                onSelectKategori("semua");
                onSearch("");
              }}
            >
              Tampilkan Semua Katalog
            </button>
          </div>
        ) : (
          <>
            {showBentoLayout && (
              <div className="umkm-bento-top">
                <UmkmCard item={topRowItems[0]} variant="featured-row" />
                <UmkmCard item={topRowItems[1]} />
              </div>
            )}

            {gridItems.length > 0 && (
              <div className="umkm-grid">
                {gridItems.map((item) => (
                  <UmkmCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}

        <BeritaPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </section>

      {/* Geografi Ekonomi Desa: Peta Sentra Komoditas 4 Dusun */}
      <section className="sentra-panel" aria-labelledby="sentra-heading">
        <div className="sentra-panel__head">
          <div>
            <p className="sentra-panel__eyebrow">{d.dusunSentra.eyebrow}</p>
            <h2 id="sentra-heading" className="text-heading-sm">{d.dusunSentra.judul}</h2>
            <p className="sentra-panel__sub">{d.dusunSentra.subjudul}</p>
          </div>
          <span className="sentra-panel__badge">
            <MapPin size={14} aria-hidden="true" /> {d.dusunSentra.badgeKanan}
          </span>
        </div>

        <div className="sentra-grid">
          {d.dusunSentra.items.map((ds) => {
            const Icon = getIcon(ds.ikon);
            return (
              <article className="sentra-card" key={ds.key}>
                <span className="sentra-card__icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3>{ds.nama}</h3>
                <p>{ds.deskripsi}</p>
                <span className="sentra-card__count">{ds.jumlah}</span>
              </article>
            );
          })}
        </div>
      </section>

      {/* Banner Ajakan Daftar UMKM */}
      <UmkmCta cta={d.cta} onOpenPanduan={onOpenPanduan} />
    </>
  );
}