import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Monitor, Film, FileText, ExternalLink } from 'lucide-react';
import StatusSelector from './StatusSelector';

const GuideCard = ({ recommendation, userStatus, onStatusChange }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie': return <Film size={14} />;
      case 'show': return <Tv size={14} />;
      case 'limited_series': return <Monitor size={14} />;
      case 'documentary': return <FileText size={14} />;
      default: return null;
    }
  };

  return (
    <motion.div 
      layout
      className="bg-brand-bg border border-brand-muted/20 rounded-3xl p-6 md:p-8 space-y-6 hover:border-totes-turquoise/30 transition-colors group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-urbanist font-bold text-totes-turquoise tracking-widest uppercase">
            {getTypeIcon(recommendation.content_type)}
            {recommendation.content_type?.replace('_', ' ')}
            <span className="text-brand-muted/40 px-1">•</span>
            <span className="text-brand-muted">{recommendation.streamer}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-totes-turquoise transition-colors capitalize">
            {recommendation.title}
          </h3>
        </div>
        <button className="text-brand-muted hover:text-brand-text transition-colors p-2 bg-brand-muted/5 rounded-full">
          <ExternalLink size={16} />
        </button>
      </div>

      <div className="space-y-2">
        <span className="inline-block px-2 py-0.5 rounded bg-brand-muted/10 text-[9px] font-urbanist font-bold text-brand-muted uppercase tracking-wider">
          {recommendation.genre_or_topic}
        </span>
        <p className="text-brand-muted text-sm leading-relaxed font-light line-clamp-3">
          {recommendation.short_blurb}
        </p>
      </div>

      <div className="pt-4 border-t border-brand-muted/10 space-y-4">
        <label className="text-[10px] font-urbanist font-bold tracking-[0.2em] text-brand-muted/60 uppercase">
          Your Status
        </label>
        <StatusSelector 
          currentStatus={userStatus} 
          onStatusChange={onStatusChange} 
        />
      </div>
    </motion.div>
  );
};

export default GuideCard;
