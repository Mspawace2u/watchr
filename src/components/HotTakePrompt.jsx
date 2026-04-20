import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

/**
 * Pages 3 + 4 of the reveal flow.
 *
 * Parent (RatingFlow) owns the step state so it can swap the right-nav label
 * between "HOME ›" (Page 3) and "SKIP IT ›" (Page 4). The mic-recorder /
 * AI-summarize capture is scoped for a follow-up PR — the current textarea
 * is wired up on its own and will coexist with a mic button later.
 */
const HotTakePrompt = ({ step, onChoice, onSubmit }) => {
  const [hotTake, setHotTake] = useState('');

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {step === 'hot-take-prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-text">
              Drop your 2-sentence hot take?
            </h3>

            <div className="flex flex-col gap-4 w-full max-w-[260px]">
              <button
                type="button"
                onClick={() => onChoice(true)}
                className="btn-pill w-full group"
              >
                <span>YEP</span>
                <ThumbsUp
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </button>

              <button
                type="button"
                onClick={() => onChoice(false)}
                className="btn-pill w-full group"
              >
                <span>NAW, I'M GOOD</span>
                <ThumbsDown
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'hot-take-input' && (
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
              placeholder="Type your hot take or record a voice note and AI will jot it in."
              className="w-full bg-brand-bg border border-brand-muted/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-punk-rock-pink transition-all font-light resize-none leading-relaxed min-h-[120px] placeholder:text-brand-muted/40"
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onSubmit(hotTake)}
                className="btn-pill w-full max-w-[260px]"
              >
                FINISH REVEAL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotTakePrompt;
