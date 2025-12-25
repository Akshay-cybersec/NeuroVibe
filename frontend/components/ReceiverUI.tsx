"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Radio, Activity, XCircle } from "lucide-react";

export function ReceiverUI({ roomCode, onExit }: { roomCode: string, onExit: () => void }) {

  const [intensity, setIntensity] = useState(0);
  const [senderOnline, setSenderOnline] = useState(true);
  const [statusText, setStatusText] = useState("Syncing Haptic Stream...");
  const [alert, setAlert] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const signalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleVibration = (strength: number) => {
    if ("vibrate" in navigator) {
      const duration = Math.min(strength * 10, 250);
      navigator.vibrate(duration);
    }
  };

  const connectWS = () => {
    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/sender`);
    wsRef.current = ws;

    ws.onopen = () => {
      setSenderOnline(true);
      setAlert(null);
      setStatusText("Stream Active");

      if (signalTimeoutRef.current) clearTimeout(signalTimeoutRef.current);
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);

        if (d.type === "ping") {
          setSenderOnline(true);
          setStatusText("Stream Active");
          return;
        }

        if (d.type === "speech" && d.intensity !== undefined) {
          setSenderOnline(true);
          const val = Math.min(Math.max(d.intensity, 0), 100);
          setIntensity(val);
          handleVibration(val);

          if (signalTimeoutRef.current) clearTimeout(signalTimeoutRef.current);
          signalTimeoutRef.current = setTimeout(() => {
            setIntensity(0);
            setSenderOnline(false);
            setStatusText("Waiting for Signal...");
          }, 2000);

          if (val > 70) setStatusText("High Intensity");
          else if (val > 40) setStatusText("Medium Intensity");
          else if (val > 0) setStatusText("Low Intensity");
          else setStatusText("Listening...");
        }
      } catch (_) { }
    };


    ws.onclose = () => {
      setSenderOnline(false);
      setStatusText("Reconnecting...");
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          connectWS();
        }, 3000);
      }
    };
  };

  useEffect(() => {
    const resizeHandler = () => {
      document.body.style.overflow = window.innerWidth < 1024 ? "unset" : "hidden";
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    connectWS();

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("resize", resizeHandler);
      if (wsRef.current) wsRef.current.close();
      if (signalTimeoutRef.current) clearTimeout(signalTimeoutRef.current);
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
    };
  }, [roomCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-5xl md:h-[calc(100vh-120px)] min-h-150 flex flex-col items-center justify-between p-6 md:p-12 bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 mx-auto shadow-2xl overflow-hidden"
    >
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider z-50"
        >
          {alert}
        </motion.div>
      )}

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 pt-4 md:pt-0">
        <button
          onClick={onExit}
          className="order-1 md:order-last flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
            Exit Session
          </span>
          <XCircle size={16} className="text-red-500 group-hover:text-white transition-colors" />
        </button>

        <div className="order-2 md:order-first flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
          <div className="flex flex-col items-start border-r border-white/10 pr-4">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Gateway ID</span>
            <span className="text-cyan-400 font-mono text-lg font-bold tracking-widest">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${senderOnline ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              {senderOnline ? "Neural Link Active" : "Reconnecting..."}
            </span>
          </div>
        </div>
      </div>

      <div className="grow flex items-center justify-center relative w-full overflow-hidden py-12 md:py-0">
        <div className="relative h-48 w-48 md:h-72 md:w-72 flex items-center justify-center">
          {[1, 1.5, 2].map((scale, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{ scale: scale + (intensity / 50), opacity: senderOnline ? 0.4 : 0.1 }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.6, ease: "easeOut" }}
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-full pointer-events-none"
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-center gap-1 px-10">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: intensity > 0 ? Math.random() * intensity + 10 : 4 }}
                transition={{ duration: 0.25, repeat: Infinity, repeatType: "reverse", delay: i * 0.02 }}
                className="w-1.5 bg-cyan-500 rounded-full opacity-80"
              />
            ))}
          </div>

          <div className="z-10 bg-slate-950 p-10 md:p-14 rounded-full border border-cyan-900/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-cyan-400">
            <Radio size={64} className="drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 z-20 pb-4">
        <Activity className="text-cyan-600 w-6 h-6 md:w-8 md:h-8" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs text-center">
          {statusText} | {intensity}%
        </p>
      </div>
    </motion.div>
  );
}
