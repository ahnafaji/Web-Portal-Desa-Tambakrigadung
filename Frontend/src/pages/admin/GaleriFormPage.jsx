// src/pages/admin/GaleriFormPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, UploadCloud, X, Star, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminapi';

export default function GaleriFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: '',
    kategori: 'Kegiatan Warga',
    tanggal: new Date().toISOString().slice(0, 10),
    lokasi: '',
    keterangan: '',
    status: 'Terbit',
    sorotanBeranda: true,
  });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi
      .getGaleriById(id)
      .then((res) => {
        if (res) setForm((prev) => ({ ...prev, ...res }));
      })
      .catch(() => {});
  }, [id, isEdit]);

  useEffect(() => {
    return () => photos.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
  }, [photos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length;
    const mapped = files.slice(0, remaining).map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...mapped]);
    e.target.value = '';
  };

  const setAsCover = (index) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const copy = [...prev];
      const [picked] = copy.splice(index, 1);
      copy.unshift(picked);
      return copy;
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const target = prev[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') fd.append(k, String(v)); });
      photos.forEach((p) => p.file && fd.append('fotos', p.file));

      if (isEdit) {
        await adminApi.updateGaleri(id, fd).catch(() => {});
      } else {
        await adminApi.createGaleri(fd).catch(() => {});
      }
      navigate('/admin/galeri');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-page">
      <div className="admin-page-head">
        <div>
          <nav className="admin-breadcrumb">
            <Link to="/admin/galeri">Galeri Foto</Link> <span>›</span>{' '}
            <strong>{isEdit ? 'Edit Galeri' : 'Tambah Galeri'}</strong>
          </nav>
          <h2 className="admin-page-title">
            {isEdit ? 'Edit Album Galeri' : 'Tambah Album Galeri'}
          </h2>
          <p className="admin-page-subtitle">
            Unggah dokumentasi foto kegiatan masyarakat, pembangunan fasilitas, dan potensi desa.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link to="/admin/galeri" className="btn-admin-outline">
            Batal
          </Link>
          <button type="submit" disabled={submitting} className="btn-admin-primary">
            <Save size={16} />
            <span>{submitting ? 'Menyimpan...' : 'Simpan Galeri'}</span>
          </button>
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-main">
          <section className="admin-card">
            <div className="admin-section-rail">
              <h3>Informasi Dokumentasi</h3>
              <p>Rincian nama kegiatan, tanggal, dan lokasi pelaksanaan acara desa.</p>
            </div>

            <div className="admin-field">
              <label>Judul Kegiatan / Album *</label>
              <input
                type="text"
                name="judul"
                required
                value={form.judul}
                onChange={handleChange}
                placeholder="Contoh: Kerja Bakti Normalisasi Saluran Irigasi Dusun Tambakboyo"
              />
            </div>

            <div className="admin-field-row-2">
              <div className="admin-field">
                <label>Kategori Kegiatan *</label>
                <select name="kategori" value={form.kategori} onChange={handleChange}>
                  <option value="Kegiatan Warga">Kegiatan Warga</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Wisata & Budaya">Wisata &amp; Budaya</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Tanggal Kegiatan *</label>
                <input
                  type="date"
                  name="tanggal"
                  required
                  value={form.tanggal}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Lokasi Kegiatan *</label>
              <input
                type="text"
                name="lokasi"
                required
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Dusun Tambakboyo RT 04 / RW 02, Area Persawahan Blok B"
              />
            </div>

            <div className="admin-field">
              <div className="admin-label-between">
                <label>Keterangan Lengkap Kegiatan</label>
                <small>{form.keterangan.length}/1000 karakter</small>
              </div>
              <textarea
                name="keterangan"
                rows={4}
                maxLength={1000}
                value={form.keterangan}
                onChange={handleChange}
                placeholder="Tuliskan deskripsi singkat mengenai latar belakang dan hasil kegiatan..."
              />
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div className="admin-section-rail">
                <h3>Unggah Foto Dokumentasi</h3>
                <p>Format JPG, JPEG, PNG, WebP (Maks. 5MB per file)</p>
              </div>
              <span className="admin-pill is-success-soft">
                {photos.length}/10 Foto Terunggah
              </span>
            </div>

            {photos.length < 10 && (
              <label className="admin-dropzone">
                <UploadCloud size={28} />
                <strong>Klik atau seret beberapa foto ke sini</strong>
                <span>
                  Dapat mengunggah hingga 10 foto sekaligus dengan rasio rekomendasi 16:9 atau 4:3
                </span>
                <span className="btn-admin-outline btn-admin-sm mt-1">Pilih Berkas Komputer</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  hidden
                  onChange={handleFiles}
                />
              </label>
            )}

            {photos.length > 0 && (
              <div className="mt-2">
                <p className="admin-field-label mb-1">
                  Foto yang Siap Diterbitkan (Klik foto untuk jadikan sampul utama):
                </p>
                <div className="admin-photo-grid">
                  {photos.map((photo, idx) => (
                    <div
                      key={photo.preview}
                      onClick={() => setAsCover(idx)}
                      className={`admin-photo-tile ${idx === 0 ? 'is-cover' : ''}`}
                    >
                      <img src={photo.preview} alt={photo.name} />
                      {idx === 0 && (
                        <span className="admin-cover-badge">
                          <Star size={11} /> SAMPUL UTAMA
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(idx);
                        }}
                        className="admin-photo-remove"
                      >
                        <X size={13} />
                      </button>
                      <div className="admin-photo-caption">
                        <span>{photo.name}</span>
                        <small>{photo.size}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="admin-form-side">
          <section className="admin-card">
            <div className="admin-card-head">
              <h3>Pengaturan Publikasi</h3>
              <span className="admin-pill is-success-soft">• {form.status}</span>
            </div>

            <label className={`admin-radio-card ${form.status === 'Terbit' ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="status"
                value="Terbit"
                checked={form.status === 'Terbit'}
                onChange={handleChange}
              />
              <div>
                <strong>Terbitkan Sekarang (Live)</strong>
                <p>Album foto langsung tayang di halaman Galeri Desa.</p>
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
                <p>Hanya tersimpan di panel admin desa, belum dipublikasikan.</p>
              </div>
            </label>

            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                name="sorotanBeranda"
                checked={form.sorotanBeranda}
                onChange={handleChange}
              />
              <div>
                <strong>Tampilkan di Sorotan Beranda</strong>
                <p>Tampilkan 3 foto terbaik album ini di widget beranda portal desa.</p>
              </div>
            </label>
          </section>

          <section className="admin-card">
            <h3>Ketentuan Foto Galeri</h3>
            <ul className="admin-rules-list">
              <li>
                <CheckCircle2 size={15} />
                <span>Foto pertama otomatis menjadi foto sampul pada etalase galeri.</span>
              </li>
              <li>
                <CheckCircle2 size={15} />
                <span>Gunakan format lanskap minimal 1280 × 720 px agar tajam di semua layar.</span>
              </li>
              <li>
                <CheckCircle2 size={15} />
                <span>Pastikan foto dokumentasi asli kegiatan warga tanpa watermark pihak ketiga.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </form>
  );
}