import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneType, Memory, DreamCategory } from './types';
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
import { ChevronLeft, Volume2, VolumeX, Settings, Heart, X, Mic } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('shreyaa_memories');
    return saved ? JSON.parse(saved) : MEMORIES;
  });

  const [dreamsData, setDreamsData] = useState<DreamCategory[]>(() => {
    const saved = localStorage.getItem('shreyaa_dreams');
    return saved ? JSON.parse(saved) : FUTURE_DREAMS_CATEGORIES;
  });

  const [voiceNotes, setVoiceNotes] = useState<any[]>(() => {
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
  }, [voiceNotes]);

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3');
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const startMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
    }
  };

  const currentIndex = ENABLED_SCENES.indexOf(currentScene);

  const nextScene = useCallback(() => {
    startMusic();
    if (currentIndex < ENABLED_SCENES.length - 1) {
      setCurrentScene(ENABLED_SCENES[currentIndex + 1]);
    }
  }, [currentIndex, ENABLED_SCENES]);

  const prevScene = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentScene(ENABLED_SCENES[currentIndex - 1]);
    }
  }, [currentIndex, ENABLED_SCENES]);

  const handleSaveVoiceNote = (data: string) => {
    setVoiceNotes(prev => [...prev, { id: Date.now(), data, date: new Date().toISOString() }]);
    nextScene();
  };

  const triggerFinalConfetti = useCallback(() => {
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
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FFC0CB', '#FF69B4', '#FFD700'], shapes: [heart, 'circle'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#FFC0CB', '#FF69B4', '#FFD700'], shapes: [heart, 'circle'] });
    }, 250);

    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#FFC0CB', '#FF69B4', '#FFB6C1', '#F08080', '#FFD700'], shapes: [heart, 'circle'], scalar: 2 });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#5D4037] flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9F5] to-[#FFE8E8]">
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50">
        <AnimatePresence>
          {currentIndex > 0 && !showThankYou && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={prevScene}
              className="p-4 bg-white/60 backdrop-blur-md rounded-full text-rose-400 shadow-sm border border-white hover:bg-white transition-colors active:scale-90"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {!showThankYou && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 bg-white/60 backdrop-blur-md rounded-full text-rose-400 shadow-sm border border-white hover:bg-white transition-colors active:scale-90"
          >
            <Settings size={24} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-rose-900/10 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xs bg-white rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button onClick={() => setIsSettingsOpen(false)} className="absolute top-6 right-6 text-rose-200 hover:text-rose-400 transition-colors"><X size={24} /></button>
              <h3 className="text-xl font-serif text-rose-500 italic mb-8">Settings</h3>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Music Volume</span>
                    <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1.5 bg-rose-50 rounded-full appearance-none accent-rose-400 cursor-pointer" />
                </div>

                {voiceNotes.length > 0 && (
                  <div className="pt-6 border-t border-rose-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4">Saved Voice Notes</p>
                    <div className="max-h-40 overflow-y-auto space-y-2 custom-scroll pr-2">
                      {voiceNotes.map((note, i) => (
                        <button key={i} onClick={() => new Audio(note.data).play()} className="w-full flex items-center gap-3 p-3 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors text-left">
                          <Mic size={14} />
                          <span className="text-[10px] font-bold">Note {i + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene + (showThankYou ? '-thanks' : '')}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          {showThankYou ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 px-10"
            >
              <Heart size={80} className="text-rose-400 mx-auto fill-rose-400 drop-shadow-xl" />
              <h2 className="text-4xl font-serif text-rose-500 italic leading-tight">Thank You for this journey, Shreyaa.</h2>
              <p className="text-rose-300 font-bold uppercase tracking-[0.2em] text-xs">You are truly one of a kind. ✨</p>
            </motion.div>
          ) : (
            <>
              {currentScene === SceneType.CORE && <CoreScene onComplete={nextScene} />}
              {currentScene === SceneType.NOISE && <NoiseScene onComplete={nextScene} />}
              {currentScene === SceneType.VOUCHER && <VoucherScene onComplete={nextScene} />}
              {currentScene === SceneType.ECHOES && (
                <MemoryScene 
                  memories={memories} 
                  onUpdateMemories={setMemories} 
                  onComplete={nextScene} 
                />
              )}
              {currentScene === SceneType.REASONS && <ReasonsScene onComplete={nextScene} />}
              {currentScene === SceneType.DREAMS && (
                <DreamsScene 
                  onComplete={nextScene} 
                  allCategories={dreamsData} 
                  setAllCategories={setDreamsData} 
                />
              )}
              {currentScene === ('REMEMBER' as any) && <RememberScene onComplete={handleSaveVoiceNote} />}
              {currentScene === SceneType.PROMISE && <PromiseScene onComplete={nextScene} />}
              {currentScene === SceneType.UNFOLD && <LoveLetterScene onOpen={triggerFinalConfetti} />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
      
      {!showThankYou && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-3 z-50 pointer-events-none">
          {ENABLED_SCENES.map((_, i) => (
            <motion.div key={i} className="flex items-center justify-center" animate={{ width: i === currentIndex ? 24 : 8 }}>
              {i === currentIndex ? (
                <motion.div layoutId="progress-active" className="text-rose-400 flex items-center justify-center" initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
                  <Heart size={14} className="fill-rose-400" />
                </motion.div>
              ) : (
                <div className={`h-2 rounded-full transition-all duration-500 w-2 bg-rose-100 ${i < currentIndex ? 'bg-rose-200' : ''}`} />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;