import { useCallback, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Home, ChevronRight, CalendarDays, User, Eye, Clock, Tag, Link2, Check, ArrowRight,
} from "lucide-react";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import SmartImage from "../components/common/SmartImage.jsx";
import BeritaSidebar from "../components/berita/BeritaSidebar.jsx";
import BeritaCard from "../components/berita/BeritaCard.jsx";
import { formatTanggal } from "../utils/format.js";

export default function BeritaDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const fetcher = useCallback((opts) => api.getBeritaDetail(slug, opts), [slug]);
  const state = useFetch(fetcher);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCopied(false);
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
    <div className="page berita-detail-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={600}>
          {(d) => {
            const { article, related, populer, kategoriSidebar } = d;
            const shareUrl = encodeURIComponent(window.location.href);
            const shareTitle = encodeURIComponent(article.judul);

            return (
              <>
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  <Link to="/"><Home size={14} aria-hidden="true" /> Home</Link>
                  <ChevronRight size={12} aria-hidden="true" />
                  <Link to="/berita">Kabar &amp; Artikel</Link>
                  <ChevronRight size={12} aria-hidden="true" />
                  <span aria-current="page">Detail Berita</span>
                </nav>

                <div className="berita-layout">
                  {/* Kolom Kiri: Isi Artikel */}
                  <article className="article-box">
                    <div className="article-box__badges">
                      <span className="pill pill--green">{article.kategoriLabel}</span>
                      {article.subLabel && (
                        <span className="pill pill--outline">{article.subLabel}</span>
                      )}
                    </div>

                    <h1 className="text-heading-lg article-box__title">{article.judul}</h1>

                    <div className="article-box__meta">
                      <span><CalendarDays size={14} aria-hidden="true" /> {formatTanggal(article.tanggal)}</span>
                      <span className="berita-meta__dot">•</span>
                      <span><User size={14} aria-hidden="true" /> {article.penulis}</span>
                      <span className="berita-meta__dot">•</span>
                      <span><Eye size={14} aria-hidden="true" /> {article.pembaca} Kali Dilihat</span>
                      <span className="berita-meta__dot">•</span>
                      <span><Clock size={14} aria-hidden="true" /> {article.waktuBaca}</span>
                    </div>

                    <figure className="article-box__figure">
                      <div className="article-box__img-wrap">
                        <SmartImage src={article.image} alt={article.judul} />
                      </div>
                      {article.caption && (
                        <figcaption className="article-box__caption">{article.caption}</figcaption>
                      )}
                    </figure>

                    <div className="article-box__content">
                      {article.konten.map((block, index) => {
                        if (block.type === "heading") {
                          return (
                            <h2 key={index} className="article-box__subheading">
                              {block.text}
                            </h2>
                          );
                        }
                        if (block.type === "quote") {
                          return (
                            <blockquote key={index} className="article-quote">
                              <span className="article-quote__mark" aria-hidden="true">&rdquo;</span>
                              <p className="article-quote__text">&ldquo;{block.text}&rdquo;</p>
                              <footer className="article-quote__author">
                                <strong>{block.author}</strong> — <span>{block.role}</span>
                              </footer>
                            </blockquote>
                          );
                        }
                        return (
                          <p key={index} className="article-box__paragraph">
                            {index === 0 && article.dateline && (
                              <strong className="article-box__dateline">{article.dateline} </strong>
                            )}
                            {block.text}
                          </p>
                        );
                      })}
                    </div>

                    {/* Topik / Tags */}
                    {article.tags?.length > 0 && (
                      <div className="article-tags">
                        <span className="article-tags__label">
                          <Tag size={14} aria-hidden="true" /> Topik:
                        </span>
                        <div className="article-tags__list">
                          {article.tags.map((t) => (
                            <Link
                              key={t}
                              to={`/berita?q=${encodeURIComponent(t)}`}
                              className="tag-pill"
                            >
                              #{t}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bagikan Artikel */}
                    <div className="article-share">
                      <span className="article-share__label">Bagikan Artikel Ini:</span>
                      <div className="article-share__buttons">
                        <a
                          href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share-btn share-btn--wa"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share-btn share-btn--fb"
                        >
                          Facebook
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="share-btn share-btn--x"
                        >
                          X / Twitter
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="share-btn share-btn--copy"
                        >
                          {copied ? (
                            <><Check size={14} aria-hidden="true" /> Tersalin</>
                          ) : (
                            <><Link2 size={14} aria-hidden="true" /> Salin Tautan</>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Kolom Kanan: Sidebar */}
                  <BeritaSidebar
                    searchTitle="Cari Informasi"
                    searchPlaceholder="Cari berita atau pengumuman..."
                    kategoriTitle="Kategori Berita"
                    onSearch={(q) => navigate(q ? `/berita?q=${encodeURIComponent(q)}` : "/berita")}
                    populer={populer}
                    kategoriList={kategoriSidebar}
                    aktifKategori={article.kategori}
                    onSelectKategori={(kat) =>
                      navigate(kat === "semua" ? "/berita" : `/berita?kategori=${kat}`)
                    }
                    showGaleriCta
                  />
                </div>

                {/* Bagian Bawah: Berita Terkait Lainnya */}
                {related?.length > 0 && (
                  <section className="related-section" aria-labelledby="related-heading">
                    <div className="related-section__head">
                      <div className="section-head__text">
                        <h2 id="related-heading">Berita Terkait Lainnya</h2>
                        <p>Informasi dan liputan kegiatan desa lainnya yang mungkin Anda lewatkan</p>
                      </div>
                      <Link to="/berita" className="related-section__all">
                        Lihat Semua Berita <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="related-grid">
                      {related.map((item) => (
                        <BeritaCard key={item.id} item={item} />
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