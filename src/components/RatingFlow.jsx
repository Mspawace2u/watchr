import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TacoScale from './TacoScale';
import HotTakePrompt from './HotTakePrompt';
import RevealHeader from './RevealHeader';

const GRADIENT_STYLE = {
  backgroundImage:
    'linear-gradient(to right, var(--color-totes-turquoise), var(--color-electric-purple), var(--color-punk-rock-pink), var(--color-highlighter-yellow))',
};

const RatingFlow = ({ recId, createdByUserId = null }) => {
  // Steps mirror the pages of the reveal flow so RevealHeader can swap the
  // right-nav label (HOME vs SKIP IT) with the sub-step.
  // 'taco'              = Page 1 — taco rating
  // 'more-like-this'    = Page 2 — more-like-this question (reviewer only)
  // 'hot-take-prompt'   = Page 3 — "Drop your 2-sentence hot take?" Yep / Nope
  // 'hot-take-input'    = Page 4 — textarea + mic capture
  // 'complete'          = all-done confirmation
  // 'locked'            = reveal already viewed; no further input
  //
  // "more-like-this" is *only* useful feedback the reviewer can give back to
  // the recommender. When the recommender themselves comes through to rate
  // their own rec after reading the viewer's hot take, we skip straight from
  // taco -> hot-take-prompt.
  const [step, setStep] = useState('taco');
  const [ratingData, setRatingData] = useState({
    rating: 0,
    moreLikeThis: false,
    hotTake: null,
  });
  const [lockedMessage, setLockedMessage] = useState(null);
  const [isRecommender, setIsRecommender] = useState(false);

  useEffect(() => {
    if (!createdByUserId) return;
    const viewer = localStorage.getItem('watchr_user') || 'A';
    setIsRecommender(viewer === createdByUserId);
  }, [createdByUserId]);

  const handleRatingSelect = (rating) => {
    setRatingData((prev) => ({ ...prev, rating }));
    // Recommender skips the more-like-this question — not a useful data
    // point to feed back to themselves.
    setStep(isRecommender ? 'hot-take-prompt' : 'more-like-this');
  };

  const handleMoreLikeThis = (val) => {
    setRatingData((prev) => ({ ...prev, moreLikeThis: val }));
    setStep('hot-take-prompt');
  };

  const handleHotTakeChoice = (wantsTo) => {
    if (wantsTo) {
      setStep('hot-take-input');
    } else {
      submitHotTake(null);
    }
  };

  const submitHotTake = async (hotTake) => {
    const userId = localStorage.getItem('watchr_user') || 'A';
    const targetUserId = userId === 'A' ? 'B' : 'A';

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveRating',
          recId,
          userId,
          rating: ratingData.rating,
          moreLikeThis: ratingData.moreLikeThis,
          hotTake,
        }),
      });

      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        setLockedMessage(body.message || 'Your hot take is locked.');
        setStep('locked');
        return;
      }

      if (!res.ok) {
        throw new Error(`Save failed with status ${res.status}`);
      }

      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          recId,
          targetUserId,
          type: 'reveal_ready',
        }),
      });

      setRatingData((prev) => ({ ...prev, hotTake }));
      setStep('complete');
    } catch (error) {
      console.error('Failed to save rating:', error);
      alert('Failed to save your reveal. Please try again.');
    }
  };

  // Page 4 (hot-take-input) shows SKIP IT — it saves the rating with a null
  // hot take (matching the behavior of the NAW, I'M GOOD button on Page 3)
  // rather than navigating away and dropping the user's pages 1–2 data.
  const rightNav = step === 'hot-take-input'
    ? { label: 'Skip It', onClick: () => submitHotTake(null) }
    : { label: 'Home', href: '/' };

  return (
    <div className="w-full flex flex-col gap-12">
      <RevealHeader
        rightLabel={rightNav.label}
        rightHref={rightNav.href}
        onRightClick={rightNav.onClick}
      />

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 'taco' && (
            <motion.div
              key="taco"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Leave Your Taco{' '}
                  <span className="bg-clip-text text-transparent" style={GRADIENT_STYLE}>
                    Rating
                  </span>
                </h2>
                <p className="text-base md:text-lg font-light text-brand-text/80 leading-relaxed">
                  Tell 'em if their rec was taco-worthy.
                </p>
              </div>
              <TacoScale
                selectedRating={ratingData.rating}
                onSelect={handleRatingSelect}
              />
            </motion.div>
          )}

          {step === 'more-like-this' && (
            <motion.div
              key="more"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10 flex flex-col items-start"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-text">
                More like this?
              </h2>
              <div className="flex gap-6 w-full">
                <button
                  onClick={() => handleMoreLikeThis(true)}
                  className="flex-1 btn-pill"
                >
                  YES PLEASE
                </button>
                <button
                  onClick={() => handleMoreLikeThis(false)}
                  className="flex-1 btn-pill"
                >
                  NOT REALLY
                </button>
              </div>
            </motion.div>
          )}

          {(step === 'hot-take-prompt' || step === 'hot-take-input') && (
            <motion.div
              key="hottake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HotTakePrompt
                step={step}
                onChoice={handleHotTakeChoice}
                onSubmit={submitHotTake}
              />
            </motion.div>
          )}

          {step === 'complete' && !isRecommender && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center gap-6 pt-4"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(45,226,230,0.2)] bg-totes-turquoise/15">
                <span role="img" aria-label="taco">🌮</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Got It!</h2>
              <p className="text-brand-text/80 max-w-xs font-light">
                Tacos and hot take locked. They're on the way to your rec dropper now...
              </p>
              <a href="/guide" className="btn-pill mt-8">Sweet, All Done Here</a>
            </motion.div>
          )}

          {step === 'complete' && isRecommender && (
            <motion.div
              key="complete-locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center gap-6 pt-4"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,47,146,0.2)] bg-punk-rock-pink/15">
                <span role="img" aria-label="locked">🔒</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Title Rank Locked!</h2>
              <p className="text-brand-text/80 max-w-xs font-light">
                Letting your Watchr pal see to give them a taste of what recs are best to serve you next.
              </p>
              <a href="/guide" className="btn-pill mt-8">Sweet, All Done Here</a>
            </motion.div>
          )}

          {step === 'locked' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center gap-6 pt-4"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,47,146,0.2)] bg-punk-rock-pink/15">
                <span role="img" aria-label="locked">🔒</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Title Rank Locked!</h2>
              <p className="text-brand-text/80 max-w-xs font-light">
                {lockedMessage || 'Letting your Watchr pal see to give them a taste of what recs are best to serve you next.'}
              </p>
              <a href="/guide" className="btn-pill mt-8">Back to Guide</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RatingFlow;
