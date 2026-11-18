import { Volume2, UserRound } from "lucide-react";
import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";

export default function ProfilSection() {
  const state = useFetch(api.getProfil);
  return (
    <section className="section container center" id="profil" aria-labelledby="judul-profil">
      <AsyncBlock state={state} minHeight={320}>
        {(p) => (
          <>
            <p className="running-text"><Volume2 size={16} /> {p.runningText}</p>
            <h2 className="section-title" id="judul-profil">Profile Desa</h2>
            <p className="section-subtitle">Mengenal lebih dekat Desa Tambakrigadung</p>

            <div style={{ textAlign: "left" }}>
              <p className="profil__label">SEJARAH DESA</p>
              <p>{p.sejarah}</p>

              <p className="profil__label" style={{ color: "inherit" }}>Riwayat Kepala Desa</p>
              <div className="kades-grid">
                {p.kepalaDesa.map((k) => (
                  <div className="kades" key={k.urutan}>
                    <div className="kades__top"><UserRound size={16} /><span>{String(k.urutan).padStart(2, "0")}</span></div>
                    <p>{k.nama}</p>
                    <p className="kades__periode">{k.periode}</p>
                  </div>
                ))}
              </div>

              <p className="profil__label center" style={{ marginTop: "var(--sp-4)" }}>VISI DAN MISI</p>
              <div className="visi-misi">
                <div className="vm-card"><h3>Visi Desa</h3><p>Visi pembangunan Desa Tambakrigadung.</p><p style={{ marginTop: 8 }}>{p.visi}</p></div>
                <div className="vm-card">
                  <h3>Misi Desa</h3>
                  <p>Misi dan langkah-langkah pemerintah desa dalam mewujudkan visi.</p>
                  <ol>{p.misi.map((m, i) => <li key={i}>{m}</li>)}</ol>
                </div>
              </div>
            </div>
          </>
        )}
      </AsyncBlock>
    </section>
  );
}
