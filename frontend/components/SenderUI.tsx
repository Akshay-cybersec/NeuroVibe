"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, XCircle, Activity, Share2, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

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

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const ws = new WebSocket(
      `${API_BASE?.replace("http", "ws")}/ws/${roomCode}/sender`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("🔗 Sender WebSocket Connected");
    ws.onerror = () => console.log("❌ WebSocket Error");
    ws.onclose = () => console.log("⚠️ Sender WebSocket Closed");

    return () => {
      ws.close();
      cleanupAudio();
    };
  }, [roomCode, API_BASE]);

  const cleanupAudio = () => {
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const startTalking = async () => {
    setActive(true);

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(
      streamRef.current
    );

    processorRef.current = audioContextRef.current.createScriptProcessor(
      1024,
      1,
      1
    );
    source.connect(processorRef.current);
    processorRef.current.connect(audioContextRef.current.destination);

    processorRef.current.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
      const intensity = Math.min(
        Math.sqrt(sum / data.length) * 100,
        100
      );

      if (wsRef.current?.readyState === 1) {
        wsRef.current.send(
          JSON.stringify({
            intensity: Math.round(intensity),
          })
        );
      }
    };
  };

  const stopTalking = () => {
    setActive(false);
    cleanupAudio();
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
        <button
          onClick={onExit}
          className="order-1 md:order-last flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-full transition-all duration-300 group shadow-lg"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">
            Disconnect Link
          </span>
          <XCircle
            size={16}
            className="text-red-500 group-hover:text-white transition-colors"
          />
        </button>

        <div className="order-2 md:order-first flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl">
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
              Broadcasting Node
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <QRCodeCanvas value={shareURL} size={130} className="bg-white p-2 rounded-xl" />

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.share
                ? navigator.share({ url: shareURL })
                : navigator.clipboard.writeText(shareURL);
            }}
            className="px-4 py-3 bg-cyan-600 text-white rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <Share2 size={18} /> Share
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareURL);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-3 bg-white/10 hover:bg-cyan-700 text-cyan-400 rounded-xl text-xs font-black uppercase tracking-widest"
          >
            {copied ? "Copied" : <Copy size={18} />}
          </button>
        </div>
      </div>

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
            className={`relative z-20 w-44 h-44 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 select-none touch-none ${
              active
                ? "bg-cyan-500 border-cyan-200 shadow-[0_0_80px_rgba(6,182,212,0.5)]"
                : "bg-slate-950 border-white/5 text-cyan-400 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            }`}
          >
            <Mic
              size={56}
              className={`transition-colors duration-500 ${
                active ? "text-slate-950" : "text-cyan-500"
              }`}
            />
            <p
              className={`mt-4 text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                active ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {active ? "Broadcasting" : "Hold to Talk"}
            </p>
          </motion.button>
        </div>

        <div className="flex flex-col items-center gap-2 -mt-4 md:-mt-8 z-30">
          <div className="flex items-end justify-center gap-1 h-10">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key="active-bars"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-1"
                >
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height:
                          active &&
                          Math.floor(Math.random() * 45) + 10,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.4,
                        delay: i * 0.03,
                      }}
                      className="w-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#06b6d4]"
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="w-24 h-px bg-cyan-400/20 rounded-full" />
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Activity
              className={`text-cyan-500 transition-all duration-700 ${
                active
                  ? "animate-spin scale-110 opacity-100"
                  : "animate-pulse opacity-20"
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
      </div>
    </motion.div>
  );
}
