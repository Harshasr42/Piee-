
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneType, Memory, DreamCategory, ThemeType, ThemeColors, VoiceNote } from './types';
import { MEMORIES, FUTURE_DREAMS_CATEGORIES } from './constants';
import CoreScene from './components/scenes/CoreScene';
import NoiseScene from './components/scenes/NoiseScene';
import VoucherScene from './components/scenes/VoucherScene';
import MemoryScene from './components/scenes/MemoryScene';
import LoveLetterScene from './components/scenes/LoveLetterScene';
import ReasonsScene from './components/scenes/ReasonsScene';
import PromiseScene from './components/scenes/PromiseScene';
import DreamsScene from './components/scenes/DreamsScene';
import RememberScene from './components/scenes/RememberScene';
import { ChevronLeft, Volume2, VolumeX, Settings, Heart, X, Palette, Play, Mic, Calendar, Trash2, AlertCircle, Edit3, Lock, Unlock } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const THEMES: Record<ThemeType, ThemeColors> = {
  rose: { primary: '#fb7185', secondary: '#fff1f2', accent: '#f43f5e', bg: '#FFF9F5', text: '#5D4037' },
  lavender: { primary: '#a78bfa', secondary: '#f5f3ff', accent: '#8b5cf6', bg: '#F9F7FF', text: '#3B3054' },
  gold: { primary: '#fbbf24', secondary: '#fffbeb', accent: '#f59e0b', bg: '#FFFDF5', text: '#5D4E37' },
  sea: { primary: '#2dd4bf', secondary: '#f0fdfa', accent: '#14b8a6', bg: '#F5FFFE', text: '#2A4A45' }
};

const App: React.FC = () => {
  const ENABLED_SCENES = useMemo(() => [
    SceneType.CORE,
    SceneType.NOISE,
    SceneType.VOUCHER,
    SceneType.ECHOES,
    SceneType.REASONS,
    SceneType.DREAMS,
    'REMEMBER' as any,
    SceneType.PROMISE,
    SceneType.UNFOLD
  ], []);

  const [currentScene, setCurrentScene] = useState<SceneType>(ENABLED_SCENES[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [hasUnsavedEcho, setHasUnsavedEcho] = useState(false);
  const [showNavPrompt, setShowNavPrompt] = useState(false);
  
  // Admin Mode
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');

  // Personalization State
  const [personalization, setPersonalization] = useState(() => {
    const saved = localStorage.getItem('shreyaa_personalization');
    return saved ? JSON.parse(saved) : {
      nickname: 'Shreyaa',
      introGreeting: 'Hi, Shreyaa...',
      voucherTitle: 'Bestie Vouchers',
      memoriesTitle: 'Our Scrapbook',
      reasonsTitle: "Why You're My Favorite",
      dreamsTitle: 'Future Visions',
      letterTitle: 'One final thing...'
    };
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('shreyaa_theme') as ThemeType) || 'rose';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const themeColors = THEMES[currentTheme];

  const updatePersonalization = (key: string, value: string) => {
    setPersonalization(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    localStorage.setItem('shreyaa_personalization', JSON.stringify(personalization));
  }, [personalization]);

  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const playSfx = useCallback((type: 'pop' | 'success' | 'whoosh' | 'shimmer') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      gain.connect(audioCtx.destination);

      if (type === 'shimmer') {
        [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0, now + i * 0.08);
          g.gain.linearRampToValueAtTime(0.05, now + i * 0.08 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 1.0);
          o.connect(g);
          g.connect(audioCtx.destination);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 1.0);
        });
        return;
      }

      const osc = audioCtx.createOscillator();
      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.4);
      } else if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.5);
      }
      osc.connect(gain);
      osc.start();
      osc.stop(now + 1.2);
    } catch (e) { console.warn("SFX failed", e); }
  }, [isMuted, volume]);

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('shreyaa_memories');
    return saved ? JSON.parse(saved) : MEMORIES;
  });

  const [dreamsData, setDreamsData] = useState<DreamCategory[]>(() => {
    const saved = localStorage.getItem('shreyaa_dreams');
    return saved ? JSON.parse(saved) : FUTURE_DREAMS_CATEGORIES;
  });

  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(() => {
    const saved = localStorage.getItem('shreyaa_voicenotes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shreyaa_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('shreyaa_dreams', JSON.stringify(dreamsData));
  }, [dreamsData]);

  useEffect(() => {
    localStorage.setItem('shreyaa_voicenotes', JSON.stringify(voiceNotes));
    localStorage.setItem('shreyaa_theme', currentTheme);
  }, [voiceNotes, currentTheme]);

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_7314757c21.mp3');
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume * 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume * 0.4;
    }
  }, [volume, isMuted]);

  const startMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  const currentIndex = ENABLED_SCENES.indexOf(currentScene);

  const nextScene = useCallback(() => {
    playSfx('whoosh');
    triggerHaptic(20);
    startMusic();
    if (currentIndex < ENABLED_SCENES.length - 1) {
      setCurrentScene(ENABLED_SCENES[currentIndex + 1]);
    }
  }, [currentIndex, ENABLED_SCENES, playSfx, triggerHaptic]);

  const prevScene = useCallback(() => {
    if (currentScene === ('REMEMBER' as any) && hasUnsavedEcho) {
      setShowNavPrompt(true);
      return;
    }
    playSfx('whoosh');
    triggerHaptic(10);
    if (currentIndex > 0) {
      setCurrentScene(ENABLED_SCENES[currentIndex - 1]);
    }
  }, [currentIndex, ENABLED_SCENES, playSfx, triggerHaptic, currentScene, hasUnsavedEcho]);

  const handleSaveVoiceNote = (data: string, durationStr?: string) => {
    playSfx('success');
    triggerHaptic([30, 50, 30]);
    const newNote: VoiceNote = { 
      id: Date.now(), 
      data, 
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: durationStr
    };
    setVoiceNotes(prev => [newNote, ...prev]);
    setHasUnsavedEcho(false);
    nextScene();
  };

  const playVoiceNote = (data: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    playSfx('pop');
    const audio = new Audio(data);
    audio.volume = 1.0;
    previewAudioRef.current = audio;
    audio.play().catch(err => console.error("Playback error:", err));
  };

  const deleteVoiceNote = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    playSfx('pop');
    setVoiceNotes(prev => prev.filter(n => n.id !== id));
    setMemories(prev => prev.map(m => m.voiceNoteId === id ? { ...m, voiceNoteId: undefined } : m));
  };

  const checkAdminCode = (code: string) => {
    setAdminCodeInput(code);
    // Requested Password: 14100604
    if (code === '14100604') {
      setIsAdmin(true);
      playSfx('success');
      triggerHaptic(30);
    }
  };

  const triggerFinalConfetti = useCallback(() => {
    playSfx('shimmer');
    triggerHaptic([50, 100, 50, 100]);
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const heart = confetti.shapeFromPath({ path: 'M0 10 C1.5 1.5 7.5 -1.5 10 3 C12.5 -1.5 18.5 1.5 20 10 C20 13 12 20 10 23 C8 20 0 13 0 10 Z' });

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setShowThankYou(true);
        return;
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: [themeColors.primary, themeColors.accent, '#FFD700'], shapes: [heart, 'circle'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: [themeColors.primary, themeColors.accent, '#FFD700'], shapes: [heart, 'circle'] });
    }, 250);

    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: [themeColors.primary, themeColors.accent, themeColors.secondary, '#F08080', '#FFD700'], shapes: [heart, 'circle'], scalar: 2 });
  }, [themeColors, playSfx, triggerHaptic]);

  const sceneVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.05, y: -10 }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col transition-colors duration-1000"
      style={{ 
        backgroundColor: themeColors.bg,
        backgroundImage: `linear-gradient(to bottom, ${themeColors.bg}, ${themeColors.secondary})`,
        color: themeColors.text
      }}
    >
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-[200] pointer-events-none">
        <AnimatePresence>
          {currentIndex > 0 && !showThankYou && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={prevScene}
              className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 pointer-events-auto hover:bg-white transition-all active:scale-90"
              style={{ color: themeColors.primary }}
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {!showThankYou && (
          <button
            onClick={() => { playSfx('pop'); setIsSettingsOpen(true); triggerHaptic(10); }}
            className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 pointer-events-auto hover:bg-white transition-all active:scale-90 ml-auto"
            style={{ color: themeColors.primary }}
          >
            <Settings size={24} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl relative border-2 border-rose-50 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button onClick={() => { playSfx('pop'); setIsSettingsOpen(false); }} className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 transition-colors"><X size={24} /></button>
              <h3 className="text-2xl font-serif italic mb-8" style={{ color: themeColors.primary }}>Settings</h3>
              
              <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-8 pb-4">
                {/* Theme Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between opacity-70">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Theme</span>
                    <Palette size={16} />
                  </div>
                  <div className="flex justify-between gap-3">
                    {(Object.keys(THEMES) as ThemeType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => { playSfx('pop'); setCurrentTheme(t); triggerHaptic(10); }}
                        className={`w-12 h-12 rounded-full border-4 transition-all ${currentTheme === t ? 'scale-110 shadow-lg' : 'scale-100 opacity-60'}`}
                        style={{ backgroundColor: THEMES[t].primary, borderColor: currentTheme === t ? 'white' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Personalized Content (Locked behind Password) */}
                {isAdmin && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-6 border-t border-rose-50"
                  >
                     <div className="flex items-center justify-between opacity-70">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Personalize Journey (Admin)</span>
                      <Edit3 size={16} className="text-rose-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-rose-300">Nickname</label>
                        <input value={personalization.nickname} onChange={(e) => updatePersonalization('nickname', e.target.value)} className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-rose-300">Intro Greeting</label>
                        <input value={personalization.introGreeting} onChange={(e) => updatePersonalization('introGreeting', e.target.value)} className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-rose-300">Voucher Slide Title</label>
                        <input value={personalization.voucherTitle} onChange={(e) => updatePersonalization('voucherTitle', e.target.value)} className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-rose-300">Memory Slide Title</label>
                        <input value={personalization.memoriesTitle} onChange={(e) => updatePersonalization('memoriesTitle', e.target.value)} className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-rose-300">Dreams Slide Title</label>
                        <input value={personalization.dreamsTitle} onChange={(e) => updatePersonalization('dreamsTitle', e.target.value)} className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 outline-none" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Volume Settings */}
                <div className="space-y-4 pt-6 border-t border-rose-50">
                  <div className="flex items-center justify-between opacity-70">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volume</span>
                    <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1.5 rounded-full appearance-none accent-gray-400 cursor-pointer" style={{ backgroundColor: themeColors.secondary }} />
                </div>

                {/* Admin Mode Toggle */}
                {!isAdmin && (
                  <div className="space-y-4 pt-6 border-t border-rose-50">
                    <div className="flex items-center justify-between opacity-70">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Admin Access</span>
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password"
                      placeholder="Enter secret code to edit text..."
                      value={adminCodeInput}
                      onChange={(e) => checkAdminCode(e.target.value)}
                      className="w-full bg-rose-50/50 px-4 py-3 rounded-xl text-xs font-medium text-rose-400 outline-none placeholder:text-rose-200"
                    />
                  </div>
                )}

                {/* Voice Note History */}
                <div className="space-y-4 pt-6 border-t border-rose-50 pb-4">
                  <div className="flex items-center justify-between opacity-70">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Saved Echoes</span>
                    <Mic size={16} />
                  </div>
                  <div className="space-y-3">
                    {voiceNotes.length === 0 ? (
                      <p className="text-[10px] text-gray-300 italic text-center py-8">No echoes recorded yet ✨</p>
                    ) : (
                      voiceNotes.map((note) => (
                        <div key={note.id} className="w-full p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center gap-3 transition-all hover:bg-rose-50">
                          <button onClick={() => playVoiceNote(note.data)} className="w-10 h-10 bg-rose-500 rounded-full text-white shadow-md active:scale-90 transition-transform flex items-center justify-center shrink-0">
                            <Play size={12} fill="currentColor" />
                          </button>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest truncate">Echo {note.duration ? `(${note.duration})` : ''}</p>
                            <div className="flex items-center gap-1.5 opacity-60 mt-0.5">
                               <Calendar size={10} /><span className="text-[9px] font-medium">{note.date}</span>
                            </div>
                          </div>
                          <button onClick={(e) => deleteVoiceNote(e, note.id)} className="p-2 text-rose-200 hover:text-rose-500 transition-colors shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNavPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500"><AlertCircle size={32} /></div>
              <h3 className="text-xl font-serif text-[#5D4037] italic">Wait, {personalization.nickname}!</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">You have an unsaved echo. If you go back now, this recording will be lost forever.</p>
              <div className="flex flex-col gap-3 w-full">
                <button onClick={() => { setShowNavPrompt(false); setHasUnsavedEcho(false); prevScene(); }} className="w-full py-3 bg-rose-50 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Discard Echo</button>
                <button onClick={() => setShowNavPrompt(false)} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Stay & Save it ✨</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene + (showThankYou ? '-thanks' : '')}
            variants={sceneVariants}
            initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            {showThankYou ? (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center justify-center text-center space-y-8 px-10">
                <Heart size={100} className="mx-auto drop-shadow-2xl" style={{ color: themeColors.primary, fill: themeColors.primary }} />
                <h2 className="text-4xl font-serif italic leading-tight" style={{ color: themeColors.primary }}>Thank You, {personalization.nickname}.</h2>
                <p className="font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">You're magic. ✨</p>
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {currentScene === SceneType.CORE && <CoreScene greeting={personalization.introGreeting} onComplete={nextScene} onProgressChange={(p) => p > 0 && p % 20 === 0 && triggerHaptic(10)} />}
                {currentScene === SceneType.NOISE && <NoiseScene nickname={personalization.nickname} onComplete={nextScene} />}
                {currentScene === SceneType.VOUCHER && <VoucherScene title={personalization.voucherTitle} nickname={personalization.nickname} onComplete={nextScene} />}
                {currentScene === SceneType.ECHOES && <MemoryScene title={personalization.memoriesTitle} memories={memories} onUpdateMemories={setMemories} onComplete={nextScene} voiceNotes={voiceNotes} />}
                {currentScene === SceneType.REASONS && <ReasonsScene title={personalization.reasonsTitle} nickname={personalization.nickname} onComplete={nextScene} />}
                {currentScene === SceneType.DREAMS && <DreamsScene title={personalization.dreamsTitle} nickname={personalization.nickname} onComplete={nextScene} allCategories={dreamsData} setAllCategories={setDreamsData} />}
                {currentScene === ('REMEMBER' as any) && <RememberScene nickname={personalization.nickname} onComplete={handleSaveVoiceNote} onStatusChange={setHasUnsavedEcho} />}
                {currentScene === SceneType.PROMISE && <PromiseScene onComplete={nextScene} />}
                {currentScene === SceneType.UNFOLD && <LoveLetterScene title={personalization.letterTitle} nickname={personalization.nickname} onOpen={triggerFinalConfetti} />}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {!showThankYou && (
        <div className="fixed bottom-12 left-0 right-0 flex justify-center items-center gap-1 z-[100] pointer-events-none">
          <div className="flex items-center gap-2 p-2.5 bg-white/50 backdrop-blur-xl rounded-full border border-white shadow-lg pointer-events-auto">
            {ENABLED_SCENES.map((_, i) => (
              <motion.div key={i} animate={{ scale: i === currentIndex ? 1.2 : 1, opacity: i <= currentIndex ? 1 : 0.3 }} className={`flex items-center justify-center ${i === currentIndex ? 'w-8 h-8' : 'w-2 h-2 rounded-full'}`} style={{ backgroundColor: i === currentIndex ? 'transparent' : themeColors.primary }}>
                {i === currentIndex && <Heart size={20} style={{ color: themeColors.primary, fill: themeColors.primary }} />}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
