
import React from 'react';
import { motion } from 'framer-motion';
import { FUTURE_DREAMS } from '../../constants';

interface Props {
  onComplete: () => void;
}

const DreamsScene: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center gap-12">
      <div className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-rose-500 italic"
        >
          Our Shared Constellation
        </motion.h2>
        <p className="text-rose-300 text-[10px] uppercase font-black tracking-widest">The things I look forward to with you</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-xs relative">
        {/* Connection lines background effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-rose-100/30 rotate-45" />
          <div className="w-full h-px bg-rose-100/30 -rotate-45" />
        </div>

        {FUTURE_DREAMS.map((dream, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.3 + 0.5, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-lg relative z-10"
          >
            <span className="text-4xl">{dream.icon}</span>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">{dream.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={onComplete}
        className="mt-8 px-10 py-4 bg-white text-rose-400 border-2 border-rose-100 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-sm hover:bg-rose-50 transition-colors"
      >
        To infinity & beyond &rarr;
      </motion.button>
    </div>
  );
};

export default DreamsScene;
