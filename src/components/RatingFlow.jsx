import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TacoScale from './TacoScale';
import HotTakePrompt from './HotTakePrompt';
import { Heart, Lock } from 'lucide-react';

const RatingFlow = ({ recId }) => {
  const [step, setStep] = useState('taco'); // 'taco' | 'more-like-this' | 'hot-take' | 'complete' | 'locked'
  const [ratingData, setRatingData] = useState({
    rating: 0,
    moreLikeThis: false,
    hotTake: null
  });
  const [lockedMessage, setLockedMessage] = useState(null);

  const handleRatingSelect = (rating) => {
    setRatingData(prev => ({ ...prev, rating }));
    setStep('more-like-this');
  };

  const handleMoreLikeThis = (val) => {
    setRatingData(prev => ({ ...prev, moreLikeThis: val }));
    setStep('hot-take');
  };

  const handleHotTakeComplete = async (hotTake) => {
    const userId = localStorage.getItem('watchr_user') || 'A';
    const targetUserId = userId === 'A' ? 'B' : 'A';

    try {
      // 1. Save rating and hot take
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveRating',
          recId,
          userId,
          rating: ratingData.rating,
          moreLikeThis: ratingData.moreLikeThis,
          hotTake
        })
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

      // 2. Create notification for the other user
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          recId,
          targetUserId,
          type: 'reveal_ready'
        })
      });

      setRatingData(prev => ({ ...prev, hotTake }));
      setStep('complete');
    } catch (error) {
      console.error('Failed to save rating:', error);
      alert('Failed to save your reveal. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-lg">
      <AnimatePresence mode="wait">
        {step === 'taco' && (
          <motion.div 
            key="taco" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">How many <span className="text-totes-turquoise">tacos?</span></h2>
              <p className="text-brand-muted font-light">Rate your watch experience on the Buddy's scale.</p>
            </div>
            <TacoScale selectedRating={ratingData.rating} onSelect={handleRatingSelect} />
          </motion.div>
        )}

        {step === 'more-like-this' && (
          <motion.div 
            key="more" 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12 py-12 flex flex-col items-start"
          >
            <h2 className="text-3xl font-bold tracking-tight">More like <span className="text-electric-purple">this?</span></h2>
            <div className="flex gap-6 w-full">
              <button 
                onClick={() => handleMoreLikeThis(true)}
                className="flex-1 btn-pill"
              >
                YES PLEASE
              </button>
              <button 
                onClick={() => handleMoreLikeThis(false)}
                className="flex-1 px-8 py-3 rounded-full border border-brand-muted/20 text-brand-muted uppercase text-sm font-urbanist font-bold hover:border-brand-muted/40 transition-all"
              >
                NOT REALLY
              </button>
            </div>
          </motion.div>
        )}

        {step === 'hot-take' && (
          <motion.div 
            key="hottake" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            <HotTakePrompt onComplete={handleHotTakeComplete} />
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div 
            key="complete" 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center gap-6"
          >
            <div className="w-20 h-20 bg-totes-turquoise/20 rounded-full flex items-center justify-center text-totes-turquoise shadow-[0_0_40px_rgba(45,226,230,0.2)]">
                <Heart size={40} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Reveal Ready!</h2>
            <p className="text-brand-muted max-w-xs font-light">Your rating and hot take have been locked. The other user has been notified.</p>
            <a href="/guide" class="btn-pill mt-8">SWEET, ALL DONE HERE</a>
          </motion.div>
        )}

        {step === 'locked' && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center gap-6"
          >
            <div className="w-20 h-20 bg-punk-rock-pink/15 rounded-full flex items-center justify-center text-punk-rock-pink shadow-[0_0_40px_rgba(255,47,146,0.2)]">
                <Lock size={36} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Rating Locked</h2>
            <p className="text-brand-muted max-w-xs font-light">
              {lockedMessage || 'The other user has already viewed this reveal — hot takes lock at that point so the memory stays pure.'}
            </p>
            <a href="/guide" class="btn-pill mt-8">BACK TO GUIDE</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RatingFlow;
