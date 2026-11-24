import { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Maximize2,
  X,
  Briefcase,
  Award,
  Calendar,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { api } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import '../../styles/strukturpemerintah.css';

const FOTO_KADES_DEFAULT = `${import.meta.env.BASE_URL}images/kades.jpeg`;
const BAGAN_SOTK_DEFAULT = '/images/bagan-struktur-pemerintah-desa.png';

const DATA_APARATUR_FALLBACK = [
  {
    id: 'kades',
    nama: 'Moch. Takim',
    jabatan: 'Kepala Desa',
    posisiSotk: 'Pimpinan',
    isKades: true,
    foto: FOTO_KADES_DEFAULT,
    periode: '2019 – Sekarang',
    status: 'Kepala Desa Definitif',
    pendidikan: 'S1 / Sederajat',
    tupoksi: [
      'Menyelenggarakan Pemerintahan Desa, melaksanakan Pembangunan Desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat.',
      'Memimpin penyelenggaraan pemerintahan desa berdasarkan kebijakan yang ditetapkan bersama BPD.',
      'Menetapkan Peraturan Desa dan mengelola keuangan serta aset Desa Tambakrigadung.',
    ],
  },
  {
    id: 'sekdes',
    nama: 'Sekretaris Desa',
    jabatan: 'Sekretaris Desa',
    posisiSotk: 'Sekretariat',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'D3 / S1',
    tupoksi: [
      'Membantu Kepala Desa dalam bidang administrasi pemerintahan, ketatausahaan, dan koordinasi pelaksanaan tugas perangkat desa.',
      'Menyusun rancangan APBDes, laporan penyelenggaraan pemerintahan desa, dan pengelolaan arsip resmi.',
    ],
  },
  {
    id: 'kaur-tu',
    nama: 'Kaur Tata Usaha & Umum',
    jabatan: 'Kaur Tata Usaha dan Umum',
    posisiSotk: 'Kaur',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Melaksanakan urusan ketatausahaan seperti tata naskah, administrasi surat-menyurat, arsip, dan ekspedisi.',
      'Mengelola inventarisasi kekayaan milik desa serta perlengkapan kantor pemerintahan desa.',
    ],
  },
  {
    id: 'kaur-keuangan',
    nama: 'Kaur Keuangan',
    jabatan: 'Kaur Keuangan',
    posisiSotk: 'Kaur',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Melaksanakan fungsi kebendaharaan, pengadministrasian sumber pendapatan dan pengeluaran desa.',
      'Melakukan verifikasi administrasi keuangan dan penatausahaan realisasi APBDes.',
    ],
  },
  {
    id: 'kaur-perencanaan',
    nama: 'Kaur Perencanaan',
    jabatan: 'Kaur Perencanaan',
    posisiSotk: 'Kaur',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Mengkoordinasikan urusan perencanaan pembangunan desa (RPJMDes dan RKPDes).',
      'Menyusun rencana anggaran belanja serta melakukan monitoring dan evaluasi program desa.',
    ],
  },
  {
    id: 'kasi-pemerintahan',
    nama: 'Kasi Pemerintahan',
    jabatan: 'Kasi Pemerintahan',
    posisiSotk: 'Kasi',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Melaksanakan manajemen tata praja pemerintahan, administrasi kependudukan, dan pertanahan.',
      'Memfasilitasi pembinaan ketenteraman, ketertiban masyarakat, dan perlindungan warga.',
    ],
  },
  {
    id: 'kasi-kesejahteraan',
    nama: 'Kasi Kesejahteraan',
    jabatan: 'Kasi Kesejahteraan',
    posisiSotk: 'Kasi',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Melaksanakan pembangunan sarana prasarana perdesaan serta pemberdayaan ekonomi dan UMKM warga.',
      'Menyelenggarakan pembinaan bidang pendidikan, kesehatan, dan sosial kemasyarakatan.',
    ],
  },
  {
    id: 'kasi-pelayanan',
    nama: 'Kasi Pelayanan',
    jabatan: 'Kasi Pelayanan',
    posisiSotk: 'Kasi',
    isKades: false,
    foto: null,
    periode: 'Aktif Menjabat',
    status: 'Perangkat Desa',
    pendidikan: 'SLTA / S1',
    tupoksi: [
      'Melaksanakan penyuluhan dan motivasi terhadap pelaksanaan hak dan kewajiban masyarakat.',
      'Meningkatkan upaya partisipasi masyarakat, pelestarian nilai sosial budaya, dan keagamaan.',
    ],
  },
];

const DEFAULT_TUPOKSI = [
  'Melaksanakan tugas pelayanan publik dan administrasi pemerintahan desa sesuai bidang jabatan.',
  'Membantu Kepala Desa dalam mewujudkan tata kelola pemerintahan Desa Tambakrigadung yang transparan.',
];

function AnonymousAvatar({ label }) {
  return (
    <div className="sp-anon-avatar" aria-label={label}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="var(--secondary-100)" />
        <circle cx="80" cy="58" r="28" fill="var(--secondary-300)" />
        <path
          d="M32 146C32 117.281 53.4903 94 80 94C106.51 94 128 117.281 128 146"
          fill="var(--secondary-400)"
        />
        <path
          d="M66 96L80 112L94 96"
          stroke="var(--primary-300)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SotkFallbackDiagram({ aparaturList }) {
  const kades = aparaturList.find((p) => p.posisiSotk === 'Pimpinan') || aparaturList[0];
  const sekdes = aparaturList.find((p) => p.posisiSotk === 'Sekretariat');
  const branches = aparaturList.filter(
    (p) => p.id !== kades?.id && p.id !== sekdes?.id
  );

  return (
    <div className="sp-sotk-fallback">
      <div className="sp-node is-head">
        <span>{(kades?.jabatan || 'KEPALA DESA').toUpperCase()}</span>
        <strong>{kades?.nama || 'Moch. Takim'}</strong>
      </div>
      <div className="sp-line-v" />
      <div className="sp-node is-sekdes">
        <span>{(sekdes?.jabatan || 'SEKRETARIS DESA').toUpperCase()}</span>
        <strong>{sekdes?.nama || 'Sekretariat Desa'}</strong>
      </div>
      {branches.length > 0 && (
        <>
          <div className="sp-line-v" />
          <div className="sp-sotk-branches">
            {branches.map((item) => (
              <div className="sp-node" key={item.id}>
                <span>{(item.posisiSotk || 'PERANGKAT').toUpperCase()}</span>
                <strong>{item.jabatan}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function StrukturPemerintahanSection({
  fotoKades = FOTO_KADES_DEFAULT,
  baganImage = BAGAN_SOTK_DEFAULT,
}) {
  const { data: remotePerangkat } = useFetch(api.getPerangkat);
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(35);
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [sotkModalOpen, setSotkModalOpen] = useState(false);
  const [sotkImgError, setSotkImgError] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const aparaturList =
    Array.isArray(remotePerangkat) && remotePerangkat.length > 0
      ? remotePerangkat.map((p) => ({
        ...p,
        isKades: p.posisiSotk === 'Pimpinan',
        periode: p.nipd ? `NIPD: ${p.nipd}` : 'Aktif Menjabat',
        status: p.status || 'Aktif Menjabat',
        pendidikan: p.posisiSotk || 'Perangkat Desa',
        tupoksi: DEFAULT_TUPOKSI,
      }))
      : DATA_APARATUR_FALLBACK.map((item) =>
        item.isKades ? { ...item, foto: fotoKades } : item
      );

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }
    const pct = 25 + (el.scrollLeft / maxScroll) * 75;
    setScrollProgress(Math.min(100, Math.max(25, pct)));
  };

  const slideBy = (direction) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 290, behavior: 'smooth' });
  };

  const renderAvatar = (person) => {
    if (person.foto && !imgErrors[person.id]) {
      return (
        <img
          src={person.foto}
          alt={person.nama}
          onError={() => setImgErrors((prev) => ({ ...prev, [person.id]: true }))}
        />
      );
    }
    return <AnonymousAvatar label={person.jabatan} />;
  };

  return (
    <section className="sp-section" aria-labelledby="judul-struktur-pemerintahan">
      <div className="sp-container">
        <div className="sp-sotk-box">
          <div className="sp-sotk-head">
            <div>
              <span className="sp-eyebrow-dark">
                <Building2 size={14} /> BAGAN ORGANISASI
              </span>
              <h3>Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Tambakrigadung</h3>
            </div>
            {!sotkImgError && (
              <button
                type="button"
                onClick={() => setSotkModalOpen(true)}
                className="sp-btn-zoom"
              >
                <Maximize2 size={15} />
                <span>Perbesar Bagan</span>
              </button>
            )}
          </div>

          <div className="sp-sotk-frame" onClick={() => !sotkImgError && setSotkModalOpen(true)}>
            {!sotkImgError ? (
              <img
                src={baganImage}
                alt="Bagan Struktur Organisasi dan Tata Kerja Pemerintah Desa Tambakrigadung"
                onError={() => setSotkImgError(true)}
              />
            ) : (
              <SotkFallbackDiagram aparaturList={aparaturList} />
            )}
          </div>
        </div>

        <div className="sp-aparatur-panel">
          <div className="sp-aparatur-head">
            <div>
              <span className="sp-pill-badge">Pemerintah Desa</span>
              <h2 id="judul-struktur-pemerintahan" className="sp-title">
                Struktur Pemerintahan Desa
              </h2>
            </div>

            <div className="sp-head-controls">
              {!showAllGrid && (
                <div className="sp-arrow-group">
                  <button
                    type="button"
                    onClick={() => slideBy(-1)}
                    className="sp-arrow-btn"
                    aria-label="Geser ke kiri"
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    type="button"
                    onClick={() => slideBy(1)}
                    className="sp-arrow-btn"
                    aria-label="Geser ke kanan"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowAllGrid((prev) => !prev)}
                className="sp-lihat-semua"
              >
                <span>{showAllGrid ? 'Tampilan Slider' : 'Lihat Semua'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className={showAllGrid ? 'sp-cards-grid' : 'sp-cards-track'}
          >
            {aparaturList.map((person) => (
              <article
                key={person.id}
                onClick={() => setSelectedOfficial(person)}
                className="sp-person-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedOfficial(person)}
              >
                <div className="sp-person-photo">{renderAvatar(person)}</div>

                <div className="sp-person-body">
                  <h3>{String(person.nama || '').toUpperCase()}</h3>
                  <p>{person.jabatan}</p>
                  <span className="sp-card-detail-hint">Klik untuk detail</span>
                </div>
              </article>
            ))}
          </div>

          {!showAllGrid && (
            <div className="sp-progress-track" aria-hidden="true">
              <div className="sp-progress-thumb" style={{ width: `${scrollProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      {selectedOfficial && (
        <div className="sp-modal-overlay" onClick={() => setSelectedOfficial(null)}>
          <div className="sp-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedOfficial(null)}
              className="sp-modal-close"
              aria-label="Tutup detail"
            >
              <X size={18} />
            </button>

            <div className="sp-modal-top">
              <div className="sp-modal-avatar">{renderAvatar(selectedOfficial)}</div>

              <div className="sp-modal-identity">
                <span className="sp-modal-role-pill">{selectedOfficial.jabatan}</span>
                <h3>{selectedOfficial.nama}</h3>
                <p>Pemerintah Desa Tambakrigadung, Kec. Tikung, Kab. Lamongan</p>

                <div className="sp-modal-meta-grid">
                  <div>
                    <Calendar size={14} />
                    <span>
                      Identitas: <strong>{selectedOfficial.periode}</strong>
                    </span>
                  </div>
                  <div>
                    <Briefcase size={14} />
                    <span>
                      Status: <strong>{selectedOfficial.status}</strong>
                    </span>
                  </div>
                  <div>
                    <Award size={14} />
                    <span>
                      Bagian: <strong>{selectedOfficial.pendidikan}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sp-modal-tupoksi">
              <h4>Tugas Pokok &amp; Fungsi</h4>
              <ul>
                {(selectedOfficial.tupoksi || DEFAULT_TUPOKSI).map((tugas, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} />
                    <span>{tugas}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {sotkModalOpen && !sotkImgError && (
        <div className="sp-modal-overlay" onClick={() => setSotkModalOpen(false)}>
          <div className="sp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="sp-lightbox-head">
              <strong>Bagan Struktur Organisasi Pemerintah Desa Tambakrigadung</strong>
              <button
                type="button"
                onClick={() => setSotkModalOpen(false)}
                className="sp-modal-close is-inline"
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={baganImage}
              alt="Bagan SOTK Pemerintah Desa Tambakrigadung"
              className="sp-lightbox-img"
            />
          </div>
        </div>
      )}
    </section>
  );
}