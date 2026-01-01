
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DreamCategory, DreamItem } from '../../types';
import { ArrowLeft, Plus, Trash2, Camera, Wand2, Loader2, Home, RotateCcw, Edit2, Check, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  title?: string;
  nickname: string;
  onComplete: () => void;
  allCategories: DreamCategory[];
  setAllCategories: React.Dispatch<React.SetStateAction<DreamCategory[]>>;
}

const DreamsScene: React.FC<Props> = ({ title = 'Future Visions', nickname, onComplete, allCategories, setAllCategories }) => {
  const [navStack, setNavStack] = useState<DreamCategory[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const [originalImg, setOriginalImg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeCategory = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const updateTree = (cats: DreamCategory[], targetId: string, updater: (cat: DreamCategory) => DreamCategory): DreamCategory[] => {
    return cats.map(cat => {
      if (cat.id === targetId) return updater(cat);
      if (cat.subCategories) return { ...cat, subCategories: updateTree(cat.subCategories, targetId, updater) };
      return cat;
    });
  };

  const handleSaveItem = () => {
    if (!activeCategory || !newLabel) return;
    const itemData: DreamItem = { id: editingId || Date.now().toString(), label: newLabel, description: newDesc, image: newImg || 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800' };
    setAllCategories(prev => updateTree(prev, activeCategory.id, (cat) => {
      const items = cat.items || [];
      if (editingId) return { ...cat, items: items.map(i => i.id === editingId ? itemData : i) };
      return { ...cat, items: [...items, itemData] };
    }));
    closeEditor();
  };

  const closeEditor = () => {
    setIsAddingItem(false);
    setEditingId(null);
    setNewLabel('');
    setNewDesc('');
    setNewImg('');
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 text-center overflow-hidden bg-[#FFFDFB]">
      <AnimatePresence mode="wait">
        <motion.div key={activeCategory ? activeCategory.id : 'root'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full h-full flex flex-col gap-4">
          <div className="flex items-center justify-between min-h-[70px] pt-4">
            {navStack.length > 0 ? (
              <button onClick={() => setNavStack(prev => prev.slice(0, -1))} className="p-3 bg-white shadow-sm rounded-full text-rose-400 active:scale-90"><ArrowLeft size={20} /></button>
            ) : (
              <div className="p-3 bg-rose-50 rounded-full text-rose-200"><Home size={20} /></div>
            )}
            <div className="text-right pr-2">
              <h2 className="text-2xl font-serif text-rose-500 italic">{activeCategory ? activeCategory.title : title}</h2>
              <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">For {nickname} ✨</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scroll pb-24">
            {((activeCategory ? activeCategory.subCategories : allCategories) || []).map((cat) => (
              <motion.div key={cat.id} layout onClick={() => setNavStack(prev => [...prev, cat])} className="group relative flex items-center gap-4 p-5 bg-white rounded-3xl border border-rose-50 shadow-sm cursor-pointer text-left hover:border-rose-200">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{cat.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-rose-500 uppercase text-[11px] tracking-widest">{cat.title}</h3>
                  <p className="text-[10px] text-rose-300 italic">{cat.items?.length || 0} dreams</p>
                </div>
              </motion.div>
            ))}

            {activeCategory && (activeCategory.items || []).map((item) => (
              <motion.div key={item.id} layout onClick={() => { setEditingId(item.id); setNewLabel(item.label); setNewDesc(item.description); setNewImg(item.image); setIsAddingItem(true); }} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-rose-50 flex flex-col gap-4 relative group cursor-pointer hover:border-rose-100 transition-all">
                <div className="relative aspect-video bg-rose-50 rounded-[1.8rem] overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.label} />
                </div>
                <div className="px-1 text-left">
                  <h4 className="font-black text-rose-600 uppercase text-[11px] tracking-widest mb-1">{item.label}</h4>
                  <p className="text-xs text-[#5D4037]/70 italic leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {!isAddingItem && !isAddingCategory && (
            <div className="absolute bottom-6 left-6 right-6 flex gap-2">
              {activeCategory && (
                <button onClick={() => setIsAddingItem(true)} className="flex-1 bg-rose-500 text-white p-4 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95">Add Dream</button>
              )}
              {navStack.length === 0 && (
                <button onClick={onComplete} className="flex-1 bg-rose-50 text-rose-400 p-4 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-sm">Next &rarr;</button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DreamsScene;
