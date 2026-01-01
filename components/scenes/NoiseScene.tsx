
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLOUD_WORRIES } from '../../constants';
import { Sparkles } from 'lucide-react';

interface Props {
  nickname: string;
  onComplete: () => void;
}

const NoiseScene: React.FC<Props> = ({ nickname, onComplete }) => {
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClear = (id: string) => {
    setClearedIds(prev => {
      const next = new Set(prev).add(id);
      if (next.size === CLOUD_WORRIES.length) {
        setShowSuccess(true);
        setTimeout(onComplete, 4500);
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center py-20 px-8">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div 
            key="clouds-container"
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="text-center z-20 space-y-4 mb-20">
              <h2 className="text-3xl font-serif text-rose-500">Brush Away the Clouds</h2>
              <p className="text-rose-300/80 font-medium uppercase tracking-widest text-[10px]">Let's clear some space for joy, {nickname}.</p>
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
                    className="absolute p-5 rounded-[2rem] bg-white/80 backdrop-blur-md shadow-lg border border-rose-50 flex items-center gap-3 group hover:bg-white transition-colors active:scale-90"
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center h-full max-w-xs space-y-8"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="text-rose-400">
              <Sparkles size={48} fill="currentColor" opacity={0.2} />
            </motion.div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold leading-relaxed text-[#5D4037]">
                Yay u cleared all the unwanted in ur life and moving on to wanted thing further
                <span className="text-rose-500 italic"> (like me 😁😉)</span>
              </h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-4xl font-serif text-rose-500 italic mt-4">
                mrng mrng sunshine ✨
              </motion.p>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.5, ease: "linear" }} className="w-32 h-1 bg-rose-200 rounded-full origin-left" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoiseScene;
