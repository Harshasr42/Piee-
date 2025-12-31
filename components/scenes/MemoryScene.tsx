
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEMORIES } from '../../constants';

interface Props {
  onComplete: () => void;
}

const MemoryScene: React.FC<Props> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  const nextMemory = () => {
    if (index < (MEMORIES?.length || 0) - 1) {
      setIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentMemory = MEMORIES && MEMORIES.length > index ? MEMORIES[index] : null;

  if (!currentMemory) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-rose-300 italic">Finding our moments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-sm py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-500">Moments for Shreyaa</h1>
      </div>

      <div className="relative w-full aspect-[3/4] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            exit={{ opacity: 0, x: -50, rotate: -10 }}
            onClick={nextMemory}
            className="w-full h-full bg-white p-4 shadow-2xl flex flex-col gap-4 cursor-pointer transform"
          >
            <div className="relative flex-1 overflow-hidden bg-rose-50 rounded-sm">
              <img 
                src={currentMemory.url || ''} 
                alt="Memory" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-16 flex items-center justify-center px-4">
              <p className="text-[#5D4037] font-medium text-center italic text-sm">
                {currentMemory.caption}
              </p>
            </div>
            
            <div className="absolute bottom-2 right-4 text-[10px] text-rose-200 font-mono">
              #{index + 1} / {MEMORIES.length}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute -z-10 inset-0 bg-white/50 translate-x-4 translate-y-4 rotate-3 rounded-sm shadow-xl" />
        <div className="absolute -z-20 inset-0 bg-white/20 translate-x-8 translate-y-8 rotate-6 rounded-sm shadow-xl" />
      </div>

      <div className="space-y-4 text-center">
        <div className="flex gap-2 justify-center">
          {MEMORIES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-rose-400' : 'w-2 bg-rose-100'}`} 
            />
          ))}
        </div>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest animate-pulse">Tap the photo to turn the page</p>
      </div>
    </div>
  );
};

export default MemoryScene;
