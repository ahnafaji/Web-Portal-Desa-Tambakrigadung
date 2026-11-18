import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { formatTanggal } from "../../utils/format.js";

export default function ContentCard({ image, title, date, to }) {
  return (
    <article className="card">
      <img className="card__img" src={image} alt={title} loading="lazy" />
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <div className="card__meta">
          <span className="card__date"><CalendarDays size={14} /> {formatTanggal(date)}</span>
          <Link to={to} className="btn btn--sm">Lihat Detail</Link>
        </div>
      </div>
    </article>
  );
}
