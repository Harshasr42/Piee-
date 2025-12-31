import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOVE_LETTER_CONTENT } from '../../constants';
import { Heart, Sparkles } from 'lucide-react';

interface Props {
  onOpen?: () => void;
}

const LoveLetterScene: React.FC<Props> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tappedHearts, setTappedHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const playSparkleSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => playNote(freq, now + i * 0.1, 0.8));
    } catch (e) { console.warn(e); }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    playSparkleSound();
    if (onOpen) onOpen();
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isOpen) return;
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY;
    
    const newHeart = { id: Date.now(), x: clientX, y: clientY };
    setTappedHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setTappedHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 perspective-2000 overflow-hidden" onClick={handleTap}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={handleOpen}
            className="cursor-pointer relative group flex flex-col items-center gap-8"
          >
            <div className="w-72 h-48 bg-white rounded-2xl border-2 border-rose-100 shadow-2xl flex items-center justify-center relative">
               <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-rose-400 shadow-xl flex items-center justify-center text-white text-3xl z-20 border-4 border-white"
              >
                💌
              </motion.div>
            </div>
            <div className="text-center">
               <p className="text-rose-400 font-serif italic text-2xl">One final thing, Shreyaa...</p>
               <p className="text-rose-200 uppercase tracking-[0.3em] text-[10px] font-black mt-3 animate-pulse">Open my heart</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl relative border-2 border-rose-50 flex flex-col max-h-[85vh] min-h-[400px] overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto custom-scroll p-10 pt-14">
              <div className="space-y-12 pb-32">
                <div className="space-y-4">
                  <p className="text-xs font-black text-rose-300 uppercase tracking-[0.3em]">{LOVE_LETTER_CONTENT.recipient}</p>
                  <h1 className="text-5xl font-serif italic text-[#5D4037]">{LOVE_LETTER_CONTENT.title}</h1>
                </div>
                <p className="text-[1.35rem] leading-[2.2rem] font-medium text-gray-500 italic whitespace-pre-wrap font-serif">
                  {LOVE_LETTER_CONTENT.body}
                </p>
                <div className="pt-12 border-t border-rose-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">{LOVE_LETTER_CONTENT.signOff}</p>
                    <p className="text-4xl font-serif text-rose-500 italic mt-1">{LOVE_LETTER_CONTENT.sender}</p>
                  </div>
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-4xl"
                  >
                    <Heart fill="currentColor" size={32} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {tappedHearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ scale: 0, opacity: 1, x: heart.x - 24, y: heart.y - 24 }}
          animate={{ scale: 1.5, opacity: 0, y: heart.y - 120 }}
          className="fixed pointer-events-none text-rose-400 z-[1000]"
        >
          <Heart fill="currentColor" size={48} />
        </motion.div>
      ))}
    </div>
  );
};

export default LoveLetterScene;