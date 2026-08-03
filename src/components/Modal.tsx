import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: string;
  maxWidthClass?: string;
  panelClassName?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidthClass = 'max-w-lg',
  panelClassName,
  showCloseButton = true,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll lock removed per user request: user wants to scroll the page while modal is open.

  // ── Cerrar con Escape ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panel = panelClassName ??
    'bg-white/85 text-slate-950';

  return createPortal(
    /*
     * OVERLAY — ocupa TODA la ventana visible con position:fixed
     * independientemente del scroll de la página.
     */
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        pointerEvents: 'none', // Permite scroll e interacción con el fondo
        /* Fondo tipo liquid glass oscuro */
        background: 'rgba(15, 5, 35, 0.60)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'modalOverlayIn 0.22s ease-out forwards',
      }}
    >
      {/*
       * PANEL — centrado por el flex del overlay.
       * Nunca usa top/transform relativo al padre.
       */}
      <div
        className={`${panel} shadow-2xl w-full flex flex-col rounded-3xl`}
        style={{
          maxWidth: 'min(600px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 40px)',
          boxSizing: 'border-box',
          pointerEvents: 'auto', // El panel sí captura clicks
          /* Liquid Glass */
          background: 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(237,220,255,0.82) 50%, rgba(255,255,255,0.88) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderTop: '2px solid rgba(255,255,255,1)',
          borderLeft: '2px solid rgba(255,255,255,0.92)',
          borderBottom: '1.5px solid rgba(139,92,246,0.30)',
          borderRight: '1.5px solid rgba(139,92,246,0.22)',
          boxShadow: [
            '0 32px 80px rgba(91, 6, 189, 0.28)',
            '0 8px 24px rgba(0,0,0,0.20)',
            'inset 0 2px 0 rgba(255,255,255,1)',
            'inset 0 -1px 0 rgba(139,92,246,0.15)',
          ].join(', '),
          animation: 'modalPanelIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Shimmer highlight ────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Header (título + botón cerrar) ──────────────────────────── */}
        {(title || subtitle || icon || showCloseButton) && (
          <div
            className="flex justify-between items-center border-b border-purple-900/15 pb-3 shrink-0 mb-3"
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '20px 20px 12px 20px',
            }}
          >
            <div className="flex items-center gap-2.5">
              {icon && (
                <div className="w-9 h-9 neu-raised text-purple-900 flex items-center justify-center rounded-2xl shrink-0">
                  <span className="material-symbols-outlined font-bold text-xl">{icon}</span>
                </div>
              )}
              <div>
                {title && (
                  <h4 className="font-black text-base sm:text-lg text-purple-950 leading-tight">
                    {title}
                  </h4>
                )}
                {subtitle && (
                  <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 neu-raised hover:neu-pressed active:neu-pressed flex items-center justify-center font-black text-xs text-slate-700 cursor-pointer rounded-full shrink-0"
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* ── Contenido (con scroll interno si es necesario) ─────────── */}
        <div
          className="flex-1 overflow-y-auto pr-1"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: title || subtitle || icon ? '0 20px 20px 20px' : '20px',
          }}
        >
          {children}
        </div>
      </div>

      {/* ── Keyframes inyectados como <style> dentro del portal ───────── */}
      <style>{`
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalPanelIn {
          from {
            opacity: 0;
            transform: scale(0.93) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};
