"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, XCircle, Share2, Copy, X, Check, Users, Activity } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();


interface Receiver {
  id: string;
  name?: string;
  email?: string;
  photo?: string;
}

const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function SenderUI({
  roomCode,
  onExit,
  shareURL,
}: {
  roomCode: string;
  onExit: () => void;
  shareURL: string;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [receivers, setReceivers] = useState<Receiver[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
  const { user } = useUser();
  //invite handler
  async function handleInvite() {
    try {
      setLoading(true);
      console.log("HANDLE INVITE CALLED", email);

      if (!email) return;

      await setDoc(
        doc(db, "rooms", roomCode),
        {
          invitations: arrayUnion({
            email,
            status: "pending",
            invitedAt: Timestamp.now(),
          }),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "notifications", email),
        {
          requests: [
            {
              roomCode,
              status: "pending",
              timestamp: Timestamp.now(),
              expiresAt: Date.now() + 30_000, 
            },
          ],
        },
        { merge: true }
      );

      setEmail("");
      setInviteOpen(false);
      setLoading(false);

      console.log("Invite sent successfully");

    } catch (err) {
      console.error("INVITE ERROR:", err);
      setLoading(false); // always stop loader
    }
  }



  //spacebar added for tap to speak
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !active) {
        e.preventDefault();
        startTalking();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && active) {
        e.preventDefault();
        stopTalking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [active]);

  useEffect(() => {
    if (!user) return;
    const roomRef = doc(db, "rooms", roomCode);

    setDoc(roomRef, {
      sender: {
        id: user.id,
        name: user.fullName || user.username,
        photo: user.imageUrl,
        email: user.primaryEmailAddress?.emailAddress,
      },
      active: true,
      created_at: Timestamp.now(),
    }, { merge: true });

    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/sender/${user.id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        user: {
          id: user?.id,
          name: user?.fullName || user?.username || "Sender",
          photo: user?.imageUrl || null
        }
      }));
    };

    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      const list = [];

      if (data.sender) list.push({ ...data.sender, isSender: true });
      if (data.receivers) list.push(...data.receivers);

      setReceivers(list);
    });

    return () => {
      unsub();
      ws.close();
      stopTalking();
    };
  }, [roomCode, user]);

  function textToMorse(text: string) {
    const map: Record<string, string> = {
      a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".",
      f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
      k: "-.-", l: ".-..", m: "--", n: "-.", o: "---",
      p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
      u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--",
      z: "--..",
      "0": "-----", "1": ".----", "2": "..---", "3": "...--",
      "4": "....-", "5": ".....", "6": "-....", "7": "--...",
      "8": "---..", "9": "----.",
    };
    return text.toLowerCase().split(" ")
      .map((w) => w.split("").map((c) => map[c] || "").join(" "))
      .join(" / ");
  }

  const startTalking = () => {
    if (!SpeechRecognition) return;
    if (recognitionRef.current) return;
    setActive(true);

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e: any) => {
      const result = e.results[e.results.length - 1];
      const text = result[0].transcript.trim();

      if (!text || !result.isFinal) return;

      const morse = textToMorse(text);
      const analysis = sentimentAnalyzer.analyze(text);
      console.log("Sentiment Score:", analysis.score);

      let emotion = "neutral";

      if (analysis.score > 1) emotion = "happy";
      else if (analysis.score < -2) emotion = "angry";
      else if (analysis.score < 0) emotion = "sad";

      console.log("Detected Emotion:", emotion);

      wsRef.current?.send(
        JSON.stringify({
          type: "morse",
          text,
          code: morse,
          emotion,
        })
      );
    };

    rec.start();
  };

  const stopTalking = () => {
    setActive(false);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomCode), (snap) => {
      if (!snap.exists()) return;
      setInvites(snap.data().invitations || []);
    });

    return () => unsub();
  }, [roomCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-5xl flex flex-col items-center p-6 md:p-12 bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 mx-auto shadow-2xl overflow-hidden min-h-[85vh]"
    >
      {inviteOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm">

            <h3 className="text-white font-bold mb-4">
              Invite by Email
            </h3>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              className="w-full p-3 rounded-xl bg-black border border-white/10 text-white"
            />

            <button
              onClick={handleInvite}
              disabled={loading}
              className="mt-4 w-full bg-cyan-600 py-3 rounded-xl text-white"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>

            <button
              onClick={() => setInviteOpen(false)}
              className="mt-2 w-full text-sm text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 mb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => { onExit(); stopTalking(); }} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group">
            <XCircle size={16} className="text-red-500 group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Exit</span>
          </button>
          <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/20 rounded-full transition-all duration-300 group">
            <Share2 size={16} className="text-cyan-400 group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-white">Share</span>
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="text-cyan-400 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full "
          >
            + Add People
          </button>

        </div>

        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
          <div className="flex flex-col items-start border-r border-white/10 pr-4">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Neural Link</span>
            <span className="text-cyan-400 font-mono text-lg md:text-xl font-bold tracking-widest">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Broadcasting</span>
          </div>
        </div>
      </div>

      {/* Mic Section */}
      <div className="flex flex-col items-center justify-center grow w-full z-20">
        <div className="relative h-64 w-64 md:h-72 md:w-72 flex items-center justify-center mb-6">
          <AnimatePresence>
            {active && [1.2, 1.5, 1.8].map((scale, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: scale, opacity: [0, 0.4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.8 }}
                className="absolute inset-0 border-2 border-cyan-400/20 rounded-full"
              />
            ))}
          </AnimatePresence>

          <motion.button
            onMouseDown={startTalking} onMouseUp={stopTalking}
            onTouchStart={(e) => { e.preventDefault(); startTalking(); }}
            onTouchEnd={(e) => { e.preventDefault(); stopTalking(); }}
            whileTap={{ scale: 0.96 }}
            className={`relative z-20 w-44 h-44 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 select-none touch-none cursor-pointer ${active ? "bg-cyan-500 border-cyan-200 shadow-[0_0_80px_rgba(6,182,212,0.4)]" : "bg-slate-950 border-white/5 text-cyan-400 shadow-[0_0_60px_rgba(0,0,0,0.8)] hover:border-cyan-500/30"
              }`}
          >
            <Mic size={48} className={active ? "text-slate-950" : "text-cyan-500"} />
            <p className={`mt-4 text-[9px] font-black uppercase tracking-[0.2em] ${active ? "text-slate-900" : "text-slate-500"}`}>
              {active ? "Broadcasting" : "Hold to Talk"}
            </p>
          </motion.button>
        </div>

        {/* --- WAVEFORM & PULSE SECTION (GAP REDUCED HERE) --- */}
        <div className="flex flex-col items-center gap-4 mb-4 min-h-[60px] w-full max-w-xs">
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex flex-col items-center w-full"
              >
                {/* Waveform Bars */}
                <div className="flex items-end justify-center gap-1.5 h-10 mb-2">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [10, Math.random() * 35 + 10, 10],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5 + Math.random() * 0.5,
                        ease: "easeInOut"
                      }}
                      className="w-1 md:w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4]"
                    />
                  ))}
                </div>
                {/* Status Pulse */}
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-cyan-400/80">Streaming</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Receiver Presence UI */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <Users size={14} className="text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Connected Nodes</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 overflow-y-auto max-h-64 py-4 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {receivers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  className="group relative flex flex-col items-center p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 rounded-[2rem] transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} className="relative w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                    ) : (
                      <div className="relative w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_#22c55e]" />
                  </div>
                  <span className="text-[10px] font-bold text-white text-center truncate w-full px-1">{user.name || "Anonymous"}</span>
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter mt-1">Connected</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-6 max-w-sm w-full relative shadow-2xl">
              <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              <h3 className="text-white font-black uppercase tracking-widest text-sm text-center">Join Neural Link</h3>
              <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]"><QRCodeCanvas value={shareURL} size={180} /></div>
              <p className="text-cyan-400 font-mono text-xl font-bold tracking-[0.3em]">{roomCode}</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => { navigator.clipboard.writeText(shareURL); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center justify-center gap-2 flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"><Share2 size={16} /> Share Link</button>
                <button onClick={() => { navigator.clipboard.writeText(shareURL); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-xl transition-all">{copied ? <Check size={20} /> : <Copy size={18} />}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}