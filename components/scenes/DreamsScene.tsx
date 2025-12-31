import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DreamCategory, DreamItem } from '../../types';
import { ArrowLeft, Plus, Trash2, Camera, Wand2, Loader2, Home, RotateCcw, Edit2, Check, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onComplete: () => void;
  allCategories: DreamCategory[];
  setAllCategories: React.Dispatch<React.SetStateAction<DreamCategory[]>>;
}

const DreamsScene: React.FC<Props> = ({ onComplete, allCategories, setAllCategories }) => {
  const [navStack, setNavStack] = useState<DreamCategory[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const [originalImg, setOriginalImg] = useState('');
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('✨');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeCategory = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  useEffect(() => {
    if (navStack.length > 0) {
      const updatedStack: DreamCategory[] = [];
      let currentLevel = allCategories;
      
      for (const stackItem of navStack) {
        const found = currentLevel.find(c => c.id === stackItem.id);
        if (found) {
          updatedStack.push(found);
          currentLevel = found.subCategories || [];
        }
      }
      
      if (updatedStack.length !== navStack.length) {
        setNavStack([]);
      } else {
        const lastInStack = updatedStack[updatedStack.length - 1];
        const lastInNav = navStack[navStack.length - 1];
        if (JSON.stringify(lastInStack) !== JSON.stringify(lastInNav)) {
          setNavStack(updatedStack);
        }
      }
    }
  }, [allCategories, navStack]);

  const updateTree = (cats: DreamCategory[], targetId: string, updater: (cat: DreamCategory) => DreamCategory): DreamCategory[] => {
    return cats.map(cat => {
      if (cat.id === targetId) return updater(cat);
      if (cat.subCategories) return { ...cat, subCategories: updateTree(cat.subCategories, targetId, updater) };
      return cat;
    });
  };

  const ghiblifyImage = async () => {
    if (!newImg && !newLabel) {
      alert("Describe your dream or add a reference photo first! ✨");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptText = `Convert this into a beautiful, high-quality Studio Ghibli anime style illustration. Subject: ${newLabel || 'A magical dream world'}. Mood: ${newDesc || 'Soft lighting, whimsical atmosphere, nostalgic feel'}. Style: Vibrant watercolors, detailed hand-drawn lines, dreamy and warm.`;
      
      const parts: any[] = [{ text: promptText }];
      
      if (newImg.startsWith('data:image')) {
        parts.push({
          inlineData: { data: newImg.split(',')[1], mimeType: 'image/jpeg' }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      // Robust part iteration to find the image
      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            setNewImg(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) throw new Error("The spirits were shy and didn't return an image.");
      
    } catch (err) {
      console.error("Ghiblify Error:", err);
      alert("The spirits are a bit shy right now. Please try again in a moment! ✨");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItem = () => {
    if (!activeCategory || !newLabel) return;
    const itemData: DreamItem = {
      id: editingId || Date.now().toString(),
      label: newLabel,
      description: newDesc,
      image: newImg || 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800'
    };

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
    setOriginalImg('');
  };

  const startEditing = (item: DreamItem) => {
    setEditingId(item.id);
    setNewLabel(item.label);
    setNewDesc(item.description);
    setNewImg(item.image);
    setOriginalImg(item.image);
    setIsAddingItem(true);
  };

  const handleDeleteItem = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (!activeCategory) return;
    setAllCategories(prev => updateTree(prev, activeCategory.id, (cat) => ({
      ...cat, items: (cat.items || []).filter(i => i.id !== itemId)
    })));
  };

  const handleDeleteCategory = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    if (!window.confirm("Remove this entire path?")) return;
    if (!activeCategory) {
      setAllCategories(prev => prev.filter(c => c.id !== catId));
    } else {
      setAllCategories(prev => updateTree(prev, activeCategory.id, (cat) => ({
        ...cat, subCategories: (cat.subCategories || []).filter(c => c.id !== catId)
      })));
    }
  };

  const handleSaveCategory = () => {
    if (!newCatTitle) return;
    const newCat: DreamCategory = {
      id: Date.now().toString(),
      title: newCatTitle,
      icon: newCatIcon,
      items: [],
      subCategories: []
    };
    if (!activeCategory) setAllCategories(prev => [...prev, newCat]);
    else setAllCategories(prev => updateTree(prev, activeCategory.id, (cat) => ({
      ...cat, subCategories: [...(cat.subCategories || []), newCat]
    })));
    setIsAddingCategory(false);
    setNewCatTitle('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setNewImg(res);
        setOriginalImg(res);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 text-center overflow-hidden bg-[#FFFDFB]">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory ? activeCategory.id : 'root'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full h-full flex flex-col gap-4"
        >
          <div className="flex items-center justify-between min-h-[70px] pt-4">
            {navStack.length > 0 ? (
              <button onClick={() => setNavStack(prev => prev.slice(0, -1))} className="p-3 bg-white shadow-sm rounded-full text-rose-400 active:scale-90"><ArrowLeft size={20} /></button>
            ) : (
              <div className="p-3 bg-rose-50 rounded-full text-rose-200"><Home size={20} /></div>
            )}
            <div className="text-right pr-2">
              <h2 className="text-2xl font-serif text-rose-500 italic">{activeCategory ? activeCategory.title : "Future Visions"}</h2>
              <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">{activeCategory ? "The Traveler's Map" : "For Shreyaa ✨"}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scroll pb-24">
            {((activeCategory ? activeCategory.subCategories : allCategories) || []).map((cat) => (
              <motion.div
                key={cat.id}
                layout
                onClick={() => setNavStack(prev => [...prev, cat])}
                className="group relative flex items-center gap-4 p-5 bg-white rounded-3xl border border-rose-50 shadow-sm cursor-pointer text-left hover:border-rose-200"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{cat.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-rose-500 uppercase text-[11px] tracking-widest">{cat.title}</h3>
                  <p className="text-[10px] text-rose-300 italic">{cat.subCategories?.length ? `${cat.subCategories.length} paths` : `${cat.items?.length || 0} dreams`}</p>
                </div>
                <button onClick={(e) => handleDeleteCategory(e, cat.id)} className="p-2 text-rose-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
              </motion.div>
            ))}

            {activeCategory && (activeCategory.items || []).map((item) => (
              <motion.div 
                key={item.id}
                layout
                onClick={() => startEditing(item)}
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-rose-50 flex flex-col gap-4 relative group cursor-pointer hover:border-rose-100 transition-all"
              >
                <div className="relative aspect-video bg-rose-50 rounded-[1.8rem] overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.label} />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); startEditing(item); }} className="p-2.5 bg-white/95 rounded-full text-rose-500 shadow-sm"><Edit2 size={16} /></button>
                    <button onClick={(e) => handleDeleteItem(e, item.id)} className="p-2.5 bg-white/95 rounded-full text-rose-500 shadow-sm"><Trash2 size={16} /></button>
                  </div>
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
                <button
                  onClick={() => { closeEditor(); setIsAddingItem(true); }}
                  className="flex-1 bg-rose-500 text-white p-4 rounded-3xl flex items-center justify-center gap-2 font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  <Plus size={20} /> Add Dream
                </button>
              )}
              <button
                onClick={() => setIsAddingCategory(true)}
                className={`p-4 rounded-3xl flex items-center justify-center gap-2 font-black uppercase text-[11px] tracking-widest border-2 bg-white transition-all shadow-md active:scale-95 ${activeCategory ? 'w-20 border-rose-100 text-rose-300' : 'flex-1 border-rose-100 text-rose-500'}`}
              >
                <Plus size={20} /> {!activeCategory && "Create Path"}
              </button>
              {navStack.length === 0 && (
                <button onClick={onComplete} className="flex-1 bg-rose-50 text-rose-400 p-4 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-sm">Next &rarr;</button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isAddingItem && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-white p-8 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-serif text-rose-500 italic">{editingId ? 'Edit Dream' : 'New Dream'}</h3>
               <button onClick={closeEditor} className="p-2 text-rose-300"><X size={24} /></button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto">
              <div className="relative aspect-[16/9] w-full bg-rose-50 rounded-3xl overflow-hidden border border-rose-100 group shadow-inner">
                {newImg ? (
                  <img src={newImg} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-200">
                    <Camera size={40} className="mb-2" />
                    <p className="text-[10px] uppercase font-black tracking-widest">Tap to Upload</p>
                  </div>
                )}
                <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/0 hover:bg-black/5" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-rose-500" size={32} />
                    <p className="text-xs font-black text-rose-400 uppercase tracking-widest animate-pulse">Summoning Magic...</p>
                  </div>
                )}
              </div>
              <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-300 ml-1">Dream Name</label>
                  <input placeholder="E.g. Road trip through Spiti" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full bg-rose-50/50 px-6 py-4 rounded-2xl text-sm font-black text-rose-600 outline-none border border-transparent focus:border-rose-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-rose-300 ml-1">The Vibe</label>
                  <textarea placeholder="Describe the feeling..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-rose-50/50 px-6 py-4 rounded-2xl text-sm italic font-medium text-rose-900 outline-none border border-transparent focus:border-rose-200 resize-none" rows={3} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={ghiblifyImage} disabled={isGenerating || (!newImg && !newLabel)} className="col-span-1 bg-gradient-to-br from-rose-500 to-orange-400 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50">
                  <Wand2 size={16} /> Ghiblify ✨
                </button>
                {newImg !== originalImg && originalImg !== '' && (
                  <button onClick={() => setNewImg(originalImg)} className="col-span-1 bg-rose-50 text-rose-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><RotateCcw size={16} /> Revert</button>
                )}
                <button onClick={handleSaveItem} className={`${(newImg !== originalImg && originalImg !== '') ? 'col-span-1' : 'col-span-2'} bg-rose-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95`}>
                  <Check size={18} /> {editingId ? 'Update Dream' : 'Save Memory'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingCategory && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-6 bottom-10 z-[100] bg-white p-7 rounded-[3rem] border-2 border-rose-100 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <input placeholder="Icon" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="w-16 bg-rose-50 text-center rounded-2xl text-2xl outline-none shadow-inner" />
              <input placeholder="Path Name" value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} className="flex-1 bg-rose-50 px-5 py-4 rounded-2xl text-xs font-black uppercase text-rose-500 outline-none shadow-inner" />
            </div>
            <button onClick={handleSaveCategory} className="bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95">Create Sub-Path</button>
            <button onClick={() => setIsAddingCategory(false)} className="text-[10px] text-rose-300 uppercase font-black tracking-widest">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(251, 113, 133, 0.2); border-radius: 10px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default DreamsScene;