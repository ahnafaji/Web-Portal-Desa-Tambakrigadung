import { api } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import AsyncBlock from "../components/common/AsyncBlock.jsx";
import KontakHeader from "../components/kontak/KontakHeader.jsx";
import KontakChannels from "../components/kontak/KontakChannels.jsx";
import PamongDirectory from "../components/kontak/PamongDirectory.jsx";
import PengaduanSop from "../components/kontak/PengaduanSop.jsx";
import PengaduanForm from "../components/kontak/PengaduanForm.jsx";
import KontakSidebar from "../components/kontak/KontakSidebar.jsx";
import MaklumatBanner from "../components/kontak/MaklumatBanner.jsx";

export default function KontakPage() {
  const state = useFetch(api.getKontakPage);

  return (
    <div className="page kontak-page">
      <div className="container">
        <AsyncBlock state={state} minHeight={640}>
          {(d) => (
            <>
              <KontakHeader header={d.header} />

              <KontakChannels channels={d.channels} />

              <PamongDirectory pamong={d.pamong} />

              <PengaduanSop sop={d.sop} />

              <div className="kontak-workspace">
                <PengaduanForm
                  dusunOptions={d.dusunOptions}
                  kategoriOptions={d.kategoriAduanOptions}
                  prioritasOptions={d.prioritasOptions}
                />
                <KontakSidebar sidebar={d.sidebar} />
              </div>

              <MaklumatBanner maklumat={d.maklumat} />
            </>
          )}
        </AsyncBlock>
      </div>
    </div>
  );
}