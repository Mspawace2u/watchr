import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Mic, Square } from 'lucide-react';

/**
 * Pages 3 + 4 of the reveal flow.
 *
 * Parent (RatingFlow) owns the step state so it can swap the right-nav label
 * between "HOME ›" (Page 3) and "SKIP IT ›" (Page 4).
 *
 * Page 4 mic: uses the browser Web Speech API (`SpeechRecognition` /
 * `webkitSpeechRecognition`). Finalized transcript chunks are appended to the
 * textarea; the user can edit before submitting. Unsupported browsers (Firefox)
 * still show the mic button — tapping it surfaces a "needs Chrome/Edge/Safari"
 * message so the affordance never silently disappears.
 */
const HotTakePrompt = ({ step, onChoice, onSubmit }) => {
  const [hotTake, setHotTake] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        }
      }
      if (finalChunk) {
        setHotTake((prev) => {
          const trimmed = finalChunk.trim();
          if (!trimmed) return prev;
          const joiner = prev && !/\s$/.test(prev) ? ' ' : '';
          return prev + joiner + trimmed;
        });
      }
    };

    recognition.onerror = (event) => {
      // `no-speech` and `aborted` are normal stop conditions — ignore them.
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicError('Mic permission denied. Allow it in browser settings to record.');
      } else {
        setMicError("Couldn't capture audio. Try again or type it in.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // no-op
      }
      recognitionRef.current = null;
    };
  }, []);

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setMicError('Voice capture needs Chrome, Edge, or Safari. Type your take in.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      return;
    }

    setMicError(null);
    try {
      recognition.start();
      setIsRecording(true);
    } catch (err) {
      if (err && err.name === 'InvalidStateError') {
        // `start()` throws InvalidStateError if a session is already running —
        // keep UI in sync and let the existing session continue.
        setIsRecording(true);
      } else {
        setMicError("Couldn't start recording. Try again or type it in.");
      }
    }
  };

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
            <div className="relative">
              <textarea
                autoFocus
                value={hotTake}
                onChange={(e) => setHotTake(e.target.value)}
                placeholder="Type your hot take or record a voice note and AI will jot it in."
                className="w-full bg-brand-bg border border-brand-muted/20 rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:border-totes-turquoise transition-all font-light resize-none leading-relaxed min-h-[140px] placeholder:text-brand-muted/60"
              />

              <button
                type="button"
                onClick={toggleRecording}
                aria-label={isRecording ? 'Stop recording' : 'Start voice note'}
                aria-pressed={isRecording}
                className={`absolute bottom-3 right-3 w-11 h-11 rounded-full border flex items-center justify-center transition-all
                  ${isRecording
                    ? 'bg-punk-rock-pink border-punk-rock-pink text-brand-bg shadow-[0_0_0_6px_rgba(255,47,146,0.15)] animate-pulse'
                    : 'bg-transparent border-punk-rock-pink text-punk-rock-pink hover:shadow-[0_0_15px_rgba(255,47,146,0.35)]'
                  }`}
              >
                {isRecording
                  ? <Square size={16} strokeWidth={2} fill="currentColor" />
                  : <Mic size={18} strokeWidth={1.5} />}
              </button>
            </div>

            {isRecording && (
              <p className="text-[10px] font-urbanist font-bold tracking-[0.2em] uppercase text-punk-rock-pink/80">
                Listening…
              </p>
            )}

            {micError && (
              <p className="text-xs text-punk-rock-pink/80 font-light">
                {micError}
              </p>
            )}

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
