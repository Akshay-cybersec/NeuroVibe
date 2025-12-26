"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Radio, Activity, XCircle } from "lucide-react";

export function ReceiverUI({ roomCode, onExit }: { roomCode: string, onExit: () => void }) {
  const [debugText, setDebugText] = useState("");
  const [debugMorse, setDebugMorse] = useState("");
  const [senderOnline, setSenderOnline] = useState(false);
  const [statusText, setStatusText] = useState("Reconnecting…");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  const [barHeights, setBarHeights] = useState<number[]>(Array(10).fill(4));

  function animateBarsForMorse(code: string) {
    const UNIT = 200;
    const sequence: (() => void)[] = [];
    let idx = 0;

    for (const c of code) {
      if (c === ".") {
        sequence.push(() => pulseBars(20));
        sequence.push(() => resetBars());
      } else if (c === "-") {
        sequence.push(() => pulseBars(50));
        sequence.push(() => resetBars());
      } else if (c === " ") {
        sequence.push(() => resetBars());
      } else if (c === "/") {
        sequence.push(() => resetBars());
      }
    }

    function runNext() {
      if (idx < sequence.length) {
        sequence[idx++]();
        setTimeout(runNext, UNIT);
      }
    }
    runNext();
  }

  function pulseBars(strength: number) {
    setBarHeights(Array(10).fill(strength));
  }

  function resetBars() {
    setBarHeights(Array(10).fill(4));
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
    navigator.vibrate(pattern);
  }

  const connectWS = () => {
    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/receiver`);
    wsRef.current = ws;

    ws.onopen = () => {
      setSenderOnline(true);
      setStatusText("Neural Link Active ✔");
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
      reconnectInterval.current = null;
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
      if (wsRef.current) wsRef.current.close();
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
    };
  }, [roomCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-5xl md:h-[calc(100vh-120px)] min-h-150 flex flex-col items-center justify-between p-6 md:p-12 bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 mx-auto shadow-2xl overflow-hidden"
    >
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
              {statusText}
            </span>
          </div>
        </div>
      </div>

      <div className="grow flex items-center justify-center relative w-full overflow-hidden py-12 md:py-0">
        <div className="relative h-48 w-48 md:h-72 md:w-72 flex items-center justify-center">
          {[1, 1.6, 2.3].map((scale, i) => (
            <motion.div
              key={i}
              animate={{ scale: scale, opacity: senderOnline ? 0.35 : 0.1 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.6, ease: "easeOut" }}
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-center gap-1 px-10">
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: h }}
                transition={{ duration: 0.15 }}
                className="w-1.5 bg-cyan-500 rounded-full opacity-80"
              />
            ))}
          </div>

          <div className="z-10 bg-slate-950 p-10 md:p-14 rounded-full border border-cyan-900/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-cyan-400">
            <Radio size={64} />
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl p-4 w-full text-white text-xs mt-4">
        <p><strong>Text:</strong> {debugText || "No text detected"}</p>
        <p><strong>Morse:</strong> {debugMorse || "No morse received"}</p>
      </div>
    </motion.div>
  );
}
