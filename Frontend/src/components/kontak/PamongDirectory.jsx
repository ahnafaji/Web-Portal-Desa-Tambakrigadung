import { Users, Phone, MessageCircle } from "lucide-react";

export default function PamongDirectory({ pamong }) {
  return (
    <section className="kontak-panel" aria-labelledby="pamong-heading">
      <div className="kontak-panel__head">
        <div>
          <p className="kontak-panel__eyebrow">
            <Users size={13} aria-hidden="true" /> {pamong.eyebrow}
          </p>
          <h2 id="pamong-heading" className="text-heading-sm">{pamong.judul}</h2>
        </div>
        <p className="kontak-panel__sub">{pamong.subjudul}</p>
      </div>

      <div className="pamong-grid">
        {pamong.items.map((p) => (
          <article className="pamong-card" key={p.nama}>
            <div className="pamong-card__top">
              <span className={`pamong-avatar pamong-avatar--${p.warna}`}>
                {p.inisial}
              </span>
              <div>
                <h3>{p.nama}</h3>
                <p>{p.jabatan}</p>
                <span className="pamong-card__tag">{p.bidang}</span>
              </div>
            </div>

            <div className="pamong-card__foot">
              <span className="pamong-card__phone">{p.telepon}</span>
              <div className="pamong-card__actions">
                <a
                  href={`https://wa.me/${p.wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pamong-icon-btn"
                  aria-label={`Chat WhatsApp ${p.nama}`}
                  title="Chat WhatsApp"
                >
                  <MessageCircle size={14} />
                </a>
                <a
                  href={`tel:${p.telepon.replace(/[^+\d]/g, "")}`}
                  className="pamong-icon-btn"
                  aria-label={`Telepon ${p.nama}`}
                  title="Panggil Telepon"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}