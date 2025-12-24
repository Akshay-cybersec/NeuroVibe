"use client";
import { motion } from "framer-motion";
import { Lock, Users, Activity } from "lucide-react";

export const PrivacyRoom = () => (
  <section id="privacy" className="py-24 px-6 bg-slate-900/30">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
          <Lock className="text-cyan-400" />
        </div>
        <h2 className="text-4xl font-bold text-white">Secure VibeRooms</h2>
        <p className="text-slate-400 text-lg">
          Communication is personal. Our "Privacy Room" feature works like a secure video call, 
          but for data. Audio is processed via <strong>Local NLP</strong>, ensuring your 
          conversations never touch a cloud server. 
        </p>
        <ul className="space-y-4">
          {["End-to-End Encryption (E2EE)", "Peer-to-Peer Haptic Streaming", "Zero Data Logging Policy"].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
      
      <div className="relative p-8 bg-slate-800/40 rounded-3xl border border-slate-700 backdrop-blur-sm">
         <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
            <span className="flex items-center gap-2 text-slate-300"><Users size={18}/> 2 Participants</span>
            <span className="text-green-400 flex items-center gap-2 italic"><Activity size={18}/> Encrypted</span>
         </div>
         <div className="space-y-4 text-white">
            <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse" />
            <div className="mt-10 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 text-center font-mono">
              Translating Audio to Haptic...
            </div>
         </div>
      </div>
    </div>
  </section>
);