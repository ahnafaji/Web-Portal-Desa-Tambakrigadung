import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Home, ChevronRight, ArrowLeft, User, Clock, MapPin, Wallet, MessageCircle,
  Navigation, Share2, Check, ShoppingBag, CheckCircle2, ArrowRight, ZoomIn, X,
} from "lucide-react";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import SmartImage from "../components/common/SmartImage.jsx";
import UmkmCta from "../components/umkm/UmkmCta.jsx";

export default function UmkmDetailPage() {
  const { slug } = useParams();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetcher = useCallback((opts) => api.getUmkmDetail(slug, opts), [slug]);
  const state = useFetch(fetcher);

  useEffect(() => {
    setActivePhotoIdx(0);
    setCopied(false);
    setLightboxOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="page umkm-detail-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={600}>
          {({ item, related }) => {
            if (!item) {
              return (
                <div className="empty-state py-12 text-center">
                  <h3>Data UMKM tidak ditemukan.</h3>
                  <Link to="/umkm" className="btn-pill btn-pill--primary mt-4">
                    Kembali ke Katalog UMKM
                  </Link>
                </div>
              );
            }

            const photos = item.galeri?.length ? item.galeri : [item.image || "/images/hero-1.jpg"];
            const currentPhoto = photos[activePhotoIdx] || photos[0];
            const waGeneral = item.whatsapp ? `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
              `Halo ${item.pemilik || 'Admin'}, saya melihat "${item.nama}" di Website Desa Tambakrigadung dan ingin bertanya/memesan.`
            )}` : '#';

            return (
              <>
                {/* Breadcrumb & Kembali */}
                <div className="detail-topbar">
                  <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
                    <ChevronRight size={12} aria-hidden="true" />
                    <Link to="/umkm">UMKM</Link>
                    <ChevronRight size={12} aria-hidden="true" />
                    <span aria-current="page">{item.nama}</span>
                  </nav>

                  <Link to="/umkm" className="detail-back-link">
                    <ArrowLeft size={14} aria-hidden="true" /> Kembali ke Daftar UMKM
                  </Link>
                </div>

                {/* Card Utama: Galeri Foto + Info Usaha */}
                <section className="umkm-hero-card" aria-labelledby="umkm-detail-title">
                  <div className="umkm-gallery">
                    <div className="umkm-gallery__main">
                      <SmartImage src={currentPhoto} alt={item.nama} />
                      <button
                        type="button"
                        className="umkm-gallery__zoom"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Perbesar foto produk"
                      >
                        <ZoomIn size={16} />
                      </button>
                    </div>

                    {photos.length > 1 && (
                      <div className="umkm-gallery__thumbs">
                        {photos.map((src, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`umkm-gallery__thumb${idx === activePhotoIdx ? " is-active" : ""}`}
                            onClick={() => setActivePhotoIdx(idx)}
                            aria-label={`Pilih foto ${idx + 1}`}
                          >
                            <SmartImage src={src} alt={`${item.nama} ${idx + 1}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="umkm-hero-card__info">
                    <div className="umkm-hero-card__badges">
                      <span className="pill pill--green">{item.kategoriLabel}</span>
                      {item.statusBuka && <span className="pill pill--mint">{item.statusBuka}</span>}
                      <span className="pill pill--outline">{item.dusun}</span>
                    </div>

                    <h1 id="umkm-detail-title" className="text-heading-lg umkm-hero-card__title">
                      {item.nama}
                    </h1>
                    <p className="umkm-hero-card__desc">{item.ringkasan}</p>

                    <div className="umkm-price-box">
                      <span className="umkm-price-box__eyebrow">RENTANG HARGA MENU</span>
                      <div className="umkm-price-box__row">
                        <strong className="text-heading-md">{item.hargaLabel}</strong>
                        {item.hargaSatuan && <span>{item.hargaSatuan}</span>}
                      </div>
                      {item.hargaBadge && (
                        <span className="umkm-price-box__pill">% {item.hargaBadge}</span>
                      )}
                    </div>

                    <dl className="umkm-spec-grid">
                      <div className="umkm-spec-item">
                        <span className="umkm-spec-item__icon"><User size={15} /></span>
                        <div>
                          <dt>Pemilik Usaha</dt>
                          <dd>{item.pemilik}</dd>
                        </div>
                      </div>
                      <div className="umkm-spec-item">
                        <span className="umkm-spec-item__icon"><Clock size={15} /></span>
                        <div>
                          <dt>Jam Operasional</dt>
                          <dd>{item.jamOperasional}</dd>
                        </div>
                      </div>
                      <div className="umkm-spec-item">
                        <span className="umkm-spec-item__icon"><MapPin size={15} /></span>
                        <div>
                          <dt>Alamat Lengkap</dt>
                          <dd>{item.alamat}</dd>
                        </div>
                      </div>
                      <div className="umkm-spec-item">
                        <span className="umkm-spec-item__icon"><Wallet size={15} /></span>
                        <div>
                          <dt>Metode Pembayaran</dt>
                          <dd>{item.pembayaran}</dd>
                        </div>
                      </div>
                    </dl>

                    <div className="umkm-hero-card__actions">
                      <a
                        href={waGeneral}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-pill--primary umkm-hero-card__wa"
                      >
                        <MessageCircle size={16} aria-hidden="true" /> Pesan via WhatsApp
                      </a>
                      <a
                        href={item.mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-pill--soft"
                      >
                        <Navigation size={15} aria-hidden="true" /> Rute Lokasi
                      </a>
                      <button
                        type="button"
                        onClick={handleShare}
                        className="umkm-share-icon-btn"
                        aria-label="Salin tautan UMKM"
                        title={copied ? "Tautan tersalin!" : "Bagikan tautan"}
                      >
                        {copied ? <Check size={16} /> : <Share2 size={16} />}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Section 2: Deskripsi Usaha & Ragam Pilihan Menu */}
                <section className="umkm-section-box" aria-labelledby="deskripsi-menu-heading">
                  <div className="section-head__text umkm-section-box__head">
                    <h2 id="deskripsi-menu-heading">Deskripsi Usaha &amp; Ragam Pilihan Menu</h2>
                    <p>Profil perkembangan usaha mikro dan daftar lengkap paket sajian maupun produk</p>
                  </div>

                  <div className="umkm-story-grid">
                    {(Array.isArray(item.deskripsiLengkap) && item.deskripsiLengkap.length > 0
                      ? item.deskripsiLengkap
                      : [item.deskripsi || item.ringkasan || "Informasi profil usaha desa."]
                    ).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {((item.menu && item.menu.length > 0) || (item.menus && item.menus.length > 0)) && (
                    <div className="umkm-menu-wrap">
                      <div className="umkm-menu-wrap__head">
                        <h3>Daftar Menu &amp; Harga Resmi</h3>
                        {item.catatanMenu && <span>{item.catatanMenu}</span>}
                      </div>

                      <div className="umkm-menu-grid">
                        {(item.menu || item.menus || []).map((m) => {
                          const waMenu = item.whatsapp ? `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                            `Halo ${item.pemilik}, saya mau pesan "${m.nama}" (${m.harga}) dari ${item.nama}.`
                          )}` : '#';
                          return (
                            <article className="menu-tile" key={m.id || m.nama}>
                              {m.badge && <span className="menu-tile__badge">{m.badge}</span>}
                              <h4>{m.nama}</h4>
                              {m.deskripsi && <p>{m.deskripsi}</p>}
                              <div className="menu-tile__foot">
                                <strong>{m.harga}</strong>
                                {item.whatsapp && (
                                  <a
                                    href={waMenu}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="menu-tile__order"
                                    aria-label={`Pesan ${m.nama} via WhatsApp`}
                                    title={`Pesan ${m.nama}`}
                                  >
                                    <ShoppingBag size={14} />
                                  </a>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 3: Peta Lokasi & Aksesibilitas */}
                <section className="umkm-section-box" aria-labelledby="lokasi-heading">
                  <div className="section-head__text umkm-section-box__head">
                    <h2 id="lokasi-heading">Peta Lokasi &amp; Aksesibilitas</h2>
                    <p>Panduan menuju gerai {item.nama} di {item.dusun || 'Desa Tambakrigadung'}</p>
                  </div>

                  <div className="umkm-map-grid">
                    <div className="umkm-map-frame">
                      <iframe
                        title={`Peta lokasi ${item.nama}`}
                        src={item.mapEmbedUrl || "https://www.google.com/maps?q=Tambakrigadung,+Tikung,+Lamongan+Regency,+East+Java&output=embed"}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <span className="umkm-map-frame__pill">
                        <MapPin size={13} aria-hidden="true" /> Lokasi: {item.patokanLokasi || item.alamat || 'Desa Tambakrigadung'}
                      </span>
                    </div>

                    <div className="umkm-direction-card">
                      <span className="umkm-direction-card__eyebrow">
                        <Navigation size={13} aria-hidden="true" /> PETUNJUK ARAH
                      </span>
                      <p>{item.petunjukArah?.deskripsi || item.patokanLokasi || 'Akses jalan utama desa mudah dijangkau.'}</p>

                      {Array.isArray(item.petunjukArah?.fasilitas) && item.petunjukArah.fasilitas.length > 0 && (
                        <ul className="umkm-direction-card__list">
                          {item.petunjukArah.fasilitas.map((f) => (
                            <li key={f}>
                              <CheckCircle2 size={15} aria-hidden="true" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.mapsHref && (
                        <a
                          href={item.mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill btn-pill--soft umkm-direction-card__btn"
                        >
                          Buka di Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 4: UMKM Pilihan Lainnya */}
                {related?.length > 0 && (
                  <section className="related-section" aria-labelledby="umkm-related-heading">
                    <div className="related-section__head">
                      <div className="section-head__text">
                        <h2 id="umkm-related-heading">UMKM Pilihan Lainnya</h2>
                        <p>Jelajahi produk lokal berkualitas lainnya hasil karya warga binaan Desa Tambakrigadung</p>
                      </div>
                      <Link to="/umkm" className="btn-pill btn-pill--primary btn-pill--xs">
                        Lihat Semua UMKM <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="related-grid">
                      {related.map((rel) => (
                        <article className="umkm-card" key={rel.id}>
                          <Link to={`/umkm/${rel.slug}`} className="umkm-card__media">
                            <SmartImage src={rel.image} alt={rel.nama} />
                            <span className="umkm-card__badge">{rel.kategoriLabel}</span>
                          </Link>
                          <div className="umkm-card__body">
                            <p className="umkm-card__loc">
                              <User size={12} aria-hidden="true" /> {rel.pemilik} • {rel.dusun}
                            </p>
                            <h3 className="umkm-card__title">
                              <Link to={`/umkm/${rel.slug}`}>{rel.nama}</Link>
                            </h3>
                            <p className="umkm-card__excerpt">{rel.ringkasan}</p>
                            <div className="umkm-card__footer">
                              <div className="umkm-card__price-wrap">
                                <span className="umkm-card__price-label">Harga Mulai</span>
                                <strong className="umkm-card__price">{rel.hargaMulai}</strong>
                              </div>
                              <Link
                                to={`/umkm/${rel.slug}`}
                                className="btn-pill btn-pill--primary btn-pill--xs"
                              >
                                Lihat Detail <ChevronRight size={13} aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {/* Section 5: Bottom CTA Strip */}
                <UmkmCta variant="compact" />

                {/* Lightbox Modal untuk Zoom Foto */}
                {lightboxOpen && (
                  <div
                    className="modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Pratinjau foto besar"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="lightbox-box__close"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Tutup pratinjau"
                      >
                        <X size={20} />
                      </button>
                      <img src={currentPhoto} alt={item.nama} />
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </AsyncBlock>
      </div>
    </div>
  );
}