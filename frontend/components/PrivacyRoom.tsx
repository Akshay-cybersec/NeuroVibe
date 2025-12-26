"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, ShieldCheck, Activity, Brain, Fingerprint, Waves, Key } from "lucide-react";
import { useRef } from "react";

export const PrivacyRoom = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateDial = useTransform(scrollYProgress, [0.2, 0.5], [0, 360]);
  const lockOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} id="privacy" className="py-32 px-6 bg-slate-950 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div style={{ opacity: lockOpacity }} className="space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> Local-Only Processing
          </div>
          
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
            Secure <span className="text-cyan-500 italic">VibeRooms</span>
          </h2>
          
          <p className="text-slate-400 text-xl leading-relaxed font-light">
            Audio is processed via **Local NLP**, ensuring your private conversations never touch a cloud server.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: <Lock size={18}/>, text: "End-to-End Encryption (E2EE)" },
              { icon: <Waves size={18}/>, text: "Peer-to-Peer Haptic Streaming" },
              { icon: <Fingerprint size={18}/>, text: "Zero Data Logging Policy" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-cyan-500">{item.icon}</div>
                <span className="text-slate-300 font-medium tracking-tight">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- MECHANICAL LOCK ILLUSION BOX --- */}
        <div className="relative aspect-square">
          <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
          
          <motion.div 
            className="relative h-full w-full bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl p-12 flex items-center justify-center overflow-hidden"
          >
            {/* combination Dial Animation */}
            <motion.div 
              style={{ rotate: rotateDial }}
              className="absolute w-[80%] h-[80%] rounded-full border-12 border-slate-800 flex items-center justify-center opacity-40"
            >
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-1 h-4 bg-slate-700" 
                  style={{ transform: `rotate(${i * 30}deg) translateY(-140px)` }} 
                />
              ))}
            </motion.div>

            {/* Inner Vault Door */}
            <motion.div 
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              className="relative z-10 w-48 h-48 rounded-full bg-slate-950 border-4 border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.3)]"
            >
              {/* Spinning Inner "Gear" */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30"
              />
              
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Brain size={48} className="drop-shadow-[0_0_15px_#06b6d4]" />
                </motion.div>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-mono uppercase tracking-widest">Secure</span>
                </div>
              </div>
            </motion.div>

            {/* "Scanning" laser bar */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-20 blur-sm pointer-events-none"
            />
            
            {/* Lock Status Footer */}
            <div className="absolute bottom-10 flex items-center gap-3">
               <Key size={14} className="text-slate-500" />
               <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">
                 LOCAL_AES_256_ACTIVE
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};