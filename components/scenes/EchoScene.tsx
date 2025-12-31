
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '../../types';
import { Plus, Trash2, Camera } from 'lucide-react';

interface Props {
  memories: Memory[];
  onUpdateMemories: (memories: Memory[]) => void;
  onComplete: () => void;
}

const EchoScene: React.FC<Props> = ({ memories, onUpdateMemories, onComplete }) => {
  const [index, setIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newUrl = event.target?.result as string;
        const newMemory: Memory = {
          id: Date.now(),
          url: newUrl,
          caption: 'A new moment we share...'
        };
        onUpdateMemories([...memories, newMemory]);
        setIndex(memories.length); // Switch to the new photo
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMemory = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (memories.length <= 1) return;
    const newMemories = memories.filter(m => m.id !== id);
    onUpdateMemories(newMemories);
    setIndex(prev => Math.min(prev, newMemories.length - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-rose-400">Our Bestie Scrapbook</h2>
        <p className="text-[10px] text-rose-300 uppercase tracking-widest mt-1">Add your own photos of us!</p>
      </div>

      <div className="relative w-full max-w-xs aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={memories[index].id}
            initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
            animate={{ opacity: 1, rotate: index % 2 === 0 ? 2 : -2, scale: 1 }}
            exit={{ opacity: 0, x: -100, rotate: -10 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full h-full relative p-4 bg-white shadow-xl rounded-sm flex flex-col gap-4 cursor-pointer group"
            onClick={() => index === memories.length - 1 ? onComplete() : setIndex(i => i + 1)}
          >
            {/* Washi Tape Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-rose-200/40 backdrop-blur-sm -rotate-2 z-20 border border-white/30" />
            
            <div className="flex-1 overflow-hidden bg-rose-50 rounded-sm relative">
              <img src={memories[index].url} className="w-full h-full object-cover" alt="Memory" />
              
              <button 
                onClick={(e) => deleteMemory(e, memories[index].id)}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md rounded-full text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="h-16 flex items-center justify-center">
              <p className="text-[#8D6E63] font-serif italic text-center text-sm">
                {memories[index].caption}
              </p>
            </div>
            
            <div className="absolute bottom-2 right-4 text-[10px] text-rose-200 font-bold">
              {index + 1} / {memories.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4 items-center">
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-400 shadow-md hover:scale-110 active:scale-95 transition-transform"
          >
            <Camera size={20} />
          </button>
          
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleFileUpload} 
          />

          <div className="flex gap-2">
            {memories.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-rose-400' : 'w-2 bg-rose-200'}`} />
            ))}
          </div>
        </div>
        
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-[0.2em] animate-pulse">
          Tap photo to turn page • Click camera to add yours
        </p>
      </div>
    </div>
  );
};

export default EchoScene;
