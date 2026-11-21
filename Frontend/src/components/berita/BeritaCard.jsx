import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";
import { formatTanggal } from "../../utils/format.js";

export default function BeritaCard({ item }) {
  return (
    <article className="berita-card">
      <Link to={`/berita/${item.slug}`} className="berita-card__media">
        <SmartImage src={item.image} alt={item.judul} />
        <span className="berita-card__badge">{item.kategoriLabel}</span>
      </Link>

      <div className="berita-card__body">
        <p className="berita-card__date">
          <CalendarDays size={13} aria-hidden="true" /> {formatTanggal(item.tanggal)}
        </p>

        <h3 className="berita-card__title">
          <Link to={`/berita/${item.slug}`}>{item.judul}</Link>
        </h3>

        <p className="berita-card__excerpt">{item.ringkasan}</p>

        <div className="berita-card__footer">
          <Link to={`/berita/${item.slug}`} className="btn-pill btn-pill--primary btn-pill--xs">
            Lihat Detail <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}