import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Tv, Monitor, Film, FileText } from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'movie', label: 'Movie', Icon: Film },
  { value: 'show', label: 'Show', Icon: Tv },
  { value: 'limited_series', label: 'Limited Series', Icon: Monitor },
  { value: 'documentary', label: 'Doc', Icon: FileText },
];

// Modal surfaced from a GuideCard pencil-icon click. Pre-fills the form with
// the rec's current fields, PATCHes them on save, and lets the parent know so
// it can refresh its rec list. Server-side gate handles the "recipient has
// started watching" case and surfaces the error inline if hit.
const RecEditModal = ({ recommendation, userId, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: recommendation.title ?? '',
    streamer: recommendation.streamer ?? '',
    contentType: recommendation.content_type ?? 'show',
    genre: recommendation.genre_or_topic ?? '',
    blurb: recommendation.short_blurb ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/recommendations/${recommendation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...form }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? 'Could not save changes.');
        setSaving(false);
        return;
      }
      const updated = await res.json();
      onSaved?.(updated);
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // NOTE: `AnimatePresence` lives in the parent (GuideCard) around the
  // `{isEditing && <RecEditModal />}` mount — putting it here would dead-code
  // the `exit` props because the whole modal unmounts before AnimatePresence
  // can drive the exit animation.
  //
  // Rendered through a portal to `document.body` so the `fixed inset-0`
  // backdrop is always sized to the viewport. Without the portal, Framer
  // Motion's `layout` prop on the parent GuideCard can apply a `transform`
  // to an ancestor during sibling-card animations, which per CSS spec turns
  // that ancestor into the containing block for any `position: fixed`
  // descendant — and the modal would clip to the card instead of covering
  // the screen.
  if (typeof document === 'undefined') return null;

  const modal = (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 bg-brand-bg/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg bg-brand-bg border border-brand-muted/20 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Edit Rec</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-brand-muted/30 text-brand-muted hover:text-totes-turquoise hover:border-totes-turquoise flex items-center justify-center transition-colors"
              aria-label="Close edit dialog"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase block">
                Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={update('title')}
                className="w-full bg-transparent border border-brand-muted/30 rounded-xl px-4 py-3 text-base font-light focus:outline-none focus:border-totes-turquoise transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase block">
                Streamer
              </label>
              <input
                type="text"
                required
                value={form.streamer}
                onChange={update('streamer')}
                className="w-full bg-transparent border border-brand-muted/30 rounded-xl px-4 py-3 text-base font-light focus:outline-none focus:border-totes-turquoise transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase block">
                Content Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_TYPES.map(({ value, label, Icon }) => {
                  const active = form.contentType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, contentType: value }))}
                      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-xs font-kumbh font-bold tracking-widest uppercase transition-colors ${
                        active
                          ? 'border-totes-turquoise text-totes-turquoise'
                          : 'border-brand-muted/30 text-brand-muted hover:text-brand-text hover:border-brand-muted/60'
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase block">
                Genre or Topic
              </label>
              <input
                type="text"
                value={form.genre}
                onChange={update('genre')}
                className="w-full bg-transparent border border-brand-muted/30 rounded-xl px-4 py-3 text-base font-light focus:outline-none focus:border-totes-turquoise transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase block">
                Short Blurb
              </label>
              <textarea
                rows={3}
                value={form.blurb}
                onChange={update('blurb')}
                className="w-full bg-transparent border border-brand-muted/30 rounded-xl px-4 py-3 text-base font-light focus:outline-none focus:border-totes-turquoise transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-punk-rock-pink text-sm font-light">{error}</p>
            )}

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-pill w-full max-w-[260px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-brand-muted hover:text-totes-turquoise transition-colors text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
      </motion.div>
    </motion.div>
  );

  return createPortal(modal, document.body);
};

export default RecEditModal;
