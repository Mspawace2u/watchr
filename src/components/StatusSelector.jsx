import React from 'react';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';
import { WATCH_STATUSES } from '../lib/constants';

// Column-first order: Col 1 (row 1, row 2) then Col 2 (row 1, row 2).
// With `grid-flow-col grid-rows-2 grid-cols-2`, items fill col-by-col.
const DISPLAY_ORDER = ['in_my_queue', 'watching', 'no_thanks', 'done'];

const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'in_my_queue': return <Clock size={14} strokeWidth={1.5} />;
      case 'watching': return <Play size={14} strokeWidth={1.5} />;
      case 'done': return <CheckCircle2 size={14} strokeWidth={1.5} />;
      case 'no_thanks': return <XCircle size={14} strokeWidth={1.5} />;
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

  const orderedStatuses = DISPLAY_ORDER
    .map((id) => WATCH_STATUSES.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="grid grid-cols-2 grid-rows-2 grid-flow-col gap-3">
      {orderedStatuses.map((status) => (
        <button
          key={status.id}
          onClick={() => onStatusChange(status.id)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border text-[10px] font-urbanist font-bold uppercase tracking-widest transition-all
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
