
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const CoreScene: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            onComplete();
            return 100;
          }
          return p + 2.5;
        });
      }, 20);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setProgress(p => Math.max(0, p - 2));
      }, 30);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHolding, onComplete]);

  return (
    <div className="flex flex-col items-center gap-12 px-6 max-w-sm">
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-serif italic text-rose-400"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Hi, Shreyaa...
        </motion.h1>
        <p className="text-rose-300 font-medium tracking-widest uppercase text-xs">Warm the heart to enter</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Soft Glow Pulses */}
        <motion.div 
          animate={{ scale: isHolding ? 1.6 : 1, opacity: isHolding ? 0.6 : 0.2 }}
          className="absolute inset-0 bg-rose-200 rounded-full blur-[60px]" 
        />
        <motion.div 
          animate={{ scale: isHolding ? 1.3 : 0.9, opacity: isHolding ? 0.5 : 0.1 }}
          className="absolute inset-0 bg-orange-100 rounded-full blur-[40px]" 
        />

        <button
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-xl border-4 border-rose-50 border-double outline-none active:scale-90 transition-transform"
        >
          <motion.span 
            className="text-5xl"
            animate={{ scale: isHolding ? 1.4 : 1 }}
          >
            💖
          </motion.span>
        </button>

        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="50%" cy="50%" r="75"
            className="stroke-rose-100 fill-none"
            strokeWidth="4"
          />
          <motion.circle
            cx="50%" cy="50%" r="75"
            className="stroke-rose-400 fill-none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="471"
            strokeDashoffset={471 - (471 * progress) / 100}
          />
        </svg>
      </div>
    </div>
  );
};

export default CoreScene;
