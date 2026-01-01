
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RefreshCw, Check, X } from 'lucide-react';

interface Props {
  nickname: string;
  onComplete: (base64Audio: string, durationStr: string) => void;
  onStatusChange?: (isDirty: boolean) => void;
}

const RememberScene: React.FC<Props> = ({ nickname, onComplete, onStatusChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const hasUnsavedData = !!audioUrl && !showConfirm;
    if (onStatusChange) onStatusChange(hasUnsavedData);
  }, [audioUrl, showConfirm, onStatusChange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        setBase64Audio(base64);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration(prev => prev + 1), 1000);
    } catch (err) {
      alert("Please allow microphone access! ✨");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (previewAudioRef.current) previewAudioRef.current.pause();
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      previewAudioRef.current = audio;
      audio.play().catch(e => console.error("Preview failed", e));
    }
  };

  const resetRecording = () => {
    if (previewAudioRef.current) previewAudioRef.current.pause();
    setAudioUrl(null);
    setBase64Audio(null);
    setDuration(0);
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-rose-500 italic">Echoes of Today</h2>
        <p className="text-rose-300 text-[10px] uppercase font-black tracking-widest">Record a voice note for {nickname}</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {isRecording && (
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-rose-200 rounded-full blur-2xl"
          />
        )}
        
        <div className="relative z-10 w-52 h-52 bg-white rounded-[4rem] shadow-2xl border-2 border-rose-50 flex flex-col items-center justify-center gap-4 overflow-hidden">
          {!audioUrl ? (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={isRecording ? stopRecording : startRecording} 
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 text-white shadow-xl scale-110' : 'bg-rose-50 text-rose-400 hover:bg-rose-100'}`}
              >
                {isRecording ? <Square fill="currentColor" size={32} className="animate-pulse" /> : <Mic size={40} />}
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black tracking-widest font-mono ${isRecording ? 'text-rose-500' : 'text-rose-200'}`}>
                  {formatDuration(duration)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <button onClick={playAudio} className="w-24 h-24 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform">
                <Play fill="currentColor" size={32} />
              </button>
              <div className="text-center">
                <span className="text-xs font-bold text-rose-300 font-mono tracking-widest uppercase">Duration: {formatDuration(duration)}</span>
                <div className="flex gap-4 mt-4">
                  <button onClick={resetRecording} className="p-3 bg-rose-50 text-rose-300 rounded-full hover:bg-rose-100 transition-colors">
                    <RefreshCw size={20} />
                  </button>
                  <button 
                    onClick={() => setShowConfirm(true)} 
                    className="px-8 py-3 bg-rose-100 text-rose-500 rounded-full font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-rose-200 transition-colors"
                  >
                    Save Echo ✨
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-rose-900/40 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 max-w-xs text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500"><Mic size={40} /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-[#5D4037] italic">Save this echo?</h3>
                <p className="text-rose-500 font-mono text-lg font-bold tracking-widest">{formatDuration(duration)}</p>
              </div>
              <div className="flex gap-4 w-full">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-rose-50 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Discard</button>
                <button onClick={() => base64Audio && onComplete(base64Audio, formatDuration(duration))} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RememberScene;
