import React from 'react';
import { motion } from 'framer-motion';

const HomeActions = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[260px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <motion.a
        href="/drop-a-rec"
        className="btn-pill w-full max-w-[260px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        DROP A REC
      </motion.a>

      <motion.a
        href="/guide"
        className="btn-pill w-full max-w-[260px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        VIEW GUIDE
      </motion.a>
    </div>
  );
};

export default HomeActions;
