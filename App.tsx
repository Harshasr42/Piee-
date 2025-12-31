
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneType, Memory } from './types';
import { MEMORIES } from './constants';
import CoreScene from './components/scenes/CoreScene';
import NoiseScene from './components/scenes/NoiseScene';
import VoucherScene from './components/scenes/VoucherScene';
import EchoScene from './components/scenes/EchoScene';
import UnfoldScene from './components/scenes/UnfoldScene';
import ReasonsScene from './components/scenes/ReasonsScene';
import PromiseScene from './components/scenes/PromiseScene';
import DreamsScene from './components/scenes/DreamsScene';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneType>(SceneType.CORE);
  const [memories, setMemories] = useState<Memory[]>(MEMORIES);

  // Heart-shaped floating sparkles background
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

    return () => { if (document.body.contains(container)) document.body.removeChild(container); };
  }, []);

  const triggerFinalConfetti = useCallback(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const heart = confetti.shapeFromPath({ path: 'M0 10 C1.5 1.5 7.5 -1.5 10 3 C12.5 -1.5 18.5 1.5 20 10 C20 13 12 20 10 23 C8 20 0 13 0 10 Z' });

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFC0CB', '#FF69B4', '#FFD700'],
        shapes: [heart, 'circle']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFC0CB', '#FF69B4', '#FFD700'],
        shapes: [heart, 'circle']
      });
    }, 250);

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FF69B4', '#FFB6C1', '#F08080', '#FFD700'],
      shapes: [heart, 'circle'],
      scalar: 2
    });
  }, []);

  const nextScene = () => {
    const scenes = Object.values(SceneType);
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  const updateMemories = (newMemories: Memory[]) => {
    setMemories(newMemories);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#5D4037] flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9F5] to-[#FFE8E8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,182,193,0.1),transparent_70%)] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -30 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          {currentScene === SceneType.CORE && <CoreScene onComplete={nextScene} />}
          {currentScene === SceneType.NOISE && <NoiseScene onComplete={nextScene} />}
          {currentScene === SceneType.VOUCHER && <VoucherScene onComplete={nextScene} />}
          {currentScene === SceneType.ECHOES && (
            <EchoScene 
              memories={memories} 
              onUpdateMemories={updateMemories} 
              onComplete={nextScene} 
            />
          )}
          {currentScene === SceneType.REASONS && <ReasonsScene onComplete={nextScene} />}
          {currentScene === SceneType.DREAMS && <DreamsScene onComplete={nextScene} />}
          {currentScene === SceneType.PROMISE && <PromiseScene onComplete={nextScene} />}
          {currentScene === SceneType.UNFOLD && <UnfoldScene onOpen={triggerFinalConfetti} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
