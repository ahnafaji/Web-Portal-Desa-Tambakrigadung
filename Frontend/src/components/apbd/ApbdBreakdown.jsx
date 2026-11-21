import { Info } from "lucide-react";
import { formatRupiah } from "../../utils/format.js";

export default function ApbdBreakdown({ pendapatan, belanja }) {
  return (
    <section className="apbd-breakdown-grid" aria-label="Rincian Pendapatan dan Belanja Desa">
      <article className="apbd-panel">
        <div className="apbd-panel__head">
          <div className="section-head__text">
            <h2>{pendapatan.judul}</h2>
          </div>
          <span className="pill pill--green">{pendapatan.badge}</span>
        </div>

        <ul className="apbd-list">
          {pendapatan.items.map((row) => (
            <li className="apbd-list__row" key={row.sumber}>
              <span>{row.sumber}</span>
              <strong>{formatRupiah(row.nominal)}</strong>
            </li>
          ))}
        </ul>

        <div className="apbd-panel__note">
          <Info size={15} aria-hidden="true" />
          <p>{pendapatan.catatan}</p>
        </div>
      </article>

      <article className="apbd-panel">
        <div className="apbd-panel__head">
          <div className="section-head__text">
            <h2>{belanja.judul}</h2>
          </div>
          <span className="pill pill--green">{belanja.badge}</span>
        </div>

        <ul className="apbd-list">
          {belanja.items.map((row) => (
            <li className="apbd-list__row" key={row.bidang}>
              <span>{row.bidang}</span>
              <strong>{formatRupiah(row.nominal)}</strong>
            </li>
          ))}
        </ul>

        <div className="apbd-panel__note">
          <Info size={15} aria-hidden="true" />
          <p>{belanja.catatan}</p>
        </div>
      </article>
    </section>
  );
}