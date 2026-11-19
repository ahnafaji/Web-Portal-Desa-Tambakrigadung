import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import SmartImage from "../common/SmartImage.jsx";
import { getIcon } from "../../utils/icons.js";

function ActionButton({ a }) {
  const Icon = getIcon(a.ikon);
  const cls = `btn-pill ${a.primary ? "btn-pill--primary" : "btn-pill--soft"}`;
  const content = (<><Icon size={16} aria-hidden="true" /> {a.label}</>);
  if (a.to) return <Link to={a.to} className={cls}>{content}</Link>;
  return <a href={a.href} className={cls} target="_blank" rel="noopener noreferrer">{content}</a>;
}

// Satu kartu potensi. Foto kiri/kanan bergantian lewat CSS (nth-child), di mobile selalu foto di atas.
export default function PotensiCard({ item }) {
  const BadgeIcon = getIcon(item.ikon);
  return (
    <article className="potensi-card" aria-labelledby={`potensi-${item.id}`}>
      <div className="potensi-card__media">
        <SmartImage src={item.image} alt={item.judul} />
        <span className="media-badge"><BadgeIcon size={14} aria-hidden="true" /> {item.kategoriLabel}</span>
      </div>

      <div className="potensi-card__body">
        <p className="potensi-card__loc"><MapPin size={14} aria-hidden="true" /> {item.lokasi}</p>
        <h2 className="text-heading-sm" id={`potensi-${item.id}`}>{item.judul}</h2>
        {item.deskripsi.map((p, i) => <p className="potensi-card__text" key={i}>{p}</p>)}

        {item.info?.length > 0 && (
          <dl className="info-grid">
            {item.info.map((it) => {
              const Icon = getIcon(it.ikon);
              return (
                <div className="info-tile" key={it.label}>
                  <dt><Icon size={14} aria-hidden="true" /> {it.label}</dt>
                  <dd>{it.value}</dd>
                </div>
              );
            })}
          </dl>
        )}

        <div className="potensi-card__actions">{item.aksi.map((a) => <ActionButton a={a} key={a.label} />)}</div>
      </div>
    </article>
  );
}