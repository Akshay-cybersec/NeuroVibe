"use client";
import { motion } from "framer-motion";

export const Hero = () => (
  <section className="relative pt-40 pb-20 px-6 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent -z-10" />
    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest">
          Next-Gen Accessibility
        </span>
        <h1 className="mt-8 text-6xl md:text-8xl font-black tracking-tight leading-none text-white">
          Feel the <span className="text-cyan-500">Conversation.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          NeuroVibe translates spoken language into real-time haptic patterns. 
          Designed for the Deaf-Blind, empowering universal connection through touch.
        </p>
      </motion.div>
    </div>
  </section>
);