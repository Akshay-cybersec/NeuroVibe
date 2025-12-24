"use client";
import { motion } from "framer-motion";
import { Radio, Activity, XCircle } from "lucide-react";

export function ReceiverUI({ roomCode, onExit }: { roomCode: string, onExit: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="relative w-full max-w-4xl min-h-125 flex flex-col items-center justify-center p-8 bg-slate-900/20 backdrop-blur-3xl rounded-[3rem] border border-white/5"
    >
      {/* Terminate Link Button - Positioned in Top Right */}
      <button 
        onClick={onExit} 
        className="absolute top-8 right-8 group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
          Terminate Link
        </span>
        <XCircle size={16} className="text-red-500 group-hover:text-white" />
      </button>

      {/* Connection Status Header */}
      <div className="mb-12 flex items-center gap-6 px-6 py-2 bg-white/5 rounded-full border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link Active</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-cyan-400 font-mono font-bold tracking-widest">{roomCode}</span>
      </div>

      {/* Pulse Ripple Animation */}
      <div className="relative h-64 w-64 flex items-center justify-center">
        {[1, 1.5, 2].map((scale, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: scale + 1.2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.8 }}
            className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
          />
        ))}
        
        <div className="z-10 bg-slate-950 p-10 rounded-full border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-cyan-400">
          <Radio size={56} className="drop-shadow-[0_0_10px_#06b6d4]" />
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-3">
        <Activity className="text-cyan-500 animate-pulse" size={24} />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
          Receiving Haptic Pulses...
        </p>
      </div>
    </motion.div>
  );
}