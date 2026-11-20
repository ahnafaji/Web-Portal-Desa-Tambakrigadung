import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";
import { formatTanggal } from "../../utils/format.js";

export default function GaleriCard({ item, showPhotoCount = false }) {
  return (
    <article className="galeri-card">
      <Link to={`/galeri/${item.slug}`} className="galeri-card__media">
        <SmartImage src={item.image} alt={item.judulLengkap || item.judul} />
        <span className="galeri-card__badge">{item.kategoriLabel}</span>
      </Link>

      <div className="galeri-card__body">
        {showPhotoCount && (
          <p className="galeri-card__date-top">
            <CalendarDays size={13} aria-hidden="true" /> {formatTanggal(item.tanggal)}
          </p>
        )}

        <h3 className="galeri-card__title">
          <Link to={`/galeri/${item.slug}`}>
            {showPhotoCount ? item.judulLengkap : item.judul}
          </Link>
        </h3>

        <div className="galeri-card__footer">
          {showPhotoCount ? (
            <span className="galeri-card__meta">{item.jumlahFoto} Foto Tersedia</span>
          ) : (
            <span className="galeri-card__meta">
              <CalendarDays size={13} aria-hidden="true" /> {formatTanggal(item.tanggal)}
            </span>
          )}

          <Link to={`/galeri/${item.slug}`} className="btn-pill btn-pill--primary btn-pill--xs">
            Lihat Detail {showPhotoCount && <ArrowRight size={13} aria-hidden="true" />}
          </Link>
        </div>
      </div>
    </article>
  );
}