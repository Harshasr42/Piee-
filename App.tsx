
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneType, Memory, DreamCategory } from './types';
import { MEMORIES, FUTURE_DREAMS_CATEGORIES } from './constants';
import CoreScene from './components/scenes/CoreScene';
import NoiseScene from './components/scenes/NoiseScene';
import VoucherScene from './components/scenes/VoucherScene';
import MemoryScene from './components/scenes/MemoryScene';
import UnfoldScene from './components/scenes/UnfoldScene';
import ReasonsScene from './components/scenes/ReasonsScene';
import PromiseScene from './components/scenes/PromiseScene';
import DreamsScene from './components/scenes/DreamsScene';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  // --- PERSISTENCE & STATE ---
  
  // Define active scenes
  const ENABLED_SCENES = useMemo(() => [
    SceneType.CORE,
    SceneType.NOISE,
    SceneType.VOUCHER,
    SceneType.ECHOES,
    SceneType.REASONS,
    SceneType.DREAMS,
    SceneType.PROMISE,
    SceneType.UNFOLD
  ], []);

  const [currentScene, setCurrentScene] = useState<SceneType>(ENABLED_SCENES[0]);

  // Persistent memories state
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('shreyaa_memories');
    return saved ? JSON.parse(saved) : MEMORIES;
  });

  // Persistent dreams state
  const [dreamsData, setDreamsData] = useState<DreamCategory[]>(() => {
    const saved = localStorage.getItem('shreyaa_dreams');
    return saved ? JSON.parse(saved) : FUTURE_DREAMS_CATEGORIES;
  });

  // Effect to save data on changes
  useEffect(() => {
    localStorage.setItem('shreyaa_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('shreyaa_dreams', JSON.stringify(dreamsData));
  }, [dreamsData]);

  // --- BACKGROUND EFFECTS ---
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
    document.body.appendChild(container);

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'absolute text-rose-200/20 text-xl pointer-events-none';
      p.innerHTML = Math.random() > 0.5 ? '♥' : '✨';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100}vh`;
      p.animate([
        { transform: 'translateY(0) rotate(0deg) scale(0.8)', opacity: 0.1 },
        { transform: `translateY(-150px) rotate(${Math.random() * 360}deg) scale(1.5)`, opacity: 0.4 },
        { transform: 'translateY(-300px) rotate(0deg) scale(0.5)', opacity: 0 }
      ], {
        duration: Math.random() * 10000 + 5000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      container.appendChild(p);
    }

    return () => { if (container && document.body.contains(container)) document.body.removeChild(container); };
  }, []);

  // --- NAVIGATION ---
  const currentIndex = ENABLED_SCENES.indexOf(currentScene);

  const nextScene = useCallback(() => {
    if (currentIndex < ENABLED_SCENES.length - 1) {
      setCurrentScene(ENABLED_SCENES[currentIndex + 1]);
    }
  }, [currentIndex, ENABLED_SCENES]);

  const prevScene = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentScene(ENABLED_SCENES[currentIndex - 1]);
    }
  }, [currentIndex, ENABLED_SCENES]);

  const triggerFinalConfetti = useCallback(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const heart = confetti.shapeFromPath({ path: 'M0 10 C1.5 1.5 7.5 -1.5 10 3 C12.5 -1.5 18.5 1.5 20 10 C20 13 12 20 10 23 C8 20 0 13 0 10 Z' });

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FFC0CB', '#FF69B4', '#FFD700'], shapes: [heart, 'circle'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#FFC0CB', '#FF69B4', '#FFD700'], shapes: [heart, 'circle'] });
    }, 250);

    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#FFC0CB', '#FF69B4', '#FFB6C1', '#F08080', '#FFD700'], shapes: [heart, 'circle'], scalar: 2 });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#5D4037] flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9F5] to-[#FFE8E8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,182,193,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Global Navigation Overlay */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.button
            key="prev"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={prevScene}
            className="fixed top-6 left-6 z-50 p-4 bg-white/60 backdrop-blur-md rounded-full text-rose-400 shadow-sm border border-white hover:bg-white transition-colors active:scale-90"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
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
          {currentScene === SceneType.PROMISE && <PromiseScene onComplete={nextScene} />}
          {currentScene === SceneType.UNFOLD && <UnfoldScene onOpen={triggerFinalConfetti} />}
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-1.5 z-50 pointer-events-none">
        {ENABLED_SCENES.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-rose-400' : 'w-2 bg-rose-100'}`} />
        ))}
      </div>
    </div>
  );
};

export default App;
