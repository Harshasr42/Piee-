
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Props {
  greeting?: string;
  onComplete: () => void;
  onProgressChange?: (progress: number) => void;
}

const CoreScene: React.FC<Props> = ({ greeting = 'Hi, Shreyaa...', onComplete, onProgressChange }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const intervalRef = useRef<number | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.Q.setValueAtTime(5, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();

    audioCtxRef.current = ctx;
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    filterRef.current = filter;
  }, []);

  const updateAudio = useCallback((p: number, holding: boolean) => {
    if (!audioCtxRef.current || !gainNodeRef.current || !oscillatorRef.current || !filterRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (holding) {
      const targetFreq = 120 + (p * 0.8);
      const targetFilter = 200 + (p * 15);
      const targetGain = 0.05 + (p * 0.001);

      oscillatorRef.current.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.1);
      filterRef.current.frequency.exponentialRampToValueAtTime(targetFilter, now + 0.1);
      gainNodeRef.current.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    } else {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.3);
    }
  }, []);

  useEffect(() => {
    if (isHolding) {
      initAudio();
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          const next = p >= 100 ? 100 : p + 1.2;
          if (next >= 100) {
            clearInterval(intervalRef.current!);
            if (audioCtxRef.current) {
               const now = audioCtxRef.current.currentTime;
               [523.25, 659.25, 783.99].forEach((f, i) => {
                 const o = audioCtxRef.current!.createOscillator();
                 const g = audioCtxRef.current!.createGain();
                 o.frequency.setValueAtTime(f, now + i * 0.1);
                 g.gain.setValueAtTime(0.1, now);
                 g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
                 o.connect(g);
                 g.connect(audioCtxRef.current!.destination);
                 o.start();
                 o.stop(now + 1.5);
               });
            }
            onComplete();
            return 100;
          }
          if (onProgressChange) onProgressChange(next);
          updateAudio(next, true);
          if (Math.random() > 0.7) {
            setParticles(prev => [...prev.slice(-15), { id: Date.now(), x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }]);
          }
          return next;
        });
      }, 20);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      updateAudio(progress, false);
      intervalRef.current = window.setInterval(() => {
        setProgress(p => Math.max(0, p - 2));
      }, 30);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHolding, onComplete, onProgressChange, initAudio, updateAudio, progress]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 max-w-sm relative">
      <div className="text-center space-y-6 mb-16 relative z-10">
        <motion.h1 
          className="text-5xl font-serif italic text-rose-400 drop-shadow-[0_2px_10px_rgba(251,113,133,0.3)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          key={greeting}
        >
          {greeting}
        </motion.h1>
        <motion.p 
          className="text-rose-300 font-black tracking-[0.4em] uppercase text-[9px] opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Warm the heart to enter
        </motion.p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <AnimatePresence>
          {isHolding && (
             <>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                 className="absolute inset-0 bg-rose-400/20 rounded-full blur-3xl" 
               />
             </>
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ 
            scale: isHolding ? 1.6 : 1.1, 
            opacity: isHolding ? 0.8 : 0.2,
            backgroundColor: isHolding ? ['#fb7185', '#fcd34d'] : '#fb7185'
          }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-rose-200 rounded-full blur-[70px]" 
        />

        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
              animate={{ opacity: 0, x: p.x * 2, y: p.y * 2 - 100, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute text-rose-300/60 pointer-events-none"
            >
              <Heart size={16} fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={(e) => { e.preventDefault(); setIsHolding(true); }}
          onTouchEnd={() => setIsHolding(false)}
          className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center bg-white shadow-[0_25px_60px_rgba(251,113,133,0.3)] border-4 border-rose-50 outline-none transition-all active:scale-90 group overflow-hidden"
        >
          <motion.div 
            className="flex items-center justify-center relative z-20"
            animate={{ 
              scale: isHolding ? [1, 1.2, 1] : 1,
              rotate: isHolding ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.8, repeat: isHolding ? Infinity : 0 }}
          >
            <span className="text-7xl drop-shadow-2xl">💖</span>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-400/20 to-orange-300/10 z-10"
            animate={{ height: `${progress}%` }}
          />
        </button>

        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="50%" cy="50%" r="95" className="stroke-rose-50/20 fill-none" strokeWidth="6" />
          <motion.circle
            cx="50%" cy="50%" r="95"
            className="stroke-rose-400 fill-none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="596"
            animate={{ 
              strokeDashoffset: 596 - (596 * progress) / 100,
              stroke: isHolding ? ['#fb7185', '#fcd34d', '#fb7185'] : '#fb7185'
            }}
            transition={{ strokeDashoffset: { ease: "linear" }, stroke: { duration: 2, repeat: Infinity } }}
          />
        </svg>
      </div>

      <motion.div className="mt-20 flex flex-col items-center gap-4">
        <div className="w-48 h-1.5 bg-rose-100/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-400 to-orange-300 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.5)]"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest italic">
          {progress > 80 ? "Almost there..." : progress > 40 ? "Feeling the warmth..." : "Starting to glow..."}
        </p>
      </motion.div>
    </div>
  );
};

export default CoreScene;
