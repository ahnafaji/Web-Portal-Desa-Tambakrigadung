import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import PotensiHeader from "../components/potensi/PotensiHeader.jsx";
import PotensiCard from "../components/potensi/PotensiCard.jsx";
import PotensiStats from "../components/potensi/PotensiStats.jsx";
import PotensiCta from "../components/potensi/PotensiCta.jsx";

export default function PotensiPage() {
  const state = useFetch(api.getPotensiPage);
  // Filter disimpan di URL (?kategori=perikanan) supaya bisa di-link dari halaman lain.
  const [params, setParams] = useSearchParams();
  const aktif = params.get("kategori") || "semua";
  const pilih = (key) => setParams(key === "semua" ? {} : { kategori: key });

  return (
    <div className="page potensi-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={520}>
          {(d) => <PotensiContent d={d} aktif={aktif} pilih={pilih} />}
        </AsyncBlock>
      </div>
    </div>
  );
}

function PotensiContent({ d, aktif, pilih }) {
  const tampil = useMemo(() => (aktif === "semua" ? d.items : d.items.filter((i) => i.kategori === aktif)), [d.items, aktif]);
  return (
    <>
      <PotensiHeader header={d.header} kategori={d.kategori} jumlahBidang={d.kategori.length} aktif={aktif} onPilih={pilih} />
      <div className="potensi-list">
        {tampil.length === 0 ? <p className="state-msg">Belum ada potensi pada kategori ini.</p> : tampil.map((item) => <PotensiCard key={item.id} item={item} />)}
      </div>
      <PotensiStats data={d.statistik} />
      <PotensiCta cta={d.cta} />
    </>
  );
}
