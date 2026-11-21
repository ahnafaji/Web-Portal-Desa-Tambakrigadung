import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, ArrowUpRight } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";

export default function UmkmFeatured({ featured }) {
  if (!featured) return null;

  const waUrl = `https://wa.me/${featured.whatsapp}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk "${featured.judul}" di Portal Desa Tambakrigadung.`
  )}`;

  return (
    <section className="umkm-featured" aria-labelledby="umkm-featured-title">
      <div className="umkm-featured__body">
        <span className="pill pill--glass">
          <Sparkles size={13} aria-hidden="true" /> {featured.badge}
        </span>

        <h2 id="umkm-featured-title" className="text-heading-md umkm-featured__title">
          {featured.judul}
        </h2>

        <p className="umkm-featured__desc">{featured.deskripsi}</p>

        <dl className="umkm-featured__meta">
          {featured.info.map((item) => (
            <div className="umkm-featured__tile" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="umkm-featured__footer">
          <div>
            <span className="umkm-featured__price-label">{featured.hargaLabel}</span>
            <p className="umkm-featured__price">
              <strong>{featured.harga}</strong> <span>{featured.hargaSatuan}</span>
            </p>
          </div>

          <div className="umkm-featured__actions">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill--white">
              <MessageCircle size={15} aria-hidden="true" /> Hubungi Pengrajin (WA)
            </a>
            <Link
              to={`/umkm/${featured.slug}`}
              className="umkm-featured__circle-btn"
              aria-label={`Lihat detail ${featured.judul}`}
            >
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      <Link to={`/umkm/${featured.slug}`} className="umkm-featured__media">
        <SmartImage src={featured.image} alt={featured.judul} />
        <span className="umkm-featured__caption">{featured.imageCaption}</span>
      </Link>
    </section>
  );
}