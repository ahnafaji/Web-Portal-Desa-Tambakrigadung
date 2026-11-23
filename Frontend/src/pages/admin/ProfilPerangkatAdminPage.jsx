import { useMemo, useState } from "react";
import {
  Save,
  FileText,
  Target,
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  Info,
  X,
} from "lucide-react";
import "../../styles/admin.css";

const STORAGE_PROFIL_KEY = "tambakrigadung_admin_profil_v1";
const STORAGE_PERANGKAT_KEY = "tambakrigadung_admin_perangkat_v1";

const DEFAULT_PROFIL = {
  sejarah:
    "Desa Tambakrigadung merupakan salah satu desa yang berada di wilayah Kecamatan Tikung, Kabupaten Lamongan, Provinsi Jawa Timur. Perjalanan pemerintahan desa mengalami beberapa pergantian kepemimpinan dari masa ke masa.",
  visi:
    "Terwujudnya Desa Tambakrigadung Yang Mandiri, Berdaya Saing, Agamis, dan Berketahanan Iklim Berbasis Gotong Royong.",
  misi: [
    "Meningkatkan Kualitas Tata Kelola Pemerintahan Desa.",
    "Memperkuat Kemandirian Ekonomi dan Ketahanan Pangan.",
    "Meningkatkan Pembangunan Infrastruktur Dasar yang Merata.",
  ],
};

const DEFAULT_PERANGKAT = [
  { id: "p-1", nama: "Moch. Takim", nipd: "19780512 201001 1 002", jabatan: "Kepala Desa", posisiSotk: "Pimpinan", status: "Aktif Menjabat", foto: "/images/kades.jpeg" },
  { id: "p-2", nama: "Ahmad Zaini, S.Pd.", nipd: "19850214 201503 1 004", jabatan: "Sekretaris Desa", posisiSotk: "Sekretariat", status: "Aktif Menjabat", foto: "" },
  { id: "p-3", nama: "Nurul Hidayati, S.E.", nipd: "19900822 201706 2 001", jabatan: "Kaur Keuangan", posisiSotk: "Kaur", status: "Aktif Menjabat", foto: "" },
  { id: "p-4", nama: "Bambang Sujarwo", nipd: "19831109 201402 1 003", jabatan: "Kaur Tata Usaha & Umum", posisiSotk: "Kaur", status: "Aktif Menjabat", foto: "" },
  { id: "p-5", nama: "Dwi Kurniawan, S.T.", nipd: "19920417 201901 1 005", jabatan: "Kaur Perencanaan", posisiSotk: "Kaur", status: "Aktif Menjabat", foto: "" },
  { id: "p-6", nama: "Slamet Wahyudi", nipd: "19810619 201204 1 002", jabatan: "Kasi Pemerintahan", posisiSotk: "Kasi", status: "Aktif Menjabat", foto: "" },
  { id: "p-7", nama: "Siti Aminah, S.Sos.", nipd: "19890915 201802 2 003", jabatan: "Kasi Kesejahteraan", posisiSotk: "Kasi", status: "Aktif Menjabat", foto: "" },
  { id: "p-8", nama: "Muhammad Ridwan", nipd: "19940120 202105 1 006", jabatan: "Kasi Pelayanan", posisiSotk: "Kasi", status: "Aktif Menjabat", foto: "" },
];

const SOTK_BADGE_MAP = {
  Pimpinan: "adm-badge--green",
  Sekretariat: "adm-badge--blue",
  Kaur: "adm-badge--purple",
  Kasi: "adm-badge--slate",
};

export default function ProfilPerangkatAdminPage() {
  const [profil, setProfil] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFIL_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFIL;
    } catch {
      return DEFAULT_PROFIL;
    }
  });

  const [perangkat, setPerangkat] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PERANGKAT_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PERANGKAT;
    } catch {
      return DEFAULT_PERANGKAT;
    }
  });

  const [activeTab, setActiveTab] = useState("semua");
  const [searchPerangkat, setSearchPerangkat] = useState("");
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [personForm, setPersonForm] = useState({
    nama: "",
    nipd: "",
    jabatan: "",
    posisiSotk: "Kaur",
    status: "Aktif Menjabat",
    foto: "",
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const handleMisiChange = (idx, value) => {
    setProfil((prev) => {
      const next = [...prev.misi];
      next[idx] = value;
      return { ...prev, misi: next };
    });
  };

  const handleAddMisi = () => {
    setProfil((prev) => ({ ...prev, misi: [...prev.misi, ""] }));
  };

  const handleRemoveMisi = (idx) => {
    if (profil.misi.length <= 1) return;
    setProfil((prev) => ({
      ...prev,
      misi: prev.misi.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveAll = () => {
    localStorage.setItem(STORAGE_PROFIL_KEY, JSON.stringify(profil));
    localStorage.setItem(STORAGE_PERANGKAT_KEY, JSON.stringify(perangkat));
    notify("Perubahan Profil, Visi-Misi & Susunan Perangkat Desa berhasil disimpan.");
  };

  const filteredPerangkat = useMemo(() => {
    const q = searchPerangkat.trim().toLowerCase();
    if (!q) return perangkat;
    return perangkat.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.jabatan.toLowerCase().includes(q) ||
        p.posisiSotk.toLowerCase().includes(q)
    );
  }, [perangkat, searchPerangkat]);

  const openAddPerson = () => {
    setEditingPerson(null);
    setPersonForm({
      nama: "",
      nipd: "",
      jabatan: "",
      posisiSotk: "Kaur",
      status: "Aktif Menjabat",
      foto: "",
    });
    setModalOpen(true);
  };

  const openEditPerson = (person) => {
    setEditingPerson(person);
    setPersonForm({
      nama: person.nama,
      nipd: person.nipd || "",
      jabatan: person.jabatan,
      posisiSotk: person.posisiSotk,
      status: person.status,
      foto: person.foto || "",
    });
    setModalOpen(true);
  };

  const handleSavePerson = (e) => {
    e.preventDefault();
    if (!personForm.nama.trim() || !personForm.jabatan.trim()) return;

    let updated;
    if (editingPerson) {
      updated = perangkat.map((p) =>
        p.id === editingPerson.id ? { ...p, ...personForm } : p
      );
      notify("Data perangkat desa diperbarui.");
    } else {
      updated = [...perangkat, { id: `p-${Date.now()}`, ...personForm }];
      notify("Aparatur perangkat desa baru ditambahkan.");
    }

    setPerangkat(updated);
    localStorage.setItem(STORAGE_PERANGKAT_KEY, JSON.stringify(updated));
    setModalOpen(false);
  };

  const handleDeletePerson = (person) => {
    if (!window.confirm(`Hapus ${person.nama} (${person.jabatan}) dari daftar perangkat desa?`)) return;
    const updated = perangkat.filter((p) => p.id !== person.id);
    setPerangkat(updated);
    localStorage.setItem(STORAGE_PERANGKAT_KEY, JSON.stringify(updated));
    notify("Data perangkat desa dihapus.");
  };

  const showProfilSection = activeTab === "semua" || activeTab === "profil";
  const showPerangkatSection = activeTab === "semua" || activeTab === "perangkat";

  return (
    <div className="adm-mod-page">
      <div className="adm-mod-head">
        <div>
          <span className="adm-mod-eyebrow">PEMERINTAHAN DESA • Kecamatan Tikung</span>
          <h1 className="adm-mod-title">Kelola Profil &amp; Perangkat Desa</h1>
          <p className="adm-mod-subtitle">
            Perbarui sejarah desa, visi misi, serta susunan perangkat dan bagan SOTK Pemerintah Desa Tambakrigadung.
          </p>
        </div>

        <button type="button" onClick={handleSaveAll} className="adm-btn adm-btn--primary">
          <Save size={16} />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {toast && (
        <div className="adm-badge adm-badge--green" role="status" style={{ padding: "10px 14px", borderRadius: 10 }}>
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="adm-filter-pills">
        <button
          type="button"
          onClick={() => setActiveTab("semua")}
          className={`adm-pill-tab${activeTab === "semua" ? " is-active" : ""}`}
        >
          Semua Bagian
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("profil")}
          className={`adm-pill-tab${activeTab === "profil" ? " is-active" : ""}`}
        >
          Profil, Visi &amp; Misi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("perangkat")}
          className={`adm-pill-tab${activeTab === "perangkat" ? " is-active" : ""}`}
        >
          Perangkat Desa &amp; SOTK ({perangkat.length})
        </button>
      </div>

      {showProfilSection && (
        <>
          <section className="adm-card" aria-labelledby="sejarah-desa-heading">
            <div className="adm-card__head">
              <div>
                <div className="adm-mod-title-row">
                  <h2 id="sejarah-desa-heading" className="adm-card__title">
                    <FileText size={17} color="#2f704b" /> Ringkasan Sejarah Desa
                  </h2>
                  <span className="adm-badge adm-badge--green">● Tampil di Beranda</span>
                </div>
                <p className="adm-card__desc">
                  Deskripsi naratif asal-usul dan riwayat perkembangan Desa Tambakrigadung.
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              maxLength={1000}
              className="adm-textarea"
              value={profil.sejarah}
              onChange={(e) => setProfil({ ...profil, sejarah: e.target.value })}
            />
            <div className="adm-char-row">
              <span>Gunakan gaya penulisan objektif dan kronologis.</span>
              <span>{profil.sejarah.length}/1000 karakter</span>
            </div>
          </section>

          <section className="adm-card" aria-labelledby="visi-misi-heading">
            <div className="adm-card__head">
              <div>
                <h2 id="visi-misi-heading" className="adm-card__title">
                  <Target size={17} color="#2f704b" /> Visi &amp; Misi Pemerintahan Desa
                </h2>
                <p className="adm-card__desc">
                  Landasan kebijakan jangka menengah RPJMDes Tambakrigadung 2020–2026.
                </p>
              </div>
            </div>

            <div className="adm-vm-grid">
              <div className="adm-vm-box">
                <strong style={{ fontSize: 14 }}>Visi Pembangunan Desa</strong>
                <p className="adm-card__desc" style={{ marginBottom: 10 }}>
                  Pernyataan komprehensif cita-cita pembangunan desa.
                </p>
                <textarea
                  rows={4}
                  className="adm-textarea"
                  value={profil.visi}
                  onChange={(e) => setProfil({ ...profil, visi: e.target.value })}
                />
                <div className="adm-mod-note" style={{ marginTop: 10, paddingTop: 10 }}>
                  <Info size={14} />
                  <span>Visi menjadi pedoman arah kebijakan RPJMDes 6 tahunan.</span>
                </div>
              </div>

              <div className="adm-vm-box">
                <div className="adm-card__head" style={{ marginBottom: 4 }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>Misi Desa (Poin-Poin Kebijakan)</strong>
                    <p className="adm-card__desc">Daftar agenda strategis operasional perwujudan visi.</p>
                  </div>
                  <span className="adm-badge adm-badge--slate">{profil.misi.length} Poin Terdaftar</span>
                </div>

                <div className="adm-misi-list">
                  {profil.misi.map((item, idx) => (
                    <div className="adm-misi-row" key={idx}>
                      <span className="adm-misi-num">{idx + 1}</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleMisiChange(idx, e.target.value)}
                        placeholder={`Poin misi ke-${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMisi(idx)}
                        className="adm-btn adm-btn--ghost-danger"
                        aria-label={`Hapus misi ${idx + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={handleAddMisi} className="adm-add-dashed">
                  <Plus size={15} /> Tambah Poin Misi
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {showPerangkatSection && (
        <section className="adm-card" aria-labelledby="struktur-perangkat-heading">
          <div className="adm-card__head">
            <div>
              <div className="adm-mod-title-row">
                <h2 id="struktur-perangkat-heading" className="adm-card__title">
                  <Users size={17} color="#2f704b" /> Struktur Pemerintahan &amp; Perangkat Desa
                </h2>
                <span className="adm-badge adm-badge--slate">
                  Total {perangkat.length} Aparatur Aktif
                </span>
              </div>
              <p className="adm-card__desc">
                Bagan dan susunan personil pamong Desa Tambakrigadung.
              </p>
            </div>

            <div className="adm-mod-actions">
              <div className="adm-search-box" style={{ minWidth: 220 }}>
                <Search size={14} color="#64748b" />
                <input
                  type="text"
                  value={searchPerangkat}
                  onChange={(e) => setSearchPerangkat(e.target.value)}
                  placeholder="Cari nama atau jabatan..."
                />
              </div>
              <button type="button" onClick={openAddPerson} className="adm-btn adm-btn--primary">
                <Plus size={15} /> Tambah Perangkat
              </button>
            </div>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>PERANGKAT</th>
                  <th>JABATAN</th>
                  <th>POSISI BAGAN SOTK</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerangkat.map((person) => {
                  const initials = person.nama
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <tr key={person.id}>
                      <td>
                        <div className="adm-person-cell">
                          {person.foto ? (
                            <img src={person.foto} alt={person.nama} className="adm-person-avatar" />
                          ) : (
                            <span className="adm-person-avatar">{initials}</span>
                          )}
                          <div>
                            <span className="adm-person-name">{person.nama}</span>
                            <span className="adm-person-nipd">NIPD: {person.nipd || "-"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{person.jabatan}</td>
                      <td>
                        <span className={`adm-badge ${SOTK_BADGE_MAP[person.posisiSotk] || "adm-badge--slate"}`}>
                          {person.posisiSotk}
                        </span>
                      </td>
                      <td>
                        <span className="adm-badge adm-badge--green">● {person.status}</span>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          onClick={() => openEditPerson(person)}
                          className="adm-btn adm-btn--ghost"
                          aria-label={`Edit ${person.nama}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePerson(person)}
                          className="adm-btn adm-btn--ghost-danger"
                          aria-label={`Hapus ${person.nama}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="adm-table-foot">
            <span>
              Menampilkan {filteredPerangkat.length} dari {perangkat.length} aparatur perangkat desa terdaftar
            </span>
            <span>Terhubung dengan Beranda Publik</span>
          </div>
        </section>
      )}

      {modalOpen && (
        <div className="adm-overlay adm-overlay--center" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-card__head">
              <h3 className="adm-card__title">
                {editingPerson ? "Edit Perangkat Desa" : "Tambah Aparatur Perangkat Desa"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="adm-btn adm-btn--ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="adm-form-stack">
              <div className="adm-field">
                <label>Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  required
                  value={personForm.nama}
                  onChange={(e) => setPersonForm({ ...personForm, nama: e.target.value })}
                />
              </div>

              <div className="adm-field">
                <label>NIPD</label>
                <input
                  type="text"
                  value={personForm.nipd}
                  onChange={(e) => setPersonForm({ ...personForm, nipd: e.target.value })}
                  placeholder="19850214 201503 1 004"
                />
              </div>

              <div className="adm-field">
                <label>Jabatan</label>
                <input
                  type="text"
                  required
                  value={personForm.jabatan}
                  onChange={(e) => setPersonForm({ ...personForm, jabatan: e.target.value })}
                  placeholder="Contoh: Kaur Keuangan"
                />
              </div>

              <div className="adm-field">
                <label>Posisi Bagan SOTK</label>
                <select
                  value={personForm.posisiSotk}
                  onChange={(e) => setPersonForm({ ...personForm, posisiSotk: e.target.value })}
                >
                  <option value="Pimpinan">Pimpinan</option>
                  <option value="Sekretariat">Sekretariat</option>
                  <option value="Kaur">Kaur</option>
                  <option value="Kasi">Kasi</option>
                </select>
              </div>

              <div className="adm-field">
                <label>Status Jabatan</label>
                <select
                  value={personForm.status}
                  onChange={(e) => setPersonForm({ ...personForm, status: e.target.value })}
                >
                  <option value="Aktif Menjabat">Aktif Menjabat</option>
                  <option value="Plt / Penjabat">Plt / Penjabat</option>
                </select>
              </div>

              <div className="adm-field">
                <label>URL Foto (opsional)</label>
                <input
                  type="text"
                  value={personForm.foto}
                  onChange={(e) => setPersonForm({ ...personForm, foto: e.target.value })}
                  placeholder="/images/kades.jpeg"
                />
              </div>

              <div className="adm-mod-actions" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" onClick={() => setModalOpen(false)} className="adm-btn adm-btn--outline">
                  Batal
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  <Save size={15} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}