import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

// Branded confirm dialog for destructive actions. Same portal + AnimatePresence
// pattern as RecEditModal: the parent mounts/unmounts it conditionally and
// wraps the conditional in <AnimatePresence>. Rendered through a portal so the
// `fixed inset-0` backdrop covers the viewport even when the caller lives inside
// a Framer Motion `layout`-animated ancestor.
const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  busyLabel,
  cancelLabel = 'Cancel',
  confirmTone = 'danger', // 'danger' | 'default'
  onConfirm,
  onCancel,
  busy = false,
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  if (typeof document === 'undefined') return null;

  const confirmClass =
    confirmTone === 'danger'
      ? 'bg-punk-rock-pink text-brand-bg border-punk-rock-pink hover:shadow-[0_0_18px_rgba(255,47,146,0.45)]'
      : 'bg-totes-turquoise text-brand-bg border-totes-turquoise hover:shadow-[0_0_18px_rgba(45,226,230,0.45)]';

  const dialog = (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8 bg-brand-bg/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={busy ? undefined : onCancel}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm bg-brand-bg border border-brand-muted/20 rounded-3xl p-6 md:p-8"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl md:text-2xl font-bold tracking-tight mb-3"
        >
          {title}
        </h2>
        {message && (
          <p className="text-sm font-light text-brand-text/80 mb-6 leading-relaxed">
            {message}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`w-full max-w-[260px] inline-flex items-center justify-center px-5 py-3 rounded-full font-urbanist font-bold uppercase tracking-widest text-sm border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${confirmClass}`}
          >
            {busy ? (busyLabel ?? `${confirmLabel}…`) : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="text-brand-muted hover:text-totes-turquoise transition-colors text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(dialog, document.body);
};

export default ConfirmDialog;
