import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Monitor, Film, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import StatusSelector from './StatusSelector';

const GuideCard = ({ recommendation, userStatus, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie': return <Film size={14} strokeWidth={1.5} />;
      case 'show': return <Tv size={14} strokeWidth={1.5} />;
      case 'limited_series': return <Monitor size={14} strokeWidth={1.5} />;
      case 'documentary': return <FileText size={14} strokeWidth={1.5} />;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      className="bg-brand-bg border border-brand-muted/20 rounded-3xl p-6 md:p-8 hover:border-totes-turquoise/30 transition-colors group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div layout className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-kumbh font-bold text-totes-turquoise tracking-widest uppercase">
            {getTypeIcon(recommendation.content_type)}
            {recommendation.content_type?.replace('_', ' ')}
            <span className="text-brand-muted/40 px-1">•</span>
            <span className="text-electric-purple/70">{recommendation.streamer}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-totes-turquoise transition-colors capitalize">
            {recommendation.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
          className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all
            ${isExpanded
              ? 'bg-punk-rock-pink border-punk-rock-pink text-brand-bg shadow-[0_0_15px_rgba(255,47,146,0.35)]'
              : 'bg-transparent border-totes-turquoise/60 text-totes-turquoise hover:border-totes-turquoise'
            }`}
        >
          {isExpanded
            ? <ChevronUp size={18} strokeWidth={2} />
            : <ChevronDown size={18} strokeWidth={1.5} />}
        </button>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">
              <div className="space-y-3">
                <span className="block text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase">
                  {recommendation.genre_or_topic}
                </span>
                <p className="text-brand-text/90 text-sm leading-relaxed font-light">
                  {recommendation.short_blurb}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-muted/10 space-y-6">
                <label className="block text-[10px] font-kumbh font-bold tracking-[0.2em] text-electric-purple/70 uppercase">
                  Your Status
                </label>
                <StatusSelector
                  currentStatus={userStatus}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GuideCard;
