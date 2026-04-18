import React from 'react';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';
import { WATCH_STATUSES } from '../lib/constants';

const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'in_my_queue': return <Clock size={14} />;
      case 'watching': return <Play size={14} />;
      case 'done': return <CheckCircle2 size={14} />;
      case 'no_thanks': return <XCircle size={14} />;
      default: return null;
    }
  };

  const getColorClass = (id, isActive) => {
    if (!isActive) return 'border-brand-muted/20 text-brand-muted hover:border-brand-muted/40';
    
    switch (id) {
      case 'in_my_queue': return 'border-highlighter-yellow/50 text-highlighter-yellow bg-highlighter-yellow/10';
      case 'watching': return 'border-totes-turquoise/50 text-totes-turquoise bg-totes-turquoise/10';
      case 'done': return 'border-screamer-green/50 text-screamer-green bg-screamer-green/10';
      case 'no_thanks': return 'border-punk-rock-pink/50 text-punk-rock-pink bg-punk-rock-pink/10';
      default: return 'border-brand-muted/20 text-brand-muted';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {WATCH_STATUSES.map((status) => (
        <button
          key={status.id}
          onClick={() => onStatusChange(status.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-urbanist font-bold uppercase tracking-widest transition-all
            ${getColorClass(status.id, currentStatus === status.id)}
          `}
        >
          {getIcon(status.id)}
          {status.label}
        </button>
      ))}
    </div>
  );
};

export default StatusSelector;
