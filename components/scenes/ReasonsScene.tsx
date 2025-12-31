import React from 'react';
import { motion } from 'framer-motion';
import { REASONS_WHY } from '../../constants';

interface Props {
  onComplete: () => void;
}

const ReasonsScene: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 overflow-y-auto">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-rose-500"
        >
          Why You're My Favorite
        </motion.h2>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest mt-2">Just a few reasons...</p>
      </div>

      <div className="space-y-6 w-full max-w-xs">
        {REASONS_WHY.map((reason, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.4 + 0.5 }}
            className="flex items-center gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm"
          >
            <span className="text-rose-300 text-sm font-bold">{idx + 1}.</span>
            <p className="text-[#5D4037] text-sm font-medium">{reason}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: REASONS_WHY.length * 0.4 + 1 }}
        onClick={onComplete}
        className="mt-12 px-8 py-3 text-rose-400 font-serif text-xl italic hover:scale-105 transition-transform"
      >
        There's so much more... &rarr;
      </motion.button>
    </div>
  );
};

export default ReasonsScene;