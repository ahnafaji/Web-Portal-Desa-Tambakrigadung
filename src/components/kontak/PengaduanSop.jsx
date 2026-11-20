import { ShieldCheck } from "lucide-react";
import { getIcon } from "../../utils/icons.js";

export default function PengaduanSop({ sop }) {
  return (
    <section className="kontak-panel" aria-labelledby="sop-heading">
      <div className="kontak-panel__head">
        <div>
          <p className="kontak-panel__eyebrow">
            <ShieldCheck size={13} aria-hidden="true" /> {sop.eyebrow}
          </p>
          <h2 id="sop-heading" className="text-heading-sm">{sop.judul}</h2>
        </div>
        <p className="kontak-panel__sub">{sop.subjudul}</p>
      </div>

      <div className="sop-grid">
        {sop.steps.map((step) => {
          const Icon = getIcon(step.ikon);
          return (
            <article className="sop-card" key={step.nomor}>
              <div className="sop-card__top">
                <span className="sop-card__num">{step.nomor}</span>
                <Icon size={16} className="sop-card__icon" aria-hidden="true" />
              </div>
              <h3>{step.judul}</h3>
              <p>{step.deskripsi}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}