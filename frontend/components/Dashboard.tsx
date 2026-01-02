"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mic, Radio, ArrowRight, Zap, Copy, Check, ShieldCheck, Loader2 } from "lucide-react";
import { SenderUI } from "./SenderUI";
import { ReceiverUI } from "./ReceiverUI";
import { doc, setDoc, serverTimestamp, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function VibeDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [role, setRole] = useState<"sender" | "receiver" | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomStatus, setRoomStatus] = useState<null | {
    active: boolean;
    receivers: number;
    sender: boolean;
  }>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(180px circle at ${x}px ${y}px, black 0%, transparent 100%)`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("dashboard-section")?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const shareLink = `${BASE_URL}/viberoom?room=${generatedCode}`;

  const searchParams = useSearchParams();
  const autoRoom = searchParams.get("room");
  const autoRole = searchParams.get("role");
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);
  const confirmJoin = () => {
    setSessionActive(true);
    setRole("receiver");
    sessionStorage.setItem("haptics", "enabled");

    setShowJoinPrompt(false);
  };


  const cancelJoin = () => {
    setShowJoinPrompt(false);
    window.location.href = "/viberoom";
  };
  useEffect(() => {
    if (autoRoom) {
      setRoomCode(autoRoom);
      setSessionActive(true);
      setShowJoinPrompt(true);
      setRole("receiver");
    }
  }, [autoRoom]);

  useEffect(() => {
    if (autoRoom) {
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
    setIsLoading(true);
    const createPromise = new Promise(async (resolve, reject) => {
      try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        await setDoc(doc(db, "rooms", code), {
          active: true,
          created_at: serverTimestamp(),
          sender: true,
          receivers: [],
        });
        setGeneratedCode(code);
        setRoomCode(code);
        setSessionActive(true);
        setRole(null);
        resolve(code);
      } catch (error) {
        reject(error);
      } finally {
        setIsLoading(false);
      }
    });

    toast.promise(createPromise, {
      loading: 'Generating Secure Gateway...',
      success: 'Neural Link Established!',
      error: 'Connection Failed. Try again.',
    }, {
      style: { borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b' },
      success: { iconTheme: { primary: '#06b6d4', secondary: '#fff' } }
    });
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict check: No spaces and exactly 6 chars
    if (roomCode.length !== 6) {
      toast.error("Code must be exactly 6 characters", {
        style: { borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const snap = await getDoc(doc(db, "rooms", roomCode));
      if (!snap.exists() || !snap.data().active) {
        toast.error("Invalid or Expired Gateway Code", {
          style: { borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }
        });
        return;
      }
      toast.success("Joining Neural Room...");
      setSessionActive(true);
      setRole(null);
    } catch (err) {
      toast.error("Sync Error. Check Connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (selectedRole: "sender" | "receiver") => {
    setRole(selectedRole);
    toast(`Switched to ${selectedRole} mode`, { icon: '🎧' });
  };

  const terminateSession = () => {
    setRole(null);
    setSessionActive(false);
    setRoomCode("");
    setGeneratedCode("");
    toast.error("Connection Terminated");
  };

  return (
    <div id="dashboard-section" className="min-h-screen bg-slate-950 flex items-start justify-center pt-16 md:pt-20 p-6 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] opacity-30" />
        <motion.div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" style={{ WebkitMaskImage: maskImage, maskImage: maskImage }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
      </div>
      {/* change ui here  */}
      {showJoinPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl text-center shadow-lg">
            <p className="text-white text-lg font-bold mb-6">
              Join room <span className="text-cyan-400">{roomCode}</span>?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmJoin}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold"
              >
                Yes, Join
              </button>
              <button
                onClick={cancelJoin}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl font-bold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* end of ui change */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-cyan-400 font-mono text-sm uppercase tracking-[0.3em] animate-pulse">Syncing Neural Link...</p>
          </motion.div>
        )}

        {!sessionActive ? (
          <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }} className="w-full max-w-md bg-slate-950/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="flex flex-col items-center mb-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-6">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">VibeRoom</h2>
              <p className="text-cyan-500/60 text-xs font-bold uppercase tracking-[0.4em] mt-2">Encryption Active</p>
            </div>

            <div className="space-y-6">
              <motion.button whileHover={{ scale: 1.02, backgroundColor: "#0891b2" }} whileTap={{ scale: 0.98 }} onClick={handleCreate} disabled={isLoading} className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all text-base uppercase tracking-widest disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                CREATE SESSION
              </motion.button>

              <div className="relative flex items-center py-4 opacity-50">
                <div className="grow h-px bg-white/10"></div>
                <span className="shrink mx-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Neural Link</span>
                <div className="grow h-px bg-white/10"></div>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={roomCode}
                  onChange={(e) => {
                    // 2. Remove all spaces and special characters, then take only first 6
                    const val = e.target.value.replace(/\s+/g, "").toUpperCase();
                    if (val.length <= 6) {
                      setRoomCode(val);
                    }
                  }}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 px-6 text-center font-mono tracking-[0.5em] text-white focus:border-cyan-500/50 transition-all outline-none text-lg"
                />
                <motion.button
                  type="submit"
                  whileHover={roomCode.length === 6 ? { scale: 1.02 } : {}}
                  whileTap={roomCode.length === 6 ? { scale: 0.98 } : {}}
                  disabled={roomCode.length !== 6 || isLoading}
                  className="w-full py-5 border border-white/10 rounded-2xl text-cyan-400 font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 disabled:opacity-20 transition-all uppercase"
                >
                  Join Link <ArrowRight size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : !role ? (
          <motion.div key="role-selection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl grid md:grid-cols-2 gap-12 z-10">
            <RoleCard icon={<Mic size={72} />} title="I am Speaking" desc="Broadcast vocal frequencies. Real-time haptic translation." onClick={() => selectRole("sender")} color="cyan" />
            <RoleCard icon={<Radio size={72} />} title="I am Feeling" desc="Access the neural link. Receive synchronized vibrations." onClick={() => selectRole("receiver")} color="blue" />
          </motion.div>
        ) : (
          <div className="w-full z-10">
            {role === "sender" ? (
              <SenderUI roomCode={roomCode} onExit={terminateSession} shareURL={shareLink} />
            ) : (
              <ReceiverUI
                roomCode={roomCode}
                onExit={terminateSession}
                onAcceptInvite={(code) => {
                  setRoomCode(code);
                  setSessionActive(true);
                  setRole("receiver");
                }}
              />
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({ icon, title, desc, onClick, color }: any) {
  const isCyan = color === "cyan";
  return (
    <motion.button whileHover={{ y: -16, boxShadow: isCyan ? "0 30px 60px -12px rgba(6,182,212,0.4)" : "0 30px 60px -12px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.98 }} onClick={onClick} className="p-12 bg-slate-900/40 
    backdrop-blur-2xl border border-white/10 rounded-[4rem] text-left transition-all group relative overflow-hidden">
      <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] -z-10 transition-colors duration-700 ${isCyan ? "bg-cyan-500/20" : "bg-blue-600/20"}`} />
      <div className={`mb-12 transition-all duration-500 transform group-hover:scale-110 ${isCyan ? "text-cyan-400 group-hover:drop-shadow-[0_0_20px_#06b6d4]" : "text-blue-500 group-hover:drop-shadow-[0_0_20px_#2563eb]"}`}>
        {icon}
      </div>
      <h3 className="text-4xl font-black text-white mb-6 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-lg font-medium mb-10">{desc}</p>
      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
        Initialize Connection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
      </div>
    </motion.button>
  );
}