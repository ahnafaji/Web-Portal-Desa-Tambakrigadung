import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Home, ChevronRight, ChevronLeft, CalendarDays, MapPin, Image as ImageIcon, User,
  Link2, Check, Download, FileText, ArrowRight, FolderArchive, Users, Landmark, CheckCircle2,
} from "lucide-react";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import SmartImage from "../components/common/SmartImage.jsx";
import GaleriCard from "../components/galeri/GaleriCard.jsx";
import { formatTanggal } from "../utils/format.js";
import { getIcon } from "../utils/icons.js";

export default function GaleriDetailPage() {
  const { slug } = useParams();
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetcher = useCallback((opts) => api.getGaleriDetail(slug, opts), [slug]);
  const state = useFetch(fetcher);

  useEffect(() => {
    setActiveIdx(0);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="page galeri-detail-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={600}>
          {({ item, related }) => {
            const photos = item.fotos?.length
              ? item.fotos
              : [{ src: item.image, caption: item.judulLengkap || item.judul }];
            const safeIdx = Math.min(activeIdx, photos.length - 1);
            const current = photos[safeIdx];

            const prevSlide = () =>
              setActiveIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
            const nextSlide = () =>
              setActiveIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));

            const shareUrl = encodeURIComponent(window.location.href);
            const shareTitle = encodeURIComponent(item.judulLengkap || item.judul);

            return (
              <>
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
                  <ChevronRight size={12} aria-hidden="true" />
                  <Link to="/galeri">Galeri</Link>
                  <ChevronRight size={12} aria-hidden="true" />
                  <span aria-current="page">Detail Dokumentasi</span>
                </nav>

                <section className="galeri-detail-box" aria-labelledby="galeri-detail-title">
                  <div className="galeri-detail-box__badges">
                    <span className="pill pill--green">{item.kategoriLabel}</span>
                    {item.arsipBadge && (
                      <span className="pill pill--outline">
                        <FolderArchive size={12} aria-hidden="true" /> {item.arsipBadge}
                      </span>
                    )}
                  </div>

                  <h1 id="galeri-detail-title" className="text-heading-lg galeri-detail-box__title">
                    {item.judulLengkap || item.judul}
                  </h1>

                  <div className="galeri-detail-box__meta">
                    <span><CalendarDays size={14} aria-hidden="true" /> {formatTanggal(item.tanggal)}</span>
                    <span><MapPin size={14} aria-hidden="true" /> {item.lokasi}</span>
                    <span><ImageIcon size={14} aria-hidden="true" /> {photos.length} Foto Dokumentasi</span>
                    <span><User size={14} aria-hidden="true" /> Dokumentasi: {item.dokumentator}</span>
                  </div>

                  {/* Carousel Foto Utama */}
                  <div className="galeri-slider">
                    <div className="galeri-slider__stage">
                      <SmartImage src={current.src} alt={current.caption || item.judul} />

                      {photos.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="galeri-slider__arrow galeri-slider__arrow--prev"
                            onClick={prevSlide}
                            aria-label="Foto sebelumnya"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            type="button"
                            className="galeri-slider__arrow galeri-slider__arrow--next"
                            onClick={nextSlide}
                            aria-label="Foto berikutnya"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}

                      <div className="galeri-slider__overlay">
                        <p className="galeri-slider__caption">{current.caption}</p>
                        <span className="galeri-slider__counter">
                          <ImageIcon size={13} aria-hidden="true" /> {safeIdx + 1} / {photos.length} Foto
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {photos.length > 1 && (
                      <div className="galeri-slider__thumbs">
                        {photos.map((photo, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`galeri-slider__thumb${idx === safeIdx ? " is-active" : ""}`}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`Tampilkan foto ke-${idx + 1}`}
                          >
                            <SmartImage src={photo.src} alt={`Thumbnail ${idx + 1}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3 Kartu Highlight Metrik Kegiatan */}
                  {item.highlights?.length > 0 && (
                    <div className="galeri-metrics">
                      {item.highlights.map((h) => {
                        const Icon = getIcon(h.ikon);
                        return (
                          <div className="galeri-metric-tile" key={h.label}>
                            <span className="galeri-metric-tile__icon">
                              <Icon size={18} aria-hidden="true" />
                            </span>
                            <div>
                              <span className="galeri-metric-tile__label">{h.label}</span>
                              <strong className="galeri-metric-tile__val">{h.value}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Panel Ringkasan Liputan Kegiatan */}
                  {item.ringkasan && (
                    <div className="galeri-summary-panel">
                      <div className="galeri-summary-panel__head">
                        <div className="section-head__text">
                          <h2>Ringkasan Liputan Kegiatan</h2>
                        </div>
                        <span className="galeri-summary-panel__tag">
                          <FolderArchive size={13} aria-hidden="true" /> Publikasi Dokumentasi Resmi
                        </span>
                      </div>

                      <dl className="galeri-summary-grid">
                        <div className="galeri-summary-item">
                          <span className="galeri-summary-item__icon"><CalendarDays size={15} /></span>
                          <div>
                            <dt>TANGGAL</dt>
                            <dd>{item.ringkasan.tanggal}</dd>
                          </div>
                        </div>

                        <div className="galeri-summary-item">
                          <span className="galeri-summary-item__icon"><MapPin size={15} /></span>
                          <div>
                            <dt>LOKASI KEGIATAN</dt>
                            <dd>{item.ringkasan.lokasi}</dd>
                          </div>
                        </div>

                        <div className="galeri-summary-item">
                          <span className="galeri-summary-item__icon"><Users size={15} /></span>
                          <div>
                            <dt>PARTISIPAN</dt>
                            <dd>{item.ringkasan.partisipan}</dd>
                          </div>
                        </div>

                        <div className="galeri-summary-item">
                          <span className="galeri-summary-item__icon"><Landmark size={15} /></span>
                          <div>
                            <dt>PENYELENGGARA</dt>
                            <dd>{item.ringkasan.penyelenggara}</dd>
                          </div>
                        </div>

                        <div className="galeri-summary-item galeri-summary-item--wide">
                          <span className="galeri-summary-item__icon"><CheckCircle2 size={15} /></span>
                          <div>
                            <dt>HASIL / CAPAIAN KEGIATAN</dt>
                            <dd>{item.ringkasan.capaian}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  )}

                  {/* Bilah Bagikan & Aksi Bawah */}
                  <div className="galeri-action-bar">
                    <div className="galeri-action-bar__share">
                      <span>Bagikan:</span>
                      <a
                        href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="galeri-share-pill galeri-share-pill--wa"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="galeri-share-pill galeri-share-pill--fb"
                      >
                        Facebook
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="galeri-share-pill galeri-share-pill--x"
                      >
                        X / Twitter
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="galeri-share-pill galeri-share-pill--light"
                      >
                        {copied ? (
                          <><Check size={13} aria-hidden="true" /> Tersalin</>
                        ) : (
                          <><Link2 size={13} aria-hidden="true" /> Salin Tautan</>
                        )}
                      </button>
                    </div>

                    <div className="galeri-action-bar__cta">
                      <a
                        href={current.src}
                        download={`${item.slug}-foto-${safeIdx + 1}.jpg`}
                        className="btn-pill btn-pill--soft btn-pill--xs"
                      >
                        <Download size={14} aria-hidden="true" /> Unduh Foto (ZIP)
                      </a>
                      {item.beritaSlug && (
                        <Link
                          to={`/berita/${item.beritaSlug}`}
                          className="btn-pill btn-pill--primary btn-pill--xs"
                        >
                          <FileText size={14} aria-hidden="true" /> Baca Artikel Berita Lengkap
                        </Link>
                      )}
                    </div>
                  </div>
                </section>

                {/* Dokumentasi Galeri Lainnya */}
                {related?.length > 0 && (
                  <section className="related-section" aria-labelledby="galeri-related-heading">
                    <div className="related-section__head">
                      <div className="section-head__text">
                        <h2 id="galeri-related-heading">Dokumentasi Galeri Lainnya</h2>
                        <p>
                          Jelajahi arsip kegiatan warga, pembangunan infrastruktur, dan potensi desa lainnya di Desa Tambakrigadung
                        </p>
                      </div>
                      <Link to="/galeri" className="related-section__all">
                        Lihat Semua Galeri (140+ Foto) <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="related-grid">
                      {related.map((rel) => (
                        <GaleriCard key={rel.id} item={rel} showPhotoCount />
                      ))}
                    </div>
                  </section>
                )}
              </>
            );
          }}
        </AsyncBlock>
      </div>
    </div>
  );
}