import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Tv, Monitor, Film, FileText, AlignLeft } from 'lucide-react';
import { CONTENT_TYPES } from '../lib/constants';

const AddRecForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    streamer: '',
    type: 'show',
    genre: '',
    blurb: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const userId = localStorage.getItem('watchr_user') || 'A';
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      window.location.href = '/guide';
    } catch (error) {
      console.error(error);
      alert('Failed to save recommendation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-2">
        <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase">
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
            className="w-full bg-transparent border-b border-brand-muted/30 py-3 text-2xl md:text-3xl focus:outline-none focus:border-totes-turquoise transition-colors placeholder:text-brand-muted/20 font-light"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase flex items-center gap-2">
            <Monitor size={12} className="text-totes-turquoise" /> Where to watch
          </label>
          <input
            type="text"
            name="streamer"
            value={formData.streamer}
            onChange={handleChange}
            placeholder="Netflix, HBO, Cinema..."
            className="w-full bg-brand-bg border border-brand-muted/20 rounded-xl px-4 py-3 focus:outline-none focus:border-totes-turquoise/50 transition-all font-light"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase flex items-center gap-2">
            <AlignLeft size={12} className="text-electric-purple" /> Genre / Topic
          </label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Dark comedy, sci-fi..."
            className="w-full bg-brand-bg border border-brand-muted/20 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-purple/50 transition-all font-light"
          />
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase">
          Content Type
        </label>
        <div className="flex flex-wrap gap-3">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData(p => ({ ...p, type: type.id }))}
              className={`px-5 py-2 rounded-full border text-[11px] font-urbanist font-bold tracking-wider transition-all flex items-center gap-2
                ${formData.type === type.id 
                  ? 'bg-totes-turquoise/20 border-totes-turquoise text-totes-turquoise shadow-[0_0_15px_rgba(45,226,230,0.2)]' 
                  : 'bg-brand-bg border-brand-muted/20 text-brand-muted hover:border-brand-muted/40'
                }`}
            >
              {type.id === 'movie' && <Film size={12} />}
              {type.id === 'show' && <Tv size={12} />}
              {type.id === 'limited_series' && <Monitor size={12} />}
              {type.id === 'documentary' && <FileText size={12} />}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted uppercase">
          The Pitch (Short Blurb)
        </label>
        <textarea
          name="blurb"
          value={formData.blurb}
          onChange={handleChange}
          rows={3}
          placeholder="Why are we watching this?"
          className="w-full bg-brand-bg border border-brand-muted/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-totes-turquoise/50 transition-all font-light resize-none leading-relaxed"
        />
      </div>

      <div className="pt-6">
        <button
          disabled={isSubmitting}
          type="submit"
          className="btn-pill w-full md:w-auto"
        >
          {isSubmitting ? 'SAVING...' : 'SAVE TO WATCH LIST'}
        </button>
      </div>
    </motion.form>
  );
};

export default AddRecForm;
