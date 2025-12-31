
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
// Fix: Import CLOUD_WORRIES as it is the correctly exported constant for distraction data
import { CLOUD_WORRIES } from '../../constants';

interface Props {
  onComplete: () => void;
}

const DistractionScene: React.FC<Props> = ({ onComplete }) => {
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());

  const handleDragEnd = (id: string, info: any) => {
    // If dragged far enough away, remove it
    if (Math.abs(info.offset.x) > 150 || Math.abs(info.offset.y) > 150) {
      setClearedIds(prev => new Set([...prev, id]));
    }
  };

  const isAllCleared = clearedIds.size === CLOUD_WORRIES.length;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md py-12">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl font-bold text-white">Something is waiting for you</h1>
        <p className="text-lg text-white/60">Move the little distractions aside</p>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* The hidden prize */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: isAllCleared ? 1.2 : 0.8, opacity: 1 }}
          className="absolute z-0"
        >
          <button
            onClick={onComplete}
            disabled={!isAllCleared}
            className={`p-10 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 shadow-2xl transition-all duration-500 ${
              isAllCleared ? 'hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-pink-300/50' : 'opacity-20 cursor-default'
            }`}
          >
            <Gift size={80} className="text-white" />
          </button>
        </motion.div>

        {/* The distraction cards stack */}
        <AnimatePresence>
          {CLOUD_WORRIES.map((card, index) => (
            !clearedIds.has(card.id) && (
              <motion.div
                key={card.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={(e, info) => handleDragEnd(card.id, info)}
                initial={{ opacity: 0, scale: 0.8, rotate: index * 5 - 10 }}
                animate={{ opacity: 1, scale: 1, rotate: index * 5 - 10 }}
                exit={{ opacity: 0, scale: 0.5, x: 200, y: -200, rotate: 45 }}
                className={`absolute w-48 h-64 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing border border-black/5 ${card.color}`}
                style={{ zIndex: CLOUD_WORRIES.length - index }}
              >
                <span className="text-5xl mb-4">{card.icon}</span>
                <span className="text-gray-800 font-bold text-xl text-center">{card.label}</span>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      <div className="h-20 flex items-center">
        {isAllCleared ? (
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-pink-300 font-semibold text-lg"
          >
            Tap the gift box!
          </motion.p>
        ) : (
          <p className="text-white/30 italic">Drag the cards away...</p>
        )}
      </div>
    </div>
  );
};

export default DistractionScene;
