import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import ApbdHeader from "../components/apbd/ApbdHeader.jsx";
import ApbdSummaryCards from "../components/apbd/ApbdSummaryCards.jsx";
import ApbdBreakdown from "../components/apbd/ApbdBreakdown.jsx";
import ApbdRealisasiTable from "../components/apbd/ApbdRealisasiTable.jsx";

export default function ApbdDetailPage() {
  const state = useFetch(api.getApbdPage);

  return (
    <div className="page apbd-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={600}>
          {(d) => (
            <>
              <ApbdHeader header={d.header} />
              <ApbdSummaryCards items={d.summary} />
              <ApbdBreakdown pendapatan={d.pendapatan} belanja={d.belanja} />
              <ApbdRealisasiTable tabel={d.tabel} />
            </>
          )}
        </AsyncBlock>
      </div>
    </div>
  );
}