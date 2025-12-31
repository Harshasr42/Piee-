import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RefreshCw } from 'lucide-react';

interface Props {
  onComplete: (base64Audio: string) => void;
}

const RememberScene: React.FC<Props> = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

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
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
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
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-serif text-rose-500 italic">Echoes of Today</h2>
        <p className="text-rose-300 text-[10px] uppercase font-black tracking-widest">Record a voice note for Shreyaa</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="relative z-10 w-48 h-48 bg-white rounded-[3rem] shadow-xl border-2 border-rose-50 flex flex-col items-center justify-center gap-4 overflow-hidden">
          {!audioUrl ? (
            <button onClick={isRecording ? stopRecording : startRecording} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 text-white shadow-xl' : 'bg-rose-50 text-rose-400'}`}>
              {isRecording ? <Square fill="currentColor" size={32} /> : <Mic size={40} />}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <button onClick={playAudio} className="w-24 h-24 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl">
                <Play fill="currentColor" size={32} />
              </button>
              <div className="flex gap-4">
                <button onClick={() => setAudioUrl(null)} className="p-3 bg-rose-50 text-rose-300 rounded-full"><RefreshCw size={20} /></button>
                <button onClick={() => base64Audio && onComplete(base64Audio)} className="px-6 py-2 bg-rose-100 text-rose-500 rounded-full font-black uppercase text-[10px]">Save ✨</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RememberScene;