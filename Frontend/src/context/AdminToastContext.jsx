// src/context/AdminToastContext.jsx
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AdminToastContext = createContext(null);

const TOAST_STYLES = {
    success: {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        accent: '#059669',
        titleColor: '#065f46',
        textColor: '#047857',
        Icon: CheckCircle2,
        defaultTitle: 'Berhasil',
    },
    error: {
        bg: '#fef2f2',
        border: '#fecaca',
        accent: '#dc2626',
        titleColor: '#991b1b',
        textColor: '#b91c1c',
        Icon: AlertCircle,
        defaultTitle: 'Terjadi Kesalahan',
    },
    info: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        accent: '#2563eb',
        titleColor: '#1e40af',
        textColor: '#1d4ed8',
        Icon: Info,
        defaultTitle: 'Informasi',
    },
};

export function AdminToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (type, message, title, duration = 3500) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            setToasts((prev) => [...prev, { id, type, message, title }]);
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const toast = {
        success: (message, title) => showToast('success', message, title),
        error: (message, title) => showToast('error', message, title, 4500),
        info: (message, title) => showToast('info', message, title),
    };

    return (
        <AdminToastContext.Provider value={toast}>
            {children}

            <style>{`
        @keyframes adminToastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>

            {toasts.length > 0 && (
                <div
                    aria-live="polite"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        maxWidth: '360px',
                        width: 'calc(100vw - 32px)',
                        pointerEvents: 'none',
                    }}
                >
                    {toasts.map((item) => {
                        const cfg = TOAST_STYLES[item.type] || TOAST_STYLES.info;
                        const Icon = cfg.Icon;

                        return (
                            <div
                                key={item.id}
                                role="status"
                                style={{
                                    pointerEvents: 'auto',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '13px 14px',
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    border: `1px solid ${cfg.border}`,
                                    borderLeft: `4px solid ${cfg.accent}`,
                                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.14)',
                                    animation: 'adminToastSlideIn 0.22s ease-out',
                                }}
                            >
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: cfg.bg,
                                        color: cfg.accent,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon size={18} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: '0.88rem',
                                            fontWeight: 700,
                                            color: cfg.titleColor,
                                            lineHeight: 1.3,
                                            marginBottom: '2px',
                                        }}
                                    >
                                        {item.title || cfg.defaultTitle}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '0.84rem',
                                            color: '#334155',
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {item.message}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeToast(item.id)}
                                    aria-label="Tutup notifikasi"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminToastContext.Provider>
    );
}

export function useAdminToast() {
    const ctx = useContext(AdminToastContext);
    if (!ctx) {
        return {
            success: () => { },
            error: () => { },
            info: () => { },
        };
    }
    return ctx;
}