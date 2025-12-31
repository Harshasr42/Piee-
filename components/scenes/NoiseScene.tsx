
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLOUD_WORRIES } from '../../constants';

interface Props {
  onComplete: () => void;
}

const NoiseScene: React.FC<Props> = ({ onComplete }) => {
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());

  const handleClear = (id: string) => {
    setClearedIds(prev => {
      const next = new Set(prev).add(id);
      if (next.size === CLOUD_WORRIES.length) {
        setTimeout(onComplete, 1200);
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center py-20 px-8">
      <div className="text-center z-20 space-y-4 mb-20">
        <h2 className="text-3xl font-serif text-rose-500">Brush Away the Clouds</h2>
        <p className="text-rose-300/80 font-medium">Let's clear some space for joy, Shreyaa.</p>
      </div>

      <div className="relative flex-1 w-full max-w-md">
        <AnimatePresence>
          {CLOUD_WORRIES.map((cloud, idx) => !clearedIds.has(cloud.id) && (
            <motion.button
              key={cloud.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, opacity: 1,
                x: [Math.sin(idx) * 30, Math.cos(idx) * 30],
                y: [Math.cos(idx) * 30, Math.sin(idx) * 30],
              }}
              transition={{ 
                type: 'spring', delay: idx * 0.1,
                x: { duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                y: { duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
              onClick={() => handleClear(cloud.id)}
              className="absolute p-5 rounded-[2rem] bg-white/80 backdrop-blur-md shadow-lg border border-rose-50 flex items-center gap-3 group hover:bg-white transition-colors"
              style={{ 
                left: `${15 + (idx % 3) * 30}%`, 
                top: `${10 + Math.floor(idx / 3) * 25}%`,
              }}
            >
              <span className="text-2xl">{cloud.icon}</span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{cloud.label}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {clearedIds.size === CLOUD_WORRIES.length && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center flex-col gap-4"
          >
            <div className="w-32 h-32 bg-orange-200 rounded-full blur-[60px] animate-pulse" />
            <span className="text-4xl">☀️</span>
            <p className="text-xl font-serif italic text-orange-400">Much better.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoiseScene;
