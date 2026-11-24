// src/pages/admin/UmkmFormPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, MapPin, UploadCloud, X, Lightbulb, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminToast } from '../../context/AdminToastContext';

const KATEGORI_OPTIONS = [
  { value: 'pangan', label: 'Pangan & Kudapan' },
  { value: 'olahan', label: 'Olahan Tambak & Madu' },
  { value: 'kerajinan', label: 'Batik & Kerajinan' },
  { value: 'jasa', label: 'Fabrikasi & Jasa' },
];

const normalizeKategori = (val = '') => {
  const lower = String(val).toLowerCase().trim();
  if (lower === 'pangan' || lower.includes('pangan') || lower.includes('kuliner') || lower.includes('kudapan')) {
    return 'pangan';
  }
  if (
    lower === 'olahan' ||
    lower.includes('olahan') ||
    lower.includes('tambak') ||
    lower.includes('madu') ||
    lower.includes('ikan') ||
    lower.includes('tani')
  ) {
    return 'olahan';
  }
  if (lower === 'kerajinan' || lower.includes('batik') || lower.includes('rajin')) {
    return 'kerajinan';
  }
  if (lower === 'jasa' || lower.includes('fabrikasi') || lower.includes('dagang')) {
    return 'jasa';
  }
  return '';
};

const stripCountryCode = (wa = '') => {
  const digits = String(wa).replace(/\D/g, '');
  if (digits.startsWith('62')) return digits.slice(2);
  if (digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const resolveImageSrc = (src) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
    return src;
  }
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = src.startsWith('/') ? src : `/${src}`;
  return `${base}${cleanPath}`;
};

export default function UmkmFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useAdminToast();

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
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    setLoadingData(true);
    setErrorMsg('');

    adminApi
      .getUmkmById(id)
      .then((res) => {
        if (!active || !res) return;
        const data = res?.item ? res.item : res;

        const fullDeskripsi =
          Array.isArray(data.deskripsiLengkap) && data.deskripsiLengkap.length > 0
            ? data.deskripsiLengkap.join('\n\n')
            : data.deskripsi || data.ringkasan || '';

        const rawMaps =
          data.rawMapsUrl !== undefined
            ? data.rawMapsUrl
            : data.mapsUrl &&
              !data.mapsUrl.includes('google.com/maps/search/?api=1') &&
              data.mapsUrl !== 'https://maps.google.com'
              ? data.mapsUrl
              : '';

        setForm({
          namaUsaha: data.namaUsaha || data.nama || '',
          kategori: normalizeKategori(data.kategori || data.kategoriLabel),
          pemilik: data.pemilik || '',
          whatsapp: stripCountryCode(data.whatsapp || data.telepon || ''),
          jamOperasional: data.jamOperasional || '',
          hargaMin: data.hargaMin ? String(data.hargaMin) : '',
          hargaMax: data.hargaMax ? String(data.hargaMax) : '',
          alamat: data.alamat || data.dusun || '',
          mapsUrl: rawMaps,
          deskripsi: fullDeskripsi,
          status:
            data.status === 'Aktif' || data.rawStatus === 'APPROVED' ? 'Aktif' : 'Draft',
        });

        const galeri = Array.isArray(data.galeri)
          ? data.galeri.filter(Boolean)
          : data.foto
            ? [data.foto]
            : [];
        setExistingPhotos(galeri);
      })
      .catch((err) => {
        if (active) setErrorMsg(err.message || 'Gagal memuat data UMKM untuk diedit.');
      })
      .finally(() => {
        if (active) setLoadingData(false);
      });

    return () => {
      active = false;
    };
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
    const remaining = Math.max(0, 4 - existingPhotos.length - photos.length);
    const valid = files.slice(0, remaining).map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, idx) => idx !== index));
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
    setErrorMsg('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && (v !== '' || isEdit)) {
          fd.append(k, v);
        }
      });
      if (isEdit) {
        fd.append('existingPhotos', JSON.stringify(existingPhotos));
      }
      photos.forEach((p) => p.file && fd.append('fotos', p.file));

      if (isEdit) {
        await adminApi.updateUmkm(id, fd);
        toast.success(`Perubahan pada "${form.namaUsaha}" berhasil disimpan.`, 'Perubahan Tersimpan');
      } else {
        await adminApi.createUmkm(fd);
        toast.success(`Data UMKM "${form.namaUsaha}" berhasil ditambahkan.`, 'UMKM Ditambahkan');
      }
      navigate('/admin/umkm');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan data UMKM. Periksa kembali isian formulir.');
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
          <button
            type="submit"
            disabled={submitting || loadingData}
            className="btn-admin-primary"
          >
            <Check size={16} />
            <span>{submitting ? 'Menyimpan...' : 'Simpan UMKM'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
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
          Memuat data UMKM...
        </div>
      ) : (
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
                  <option value="">Pilih Kategori Bidang</option>
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
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
                <small>{form.deskripsi.length}/2000 karakter</small>
              </div>
              <textarea
                name="deskripsi"
                required
                maxLength={2000}
                rows={4}
                value={form.deskripsi}
                onChange={handleChange}
                placeholder="Jelaskan produk yang dijual, keistimewaan rasa/bahan baku lokal, metode pemesanan, atau fasilitas yang tersedia..."
              />
            </div>
          </section>

          {/* Status & Foto */}
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

              {isEdit && existingPhotos.length > 0 && (
                <div className="admin-uploaded-list" style={{ marginBottom: '12px' }}>
                  <span className="admin-field-label">
                    FOTO TERPASANG SAAT INI ({existingPhotos.length})
                  </span>
                  {existingPhotos.map((url, idx) => (
                    <div key={`${url}-${idx}`} className="admin-uploaded-item">
                      <img src={resolveImageSrc(url)} alt={`Foto UMKM ${idx + 1}`} />
                      <div className="admin-uploaded-meta">
                        <strong>Foto Tersimpan #{idx + 1}</strong>
                        <span>Aktif di katalog publik</span>
                      </div>
                      {idx === 0 && <span className="admin-pill is-success-soft">Cover</span>}
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(idx)}
                        className="admin-icon-btn"
                        aria-label={`Hapus foto tersimpan #${idx + 1}`}
                        title="Hapus foto"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length < 4 && (
                <label className="admin-dropzone">
                  <UploadCloud size={26} />
                  <strong>
                    {isEdit
                      ? 'Unggah foto baru (opsional)'
                      : 'Seret foto ke sini atau klik untuk unggah'}
                  </strong>
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
                  <span className="admin-field-label">BERKAS BARU ({photos.length}/4)</span>
                  {photos.map((photo, idx) => (
                    <div key={photo.preview} className="admin-uploaded-item">
                      <img src={photo.preview} alt={photo.name} />
                      <div className="admin-uploaded-meta">
                        <strong>{photo.name}</strong>
                        <span>{photo.size} • Siap diunggah</span>
                      </div>
                      {idx === 0 && <span className="admin-pill is-success-soft">Cover Baru</span>}
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
      )}
    </form>
  );
}