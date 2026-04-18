import React from 'react';
import { motion } from 'framer-motion';
import { TACO_RATING_SCALE } from '../lib/constants';

const TacoScale = ({ selectedRating, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      {TACO_RATING_SCALE.map((item) => (
        <motion.button
          key={item.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(item.value)}
          className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between
            ${selectedRating === item.value 
              ? 'bg-totes-turquoise/10 border-totes-turquoise shadow-[0_0_20px_rgba(45,226,230,0.1)]' 
              : 'bg-brand-bg border-brand-muted/20 hover:border-brand-muted/40'
            }`}
        >
          <span className="text-sm font-light text-brand-text">
            {item.label}
          </span>
          <span className="text-xl">
             {'🌮'.repeat(item.value)}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default TacoScale;
