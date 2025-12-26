"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, XCircle, Activity, Share2, Copy, QrCode, X, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

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
  const [active, setActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);

  const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/sender`);
    wsRef.current = ws;

    return () => {
      ws.close();
      stopTalking();
    };
  }, [roomCode]);

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
    return text
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word
          .split("")
          .map((c) => map[c] || "")
          .join(" ")
      )
      .join(" / ");
  }

  const startTalking = () => {
    if (!SpeechRecognition) return;
    if (recognitionRef.current) return;

    setActive(true);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (e: any) => {
      const text = e.results[e.results.length - 1][0].transcript.trim();
      if (!text) return;
      const morse = textToMorse(text);

      wsRef.current?.send(
        JSON.stringify({
          type: "morse",
          text,
          code: morse,
        })
      );
    };

    recognition.start();
  };

  const stopTalking = () => {
    setActive(false);

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-5xl flex flex-col items-center p-6 md:p-12
       bg-slate-900/10 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] border
        border-white/5 mx-auto shadow-2xl overflow-hidden min-h-150"
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onExit();
              stopTalking();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg"
          >
            <XCircle size={16} className="text-red-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
              Exit
            </span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/20 rounded-full transition-all duration-300 group shadow-lg"
          >
            <Share2 size={16} className="text-cyan-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-white">
              Share Link
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
          <div className="flex flex-col items-start border-r border-white/10 pr-4">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
              Neural Link
            </span>
            <span className="text-cyan-400 font-mono text-lg md:text-xl font-bold tracking-widest">
              {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              Broadcasting
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-6 max-w-sm w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-white font-black uppercase tracking-widest text-sm">Join Neural Link</h3>

              <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                <QRCodeCanvas value={shareURL} size={200} />
              </div>

              <p className="text-cyan-400 font-mono text-xl font-bold tracking-[0.3em]">{roomCode}</p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareURL);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center justify-center gap-2 flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Share2 size={16} /> Share Link
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareURL);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-xl transition-all"
                >
                  {copied ? <Check size={20} /> : <Copy size={18} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center grow w-full">
        <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
          <AnimatePresence>
            {active &&
              [1.2, 1.5, 1.8].map((scale, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: scale, opacity: [0, 0.4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    delay: i * 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 border-2 border-cyan-400/20 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                />
              ))}
          </AnimatePresence>

          <motion.button
            onMouseDown={startTalking}
            onMouseUp={stopTalking}
            onTouchStart={(e) => {
              e.preventDefault();
              startTalking();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stopTalking();
            }}
            whileTap={{ scale: 0.96 }}
            className={`relative z-20 w-44 h-44 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 select-none touch-none cursor-pointer ${
              active
                ? "bg-cyan-500 border-cyan-200 shadow-[0_0_80px_rgba(6,182,212,0.5)]"
                : "bg-slate-950 border-white/5 text-cyan-400 shadow-[0_0_60px_rgba(0,0,0,0.8)] hover:border-cyan-500/30"
            }`}
          >
            <Mic size={56} className={active ? "text-slate-950" : "text-cyan-500"} />
            <p
              className={`mt-4 text-[10px] font-black uppercase tracking-[0.25em] ${
                active ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {active ? "Broadcasting" : "Hold to Talk"}
            </p>
          </motion.button>
        </div>

        <div className="flex flex-col items-center gap-1 -mt-4 md:-mt-8 z-30">
          <Activity
            className={`text-cyan-500 transition-all duration-700 ${
              active ? "animate-spin scale-110 opacity-100" : "animate-pulse opacity-20"
            }`}
            size={20}
          />
          <span
            className={`text-[8px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
              active ? "opacity-100 text-cyan-400" : "opacity-0"
            }`}
          >
            Signal Active
          </span>
        </div>
      </div>
    </motion.div>
  );
}
