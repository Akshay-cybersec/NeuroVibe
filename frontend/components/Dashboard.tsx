"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Radio, ArrowRight, Zap, Copy, Check, ShieldCheck } from "lucide-react";
import { SenderUI } from "./SenderUI";
import { ReceiverUI } from "./ReceiverUI";
import { doc, setDoc, serverTimestamp, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams } from "next/navigation";

export default function VibeDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [role, setRole] = useState<"sender" | "receiver" | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [roomStatus, setRoomStatus] = useState<null | {
    active: boolean;
    receivers: number;
    sender: boolean;
  }>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const shareLink = `${BASE_URL}/join/${generatedCode}`;


  const searchParams = useSearchParams();
  const autoRoom = searchParams.get("room");
  const autoRole = searchParams.get("role");

  useEffect(() => {
    if (autoRoom && autoRole === "receiver") {
      setRoomCode(autoRoom);
      setSessionActive(true);
      setRole("receiver");
    }
  }, [autoRoom, autoRole]);

  useEffect(() => {
    if (!generatedCode) return;

    const unsub = onSnapshot(doc(db, "rooms", generatedCode), (snap) => {
      if (snap.exists()) {
        setRoomStatus(snap.data() as {
          active: boolean;
          receivers: number;
          sender: boolean;
        });
      }
    });

    return () => unsub();
  }, [generatedCode]);

  const handleCreate = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await setDoc(doc(db, "rooms", code), {
      active: true,
      created_at: serverTimestamp(),
      sender: true,
      receivers: 0,
    });

    setGeneratedCode(code);
    setRoomCode(code);
    setRole("sender");
    setSessionActive(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const terminateSession = () => {
    setRole(null);
    setSessionActive(false);
    setRoomCode("");
    setGeneratedCode("");
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const snap = await getDoc(doc(db, "rooms", roomCode));

    if (!snap.exists() || !snap.data().active) {
      alert("Invalid or expired room ❌");
      return;
    }

    setRole(null);
    setSessionActive(true);
  };

  const selectRole = (selectedRole: "sender" | "receiver") => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10" />
      <AnimatePresence mode="wait">
        {!sessionActive ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
            className="w-full max-w-md bg-slate-950/60 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="flex flex-col items-center mb-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-6">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                VibeRoom
              </h2>
              <p className="text-cyan-500/60 text-xs font-bold uppercase tracking-[0.4em] mt-2">
                Encryption Active
              </p>
            </div>

            <div className="space-y-6">
              {!generatedCode ? (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#0891b2" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all text-base"
                >
                  <Zap size={20} fill="currentColor" /> CREATE SESSION
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white/5 border border-cyan-500/30 rounded-2xl flex flex-col gap-6 items-center"
                >
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                    Gateway ID
                  </p>

                  <p className="text-cyan-400 font-mono text-3xl font-black tracking-[0.35em]">
                    {generatedCode}
                  </p>

                  <div className="bg-white p-3 rounded-xl shadow-xl">
                    <QRCodeCanvas value={shareLink} size={110} />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.share
                          ? navigator.share({ url: shareLink })
                          : navigator.clipboard.writeText(shareLink);

                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-3 bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                    >
                      Share Link
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-cyan-700 text-cyan-400 rounded-xl text-xs font-black uppercase tracking-widest"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </motion.div>

              )}

              <div className="relative flex items-center py-4 opacity-50">
                <div className="grow h-px bg-white/10"></div>
                <span className="shrink mx-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  Neural Link
                </span>
                <div className="grow h-px bg-white/10"></div>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 px-6 text-center font-mono tracking-[0.5em] text-white focus:border-cyan-500/50 transition-all outline-none text-lg"
                />
                <motion.button
                  type="submit"
                  whileHover={roomCode.length === 6 ? { scale: 1.02 } : {}}
                  whileTap={roomCode.length === 6 ? { scale: 0.98 } : {}}
                  disabled={roomCode.length < 6}
                  className="w-full py-5 border border-white/10 rounded-2xl text-cyan-400 font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 disabled:opacity-20 transition-all uppercase"
                >
                  Join Link <ArrowRight size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : !role ? (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="w-full max-w-5xl grid md:grid-cols-2 gap-12"
          >
            <RoleCard
              icon={<Mic size={72} />}
              title="I am Speaking"
              desc="Broadcast vocal frequencies. Real-time haptic translation."
              onClick={() => selectRole("sender")}
              color="cyan"
            />
            <RoleCard
              icon={<Radio size={72} />}
              title="I am Feeling"
              desc="Access the neural link. Receive synchronized vibrations."
              onClick={() => selectRole("receiver")}
              color="blue"
            />
          </motion.div>
        ) : (
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

function RoleCard({ icon, title, desc, onClick, color }: any) {
  const isCyan = color === "cyan";
  return (
    <motion.button
      whileHover={{
        y: -16,
        boxShadow: isCyan
          ? "0 30px 60px -12px rgba(6,182,212,0.5)"
          : "0 30px 60px -12px rgba(37,99,235,0.5)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-12 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[4rem] text-left transition-all group relative overflow-hidden"
    >
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] -z-10 transition-colors duration-700 ${isCyan ? "bg-cyan-500/20 group-hover:bg-cyan-500/40" : "bg-blue-600/20 group-hover:bg-blue-600/40"
          }`}
      />

      <div
        className={`mb-12 transition-all duration-500 transform group-hover:scale-110 ${isCyan
          ? "text-cyan-400 group-hover:drop-shadow-[0_0_20px_#06b6d4]"
          : "text-blue-500 group-hover:drop-shadow-[0_0_20px_#2563eb]"
          }`}
      >
        {icon}
      </div>

      <h3 className="text-4xl font-black text-white mb-6 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed text-lg font-medium mb-10">
        {desc}
      </p>

      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
        Initialize Connection{" "}
        <ArrowRight
          size={18}
          className="group-hover:translate-x-2 transition-transform"
        />
      </div>
    </motion.button>
  );
}
