import { useState } from "react";
import { MapPin, Navigation, Copy, Check, Share2, ArrowUpRight, Headset, Phone } from "lucide-react";
import { getIcon } from "../../utils/icons.js";

export default function KontakSidebar({ sidebar }) {
  const [copiedCoord, setCopiedCoord] = useState(false);
  const { lokasi, sosmed, bantuanLangsung } = sidebar;

  const handleCopyCoord = async () => {
    try {
      await navigator.clipboard.writeText(lokasi.koordinat);
      setCopiedCoord(true);
      setTimeout(() => setCopiedCoord(false), 2000);
    } catch {
      setCopiedCoord(false);
    }
  };

  return (
    <aside className="kontak-sidebar">
      {/* Card 1: Lokasi Balai Desa */}
      <div className="sidebar-box">
        <div className="sidebar-box__head">
          <h3>
            <MapPin size={15} aria-hidden="true" /> {lokasi.judul}
          </h3>
          <span className="pill pill--green">{lokasi.badge}</span>
        </div>
        <p className="sidebar-box__desc">{lokasi.deskripsi}</p>

        <div className="sidebar-map">
          <iframe
            title="Peta Lokasi Balai Desa Tambakrigadung"
            src={lokasi.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="sidebar-map-actions">
          <a
            href={lokasi.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill--primary btn-pill--xs sidebar-map-actions__main"
          >
            <Navigation size={13} aria-hidden="true" /> Buka Google Maps
          </a>
          <button
            type="button"
            onClick={handleCopyCoord}
            className="btn-pill btn-pill--soft btn-pill--xs"
            title={`Salin koordinat ${lokasi.koordinat}`}
          >
            {copiedCoord ? <><Check size={13} /> Tersalin</> : <><Copy size={13} /> Salin Titik</>}
          </button>
        </div>
      </div>

      {/* Card 2: Media Sosial & Informasi Resmi */}
      <div className="sidebar-box">
        <h3 className="sidebar-box__title-inline">
          <Share2 size={15} aria-hidden="true" /> {sosmed.judul}
        </h3>
        <p className="sidebar-box__desc">{sosmed.deskripsi}</p>

        <div className="sosmed-list">
          {sosmed.items.map((item) => {
            const Icon = getIcon(item.ikon);
            return (
              <a
                key={item.nama}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sosmed-tile"
              >
                <span className="sosmed-tile__icon">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <div className="sosmed-tile__meta">
                  <strong>{item.nama}</strong>
                  <span>{item.platform}</span>
                </div>
                <ArrowUpRight size={15} className="sosmed-tile__arrow" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Card 3: Butuh Bantuan Langsung? */}
      <div className="sidebar-box sidebar-box--mint">
        <h3 className="sidebar-box__title-inline">
          <Headset size={15} aria-hidden="true" /> {bantuanLangsung.judul}
        </h3>
        <p className="sidebar-box__desc">{bantuanLangsung.deskripsi}</p>

        <div className="direct-call-box">
          <span>
            <Phone size={13} aria-hidden="true" /> {bantuanLangsung.telepon}
          </span>
          <a href={bantuanLangsung.href} className="btn-pill btn-pill--primary btn-pill--xs">
            Panggil
          </a>
        </div>
      </div>
    </aside>
  );
}