import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";
import { formatRupiah } from "../../utils/format.js";

export default function ApbdSection() {
  const state = useFetch(api.getApbd);
  return (
    <section className="section section--white">
      <div className="container">
        <AsyncBlock state={state} minHeight={240}>
          {(a) => (
            <div className="apbd">
              <div className="apbd__icon" aria-hidden="true">ICON APBD</div>
              <div>
                <h2 className="section-title section-title--green" style={{ fontSize: "var(--fs-xl)" }}>APBD Desa Tambakrigadung {a.tahun}</h2>
                <p>Akses transparansi terhadap APB Desa serta proyek pembangunan</p>
                <div className="apbd__row"><p className="apbd__label">Pendapatan Desa</p><p className="apbd__value">{formatRupiah(a.pendapatan)}</p></div>
                <div className="apbd__row"><p className="apbd__label">Pengeluaran Desa</p><p className="apbd__value">{formatRupiah(a.pengeluaran)}</p></div>
                <div className="apbd__cta"><Link to="/apbd" className="btn"><FileText size={16} /> Lihat Data Lengkap</Link></div>
              </div>
            </div>
          )}
        </AsyncBlock>
      </div>
    </section>
  );
}
