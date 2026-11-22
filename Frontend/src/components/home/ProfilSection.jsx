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
            <div className="running-text-bar" role="region" aria-label="Sambutan Selamat Datang">
              <div className="running-text-bar__icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1c241f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 11l12-5v12L3 13v-2z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  <path d="M19 9a5 5 0 0 1 0 6" />
                </svg>
              </div>
              <div className="running-text-bar__viewport">
                <div className="running-text-bar__track">
                  <span>{p.runningText}</span>
                  <span aria-hidden="true">{p.runningText}</span>
                </div>
              </div>
            </div>

            <h2 className="section-title" id="judul-profil">Profile Desa</h2>
            <p className="section-subtitle">Mengenal lebih dekat Desa Tambakrigadung</p>

            <div style={{ textAlign: "left" }}>
              <p className="profil__label">SEJARAH DESA</p>
              <p>{p.sejarah}</p>

              <p className="profil__label center" style={{ marginTop: "var(--sp-4)" }}>VISI DAN MISI</p>
              <div className="visi-misi">
                <div className="vm-card">
                  <h3>Visi Desa</h3>
                  <p>Visi pembangunan Desa Tambakrigadung.</p>
                  <p style={{ marginTop: 8 }}>{p.visi}</p>
                </div>
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