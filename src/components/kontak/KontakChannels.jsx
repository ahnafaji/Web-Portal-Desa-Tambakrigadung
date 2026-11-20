import { ArrowRight } from "lucide-react";
import { getIcon } from "../../utils/icons.js";

export default function KontakChannels({ channels }) {
  return (
    <section className="kontak-channels" aria-label="Saluran komunikasi utama desa">
      {channels.map((ch) => {
        const Icon = getIcon(ch.ikon);
        const isFeatured = ch.varian === "featured";
        return (
          <article
            key={ch.key}
            className={`channel-card channel-card--${ch.varian}`}
          >
            <div className="channel-card__top">
              <span className="channel-card__icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="channel-card__status">{ch.status}</span>
            </div>

            <h2 className="channel-card__title">{ch.judul}</h2>
            <p className="channel-card__desc">{ch.deskripsi}</p>

            <div className="channel-card__highlight">{ch.highlight}</div>

            <a
              href={ch.href}
              target={ch.external ? "_blank" : undefined}
              rel={ch.external ? "noopener noreferrer" : undefined}
              className={`channel-card__cta${isFeatured ? " is-featured" : ""}`}
            >
              <span>{ch.ctaLabel}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </article>
        );
      })}
    </section>
  );
}