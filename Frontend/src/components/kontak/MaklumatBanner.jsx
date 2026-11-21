import { ShieldCheck, Award } from "lucide-react";

export default function MaklumatBanner({ maklumat }) {
  return (
    <section className="maklumat-banner" aria-labelledby="maklumat-heading">
      <span className="maklumat-banner__shield">
        <ShieldCheck size={28} aria-hidden="true" />
      </span>

      <div className="maklumat-banner__body">
        <span className="pill pill--green">{maklumat.badge}</span>
        <h2 id="maklumat-heading" className="text-heading-sm">{maklumat.judul}</h2>
        <blockquote>{maklumat.kutipan}</blockquote>

        <div className="maklumat-banner__foot">
          <small>{maklumat.catatan}</small>
          <div className="maklumat-banner__sign">
            <div>
              <strong>{maklumat.pejabat}</strong>
              <span>{maklumat.jabatan}</span>
            </div>
            <Award size={20} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}