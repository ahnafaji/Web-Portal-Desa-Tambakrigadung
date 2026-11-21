import { RefreshCw } from "lucide-react";

export default function PotensiStats({ data }) {
  return (
    <section className="stats-panel" aria-labelledby="judul-potensi-angka">
      <div className="stats-panel__head">
        <div>
          <h2 className="text-heading-sm" id="judul-potensi-angka">{data.judul}</h2>
          <p className="stats-panel__sub">{data.subjudul}</p>
        </div>
        <p className="pill pill--green"><RefreshCw size={12} aria-hidden="true" /> {data.diperbarui}</p>
      </div>

      <div className="stat-grid">
        {data.items.map((s) => (
          <div className="stat-box" key={s.key}>
            <p className="stat-box__label">{s.label}</p>
            <p className="text-heading-md stat-box__value">{s.value}</p>
            <p className="stat-box__caption">{s.caption}</p>
            <div className="bar" role="progressbar" aria-valuenow={s.persen} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.label}: ${s.persen}%`}>
              <span style={{ width: `${Math.min(100, s.persen)}%` }} />
            </div>
          </div>
        ))}
      </div>
      {data.sumber && <p className="stats-panel__source">{data.sumber}</p>}
    </section>
  );
}
