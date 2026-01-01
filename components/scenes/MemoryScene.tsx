
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory, VoiceNote } from '../../types';
// Fixed: Added missing Heart icon to the lucide-react imports
import { Star, Share2, Trash2, Camera, Wand2, Loader2, Sparkles, Filter, X, Mic, Play, Check, RotateCcw, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  title?: string;
  memories: Memory[];
  onUpdateMemories: (memories: Memory[]) => void;
  onComplete: () => void;
  voiceNotes?: VoiceNote[];
}

const MemoryScene: React.FC<Props> = ({ title = 'Our Scrapbook', memories, onUpdateMemories, onComplete, voiceNotes = [] }) => {
  const [index, setIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLinkingEcho, setIsLinkingEcho] = useState(false);
  
  const [lastDeleted, setLastDeleted] = useState<{ item: Memory; index: number } | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMemories = showFavoritesOnly 
    ? memories.filter(m => m.isFavorite) 
    : memories;

  const currentMemory = filteredMemories[index];

  const handleMemoryTap = () => {
    if (isEditing || !currentMemory || isZooming || deleteId || isLinkingEcho) return; 
    
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
          text: `"${currentMemory.caption}" - A moment for us ✨`,
          url: window.location.href,
        });
      } else {
        alert("Sharing not supported! ✨");
      }
    } catch (err) {
      console.log("Sharing failed", err);
    }
  };

  const executeDelete = () => {
    if (deleteId === null) return;
    const targetItem = memories.find(m => m.id === deleteId);
    const targetIndex = memories.findIndex(m => m.id === deleteId);

    if (targetItem) {
      setLastDeleted({ item: targetItem, index: targetIndex });
      setShowUndo(true);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = window.setTimeout(() => setShowUndo(false), 5000);
    }

    const updated = memories.filter(m => m.id !== deleteId);
    onUpdateMemories(updated);
    setDeleteId(null);
    setIndex(prev => Math.max(0, Math.min(prev, updated.length - 1)));
  };

  const handleUndo = () => {
    if (lastDeleted) {
      const { item, index: originalIndex } = lastDeleted;
      const newMemories = [...memories];
      newMemories.splice(originalIndex, 0, item);
      onUpdateMemories(newMemories);
      setLastDeleted(null);
      setShowUndo(false);
    }
  };

  const generateAICaption = async (base64Img: string) => {
    setIsGeneratingCaption(true);
    try {
      // Create a new GoogleGenAI instance for the request
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Img.split(',')[1], mimeType: 'image/jpeg' } },
              { text: "Generate a very short, heartwarming, and poetic caption for this photo of two best friends. It should feel sweet and nostalgic. Max 8 words." }
            ]
          }
        ]
      });
      // Correct property access for text output from GenerateContentResponse
      return response.text?.trim().replace(/"/g, '') || "A beautiful moment...";
    } catch (err) {
      console.error("AI Caption error:", err);
      return "A memory to hold onto forever...";
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
        
        // Show loading state and generate caption
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
    const updated = memories.map(m => m.id === currentMemory.id ? { ...m, caption: newCaption } : m);
    onUpdateMemories(updated);
  };

  if (filteredMemories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-6">
        <Star size={48} className="text-rose-100" />
        <p className="text-rose-300 italic text-center">No favorites yet! <br/> Tap the star on your favorite moments.</p>
        <button onClick={() => setShowFavoritesOnly(false)} className="px-6 py-2 bg-rose-50 text-rose-500 rounded-full font-black uppercase text-[10px] tracking-widest">Show All Moments</button>
      </div>
    );
  }

  const favoritesCount = memories.filter(m => m.isFavorite).length;
  const linkedNote = currentMemory.voiceNoteId ? voiceNotes.find(n => n.id === currentMemory.voiceNoteId) : null;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-sm py-12 px-4 relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-rose-500 italic">{title}</h2>
      </div>

      <div className="flex justify-between w-full mb-4 px-2 relative z-50">
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-3 rounded-2xl flex items-center gap-2 transition-all relative ${showFavoritesOnly ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-rose-300 border border-rose-50'}`}
        >
          <Filter size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{showFavoritesOnly ? "Favorites Only" : "Filter"}</span>
          {showFavoritesOnly && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-3 -right-3 bg-rose-600 text-white text-[9px] font-black px-2 py-1 rounded-full border-2 border-white shadow-xl min-w-[24px] flex items-center justify-center"
            >
              {favoritesCount}
            </motion.div>
          )}
        </button>
        
        <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white text-rose-400 rounded-2xl border border-rose-50 shadow-sm flex items-center gap-2 active:scale-95 transition-transform">
          <Camera size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Add Memory</span>
        </button>
      </div>

      <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />

      {/* Memory Card */}
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
            onClick={handleMemoryTap}
            className="w-full h-full bg-white p-4 shadow-2xl flex flex-col gap-4 cursor-pointer relative origin-center"
          >
            {/* Card Actions */}
            <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
              <button onClick={toggleFavorite} className={`p-2.5 rounded-full shadow-lg transition-all ${currentMemory.isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-rose-300'}`}>
                <Star size={18} fill={currentMemory.isFavorite ? "currentColor" : "none"} />
              </button>
              <button onClick={shareMemory} className="p-2.5 bg-white/80 backdrop-blur-md text-rose-400 rounded-full shadow-lg"><Share2 size={18} /></button>
              <button onClick={(e) => { e.stopPropagation(); setIsLinkingEcho(true); }} className={`p-2.5 rounded-full shadow-lg transition-all ${linkedNote ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-rose-400'}`}>
                <Mic size={18} />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative flex-1 overflow-hidden bg-rose-50 rounded-sm pointer-events-none shadow-inner">
              <img src={currentMemory.url} alt="Memory" className="w-full h-full object-cover" />
              
              {/* AI Generating Overlay */}
              {isGeneratingCaption && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {/* Fixed: Heart icon is now imported */}
                    <Heart size={32} className="text-rose-500 fill-rose-500" />
                  </motion.div>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">AI Thinking...</p>
                </div>
              )}

              {/* Linked Echo Indicator */}
              {linkedNote && (
                 <div className="absolute bottom-4 left-4 flex items-center gap-2">
                   <div className="p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-full shadow-xl pointer-events-auto">
                     <Play size={20} fill="currentColor" />
                   </div>
                   {linkedNote.duration && (
                     <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm border border-rose-50">
                       <span className="text-[10px] font-black text-rose-500 tabular-nums">{linkedNote.duration}</span>
                     </div>
                   )}
                 </div>
              )}
            </div>
            
            {/* Caption */}
            <div className="h-20 flex flex-col items-center justify-center px-2">
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
                <p 
                  className="text-[#5D4037] font-medium text-center italic text-sm leading-relaxed cursor-text hover:text-rose-400 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                >
                  {currentMemory.caption}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination / Dots */}
      <div className="space-y-4 text-center mt-4">
        <div className="flex gap-1 justify-center max-w-[280px] flex-wrap">
          {filteredMemories.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-rose-400' : 'w-1 bg-rose-100'}`} />
          ))}
        </div>
        <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest mt-2">
          {isEditing ? "Editing..." : "Tap to zoom • Swipe for more"}
        </p>
      </div>

      {/* Link Echo Modal */}
      <AnimatePresence>
        {isLinkingEcho && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-rose-900/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full max-h-[70vh]">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-serif italic text-rose-500">Link an Echo</h3>
                <button onClick={() => setIsLinkingEcho(false)} className="text-rose-300 hover:text-rose-500 transition-colors"><X size={20} /></button>
              </div>
              <div className="w-full overflow-y-auto custom-scroll pr-1 flex flex-col gap-3">
                {voiceNotes.length > 0 ? (
                  voiceNotes.map(note => (
                    <button 
                      key={note.id} 
                      onClick={() => { 
                        onUpdateMemories(memories.map(m => m.id === currentMemory.id ? { ...m, voiceNoteId: m.voiceNoteId === note.id ? undefined : note.id } : m));
                        setIsLinkingEcho(false);
                      }} 
                      className={`w-full p-4 rounded-3xl flex items-center justify-between border-2 transition-all ${currentMemory.voiceNoteId === note.id ? 'bg-rose-50 border-rose-300 shadow-md' : 'bg-white border-rose-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Mic size={16} className={currentMemory.voiceNoteId === note.id ? 'text-rose-500' : 'text-gray-400'} />
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest">Echo {note.duration || ''}</p>
                          <p className="text-[9px] opacity-60 font-medium">{note.date}</p>
                        </div>
                      </div>
                      {currentMemory.voiceNoteId === note.id && <Check size={16} className="text-rose-500" />}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-xs text-rose-300 italic py-10">No voice echoes found! ✨</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-rose-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 max-w-xs text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500"><Trash2 size={32} /></div>
              <h3 className="text-xl font-serif text-[#5D4037] italic">Remove from scrapbook?</h3>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-rose-50 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Keep It</button>
                <button onClick={executeDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {showUndo && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[400] bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-rose-400/30">
            <p className="text-xs font-bold uppercase tracking-widest">Removed</p>
            <button onClick={handleUndo} className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full"><RotateCcw size={14} /><span className="text-[10px] font-black uppercase">Undo</span></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryScene;
