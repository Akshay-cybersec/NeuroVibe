"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Activity, XCircle } from "lucide-react";

export function ReceiverUI({ roomCode, onExit }: { roomCode: string, onExit: () => void }) {
  
  // This effect locks the scroll ONLY when this specific UI is mounted on Desktop/Laptop
  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };

    handleScrollLock();
    window.addEventListener('resize', handleScrollLock);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener('resize', handleScrollLock);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      /* Desktop: Fixed height md:h-[calc(100vh-120px)] prevents overflow.
         Mobile: min-h-[600px] allows scrolling if items stack too tightly.
      */
      className="relative w-full max-w-5xl md:h-[calc(100vh-120px)] min-h-150 flex flex-col items-center justify-between p-6 md:p-12 bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 mx-auto shadow-2xl overflow-hidden"
    >
      {/* 1. TOP SECTION: Responsive Header with Order Control */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 pt-4 md:pt-0">
        
        {/* Terminate Button: Order 1 on mobile (top), md:order-last on desktop (right) */}
        <button 
          onClick={onExit} 
          className="order-1 md:order-last flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
            Terminate Link
          </span>
          <XCircle size={16} className="text-red-500 group-hover:text-white transition-colors" />
        </button>

        {/* Gateway ID Box: Order 2 on mobile (bottom), md:order-first on desktop (left) */}
        <div className="order-2 md:order-first flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
          <div className="flex flex-col items-start border-r border-white/10 pr-4">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Gateway ID</span>
            <span className="text-cyan-400 font-mono text-lg font-bold tracking-widest">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Neural Link Active</span>
          </div>
        </div>
      </div>

      {/* 2. CENTER SECTION: Balanced Pulse Center */}
      <div className="grow flex items-center justify-center relative w-full overflow-hidden py-12 md:py-0">
        <div className="relative h-48 w-48 md:h-72 md:w-72 flex items-center justify-center">
          {[1, 1.5, 2].map((scale, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: scale + 1.2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 1, ease: "easeOut" }}
              className="absolute inset-0 border-2 border-slate-800 rounded-full pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
            />
          ))}
          
          <div className="z-10 bg-slate-950 p-10 md:p-14 rounded-full border border-cyan-900/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-cyan-400">
            <Radio size={64} className="drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
          </div>
        </div>
      </div>
      
      {/* 3. STATUS FOOTER: Professional Label */}
      <div className="flex flex-col items-center gap-3 z-20 pb-4">
        <Activity className="text-cyan-600 animate-pulse w-6 h-6 md:w-8 md:h-8" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs text-center">
          Syncing Haptic Stream...
        </p>
      </div>
    </motion.div>
  );
}