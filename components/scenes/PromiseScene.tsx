import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const PromiseScene: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-10 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-8"
      >
        <div className="flex justify-center gap-4 text-4xl">
           <span>🤙</span>
           <span>✨</span>
           <span>🤙</span>
        </div>
        
        <h2 className="text-4xl font-serif text-rose-500">A Pinky Promise</h2>
        
        <div className="p-8 bg-white/60 backdrop-blur-md rounded-[3rem] border-2 border-rose-50 shadow-inner">
          <p className="text-lg leading-relaxed text-gray-600 italic">
            "No matter how much life changes, how busy we get, or how far apart we might be... I promise to always be the one you can call at 3 AM. I promise to always be your biggest cheerleader. Always."
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onComplete}
          className="px-10 py-4 bg-rose-400 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-xl"
        >
          I Promise Too ❤️
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PromiseScene;