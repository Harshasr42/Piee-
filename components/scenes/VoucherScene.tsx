import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BESTIE_VOUCHERS } from '../../constants';
import { Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const VoucherScene: React.FC<Props> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-sm px-6">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-rose-500">Bestie Vouchers</h2>
        <p className="text-xs text-rose-300 mt-2 uppercase tracking-[0.2em] font-bold">Pick your favorites, Shreyaa</p>
      </div>

      <div className="w-full space-y-4">
        {BESTIE_VOUCHERS.map((v) => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggle(v.id)}
            className={`w-full p-5 rounded-3xl flex items-center justify-between border-2 transition-all duration-300 ${
              selected.includes(v.id) 
                ? 'bg-rose-50 border-rose-300 shadow-md' 
                : 'bg-white/40 border-white/60 text-rose-200'
            }`}
          >
            <div className="text-left">
              <h3 className={`font-bold tracking-tight ${selected.includes(v.id) ? 'text-rose-600' : 'text-rose-300'}`}>{v.title}</h3>
              <p className="text-[10px] text-rose-300 uppercase mt-1">Cost: {v.cost}</p>
            </div>
            {selected.includes(v.id) ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Heart size={20} className="fill-rose-400 text-rose-400" />
              </motion.div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-rose-100" />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selected.length > 0 ? 1 : 0 }}
        onClick={onComplete}
        className="mt-4 px-12 py-4 bg-rose-400 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-rose-500 transition-colors"
      >
        Redeem All &rarr;
      </motion.button>
    </div>
  );
};

export default VoucherScene;