// src/components/admin/AdminConfirmModal.jsx
import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function AdminConfirmModal({
    open,
    title = 'Konfirmasi Hapus',
    description,
    confirmLabel = 'Ya, Hapus',
    cancelLabel = 'Batal',
    loading = false,
    error = '',
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && !loading) onCancel?.();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-modal-title"
            onClick={() => !loading && onCancel?.()}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                }}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    aria-label="Tutup"
                    className="admin-icon-btn"
                    style={{ position: 'absolute', top: '16px', right: '16px' }}
                >
                    <X size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <AlertTriangle size={22} />
                    </div>

                    <div style={{ flex: 1, paddingRight: '20px' }}>
                        <h3
                            id="admin-confirm-modal-title"
                            style={{
                                margin: '0 0 6px',
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                color: '#0f172a',
                            }}
                        >
                            {title}
                        </h3>
                        <div style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#475569' }}>
                            {description}
                        </div>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        style={{
                            marginTop: '14px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            fontSize: '0.83rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                        marginTop: '22px',
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="btn-admin-outline"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: loading ? '#f87171' : '#dc2626',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <Trash2 size={15} />
                        <span>{loading ? 'Menghapus...' : confirmLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}