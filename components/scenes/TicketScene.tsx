
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface Props {
  onComplete: () => void;
}

const TicketScene: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-sm px-4">
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="w-full relative group"
      >
        <div className="absolute inset-0 bg-yellow-400/20 blur-3xl group-hover:bg-yellow-400/30 transition-all rounded-full" />
        
        <div className="relative bg-[#1a1200] border-4 border-yellow-500 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
          <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center text-3xl font-black text-[#1a1200]">
            K
          </div>
          
          <div className="text-center">
            <h2 className="text-4xl font-black text-yellow-500 tracking-widest uppercase italic">Golden Ticket</h2>
            <p className="text-yellow-600 font-bold text-xs tracking-tighter uppercase mt-1">Valid for every day ahead</p>
          </div>

          <div className="w-full h-px bg-yellow-900/50 my-2" />

          <div className="text-center italic">
            <p className="text-xl text-yellow-100/90 font-medium">"Unlimited Love & Smiles"</p>
            <p className="text-xs text-yellow-600/50 mt-2">No expiration date</p>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="px-8 py-4 bg-yellow-500 text-[#1a1200] rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(234,179,8,0.3)]"
      >
        Claim Ticket &gt;
      </motion.button>
    </div>
  );
};

export default TicketScene;
