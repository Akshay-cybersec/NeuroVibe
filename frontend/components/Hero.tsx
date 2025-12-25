"use client";
import { motion } from "framer-motion";

export const Hero = () => (
  <section className="relative pt-32 md:pt-40 pb-20 px-4 md:px-6 overflow-hidden min-h-[70vh] flex items-center">
    {/* Background Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent -z-10" />
    
    <div className="w-full max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
          Next-Gen Accessibility
        </span>

        {/* FIXED TYPOGRAPHY: 
          1. Changed text-6xl to text-4xl on mobile to prevent overflow.
          2. Added break-words and hyphens-auto as a safety net.
        */}
        <h1 className="mt-6 md:mt-8 text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] text-white wrap-break-words">
          Feel the <br className="block md:hidden" /> 
          <span className="text-cyan-500">Conversation.</span>
        </h1>

        <p className="mt-6 md:mt-8 text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
          NeuroVibe translates spoken language into real-time haptic patterns. 
          Designed for the <span className="text-slate-200">Deaf-Blind</span>, empowering universal connection through touch.
        </p>
      </motion.div>
    </div>
  </section>
);