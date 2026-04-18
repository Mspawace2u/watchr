import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ThumbsUp, ThumbsDown } from 'lucide-react';

const HotTakePrompt = ({ onComplete }) => {
  const [step, setStep] = useState('prompt'); // 'prompt' | 'input'
  const [hotTake, setHotTake] = useState('');

  const handleChoice = (wantsTo) => {
    if (wantsTo) {
      setStep('input');
    } else {
      onComplete(null);
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {step === 'prompt' ? (
          <motion.div 
            key="prompt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3 text-brand-text">
              <Mic size={20} className="text-totes-turquoise stroke-[1.5px]" />
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Drop your 2-sentence hot take?
              </h3>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-brand-muted/20 hover:border-totes-turquoise hover:bg-totes-turquoise/5 transition-all group"
              >
                <ThumbsUp size={18} className="text-totes-turquoise stroke-[1.5px]" />
                <span className="text-[10px] font-urbanist font-bold tracking-[0.2em] uppercase">Yep</span>
              </button>

              <button
                onClick={() => handleChoice(false)}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-brand-muted/20 hover:border-punk-rock-pink hover:bg-punk-rock-pink/5 transition-all group"
              >
                <ThumbsDown size={18} className="text-punk-rock-pink stroke-[1.5px]" />
                <span className="text-[10px] font-urbanist font-bold tracking-[0.2em] uppercase">Naw, I'm Good</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <textarea
              autoFocus
              value={hotTake}
              onChange={(e) => setHotTake(e.target.value)}
              placeholder="Keep it succinct and spoiler-light..."
              className="w-full bg-brand-bg border border-brand-muted/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-totes-turquoise/50 transition-all font-light resize-none leading-relaxed min-h-[120px]"
            />
            <button
              onClick={() => onComplete(hotTake)}
              className="btn-pill w-full md:w-auto"
            >
              FINISH REVEAL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotTakePrompt;
