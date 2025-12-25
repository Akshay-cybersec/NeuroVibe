"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Radio, ArrowRight, Zap, Copy, Check, ShieldCheck } from "lucide-react";
import { SenderUI } from "./SenderUI";
import { ReceiverUI } from "./ReceiverUI";

export default function VibeDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [role, setRole] = useState<"sender" | "receiver" | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  // 1. Generate unique session code
  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setCopied(false);
  };

  // 2. Clipboard Logic
  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3. Reset all states to return to Dashboard Home
  const terminateSession = () => {
    setRole(null);
    setSessionActive(false);
    setRoomCode("");
    setGeneratedCode(""); // Optional: clears generated code too
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length >= 4) {
      setSessionActive(true);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10" />
     <AnimatePresence mode="wait">
  {!sessionActive ? (
    <motion.div
      key="setup"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
      /* Reduced padding and max-width for better vertical fit */
      className="w-full max-w-sm bg-slate-950/60 backdrop-blur-3xl border border-white/5 p-8 rounded-4xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent" />

      {/* Tighter header section */}
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">VibeRoom</h2>
        <p className="text-cyan-500/50 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Encryption Active</p>
      </div>

      {/* Compressed spacing (space-y-5 instead of space-y-8) */}
      <div className="space-y-5">
        {!generatedCode ? (
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#0891b2" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="w-full py-4 bg-cyan-600 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-lg transition-all text-sm"
          >
            <Zap size={18} fill="currentColor" /> CREATE SESSION
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 border border-cyan-500/30 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Gateway ID</p>
              <p className="text-cyan-400 font-mono text-xl font-bold tracking-widest">{generatedCode}</p>
            </div>
            <button 
              onClick={copyToClipboard} 
              className="p-3 bg-white/5 hover:bg-cyan-500 rounded-lg transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </motion.div>
        )}

        <div className="relative flex items-center py-1 opacity-50">
          <div className="grow h-px bg-white/10"></div>
          <span className="shrink mx-4 text-slate-500 text-[8px] font-black uppercase tracking-[0.4em]">Neural Link</span>
          <div className="grow h-px bg-white/10"></div>
        </div>

        <form onSubmit={handleJoin} className="space-y-3">
          <input
            type="text"
            placeholder="ENTER CODE"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-4 px-4 text-center font-mono tracking-[0.4em] text-white focus:border-cyan-500/50 transition-all outline-none text-sm"
          />
          <motion.button
            type="submit"
            whileHover={roomCode.length >= 4 ? { scale: 1.02 } : {}}
            whileTap={roomCode.length >= 4 ? { scale: 0.98 } : {}}
            disabled={roomCode.length < 4}
            className="w-full py-4 border border-white/10 rounded-xl text-cyan-400 font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 disabled:opacity-20 transition-all uppercase"
          >
            Join Link <ArrowRight size={16} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  
        ) : !role ? (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="w-full max-w-4xl grid md:grid-cols-2 gap-10"
          >
            <RoleCard 
              icon={<Mic size={56}/>} 
              title="I am Speaking" 
              desc="Broadcast vocal frequencies. Real-time haptic translation." 
              onClick={() => setRole("sender")}
              color="cyan"
            />
            <RoleCard 
              icon={<Radio size={56}/>} 
              title="I am Feeling" 
              desc="Access the neural link. Receive synchronized vibrations." 
              onClick={() => setRole("receiver")}
              color="blue"
            />
          </motion.div>
        ) : (
          /* These UIs now trigger the terminateSession logic */
          role === "sender" ? (
            <SenderUI roomCode={roomCode} onExit={terminateSession} />
          ) : (
            <ReceiverUI roomCode={roomCode} onExit={terminateSession} />
          )
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * HELPER COMPONENT: RoleCard
 */
function RoleCard({ icon, title, desc, onClick, color }: any) {
  const isCyan = color === "cyan";
  return (
    <motion.button 
      whileHover={{ 
        y: -12, 
        boxShadow: isCyan 
          ? "0 25px 50px -12px rgba(6,182,212,0.4)" 
          : "0 25px 50px -12px rgba(37,99,235,0.4)" 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-10 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-left transition-all group relative overflow-hidden"
    >
      <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] -z-10 transition-colors duration-700 ${
        isCyan ? "bg-cyan-500/20 group-hover:bg-cyan-500/30" : "bg-blue-600/20 group-hover:bg-blue-600/30"
      }`} />
      
      <div className={`mb-10 transition-all duration-500 transform group-hover:scale-110 ${
        isCyan 
          ? "text-cyan-400 group-hover:drop-shadow-[0_0_15px_#06b6d4]" 
          : "text-blue-500 group-hover:drop-shadow-[0_0_15px_#2563eb]"
      }`}>
        {icon}
      </div>
      
      <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm font-medium mb-6">{desc}</p>
      
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">
        Initialize Connection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
}