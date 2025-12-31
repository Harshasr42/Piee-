
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const IntroScene: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startHolding = () => setIsHolding(true);
  const stopHolding = () => setIsHolding(false);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            onComplete();
            return 100;
          }
          return prev + 1.5;
        });
      }, 20);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Gradually drain progress if not holding (optional, for effect)
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => Math.max(0, prev - 2));
      }, 30);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHolding, onComplete]);

  return (
    <div className="flex flex-col items-center gap-12 max-w-sm w-full bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-pink-300">A little surprise for you</h1>
        <p className="text-lg text-white/60 font-light">Before this year begins</p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Progress Circle SVG */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-white/10 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="80"
            className="stroke-pink-500 fill-none"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: "502.6",
              strokeDashoffset: 502.6 - (502.6 * progress) / 100,
            }}
          />
        </svg>

        <button
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          className={`relative z-10 p-10 rounded-full transition-all duration-300 ${
            isHolding ? 'scale-90 bg-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.3)]' : 'scale-100 bg-white/5'
          }`}
        >
          <Heart 
            size={64} 
            className={`transition-all duration-300 ${isHolding ? 'fill-pink-500 text-pink-500' : 'text-pink-300'}`}
          />
        </button>
      </div>

      <p className="text-white/40 font-medium animate-pulse">Tap and hold</p>
    </div>
  );
};

export default IntroScene;
