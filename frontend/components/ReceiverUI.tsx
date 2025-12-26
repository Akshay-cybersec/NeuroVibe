"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Activity, XCircle, Users } from "lucide-react";

interface Receiver {
  id: string;
  name?: string;
  email?: string;
  photo?: string;
}

export function ReceiverUI({ roomCode, onExit }: { roomCode: string; onExit: () => void }) {
  const [debugText, setDebugText] = useState("");
  const [debugMorse, setDebugMorse] = useState("");
  const [senderOnline, setSenderOnline] = useState(false);
  const [statusText, setStatusText] = useState("Reconnecting…");
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [barHeights, setBarHeights] = useState<number[]>(Array(10).fill(4));

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  function animateBarsForMorse(code: string) {
    const UNIT = 200;
    const pattern: number[] = [];

    for (const c of code) {
      if (c === ".") pattern.push(20);
      if (c === "-") pattern.push(50);
      if (c === " ") pattern.push(0);
      if (c === "/") pattern.push(0);
    }

    let idx = 0;
    const run = () => {
      if (idx >= pattern.length) return;
      const height = pattern[idx++];
      setBarHeights(Array(10).fill(height > 0 ? height : 4));
      setTimeout(run, UNIT);
    };
    run();
  }

  function vibrateMorse(code: string) {
    const UNIT = 200;
    const pattern: number[] = [];
    for (const c of code) {
      if (c === ".") pattern.push(UNIT, UNIT);
      else if (c === "-") pattern.push(UNIT * 3, UNIT);
      else if (c === " ") pattern.push(UNIT * 3);
      else if (c === "/") pattern.push(UNIT * 7);
    }
    navigator.vibrate?.(pattern);
  }

  const receiverId = useRef(`R-${Math.random().toString(36).substring(2, 8)}`);
  const connectWS = () => {
    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/receiver/${receiverId.current}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setSenderOnline(true);
      setStatusText("Neural Link Active ✔");
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
    };

    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);

      if (d.type === "morse") {
        setDebugText(d.text || "");
        setDebugMorse(d.code || "");
        setStatusText("Neural Link Active ✔");
        animateBarsForMorse(d.code);
        vibrateMorse(d.code);
      }

      if (d.type === "receiver_list") {
        setReceivers(d.users || []);
      }

      if (d.type === "disconnect") {
        setSenderOnline(false);
        setStatusText("Sender Offline");
      }
    };

    ws.onclose = () => {
      setSenderOnline(false);
      setStatusText("Reconnecting…");
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(connectWS, 3000);
      }
    };
  };

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      reconnectInterval.current && clearInterval(reconnectInterval.current);
    };
  }, [roomCode]);

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
            <div className={`w-2 h-2 rounded-full animate-pulse ${
                senderOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"
              }`} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {statusText}
            </span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Exit Session</span>
          <XCircle size={16} className="text-red-500 group-hover:text-white" />
        </button>
      </div>

      {/* UI remains EXACT same below */}
      {/* Equalizer + Receiver list + Transcript */}
      {/* ... (UNCHANGED UI CONTENT BELOW) ... */}
      
      <div className="grow flex flex-col items-center justify-center w-full z-20">
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
              <motion.div
                key={i}
                animate={{ height: h }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"
              />
            ))}
          </div>

          <div className="z-10 bg-slate-950 p-12 md:p-14 rounded-full border border-cyan-900/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-cyan-400">
            <Radio size={56} className={senderOnline ? "animate-pulse" : "opacity-20"} />
          </div>
        </div>

        {/* Receiver list */}
        <div className="w-full max-w-3xl mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <Users size={14} className="text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Network Nodes
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 overflow-y-auto max-h-48 py-2 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {receivers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center p-3 bg-white/[0.03] border border-white/5 rounded-3xl backdrop-blur-sm"
                >
                  <div className="relative mb-2">
                    {user.photo ? (
                      <img src={user.photo} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-white text-center">{user.name || "User"}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Feed */}
        <div className="w-full max-w-2xl bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-cyan-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Live Transcript
              </span>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed">
              <span className="text-slate-500 mr-2">Text:</span>
              {debugText || "Listening for incoming neural patterns..."}
            </p>
            <p className="text-cyan-400/70 font-mono text-[10px] tracking-widest truncate">
              <span className="text-slate-500 mr-2 font-sans italic">Morse:</span>
              {debugMorse || "--- --- ---"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
