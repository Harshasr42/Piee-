
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LOVE_LETTER_CONTENT } from '../../constants';
import { Heart } from 'lucide-react';

const LetterScene: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playMagicalFlipSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.05 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 1.2);
      });
    } catch (e) { console.warn(e); }
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playMagicalFlipSound();
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-sm px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-rose-500 italic drop-shadow-sm">{LOVE_LETTER_CONTENT.title}</h1>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">A message from my heart</p>
      </div>

      <div 
        className="relative w-full aspect-[2/3] perspective-2000 cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 60 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(251,113,133,0.3)] border-4 border-white/90">
            <motion.img 
              src={LOVE_LETTER_CONTENT.coverImage} 
              alt="Card Cover" 
              className="w-full h-full object-cover"
              animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/50 via-transparent to-rose-200/10 flex flex-col items-center justify-end p-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-white/90 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl border border-rose-100"
              >
                <span className="text-rose-500 font-bold tracking-[0.3em] text-xs">OPEN MY HEART ❤️</span>
              </motion.div>
            </div>
          </div>

          {/* Back Side (The Message) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] bg-[#fdfaf5] p-10 flex flex-col shadow-2xl border-4 border-white/90 overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fb7185 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
              <div className="w-16 h-1 bg-rose-200/50 rounded-full" />
              <p className="text-[#5D4037] text-[1.2rem] leading-relaxed font-medium whitespace-pre-wrap italic font-serif tracking-wide px-2 group">
                {LOVE_LETTER_CONTENT.body}
                <motion.span 
                  className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity }}
                >
                  <Heart size={14} className="fill-rose-300 text-rose-300" />
                </motion.span>
              </p>
              <div className="w-16 h-1 bg-rose-200/50 rounded-full self-end" />
            </div>
            
            <div className="mt-8 text-center pt-6 border-t border-rose-100 relative z-10">
              <p className="text-rose-400 font-black tracking-[0.3em] uppercase text-[9px] mb-2">
                {LOVE_LETTER_CONTENT.footer}
              </p>
              <p className="text-rose-500 font-serif text-3xl italic">{LOVE_LETTER_CONTENT.sender}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default LetterScene;
