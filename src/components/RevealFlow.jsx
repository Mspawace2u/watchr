import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { TACO_RATING_SCALE } from '../lib/constants';

const RevealFlow = ({ recommendation, rating, hotTake, onComplete }) => {
  const [revealed, setRevealed] = useState(false);

  const ratingObj = TACO_RATING_SCALE.find(item => item.value === rating);

  const handleOpenReveal = async () => {
    const userId = localStorage.getItem('watchr_user') || 'A';
    try {
      // 1. Mark notification as read
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', recId: recommendation.id, userId })
      });

      // 2. Set reveal as viewed in reactions
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setViewed', recId: recommendation.id, userId })
      });

      setRevealed(true);
    } catch (error) {
      console.error('Failed to update reveal states:', error);
      setRevealed(true); // Proceed anyway to not block the user
    }
  };

  return (
    <div className="w-full max-w-lg space-y-12 py-12">
      {!revealed ? (
         <motion.div 
          className="flex flex-col items-center justify-center gap-8 py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 rotate: [0, 5, -5, 0]
               }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="w-24 h-24 bg-electric-purple/20 rounded-full flex items-center justify-center text-electric-purple text-3xl shadow-[0_0_50px_rgba(155,92,255,0.2)] cursor-pointer"
               onClick={handleOpenReveal}
            >
              🎁
            </motion.div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">New Reveal Ready!</h2>
            <p className="text-brand-muted font-light">The other user shared their thoughts on <span className="text-brand-text font-semibold">{recommendation.title}</span>.</p>
          </div>
          <button 
            onClick={handleOpenReveal}
            className="btn-pill"
          >
            OPEN REVEAL
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
             <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase">The Verdict</label>
             <div className="bg-totes-turquoise/5 border border-totes-turquoise/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-5xl"
                >
                  {'🌮'.repeat(rating)}
                </motion.div>
                <div className="space-y-1">
                  <p className="text-xl font-bold tracking-tight">{ratingObj?.label.split(' ')[0]}</p>
                  <p className="text-sm text-brand-muted font-light">{ratingObj?.label.split(' ').slice(1).join(' ')}</p>
                </div>
             </div>
          </div>

          {hotTake && (
            <div className="space-y-4">
              <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase">Hot Take</label>
              <div className="relative bg-brand-bg border border-brand-muted/10 rounded-3xl p-8">
                <MessageSquareQuote className="absolute top-4 left-4 text-totes-turquoise/20" size={32} />
                <p className="text-lg md:text-xl font-light italic leading-relaxed text-brand-text/90 relative z-10">
                  "{hotTake}"
                </p>
              </div>
            </div>
          )}

          <div className="pt-8 flex flex-col gap-4">
              <button 
                onClick={onComplete}
                className="btn-pill w-full"
              >
                COOL, ADD MY RATING
              </button>
              <a href="/guide" className="text-center text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase hover:text-brand-text transition-colors">
                Back to Guide
              </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RevealFlow;
