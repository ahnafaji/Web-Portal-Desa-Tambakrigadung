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
  const [params, setParams] = useSearchParams();
  const aktif = params.get("kategori") || "semua";
  const pilih = (key) => setParams(key === "semua" ? {} : { kategori: key });

  return (
    <div className="page potensi-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={520}>
          {(data) => <PotensiContent data={data} aktif={aktif} pilih={pilih} />}
        </AsyncBlock>
      </div>
    </div>
  );
}

function PotensiContent({ data, aktif, pilih }) {
  const items = useMemo(
    () => (aktif === "semua" ? data.items : data.items.filter((item) => item.kategori === aktif)),
    [data.items, aktif]
  );

  return (
    <>
      <PotensiHeader
        header={data.header}
        kategori={data.kategori}
        jumlahBidang={data.kategori.length}
        aktif={aktif}
        onPilih={pilih}
      />
      <div className="potensi-list">
        {items.length === 0 ? (
          <p className="state-msg">Belum ada potensi pada kategori ini.</p>
        ) : (
          items.map((item) => <PotensiCard key={item.id} item={item} />)
        )}
      </div>
      <PotensiStats data={data.statistik} />
      <PotensiCta cta={data.cta} />
    </>
  );
}
