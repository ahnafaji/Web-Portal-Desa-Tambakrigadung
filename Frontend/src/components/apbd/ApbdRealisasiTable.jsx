import { Clock } from "lucide-react";

const formatAngka = (num) => new Intl.NumberFormat("id-ID").format(num);

export default function ApbdRealisasiTable({ tabel }) {
  return (
    <section className="apbd-panel apbd-table-panel" aria-labelledby="apbd-table-heading">
      <div className="apbd-table-panel__head">
        <div className="section-head__text">
          <h2 id="apbd-table-heading">{tabel.judul}</h2>
          <p>{tabel.subjudul}</p>
        </div>
      </div>

      <div className="apbd-table-wrap">
        <table className="apbd-table">
          <thead>
            <tr>
              <th>Kode Rekening</th>
              <th>Uraian Bidang / Kegiatan</th>
              <th className="is-num">Anggaran Pagu (Rp)</th>
              <th className="is-num">Realisasi Keuangan (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {tabel.rows.map((row) => (
              <tr key={row.kode}>
                <td className="apbd-table__code">{row.kode}</td>
                <td>
                  <strong className="apbd-table__title">{row.kegiatan}</strong>
                  <span className="apbd-table__sub">{row.detail}</span>
                </td>
                <td className="is-num apbd-table__pagu">{formatAngka(row.pagu)}</td>
                <td className="is-num apbd-table__realisasi">{formatAngka(row.realisasi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="apbd-table-panel__foot">
        <Clock size={14} aria-hidden="true" />
        <span>{tabel.keterangan}</span>
      </p>
    </section>
  );
}