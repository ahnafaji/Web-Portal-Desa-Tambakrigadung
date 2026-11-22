// src/pages/admin/BeritaFormPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, UploadCloud } from 'lucide-react';
import { adminApi } from '../../services/adminapi';

export default function BeritaFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi
      .getBeritaById(id)
      .then((res) => {
        if (res) {
          setForm((prev) => ({ ...prev, ...res }));
          if (res.gambar) setCoverPreview(res.gambar);
        }
      })
      .catch(() => {});
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append('gambar', coverFile);

      if (isEdit) {
        await adminApi.updateBerita(id, fd).catch(() => {});
      } else {
        await adminApi.createBerita(fd).catch(() => {});
      }
      navigate('/admin/berita');
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
          <button type="submit" disabled={submitting} className="btn-admin-primary">
            <Check size={16} />
            <span>{submitting ? 'Menyimpan...' : 'Publikasikan'}</span>
          </button>
        </div>
      </div>

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
                <option value="Kegiatan Warga">Kegiatan Warga</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Pertanian & Perikanan">Pertanian &amp; Perikanan</option>
                <option value="Pembangunan">Pembangunan</option>
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
            <label className="admin-dropzone">
              <UploadCloud size={26} />
              <strong>Pilih gambar sampul</strong>
              <span>JPG, PNG, WebP (Maks. 2MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleImage}
              />
            </label>
            {coverPreview && (
              <img src={coverPreview} alt="Pratinjau sampul" className="admin-evidence-img mt-1" />
            )}
          </section>
        </div>
      </div>
    </form>
  );
}