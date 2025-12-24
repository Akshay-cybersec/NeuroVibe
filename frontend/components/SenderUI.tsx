"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Power, XCircle } from "lucide-react";

export function SenderUI({ roomCode, onExit }: { roomCode: string, onExit: () => void }) {
  const [active, setActive] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="relative w-full max-w-4xl min-h-125 flex flex-col items-center justify-center p-8 bg-slate-900/20 backdrop-blur-3xl rounded-[3rem] border border-white/5"
    >
      {/* Disconnect/Terminate Button - Positioned in Top Right */}
      <button 
        onClick={onExit} 
        className="absolute top-8 right-8 group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
          Disconnect Session
        </span>
        <XCircle size={16} className="text-red-500 group-hover:text-white" />
      </button>

      {/* Neural Link Header */}
      <div className="mb-12 flex items-center gap-6 px-8 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Neural Link</span>
          <span className="text-cyan-400 font-mono text-xl font-bold tracking-widest">{roomCode}</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
           <span className="text-[10px] text-white font-black uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Main Broadcast Interface */}
      <div className="relative flex items-center justify-center p-10">
        {/* Animated Background Rings */}
        <motion.div 
          animate={active ? { scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-87.5 h-w-87.5 border border-cyan-500/10 rounded-full" 
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          onTouchStart={() => setActive(true)}
          onTouchEnd={() => setActive(false)}
          className={`relative z-20 w-52 h-52 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 ${
            active 
            ? "bg-cyan-500 border-cyan-300 shadow-[0_0_80px_rgba(6,182,212,0.4)]" 
            : "bg-slate-950 border-white/5 text-cyan-400 shadow-2xl"
          }`}
        >
          <Mic size={56} className={active ? "text-slate-950" : "text-cyan-500"} />
          <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${active ? "text-slate-900" : "text-slate-500"}`}>
            {active ? "Broadcasting..." : "Hold to Broadcast"}
          </p>
        </motion.button>

        {/* Liquid Waveform Animation */}
        {active && (
          <div className="absolute flex items-end gap-1.5 h-24 -bottom-2.5">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, Math.random() * 60 + 20, 10] }}
                transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                className="w-1.5 bg-cyan-400/60 rounded-full shadow-[0_0_10px_#06b6d4]"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">
          Encrypted Vocal Stream Terminal
        </p>
      </div>
    </motion.div>
  );
}