
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '../../types';
import { Star, Share2, Trash2, Camera, Loader2, Filter } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  memories: Memory[];
  onUpdateMemories: (memories: Memory[]) => void;
  onComplete: () => void;
}

const MemoryScene: React.FC<Props> = ({ memories, onUpdateMemories, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMemories = showFavoritesOnly 
    ? memories.filter(m => m.isFavorite) 
    : memories;

  const currentMemory = filteredMemories[index];

  const handleMemoryTap = () => {
    if (isEditing || !currentMemory || isZooming || deleteId) return; 
    
    setIsZooming(true);
    setTimeout(() => {
      setIsZooming(false);
      if (index < filteredMemories.length - 1) {
        setIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 700);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentMemory) return;
    const updated = memories.map(m => 
      m.id === currentMemory.id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    onUpdateMemories(updated);
  };

  const shareMemory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentMemory) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'A Beautiful Memory',
          text: `"${currentMemory.caption}" - A moment for Shreyaa ✨`,
          url: window.location.href,
        });
      } else {
        alert("Sharing not supported on this browser! ✨");
      }
    } catch (err) {
      console.log("Sharing failed", err);
    }
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (memories.length <= 1) return;
    setDeleteId(currentMemory.id);
  };

  const executeDelete = () => {
    if (deleteId === null) return;
    const updated = memories.filter(m => m.id !== deleteId);
    onUpdateMemories(updated);
    setDeleteId(null);
    setIndex(prev => Math.max(0, Math.min(prev, updated.length - 1)));
  };

  const generateAICaption = async (base64Img: string) => {
    setIsGeneratingCaption(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Img.split(',')[1], mimeType: 'image/jpeg' } },
              { text: "Generate a very short, heartwarming, and poetic caption for this photo of two best friends. Max 10 words." }
            ]
          }
        ]
      });
      return response.text?.trim().replace(/"/g, '') || "A beautiful moment...";
    } catch (err) {
      console.error(err);
      return "A moment we'll never forget...";
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const suggestion = await generateAICaption(base64);
        
        const newMemory: Memory = {
          id: Date.now(),
          url: base64,
          caption: suggestion,
          isFavorite: false
        };
        
        const updated = [...memories, newMemory];
        onUpdateMemories(updated);
        setShowFavoritesOnly(false);
        setIndex(updated.length - 1);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCaption = (newCaption: string) => {
    if (!currentMemory) return;
    const updated = memories.map(m => 
      m.id === currentMemory.id ? { ...m, caption: newCaption } : m
    );
    onUpdateMemories(updated);
  };

  if (filteredMemories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-6">
        <Star size={48} className="text-rose-100" />
        <p className="text-rose-300 italic text-center">No favorites yet, Shreyaa! <br/> Tap the star on your favorite moments.</p>
        <button onClick={() => setShowFavoritesOnly(false)} className="px-6 py-2 bg-rose-50 text-rose-500 rounded-full font-black uppercase text-[10px] tracking-widest">Show All Moments</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-sm py-12 px-4 relative">
      <div className="flex justify-between w-full mb-4 px-2">
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-3 rounded-2xl flex items-center gap-2 transition-all ${showFavoritesOnly ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-rose-300 border border-rose-50'}`}
        >
          <Filter size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{showFavoritesOnly ? "Favorites" : "All"}</span>
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-white text-rose-400 rounded-2xl border border-rose-50 shadow-sm active:scale-90 flex items-center gap-2"
        >
          <Camera size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Add Memory</span>
        </button>
      </div>

      <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />

      {/* Prominent Memory Counter */}
      <motion.div 
        key={`badge-${index}-${filteredMemories.length}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 bg-rose-500/10 backdrop-blur-md px-6 py-2 rounded-full border border-rose-200 shadow-sm"
      >
        <p className="text-rose-600 font-bold text-xs tracking-widest uppercase">
          Memory <span className="text-rose-700 font-black">{index + 1}</span> of <span className="text-rose-700 font-black">{filteredMemories.length}</span>
        </p>
      </motion.div>

      <div className="relative w-full aspect-[3/4] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            drag="x"
            dragConstraints={{ left: -100, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -80) confirmDelete(e as any);
            }}
            initial={{ opacity: 0, x: 50, rotate: 10, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              rotate: -2, 
              scale: isZooming ? 1.4 : 1,
              zIndex: isZooming ? 50 : 1
            }}
            exit={{ opacity: 0, x: -50, rotate: -10, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onClick={handleMemoryTap}
            className="w-full h-full bg-white p-4 shadow-2xl flex flex-col gap-4 cursor-pointer transform origin-center relative"
          >
            <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
              <button 
                onClick={toggleFavorite}
                className={`p-2.5 rounded-full shadow-lg transition-all ${currentMemory.isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-rose-300'}`}
              >
                <Star size={18} fill={currentMemory.isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={shareMemory}
                className="p-2.5 bg-white/80 backdrop-blur-md text-rose-400 rounded-full shadow-lg"
              >
                <Share2 size={18} />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden bg-rose-50 rounded-sm pointer-events-none">
              <img src={currentMemory.url} alt="Memory" className="w-full h-full object-cover" />
              {isGeneratingCaption && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-rose-500" size={32} />
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">AI Thinking...</p>
                </div>
              )}
            </div>
            
            <div className="h-20 flex flex-col items-center justify-center px-2 relative">
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
                <p className="text-[#5D4037] font-medium text-center italic text-sm leading-relaxed hover:text-rose-400 transition-colors"
                   onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                  {currentMemory.caption}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-4 text-center mt-6">
        <div className="flex gap-1 justify-center max-w-[280px] flex-wrap">
          {filteredMemories.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-rose-400' : 'w-1 bg-rose-100'}`} />
          ))}
        </div>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">
          {isEditing ? "Editing caption..." : "Swipe left to delete • Tap to zoom"}
        </p>
      </div>

      <AnimatePresence>
        {deleteId !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-rose-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 max-w-xs text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-serif text-[#5D4037] italic">Delete this memory?</h3>
              <p className="text-xs text-gray-400 font-medium">This cannot be undone, Shreyaa.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-rose-50 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                <button onClick={executeDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryScene;
