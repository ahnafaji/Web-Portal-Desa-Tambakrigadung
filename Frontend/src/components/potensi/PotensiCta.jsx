import { Handshake, MessageCircle, Mail } from "lucide-react";

export default function PotensiCta({ cta }) {
  return (
    <section className="cta" aria-labelledby="judul-cta">
      <div className="cta__body">
        <p className="pill pill--glass"><Handshake size={14} aria-hidden="true" /> {cta.badge}</p>
        <h2 className="text-heading-md" id="judul-cta">{cta.judul}</h2>
        <p className="cta__text">{cta.deskripsi}</p>
        <div className="cta__actions">
          <a className="btn-pill btn-pill--white" href={`https://wa.me/${cta.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> Hubungi via WhatsApp</a>
          <a className="btn-pill btn-pill--glass" href={`mailto:${cta.email}`}><Mail size={16} aria-hidden="true" /> Kirim Email</a>
        </div>
      </div>
      <span className="cta__circle" aria-hidden="true" />
    </section>
  );
}
