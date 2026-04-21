import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, LayoutGrid } from 'lucide-react';
import { TACO_RATING_SCALE } from '../lib/constants';

// Viewer-side post-watch reveal.
//
// Screen 1: "New Reveal Ready" — standardized against the "Got It" success
// card in RatingFlow: same pt-4 / gap-6 spacing, same 5xl headline, same
// w-24 rounded circle with bg-color/15 + 40px shadow, swapped to
// Electric Purple.
//
// Screen 2: verdict card. THE VERDICT + HOT TAKE + MORE LIKE THIS sections
// use punk-rock-pink at 70 percent opacity to match the POST-WATCH REVEAL
// pre-header. Hot take body text pulses between 40 and 100 percent brand
// white next to a static highlighter-yellow quote icon. MORE LIKE THIS
// only appears when the reviewer said YES PLEASE.
//
// CTA pill mirrors Got It and New Reveal Ready dimensions. The secondary
// BACK TO GUIDE link uses the same LayoutGrid icon as the sticky header
// guide nav so the redirect target is visually consistent.
const RevealFlow = ({
  recommendation,
  rating,
  hotTake,
  moreLikeThis,
  onComplete,
  viewerHasRated = false,
}) => {
  const [revealed, setRevealed] = useState(false);

  const ratingObj = TACO_RATING_SCALE.find(item => item.value === rating);

  const handleOpenReveal = async () => {
    const userId = localStorage.getItem('watchr_user') || 'A';
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', recId: recommendation.id, userId })
      });

      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setViewed', recId: recommendation.id, userId })
      });

      setRevealed(true);
    } catch (error) {
      console.error('Failed to update reveal states:', error);
      setRevealed(true);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {!revealed ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center gap-6 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            type="button"
            onClick={handleOpenReveal}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(155,92,255,0.2)] bg-electric-purple/15"
            aria-label="Open reveal"
          >
            <span role="img" aria-hidden="true">🎁</span>
          </motion.button>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">New Reveal Ready!</h2>
          <p className="text-brand-text/80 max-w-xs font-light">
            See what your Watchr pal thought of{' '}
            <span className="text-brand-text font-semibold">{recommendation.title}</span>.
          </p>
          <button
            type="button"
            onClick={handleOpenReveal}
            className="btn-pill mt-8"
          >
            Open Reveal
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pb-6">
            <label className="block mb-6 text-[10px] font-kumbh font-bold tracking-[0.2em] text-punk-rock-pink/70 uppercase">
              The Verdict
            </label>
            <div className="bg-totes-turquoise/5 border border-totes-turquoise/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-5xl"
              >
                {'🌮'.repeat(rating)}
              </motion.div>
              {ratingObj && (
                <p className="text-lg font-bold tracking-tight text-brand-text">
                  {ratingObj.label}
                </p>
              )}
            </div>
          </div>

          {hotTake && (
            <div>
              <label className="block mb-6 text-[10px] font-kumbh font-bold tracking-[0.2em] text-punk-rock-pink/70 uppercase">
                Hot Take
              </label>
              <div className="relative bg-brand-bg border border-brand-muted/10 rounded-3xl p-8 pl-16">
                <MessageSquareQuote
                  className="absolute top-7 left-5 text-highlighter-yellow pr-1 pb-1"
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <motion.p
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  className="text-base font-light leading-snug text-brand-text relative z-10"
                >
                  {hotTake}
                </motion.p>
              </div>
            </div>
          )}

          {moreLikeThis && (
            <div>
              <label className="block mb-6 text-[10px] font-kumbh font-bold tracking-[0.2em] text-punk-rock-pink/70 uppercase">
                More Like This
              </label>
              <p className="text-brand-text/90 text-sm leading-relaxed font-light">
                Hell yes! 💯
              </p>
            </div>
          )}

          {!viewerHasRated && (
            <div className="pt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={onComplete}
                className="btn-pill"
              >
                Add My Rating
              </button>
              <a
                href="/guide"
                className="group flex items-center gap-2 text-brand-muted hover:text-totes-turquoise transition-colors text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase"
              >
                <span className="transition-transform group-hover:-translate-x-0.5">Back to Guide</span>
                <LayoutGrid
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RevealFlow;
