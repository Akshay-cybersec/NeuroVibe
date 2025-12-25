"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, Variants } from "framer-motion"; // Added Variants type
import { Brain, Fingerprint, Activity, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

const TRAINING_STAGES = [
  {
    title: "Stage 1: Isolation",
    icon: <Fingerprint />,
    desc: "Trainees identify isolated vibration signatures until they become instinctual muscle memory.",
    color: "from-cyan-500/20",
  },
  {
    title: "Stage 2: Synthesis",
    icon: <Activity />,
    desc: "Individual letters merge into semantic 'chunks' like digraphs to bypass mental translation.",
    color: "from-blue-500/20",
  },
  {
    title: "Stage 3: Rhythm",
    icon: <Brain />,
    desc: "The focus shifts to linguistic cadence, mastering the pauses that define sentence structure.",
    color: "from-indigo-500/20",
  },
  {
    title: "Stage 4: Immersion",
    icon: <GraduationCap />,
    desc: "Complete tactile literacy where complex data is perceived as a holistic 'vibe' rather than code.",
    color: "from-purple-500/20",
  },
];

// FIX: Explicitly typed as Variants and used valid Easing strings/arrays
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" // Framer Motion expects specific string literal values
    } 
  },
};

export default function TrainingAwareness() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      {/* Hero Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto pt-52 pb-20 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block"
          >
            The Learning Path
          </motion.span>
          {/* Tailwind Fix: bg-linear-to-b */}
          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent mb-8 leading-tight tracking-tighter">
            Cognitive Tactile <br />Integration
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            We bridge the gap between silence and connection by retraining the brain to interpret complex haptic rhythms as fluent language.
          </p>
        </motion.div>

        {/* Methodology Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32"
        >
          {TRAINING_STAGES.map((stage, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors"
            >
              {/* Tailwind Fix: bg-linear-to-br */}
              <div className={`absolute inset-0 bg-linear-to-br ${stage.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="mb-8 p-4 bg-slate-800 rounded-2xl w-fit text-cyan-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {stage.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors tracking-tight">{stage.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                {stage.desc}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* --- REAL-WORLD EXAMPLES SECTION --- */}
<motion.section 
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="mb-32"
>
  <div className="text-center mb-16">
    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">NeuroVibe in Action</h2>
    <p className="text-slate-400 max-w-2xl mx-auto">See how simple tactile pulses transform into complex communication through trained association.</p>
  </div>

  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        title: "The 'Doorbell' Signature",
        desc: "A rhythmic triple-pulse pattern. After training, a user doesn't 'count' the pulses; they simply feel the 'presence' of someone at the door.",
        icon: "🔔",
      },
      {
        title: "Conversational Flow",
        desc: "Feeling a sharp 'E' vibration (single quick tap) allows a user to identify common words like 'The' or 'He' instantly by their haptic shape.",
        icon: "💬",
      },
      {
        title: "Emergency Alerts",
        desc: "High-intensity, continuous vibrations. The brain recognizes this 'urgent texture' immediately as a signal for danger or immediate attention.",
        icon: "🚨",
      },
    ].map((example, i) => (
      <div key={i} className="p-8 bg-slate-900/30 border border-slate-800 rounded-3xl hover:border-cyan-500/30 transition-all group">
        <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
          {example.icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
          {example.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {example.desc}
        </p>
      </div>
    ))}
  </div>
</motion.section>

        {/* Informational Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-slate-900/30 border border-slate-800/50 rounded-[3rem] p-8 md:p-16 mb-32 backdrop-blur-md relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">Tactile Memory & <br /> <span className="text-cyan-500">Neuroplasticity</span></h2>
              <div className="space-y-6">
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  Through <strong>Cross-Modal Plasticity</strong>, the human brain demonstrates the remarkable ability to repurpose auditory and visual processing centers for haptic data.
                </p>
                <ul className="space-y-4">
                  {['Neural rewiring through repetition', 'Direct sensory language perception', 'Eliminating mental translation latency'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Neuro-Processing Visualizer */}
            {/* Tailwind Fix: rounded-4xl, h-px, w-px */}
            <div className="relative aspect-square rounded-4xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-cyan-500/50 animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-cyan-500/50 animate-pulse" />
               </div>
               <div className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-32 h-32 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-400 bg-cyan-500/10"
                  >
                    <Brain size={48} />
                  </motion.div>
                  <div className="mt-6 space-y-2">
                    <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: [-200, 200] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-1/2 h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" 
                      />
                    </div>
                    <p className="text-[10px] text-cyan-500 text-center font-mono uppercase tracking-widest">Processing Tactile Input</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center bg-linear-to-b from-slate-900/50 to-transparent p-16 rounded-[3rem] border border-slate-800/50"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Master the Haptic Standard</h2>
          <Link href="/hapticfeedback">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-cyan-500 text-slate-300 px-10 py-5
               rounded-2xl font-black text-lg transition-all flex items-center gap-3 mx-auto"
            >
              Explore Haptic Alphabet
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}