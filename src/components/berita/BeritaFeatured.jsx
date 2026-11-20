import { Link } from "react-router-dom";
import { Star, CalendarDays, User, Clock, ArrowRight, Eye } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";
import { formatTanggal } from "../../utils/format.js";

export default function BeritaFeatured({ item }) {
  if (!item) return null;

  return (
    <article className="berita-featured" aria-labelledby="featured-news-title">
      <Link to={`/berita/${item.slug}`} className="berita-featured__media">
        <SmartImage src={item.image} alt={item.judul} />
        <span className="berita-featured__badge">
          <Star size={12} fill="currentColor" aria-hidden="true" /> BERITA UTAMA
        </span>
      </Link>

      <div className="berita-featured__body">
        <div className="berita-meta">
          <span><CalendarDays size={14} aria-hidden="true" /> {formatTanggal(item.tanggal)}</span>
          <span className="berita-meta__dot">•</span>
          <span><User size={14} aria-hidden="true" /> {item.penulis}</span>
          <span className="berita-meta__dot">•</span>
          <span><Clock size={14} aria-hidden="true" /> {item.waktuBaca}</span>
        </div>

        <h2 id="featured-news-title" className="text-heading-md berita-featured__title">
          <Link to={`/berita/${item.slug}`}>{item.judul}</Link>
        </h2>

        <p className="berita-featured__excerpt">{item.ringkasan}</p>

        <div className="berita-featured__footer">
          <Link to={`/berita/${item.slug}`} className="btn-pill btn-pill--primary">
            Baca Selengkapnya <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <span className="berita-featured__views">
            <Eye size={15} aria-hidden="true" /> {item.pembaca} Pembaca
          </span>
        </div>
      </div>
    </article>
  );
}