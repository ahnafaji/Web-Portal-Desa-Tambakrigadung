// src/pages/admin/BeritaFormPage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, UploadCloud, X, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminToast } from '../../context/AdminToastContext';

const KATEGORI_OPTIONS = [
  'Kegiatan Warga',
  'Pengumuman',
  'Pertanian & Perikanan',
  'Pembangunan',
];

export default function BeritaFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useAdminToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    judul: '',
    kategori: 'Kegiatan Warga',
    penulis: 'Admin Desa',
    ringkasan: '',
    isi: '',
    status: 'Terbit',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [removeCover, setRemoveCover] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    setLoadingData(true);
    setErrorMsg('');

    adminApi
      .getBeritaById(id)
      .then((res) => {
        if (!active || !res) return;
        const normalizedKategori = KATEGORI_OPTIONS.includes(res.kategori)
          ? res.kategori
          : 'Kegiatan Warga';

        setForm({
          judul: res.judul || '',
          kategori: normalizedKategori,
          penulis: res.penulis || 'Admin Desa',
          ringkasan: res.ringkasan || '',
          isi: res.isi || '',
          status: res.status === 'Terbit' || res.isPublished ? 'Terbit' : 'Draft',
        });

        if (res.gambar || res.image) {
          setCoverPreview(res.gambar || res.image);
          setRemoveCover(false);
        }
      })
      .catch((err) => {
        if (active) setErrorMsg(err.message || 'Gagal memuat data artikel untuk diedit.');
      })
      .finally(() => {
        if (active) setLoadingData(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setRemoveCover(false);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview('');
    setRemoveCover(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && (v !== '' || isEdit)) {
          fd.append(k, String(v));
        }
      });
      if (coverFile) {
        fd.append('gambar', coverFile);
      } else if (removeCover) {
        fd.append('removeCover', 'true');
      }

      if (isEdit) {
        await adminApi.updateBerita(id, fd);
        toast.success(`Perubahan pada "${form.judul}" berhasil disimpan.`, 'Berita Diperbarui');
      } else {
        await adminApi.createBerita(fd);
        toast.success(
          form.status === 'Terbit'
            ? `Artikel "${form.judul}" berhasil diterbitkan.`
            : `Draf "${form.judul}" berhasil disimpan.`,
          form.status === 'Terbit' ? 'Berita Diterbitkan' : 'Draf Tersimpan'
        );
      }
      navigate('/admin/berita');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan berita. Periksa kembali isian formulir.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-page">
      <div className="admin-page-head">
        <div>
          <nav className="admin-breadcrumb">
            <Link to="/admin/berita">Berita &amp; Artikel</Link> <span>›</span>{' '}
            <strong>{isEdit ? 'Edit Berita' : 'Tulis Berita Baru'}</strong>
          </nav>
          <h2 className="admin-page-title">
            {isEdit ? 'Edit Berita & Artikel' : 'Tulis Berita & Artikel Baru'}
          </h2>
        </div>
        <div className="admin-head-actions">
          <Link to="/admin/berita" className="btn-admin-outline">
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || loadingData}
            className="btn-admin-primary"
          >
            <Check size={16} />
            <span>
              {submitting
                ? 'Menyimpan...'
                : isEdit
                  ? 'Simpan Perubahan'
                  : form.status === 'Terbit'
                    ? 'Publikasikan'
                    : 'Simpan Draf'}
            </span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loadingData ? (
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Memuat data artikel berita...
        </div>
      ) : (
        <div className="admin-form-grid">
          <section className="admin-card">
            <div className="admin-field">
              <label>Judul Berita / Artikel *</label>
              <input
                type="text"
                name="judul"
                required
                value={form.judul}
                onChange={handleChange}
                placeholder="Tuliskan judul berita yang informatif..."
              />
            </div>

            <div className="admin-field-row-2">
              <div className="admin-field">
                <label>Kategori *</label>
                <select name="kategori" value={form.kategori} onChange={handleChange}>
                  {KATEGORI_OPTIONS.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Penulis / Redaksi *</label>
                <input
                  type="text"
                  name="penulis"
                  required
                  value={form.penulis}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Ringkasan Singkat *</label>
              <textarea
                name="ringkasan"
                required
                rows={2}
                maxLength={250}
                value={form.ringkasan}
                onChange={handleChange}
                placeholder="Ringkasan 1–2 kalimat yang tampil pada kartu pratinjau berita..."
              />
            </div>

            <div className="admin-field">
              <label>Isi Artikel Lengkap *</label>
              <textarea
                name="isi"
                required
                rows={10}
                value={form.isi}
                onChange={handleChange}
                placeholder="Tulis isi lengkap kabar desa di sini..."
              />
            </div>
          </section>

          <div className="admin-form-side">
            <section className="admin-card">
              <h3>Status Publikasi</h3>
              <label className={`admin-radio-card ${form.status === 'Terbit' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="Terbit"
                  checked={form.status === 'Terbit'}
                  onChange={handleChange}
                />
                <div>
                  <strong>Terbitkan Sekarang</strong>
                  <p>Langsung muncul pada portal berita warga.</p>
                </div>
              </label>

              <label className={`admin-radio-card ${form.status === 'Draft' ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={form.status === 'Draft'}
                  onChange={handleChange}
                />
                <div>
                  <strong>Simpan sebagai Draf</strong>
                  <p>Tersimpan internal sebelum ditinjau kembali.</p>
                </div>
              </label>
            </section>

            <section className="admin-card">
              <h3>Gambar Sampul Berita</h3>

              {coverPreview ? (
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <img
                    src={coverPreview}
                    alt="Pratinjau sampul"
                    className="admin-evidence-img"
                    style={{ width: '100%', display: 'block', borderRadius: '10px' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Hapus gambar sampul"
                    title="Hapus gambar sampul"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}

              <label className="admin-dropzone">
                <UploadCloud size={26} />
                <strong>{coverPreview ? 'Ganti gambar sampul' : 'Pilih gambar sampul'}</strong>
                <span>JPG, PNG, WebP (Maks. 2MB)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleImage}
                />
              </label>
            </section>
          </div>
        </div>
      )}
    </form>
  );
}