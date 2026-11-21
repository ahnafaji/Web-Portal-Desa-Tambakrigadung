import { Link } from "react-router-dom";
import { MapPin, Clock, Star, ShieldCheck, MessageCircle, ChevronRight } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";

export default function UmkmCard({ item, variant = "default" }) {
  const isHorizontal = variant === "featured-row";
  const waUrl = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
    `Halo ${item.pemilik}, saya ingin memesan produk dari "${item.nama}" melalui Portal Desa Tambakrigadung.`
  )}`;

  return (
    <article className={`umkm-card${isHorizontal ? " umkm-card--horizontal" : ""}`}>
      <Link to={`/umkm/${item.slug}`} className="umkm-card__media">
        <SmartImage src={item.image} alt={item.nama} />
        <span className="umkm-card__badge">{item.badgeUtama || item.kategoriLabel}</span>
        {item.ratingLabel && (
          <span className="umkm-card__rating">
            {item.ratingLabel.includes("Garansi") ? (
              <ShieldCheck size={12} aria-hidden="true" />
            ) : (
              <Star size={12} fill="currentColor" aria-hidden="true" />
            )}{" "}
            {item.ratingLabel}
          </span>
        )}
      </Link>

      <div className="umkm-card__body">
        <div className="umkm-card__loc">
          <span><MapPin size={13} aria-hidden="true" /> {item.dusun}</span>
          {isHorizontal && item.statusBuka && (
            <span>• <Clock size={12} aria-hidden="true" /> {item.statusBuka}</span>
          )}
        </div>

        <h3 className="umkm-card__title">
          <Link to={`/umkm/${item.slug}`}>{item.nama}</Link>
        </h3>

        <p className="umkm-card__excerpt">{item.ringkasan}</p>

        {item.tags?.length > 0 && (
          <div className="umkm-card__tags">
            {item.tags.map((tag) => (
              <span className="umkm-tag" key={tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className="umkm-card__footer">
          <div className="umkm-card__price-wrap">
            <span className="umkm-card__price-label">
              {item.hargaMulai === "Sesuai Rancangan" ? "Estimasi Biaya" : "Mulai dari"}
            </span>
            <strong className="umkm-card__price">{item.hargaLabel}</strong>
          </div>

          <div className="umkm-card__actions">
            <Link to={`/umkm/${item.slug}`} className="btn-pill btn-pill--soft btn-pill--xs">
              Lihat Detail <ChevronRight size={13} aria-hidden="true" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill--primary btn-pill--xs"
            >
              <MessageCircle size={13} aria-hidden="true" /> Pesan WA
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}