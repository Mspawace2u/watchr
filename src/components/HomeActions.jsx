import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Tv } from 'lucide-react';

const HomeActions = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[260px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <motion.a
        href="/drop-a-rec"
        className="btn-pill w-full max-w-[260px] group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span>DROP A REC</span>
        <Mic
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        />
      </motion.a>

      <motion.a
        href="/guide"
        className="btn-pill w-full max-w-[260px] group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span>VIEW GUIDE</span>
        <Tv
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        />
      </motion.a>
    </div>
  );
};

export default HomeActions;
