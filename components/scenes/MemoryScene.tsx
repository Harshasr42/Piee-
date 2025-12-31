
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '../../types';

interface Props {
  memories: Memory[];
  onUpdateMemories: (memories: Memory[]) => void;
  onComplete: () => void;
}

const MemoryScene: React.FC<Props> = ({ memories, onUpdateMemories, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Safety guard: Find current memory safely
  const currentMemory = memories && memories.length > index ? memories[index] : null;

  const handleMemoryTap = () => {
    if (isEditing || !currentMemory || isZooming) return; 
    
    setIsZooming(true);
    // Wait for zoom animation to play before transitioning
    setTimeout(() => {
      setIsZooming(false);
      if (index < memories.length - 1) {
        setIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 700);
  };

  const updateCaption = (newCaption: string) => {
    if (!currentMemory) return;
    const updated = [...memories];
    updated[index] = { ...currentMemory, caption: newCaption };
    onUpdateMemories(updated);
  };

  // Robust guard for entire component
  if (!currentMemory || !currentMemory.url) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-rose-300 italic animate-pulse">Gathering moments for Shreyaa...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-sm py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-500">Moments for Shreyaa</h1>
      </div>

      <div className="relative w-full aspect-[3/4] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, x: 50, rotate: 10, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              rotate: -2, 
              scale: isZooming ? 1.4 : 1,
              zIndex: isZooming ? 50 : 1
            }}
            exit={{ opacity: 0, x: -50, rotate: -10, scale: 0.8 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 120,
              scale: { duration: 0.7, ease: "easeInOut" }
            }}
            onClick={handleMemoryTap}
            className="w-full h-full bg-white p-4 shadow-2xl flex flex-col gap-4 cursor-pointer transform origin-center"
          >
            <div className="relative flex-1 overflow-hidden bg-rose-50 rounded-sm pointer-events-none">
              <img 
                src={currentMemory.url} 
                alt="Memory" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div 
              className="h-20 flex items-center justify-center px-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {isEditing ? (
                <input
                  autoFocus
                  className="w-full text-center text-sm font-medium italic text-[#5D4037] bg-rose-50/50 border-b-2 border-rose-300 outline-none p-2 rounded"
                  value={currentMemory.caption}
                  onChange={(e) => updateCaption(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                />
              ) : (
                <p className="text-[#5D4037] font-medium text-center italic text-sm leading-relaxed hover:text-rose-400 transition-colors">
                  {currentMemory.caption}
                </p>
              )}
            </div>
            
            <div className="absolute bottom-2 right-4 text-[10px] text-rose-200 font-mono">
              #{index + 1} / {memories.length}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {!isZooming && (
          <>
            <div className="absolute -z-10 inset-0 bg-white/50 translate-x-4 translate-y-4 rotate-3 rounded-sm shadow-xl" />
            <div className="absolute -z-20 inset-0 bg-white/20 translate-x-8 translate-y-8 rotate-6 rounded-sm shadow-xl" />
          </>
        )}
      </div>

      <div className="space-y-4 text-center">
        <div className="flex gap-1 justify-center max-w-[280px] flex-wrap">
          {memories.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-rose-400' : 'w-1 bg-rose-100'}`} 
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">
            {isEditing ? "Editing caption..." : "Tap photo to zoom & turn page"}
          </p>
          {!isEditing && (
            <p className="text-rose-200 text-[8px] uppercase tracking-tighter italic">
              (Tap the text to edit it)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryScene;
