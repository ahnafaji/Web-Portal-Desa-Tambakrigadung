import { useEffect, useMemo, useRef, useState } from "react";
import {
  Save,
  FileText,
  Target,
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Info,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminToast } from "../../context/AdminToastContext";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import "../../styles/admin.css";

const SOTK_BADGE_MAP = {
  Pimpinan: "adm-badge--green",
  Sekretariat: "adm-badge--blue",
  Kaur: "adm-badge--purple",
  Kasi: "adm-badge--slate",
  Kasun: "adm-badge--amber",
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProfilPerangkatAdminPage() {
  const toast = useAdminToast();
  const fileInputRef = useRef(null);

  const [profil, setProfil] = useState({ sejarah: "", visi: "", misi: [""] });
  const [perangkat, setPerangkat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfil, setSavingProfil] = useState(false);
  const [pageError, setPageError] = useState("");

  const [activeTab, setActiveTab] = useState("semua");
  const [searchPerangkat, setSearchPerangkat] = useState("");

  // Modal Tambah/Edit Perangkat
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [savingPerson, setSavingPerson] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [removeFoto, setRemoveFoto] = useState(false);
  const [fotoError, setFotoError] = useState("");
  const [personForm, setPersonForm] = useState({
    nama: "",
    nipd: "",
    jabatan: "",
    posisiSotk: "Kaur",
    status: "Aktif Menjabat",
  });

  // Modal Konfirmasi Hapus Perangkat
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPageError("");

    Promise.all([adminApi.getProfil(), adminApi.getPerangkat()])
      .then(([profilRes, perangkatRes]) => {
        if (!active) return;
        setProfil({
          sejarah: profilRes?.sejarah || "",
          visi: profilRes?.visi || "",
          misi: Array.isArray(profilRes?.misi) && profilRes.misi.length ? profilRes.misi : [""],
        });
        setPerangkat(Array.isArray(perangkatRes) ? perangkatRes : []);
      })
      .catch((err) => {
        if (active) setPageError(err.message || "Gagal memuat data profil & perangkat desa.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Bersihkan blob URL saat preview berganti/ditutup
  useEffect(() => {
    return () => {
      if (fotoPreview && fotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

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

  const handleSaveProfil = async () => {
    setSavingProfil(true);
    setPageError("");
    try {
      const cleanedMisi = profil.misi.map((m) => m.trim()).filter(Boolean);
      const updated = await adminApi.updateProfil({
        sejarah: profil.sejarah,
        visi: profil.visi,
        misi: cleanedMisi,
      });
      setProfil({
        sejarah: updated?.sejarah || profil.sejarah,
        visi: updated?.visi || profil.visi,
        misi: Array.isArray(updated?.misi) && updated.misi.length ? updated.misi : cleanedMisi,
      });
      toast.success(
        "Perubahan Sejarah, Visi & Misi Desa berhasil disimpan dan tampil di Beranda.",
        "Profil Desa Diperbarui"
      );
    } catch (err) {
      setPageError(err.message || "Gagal menyimpan profil desa.");
      toast.error(err.message || "Gagal menyimpan profil desa.", "Gagal Menyimpan");
    } finally {
      setSavingProfil(false);
    }
  };

  const filteredPerangkat = useMemo(() => {
    const q = searchPerangkat.trim().toLowerCase();
    if (!q) return perangkat;
    return perangkat.filter(
      (p) =>
        String(p.nama || "").toLowerCase().includes(q) ||
        String(p.jabatan || "").toLowerCase().includes(q) ||
        String(p.posisiSotk || "").toLowerCase().includes(q)
    );
  }, [perangkat, searchPerangkat]);

  const resetFotoState = (initialUrl = "") => {
    setFotoFile(null);
    setFotoPreview(initialUrl);
    setRemoveFoto(false);
    setFotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddPerson = () => {
    setEditingPerson(null);
    setPersonForm({
      nama: "",
      nipd: "",
      jabatan: "",
      posisiSotk: "Kaur",
      status: "Aktif Menjabat",
    });
    resetFotoState("");
    setModalOpen(true);
  };

  const openEditPerson = (person) => {
    setEditingPerson(person);
    setPersonForm({
      nama: person.nama || "",
      nipd: person.nipd || "",
      jabatan: person.jabatan || "",
      posisiSotk: person.posisiSotk || "Kaur",
      status: person.status || "Aktif Menjabat",
    });
    resetFotoState(person.foto || "");
    setModalOpen(true);
  };

  const handleFotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFotoError("Format foto harus berupa JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFotoError("Ukuran file foto maksimal 5 MB.");
      e.target.value = "";
      return;
    }

    setFotoError("");
    setFotoFile(file);
    setRemoveFoto(false);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleClearFoto = () => {
    setFotoFile(null);
    setFotoPreview("");
    setRemoveFoto(true);
    setFotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSavePerson = async (e) => {
    e.preventDefault();
    if (!personForm.nama.trim() || !personForm.jabatan.trim()) return;
    setSavingPerson(true);

    try {
      const formData = new FormData();
      formData.append("nama", personForm.nama.trim());
      formData.append("nipd", personForm.nipd.trim());
      formData.append("jabatan", personForm.jabatan.trim());
      formData.append("posisiSotk", personForm.posisiSotk);
      formData.append("status", personForm.status);

      if (fotoFile) {
        formData.append("foto", fotoFile);
      } else if (removeFoto) {
        formData.append("removeFoto", "true");
      }

      if (editingPerson) {
        const updated = await adminApi.updatePerangkat(editingPerson.id, formData);
        setPerangkat((prev) => prev.map((p) => (p.id === editingPerson.id ? updated : p)));
        toast.success(`Data "${updated.nama}" berhasil diperbarui.`, "Perangkat Diperbarui");
      } else {
        const created = await adminApi.createPerangkat(formData);
        setPerangkat((prev) => [...prev, created]);
        toast.success(`"${created.nama}" berhasil ditambahkan ke struktur desa.`, "Perangkat Ditambahkan");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan data perangkat desa.", "Gagal Menyimpan");
    } finally {
      setSavingPerson(false);
    }
  };

  const openDeleteModal = (person) => {
    setDeleteError("");
    setDeleteTarget(person);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDeletePerson = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const targetName = deleteTarget.nama;
      await adminApi.deletePerangkat(deleteTarget.id);
      setPerangkat((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success(`Data perangkat "${targetName}" berhasil dihapus.`, "Perangkat Dihapus");
    } catch (err) {
      setDeleteError(err.message || "Gagal menghapus data perangkat desa.");
    } finally {
      setDeleting(false);
    }
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

        <button
          type="button"
          disabled={loading || savingProfil}
          onClick={handleSaveProfil}
          className="adm-btn adm-btn--primary"
        >
          <Save size={16} />
          <span>{savingProfil ? "Menyimpan..." : "Simpan Profil"}</span>
        </button>
      </div>

      {pageError && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "0.9rem",
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{pageError}</span>
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

      {loading ? (
        <div className="adm-card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          Memuat data profil &amp; perangkat desa...
        </div>
      ) : (
        <>
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
                    {filteredPerangkat.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                          Belum ada data perangkat desa. Klik &ldquo;Tambah Perangkat&rdquo; untuk mengisi.
                        </td>
                      </tr>
                    ) : (
                      filteredPerangkat.map((person) => {
                        const initials = String(person.nama || "PD")
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
                              <span
                                className={`adm-badge ${SOTK_BADGE_MAP[person.posisiSotk] || "adm-badge--slate"
                                  }`}
                              >
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
                                onClick={() => openDeleteModal(person)}
                                className="adm-btn adm-btn--ghost-danger"
                                aria-label={`Hapus ${person.nama}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
        </>
      )}

      {modalOpen && (
        <div
          className="adm-overlay adm-overlay--center"
          onClick={() => !savingPerson && setModalOpen(false)}
        >
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-card__head">
              <h3 className="adm-card__title">
                {editingPerson ? "Edit Perangkat Desa" : "Tambah Aparatur Perangkat Desa"}
              </h3>
              <button
                type="button"
                disabled={savingPerson}
                onClick={() => setModalOpen(false)}
                className="adm-btn adm-btn--ghost"
              >
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
                  <option value="Kasun">Kasun</option>
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
                <label htmlFor="perangkat-foto-input">Foto Perangkat (JPG / PNG / WEBP, Maks. 5 MB)</label>
                <input
                  ref={fileInputRef}
                  id="perangkat-foto-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoSelect}
                  style={{ display: "none" }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px dashed #cbd5e1",
                    background: "#f8fafc",
                  }}
                >
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Pratinjau foto perangkat"
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "10px",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "10px",
                        background: "#e2e8f0",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Users size={22} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="adm-btn adm-btn--outline"
                        style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                      >
                        <Upload size={14} />
                        <span>{fotoPreview ? "Ganti Foto" : "Pilih File Foto"}</span>
                      </button>

                      {fotoPreview && (
                        <button
                          type="button"
                          onClick={handleClearFoto}
                          className="adm-btn adm-btn--ghost-danger"
                          style={{ padding: "6px 10px", fontSize: "0.82rem" }}
                        >
                          <Trash2 size={14} />
                          <span>Hapus Foto</span>
                        </button>
                      )}
                    </div>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "0.75rem",
                        color: "#64748b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fotoFile
                        ? `${fotoFile.name} (${(fotoFile.size / 1024).toFixed(0)} KB)`
                        : fotoPreview
                          ? "Foto tersimpan saat ini"
                          : "Opsional — jika kosong akan memakai avatar bawaan"}
                    </p>
                  </div>
                </div>

                {fotoError && (
                  <span style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: 4 }}>{fotoError}</span>
                )}
              </div>

              <div className="adm-mod-actions" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  disabled={savingPerson}
                  onClick={() => setModalOpen(false)}
                  className="adm-btn adm-btn--outline"
                >
                  Batal
                </button>
                <button type="submit" disabled={savingPerson} className="adm-btn adm-btn--primary">
                  <Save size={15} /> {savingPerson ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Perangkat Desa?"
        description={
          deleteTarget && (
            <>
              Anda yakin ingin menghapus{" "}
              <strong style={{ color: "#0f172a" }}>{deleteTarget.nama}</strong> ({deleteTarget.jabatan})
              dari susunan perangkat desa?
            </>
          )
        }
        confirmLabel="Ya, Hapus Perangkat"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDeletePerson}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}