import { Phone, Mail } from "lucide-react";
import { api } from "../../services/api.js";
import useFetch from "../../hooks/useFetch.js";
import AsyncBlock from "../common/AsyncBlock.jsx";

export default function Footer() {
  const state = useFetch(api.getKontak);
  return (
    <footer className="footer">
      <div className="container">
        <AsyncBlock state={state} minHeight={120}>
          {(k) => (
            <div className="footer__grid">
              <div className="footer__brand">
                <img src="/images/logo-kecamatan.png" alt="" className="footer__logo" />
                <div>
                  <h4>{k.nama}</h4>
                  <p>{k.alamat}</p>
                  <p><strong>Kode Wilayah: {k.kodeWilayah}</strong></p>
                </div>
              </div>
              <div>
                <h4>Hubungi Kami</h4>
                <p className="footer__row"><Phone size={14} /> {k.telepon}</p>
                <p className="footer__row"><Mail size={14} /> {k.email}</p>
              </div>
              <div>
                <h4>Nomor Telepon Pengurus</h4>
                <ul>{k.nomorPengurus.map((n) => <li key={n.label}><a href={n.href}>{n.label}</a></li>)}</ul>
              </div>
              <div>
                <h4>Jelajahi</h4>
                <ul>{k.jelajahi.map((n) => <li key={n.label}><a href={n.href}>{n.label}</a></li>)}</ul>
              </div>
            </div>
          )}
        </AsyncBlock>
        <p className="footer__copy">© Pemerintah Desa Tambakrigadung. Dikembangkan bersama Mahasiswa Manajemen Informatika UNESA Angkatan 2024 (Kelompok 13).</p>
      </div>
    </footer>
  );
}
