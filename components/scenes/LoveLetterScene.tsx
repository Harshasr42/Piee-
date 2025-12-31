
import React, { useState, useCallback, useEffect } from 'react';
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
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
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
            initial={{ y: 50, opacity: 0, rotateX: 30 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 180, rotateZ: 20, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            onClick={handleOpen}
            className="cursor-pointer relative group flex flex-col items-center gap-8"
          >
            <div className="w-72 h-48 bg-white rounded-2xl border-2 border-rose-100 shadow-[0_40px_80px_rgba(251,113,133,0.3)] flex items-center justify-center relative overflow-hidden preserve-3d">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FF69B4 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
              <div className="absolute top-0 w-full h-full border-t-[100px] border-t-rose-50 border-x-[144px] border-x-transparent z-10 opacity-70" />
              
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
            initial={{ opacity: 0, y: 150, rotateX: -90, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 80, delay: 0.2 }}
            className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.12)] relative border-2 border-rose-50 flex flex-col max-h-[85vh] min-h-[400px] overflow-hidden"
          >
            {/* Shimmering Top Bar */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 z-20 shrink-0"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 100%' }}
            />
            
            <div className="flex-1 overflow-y-auto custom-scroll p-10 pt-14">
              <div className="space-y-12 pb-32">
                <div className="space-y-4">
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-black text-rose-300 uppercase tracking-[0.3em]"
                  >
                    {LOVE_LETTER_CONTENT.recipient}
                  </motion.p>
                  <motion.h1 
                    className="text-5xl font-serif italic text-[#5D4037] relative"
                  >
                    <span className="relative z-10">{LOVE_LETTER_CONTENT.title}</span>
                    <motion.span 
                      className="absolute -inset-1 bg-rose-100/30 blur-xl rounded-full -z-10"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.h1>
                </div>

                <div className="relative group">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-200 via-rose-50 to-rose-200 rounded-full" />
                  <p className="text-[1.35rem] leading-[2.2rem] font-medium text-gray-500 italic pl-4 whitespace-pre-wrap font-serif">
                    {LOVE_LETTER_CONTENT.body.split(' ').map((word, i) => (
                      <span key={i} className="inline-block transition-all hover:text-rose-400 cursor-default">
                        {word === 'Shreyaa' ? (
                          <motion.span 
                            className="text-rose-500 font-bold"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {word}&nbsp;
                          </motion.span>
                        ) : word + ' '}
                      </span>
                    ))}
                  </p>
                  
                  {/* Decorative Sparkles in Text */}
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -right-2 top-0 text-rose-200 opacity-40"
                  >
                    <Sparkles size={20} />
                  </motion.div>
                </div>

                <div className="pt-12 border-t border-rose-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">{LOVE_LETTER_CONTENT.signOff}</p>
                    <p className="text-4xl font-serif text-rose-500 italic mt-1">{LOVE_LETTER_CONTENT.sender}</p>
                  </div>
                  
                  <motion.div 
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.15, 1],
                      filter: ["drop-shadow(0 0 0px #fb7185)", "drop-shadow(0 0 10px #fb7185)", "drop-shadow(0 0 0px #fb7185)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-4xl"
                  >
                    <Heart fill="currentColor" size={32} />
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-200 uppercase tracking-widest pointer-events-none"
            >
              Scroll to the end
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Tapped Hearts */}
      {tappedHearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ scale: 0, opacity: 1, x: heart.x - 24, y: heart.y - 24 }}
          animate={{ scale: 1.5, opacity: 0, y: heart.y - 120, x: heart.x - 24 + (Math.random() * 40 - 20) }}
          className="fixed pointer-events-none text-rose-400 z-[1000]"
        >
          <Heart fill="currentColor" size={48} />
        </motion.div>
      ))}

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(251, 113, 133, 0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LoveLetterScene;
