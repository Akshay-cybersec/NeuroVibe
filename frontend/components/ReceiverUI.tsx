"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Activity, XCircle, Users } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface Member {
  id: string;
  name: string;
  photo: string | null;
}

export function ReceiverUI({ roomCode, onExit }: { roomCode: string; onExit: () => void }) {
  const roomRef = doc(db, "rooms", roomCode);
  const { user, isLoaded } = useUser();

  const wsRef = useRef<WebSocket | null>(null);
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  const [senderOnline, setSenderOnline] = useState(false);
  const [statusText, setStatusText] = useState("Connecting…");
  const [members, setMembers] = useState<Member[]>([]);
  const [debugText, setDebugText] = useState("");
  const [debugMorse, setDebugMorse] = useState("");
  const [barHeights, setBarHeights] = useState<number[]>(Array(10).fill(4));
  
  useEffect(() => {
    navigator.vibrate?.(1);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/receiver`);
    wsRef.current = ws;

    ws.onopen = () => {
      setSenderOnline(true);
      setStatusText("Neural Link Active ✔");
      ws.send(JSON.stringify({
        user: {
          id: user?.id,
          name: user?.fullName || user?.username || "Receiver",
          photo: user?.imageUrl || null
        }
      }));
    };

    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);

      if (d.type === "morse") {
        setDebugText(d.text);
        setDebugMorse(d.code);

        const emotion = d.emotion || "neutral";
        console.log("Received emotion:", emotion);

        let intensity = 1;

        switch (emotion) {
          case "happy":
            intensity = 2;
            break;
          case "sad":
            intensity = 0.5;
            break;
          case "angry":
            intensity = 3;
            break;
          default:
            intensity = 1;
        }

        animateBars(d.code, intensity);
        vibrateMorse(d.code, intensity);
      }

      if (d.type === "disconnect") {
        setSenderOnline(false);
        setStatusText("Sender Offline");
      }
    };

    ws.onclose = () => {
      setSenderOnline(false);
      setStatusText("Sender Offline");
    };

    return () => ws.close();
  }, [roomCode]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const receiverData: Member = {
      id: user.id,
      name: user.fullName || user.username || "Receiver",
      photo: user.imageUrl || null
    };

    updateDoc(roomRef, {
      receivers: arrayUnion(receiverData)
    }).catch(console.error);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      setSenderOnline(!!data.sender);
      setStatusText(data.sender ? "Neural Link Active ✔" : "Sender Offline");

      const list: Member[] = [];
      if (data.sender) list.push({ ...data.sender, isSender: true });
      if (Array.isArray(data.receivers)) list.push(...data.receivers);

      const filtered = list.filter(m => m.id !== user?.id);

      setMembers(filtered);
    });

    return () => {
      updateDoc(roomRef, {
        receivers: arrayRemove(receiverData)
      }).catch(console.error);

      unsub();
    };
  }, [isLoaded, user]);

  function vibrateMorse(code: string, intensity: number = 1) {
    const UNIT = 200 * intensity;
    const pattern: number[] = [];

    for (const c of code) {
      if (c === ".") pattern.push(UNIT);
      else if (c === "-") pattern.push(UNIT * 3);
      else pattern.push(UNIT);
    }

    navigator.vibrate?.(pattern);
  }


  function animateBars(code: string, intensity: number = 1) {
    const UNIT = 200;
    const pulse = code.split("").map((c) =>
      c === "."
        ? 30 * intensity
        : c === "-"
          ? 60 * intensity
          : 4
    );

    let i = 0;

    const step = () => {
      if (i >= pulse.length) return;
      setBarHeights(Array(10).fill(pulse[i]));
      i++;
      setTimeout(step, UNIT);
    };

    step();
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-5xl flex flex-col items-center p-6 md:p-12 bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 mx-auto shadow-2xl overflow-hidden min-h-[85vh]"
    >
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 mb-8">
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
          <div className="flex flex-col items-start border-r border-white/10 pr-4">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Gateway ID</span>
            <span className="text-cyan-400 font-mono text-lg font-bold tracking-widest">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${senderOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"}`} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{statusText}</span>
          </div>
        </div>

        <button onClick={onExit} className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Exit Session</span>
          <XCircle size={16} className="text-red-500 group-hover:text-white" />
        </button>
      </div>

      {/* Center UI */}
      <div className="grow flex flex-col items-center justify-center w-full z-20">
        {/* Visualization */}
        <div className="relative h-56 w-56 md:h-72 md:w-72 flex items-center justify-center mb-10">
          {[1, 1.6, 2.3].map((scale, i) => (
            <motion.div
              key={i}
              animate={{ scale, opacity: senderOnline ? [0.1, 0.3, 0.1] : 0.05 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.6 }}
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-center gap-1.5 pb-12 px-12">
            {barHeights.map((h, i) => (
              <motion.div key={i} animate={{ height: h }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
            ))}
          </div>

          <div className="z-10 bg-slate-950 p-12 md:p-14 rounded-full border border-cyan-900/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-cyan-400">
            <Radio size={56} className={senderOnline ? "animate-pulse" : "opacity-20"} />
          </div>
        </div>

        {/* Member List */}
        <div className="w-full max-w-3xl mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users size={14} className="text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Network Nodes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {members.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center p-3 bg-white/[0.03] border border-white/5 rounded-3xl">
                  <img src={m.photo || ""} className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
                  <span className="text-[9px] font-bold text-white mt-1">{m.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Transcript */}
        <div className="w-full max-w-2xl bg-black/40 border border-white/5 rounded-2xl p-5">
          <p className="text-white text-sm"><span className="text-slate-500 mr-2">Text:</span>{debugText || "Waiting…"}</p>
          <p className="text-cyan-400/70 font-mono text-[10px]"><span className="text-slate-500 mr-2">Morse:</span>{debugMorse || "---"}</p>
        </div>
      </div>
    </motion.div>
  );
}
