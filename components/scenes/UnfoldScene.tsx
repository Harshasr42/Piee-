
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOVE_LETTER_CONTENT } from '../../constants';

interface Props {
  onOpen?: () => void;
}

const UnfoldScene: React.FC<Props> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const playSparkleSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
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
      // Arpeggio sound for a "magical" opening
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        playNote(freq, now + i * 0.1, 0.8);
      });
      // High shimmer
      playNote(2093.00, now + 0.4, 1.2, 'triangle');
    } catch (e) {
      console.warn("Audio context failed to start", e);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    playSparkleSound();
    if (onOpen) onOpen();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 perspective-2000 overflow-hidden">
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
            className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.12)] relative border-2 border-rose-50 flex flex-col max-h-[75vh] min-h-[400px] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 z-20 shrink-0" />
            
            <div className="flex-1 overflow-y-auto custom-scroll p-10 pt-12">
              <div className="space-y-10 pb-20"> {/* Extra bottom padding for safe scrolling */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-rose-300 uppercase tracking-[0.3em]">{LOVE_LETTER_CONTENT.recipient}</p>
                  <h1 className="text-5xl font-serif italic text-[#5D4037]">{LOVE_LETTER_CONTENT.title}</h1>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-rose-100 rounded-full" />
                  <p className="text-xl leading-relaxed font-medium text-gray-500 italic pl-2 whitespace-pre-wrap">
                    {LOVE_LETTER_CONTENT.body}
                  </p>
                </div>

                <div className="pt-8 border-t border-rose-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">{LOVE_LETTER_CONTENT.signOff}</p>
                    <p className="text-3xl font-serif text-rose-500">{LOVE_LETTER_CONTENT.sender}</p>
                  </div>
                  <motion.div 
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 text-3xl font-black"
                  >
                    ✨
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(251, 113, 133, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default UnfoldScene;
