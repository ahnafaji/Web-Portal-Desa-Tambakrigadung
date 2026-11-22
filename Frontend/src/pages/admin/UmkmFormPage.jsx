// src/pages/admin/UmkmFormPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, MapPin, UploadCloud, X, Lightbulb } from 'lucide-react';
import { adminApi } from '../../services/adminapi';

export default function UmkmFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    namaUsaha: '',
    kategori: '',
    pemilik: '',
    whatsapp: '',
    jamOperasional: '',
    hargaMin: '',
    hargaMax: '',
    alamat: '',
    mapsUrl: '',
    deskripsi: '',
    status: 'Aktif',
  });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi
      .getUmkmById(id)
      .then((res) => {
        if (res) setForm((prev) => ({ ...prev, ...res }));
      })
      .catch(() => {});
  }, [id, isEdit]);

  useEffect(() => {
    return () => photos.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
  }, [photos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileAdd = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - photos.length;
    const valid = files.slice(0, remaining).map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const target = prev[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((p) => p.file && fd.append('fotos', p.file));

      if (isEdit) {
        await adminApi.updateUmkm(id, fd).catch(() => {});
      } else {
        await adminApi.createUmkm(fd).catch(() => {});
      }
      navigate('/admin/umkm');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-page">
      <div className="admin-page-head">
        <div>
          <nav className="admin-breadcrumb">
            <Link to="/admin/umkm">UMKM</Link> <span>›</span>{' '}
            <strong>{isEdit ? 'Edit UMKM' : 'Tambah UMKM Baru'}</strong>
          </nav>
          <h2 className="admin-page-title">{isEdit ? 'Edit Data UMKM' : 'Tambah Data UMKM'}</h2>
          <p className="admin-page-subtitle">
            Isi formulir data unit usaha warga desa untuk ditampilkan pada katalog portal publik.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link to="/admin/umkm" className="btn-admin-outline">
            Batal
          </Link>
          <button type="submit" disabled={submitting} className="btn-admin-primary">
            <Check size={16} />
            <span>{submitting ? 'Menyimpan...' : 'Simpan UMKM'}</span>
          </button>
        </div>
      </div>

      <div className="admin-form-grid">
        {/* Kolom Kiri: Informasi Usaha */}
        <section className="admin-card">
          <div className="admin-section-rail">
            <h3>Informasi Usaha</h3>
            <p>Informasi identitas dan rincian produk usaha warga secara komprehensif</p>
          </div>

          <div className="admin-field">
            <label>Nama Usaha *</label>
            <input
              type="text"
              name="namaUsaha"
              required
              value={form.namaUsaha}
              onChange={handleChange}
              placeholder="Contoh: Ayam Geprek Pak Slamet"
            />
            <small>Gunakan nama resmi atau nama komersial yang dikenal warga sekitar.</small>
          </div>

          <div className="admin-field-row-2">
            <div className="admin-field">
              <label>Kategori Usaha *</label>
              <select name="kategori" required value={form.kategori} onChange={handleChange}>
                <option value="">Pilih kategori bidang usaha</option>
                <option value="Kuliner">Kuliner &amp; Olahan Pangan</option>
                <option value="Pertanian">Pertanian &amp; Perkebunan</option>
                <option value="Perikanan">Perikanan &amp; Tambak</option>
                <option value="Kerajinan">Kerajinan Tangan</option>
                <option value="Jasa">Jasa &amp; Perdagangan</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Nama Pemilik *</label>
              <input
                type="text"
                name="pemilik"
                required
                value={form.pemilik}
                onChange={handleChange}
                placeholder="Contoh: Slamet Riyadi"
              />
            </div>
          </div>

          <div className="admin-field-row-2">
            <div className="admin-field">
              <label>Nomor WhatsApp Aktif *</label>
              <div className="admin-input-addon">
                <span>+62</span>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="812-3499-1122"
                />
              </div>
              <small>Nomor utama untuk pesanan langsung dari pengunjung portal.</small>
            </div>
            <div className="admin-field">
              <label>Jam Operasional</label>
              <input
                type="text"
                name="jamOperasional"
                value={form.jamOperasional}
                onChange={handleChange}
                placeholder="Contoh: Setiap Hari, 09.00 - 21.00 WIB"
              />
            </div>
          </div>

          <div className="admin-field-row-2">
            <div className="admin-field">
              <label>Harga Minimum</label>
              <div className="admin-input-addon">
                <span>Rp</span>
                <input
                  type="number"
                  name="hargaMin"
                  min="0"
                  value={form.hargaMin}
                  onChange={handleChange}
                  placeholder="15000"
                />
              </div>
            </div>
            <div className="admin-field">
              <label>Harga Maksimum</label>
              <div className="admin-input-addon">
                <span>Rp</span>
                <input
                  type="number"
                  name="hargaMax"
                  min="0"
                  value={form.hargaMax}
                  onChange={handleChange}
                  placeholder="35000"
                />
              </div>
            </div>
          </div>

          <div className="admin-field">
            <label>Alamat Lengkap / Dusun *</label>
            <input
              type="text"
              name="alamat"
              required
              value={form.alamat}
              onChange={handleChange}
              placeholder="Contoh: Dusun Krajan RT 02 / RW 01, Desa Tambakrigadung"
            />
          </div>

          <div className="admin-field">
            <div className="admin-label-between">
              <label>Link Google Maps Usaha (Opsional)</label>
              <small>Memudahkan rute pembeli</small>
            </div>
            <div className="admin-input-addon">
              <span>
                <MapPin size={15} />
              </span>
              <input
                type="url"
                name="mapsUrl"
                value={form.mapsUrl}
                onChange={handleChange}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>

          <div className="admin-field">
            <div className="admin-label-between">
              <label>Deskripsi Usaha &amp; Produk Unggulan *</label>
              <small>{form.deskripsi.length}/500 karakter</small>
            </div>
            <textarea
              name="deskripsi"
              required
              maxLength={500}
              rows={4}
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan produk yang dijual, keistimewaan rasa/bahan baku lokal, metode pemesanan, atau fasilitas yang tersedia..."
            />
          </div>
        </section>

        {/* Status, Foto */}
        <div className="admin-form-side">
          <section className="admin-card">
            <div className="admin-card-head">
              <h3>Status Publikasi</h3>
              <span className={`status-dot ${form.status === 'Aktif' ? 'is-green' : 'is-gray'}`} />
            </div>

            <label className={`admin-radio-card ${form.status === 'Aktif' ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="status"
                value="Aktif"
                checked={form.status === 'Aktif'}
                onChange={handleChange}
              />
              <div>
                <strong>
                  Aktif &amp; Ditampilkan <span className="admin-pill is-success-soft">Live</span>
                </strong>
                <p>Langsung tayang di etalase katalog publik UMKM desa.</p>
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
                <p>Hanya tersimpan di panel admin, belum dapat diakses pengunjung publik.</p>
              </div>
            </label>
          </section>

          <section className="admin-card">
            <h3>Foto Produk &amp; Usaha</h3>
            <p className="admin-muted-sm">
              Unggah 1–4 foto berkualitas baik untuk mempromosikan produk warga desa.
            </p>

            {photos.length < 4 && (
              <label className="admin-dropzone">
                <UploadCloud size={26} />
                <strong>Seret foto ke sini atau klik untuk unggah</strong>
                <span>Format JPG, PNG (Maks. 2MB per foto, hingga 4 foto)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  hidden
                  onChange={handleFileAdd}
                />
              </label>
            )}

            {photos.length > 0 && (
              <div className="admin-uploaded-list">
                <span className="admin-field-label">BERKAS TERUNGGAH ({photos.length}/4)</span>
                {photos.map((photo, idx) => (
                  <div key={photo.preview} className="admin-uploaded-item">
                    <img src={photo.preview} alt={photo.name} />
                    <div className="admin-uploaded-meta">
                      <strong>{photo.name}</strong>
                      <span>{photo.size} • Selesai</span>
                    </div>
                    {idx === 0 && <span className="admin-pill is-success-soft">Cover</span>}
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="admin-icon-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="admin-callout-success">
            <Lightbulb size={18} />
            <div>
              <strong>Tips Verifikasi Admin</strong>
              <p>
                Pastikan nomor WhatsApp telah teruji aktif dan alamat dusun sesuai kearsipan desa
                sebelum mengaktifkan status publikasi live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}