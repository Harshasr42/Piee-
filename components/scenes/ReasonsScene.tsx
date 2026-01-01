
import React from 'react';
import { motion } from 'framer-motion';
import { REASONS_WHY } from '../../constants';

interface Props {
  title?: string;
  nickname: string;
  onComplete: () => void;
}

const ReasonsScene: React.FC<Props> = ({ title = "Why You're My Favorite", nickname, onComplete }) => {
  return (
    <div className="flex flex-col items-center w-full h-full p-8 pt-32 overflow-y-auto custom-scroll">
      <div className="text-center mb-10">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-rose-500 italic drop-shadow-sm"
        >
          {title}
        </motion.h2>
        <p className="text-rose-300 text-[10px] uppercase font-black tracking-[0.3em] mt-3">A few reasons, {nickname}...</p>
      </div>

      <div className="space-y-6 w-full max-w-xs pb-16">
        {REASONS_WHY.map((reason, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 + 0.5, type: 'spring' }}
            className="flex items-center gap-4 p-6 bg-white/70 backdrop-blur-md rounded-[2rem] border border-rose-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-rose-400 text-xs font-black min-w-[20px]">{idx + 1}.</span>
            <p className="text-[#5D4037] text-sm font-medium leading-relaxed italic">{reason}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: REASONS_WHY.length * 0.15 + 1 }}
        onClick={onComplete}
        className="mt-4 mb-20 px-8 py-3 text-rose-400 font-serif text-2xl italic hover:scale-105 active:scale-95 transition-all"
      >
        There's so much more... &rarr;
      </motion.button>
    </div>
  );
};

export default ReasonsScene;
