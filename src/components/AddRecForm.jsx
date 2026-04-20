import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tv, Monitor, Film, FileText, AlignLeft, Headphones, Save, CheckCircle2 } from 'lucide-react';
import { CONTENT_TYPES } from '../lib/constants';

const SAVED_HOLD_MS = 1500;

const AddRecForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    streamer: '',
    type: 'show',
    genre: '',
    blurb: ''
  });

  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saveState !== 'idle') return;

    setSaveState('saving');
    const userId = localStorage.getItem('watchr_user') || 'A';

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });

      if (!response.ok) throw new Error('Failed to save');

      setSaveState('saved');
      setTimeout(() => {
        window.location.href = '/guide';
      }, SAVED_HOLD_MS);
    } catch (error) {
      console.error(error);
      setSaveState('idle');
      alert('Failed to save recommendation. Please try again.');
    }
  };

  const labelBase =
    "text-[10px] font-urbanist font-bold tracking-[0.2em] text-electric-purple/70 uppercase flex items-center gap-2";
  const iconClass = "text-punk-rock-pink";
  const fieldBase =
    "w-full bg-brand-bg border border-brand-muted/20 rounded-xl px-4 py-3 focus:outline-none focus:border-punk-rock-pink transition-all font-light";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* TITLE — underline field, no icon */}
      <div className="space-y-4">
        <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-electric-purple/70 uppercase">
          Title
        </label>
        <div className="relative group">
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What should we watch?"
            className="w-full bg-transparent border-b border-brand-muted/30 py-3 text-2xl md:text-3xl focus:outline-none focus:border-punk-rock-pink transition-colors placeholder:text-brand-muted/20 font-light"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className={labelBase}>
            <Monitor size={12} strokeWidth={1.5} className={iconClass} /> Where to watch
          </label>
          <input
            type="text"
            name="streamer"
            value={formData.streamer}
            onChange={handleChange}
            placeholder="Netflix, HBO, Cinema..."
            className={fieldBase}
          />
        </div>

        <div className="space-y-4">
          <label className={labelBase}>
            <AlignLeft size={12} strokeWidth={1.5} className={iconClass} /> Genre / Topic
          </label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Dark comedy, sci-fi..."
            className={fieldBase}
          />
        </div>
      </div>

      {/* CONTENT TYPE — 2 col x 2 row grid */}
      <div className="space-y-4">
        <label className={labelBase}>
          <Tv size={12} strokeWidth={1.5} className={iconClass} /> Content Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CONTENT_TYPES.map((type) => {
            const selected = formData.type === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData(p => ({ ...p, type: type.id }))}
                className={`w-full px-5 py-2.5 rounded-full border text-[11px] font-urbanist font-bold tracking-wider transition-all flex items-center justify-center gap-2
                  ${selected
                    ? 'bg-punk-rock-pink/15 border-punk-rock-pink text-punk-rock-pink shadow-[0_0_15px_rgba(255,47,146,0.2)]'
                    : 'bg-brand-bg border-brand-muted/20 text-brand-muted hover:border-brand-muted/40'
                  }`}
              >
                {type.id === 'movie' && <Film size={12} strokeWidth={1.5} />}
                {type.id === 'show' && <Tv size={12} strokeWidth={1.5} />}
                {type.id === 'limited_series' && <Monitor size={12} strokeWidth={1.5} />}
                {type.id === 'documentary' && <FileText size={12} strokeWidth={1.5} />}
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <label className={labelBase}>
          <Headphones size={12} strokeWidth={1.5} className={iconClass} /> The Pitch (Short Blurb)
        </label>
        <textarea
          name="blurb"
          value={formData.blurb}
          onChange={handleChange}
          rows={3}
          placeholder="Why are we watching this?"
          className="w-full bg-brand-bg border border-brand-muted/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-punk-rock-pink transition-all font-light resize-none leading-relaxed"
        />
      </div>

      {/* SUBMIT — save state machine */}
      <div className="pt-0 flex justify-center">
        <button
          disabled={saveState !== 'idle'}
          type="submit"
          className="btn-pill w-full max-w-[260px] group"
          aria-live="polite"
        >
          {saveState === 'idle' && <span>SAVE TO WATCH LIST</span>}

          {saveState === 'saving' && (
            <span className="flex items-center gap-2 animate-pulse">
              <span>SAVING</span>
              <Save size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
          )}

          {saveState === 'saved' && (
            <span className="flex items-center gap-2">
              <span>SAVED</span>
              <CheckCircle2 size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default AddRecForm;
