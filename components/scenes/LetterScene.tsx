
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LOVE_LETTER_CONTENT } from '../../constants';

const LetterScene: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playFlipSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.4);
      
      // Added high-freq "sparkle"
      const sparkle = audioCtx.createOscillator();
      const sparkleGain = audioCtx.createGain();
      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(2000, now);
      sparkleGain.gain.setValueAtTime(0, now);
      sparkleGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      sparkle.connect(sparkleGain);
      sparkleGain.connect(audioCtx.destination);
      sparkle.start(now);
      sparkle.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio Context failed");
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playFlipSound();
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-sm px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-rose-500 italic">{LOVE_LETTER_CONTENT.title}</h1>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">A message just for you</p>
      </div>

      <div 
        className="relative w-full aspect-[2/3] perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-700"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/80">
            <img 
              src={LOVE_LETTER_CONTENT.coverImage} 
              alt="Card Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/40 to-transparent flex flex-col items-center justify-end p-10">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-lg"
              >
                <span className="text-rose-500 font-bold tracking-[0.2em] text-sm">OPEN HEART ❤️</span>
              </motion.div>
            </div>
          </div>

          {/* Back Side (The Message) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] bg-[#fdfaf5] p-10 flex flex-col shadow-2xl border-4 border-white/80"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="w-12 h-1.5 bg-rose-200 rounded-full" />
              <p className="text-[#5D4037] text-lg leading-relaxed font-medium whitespace-pre-wrap italic font-serif">
                {LOVE_LETTER_CONTENT.body}
              </p>
              <div className="w-12 h-1.5 bg-rose-200 rounded-full self-end" />
            </div>
            
            <div className="mt-8 text-center pt-6 border-t border-rose-100">
              <p className="text-rose-400 font-bold tracking-[0.2em] uppercase text-[10px]">
                {LOVE_LETTER_CONTENT.footer}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>

      {isFlipped && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-rose-300 text-[10px] font-bold tracking-widest uppercase"
        >
          You are magical, Shreyaa
        </motion.p>
      )}
    </div>
  );
};

export default LetterScene;
