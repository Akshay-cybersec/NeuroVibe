"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export const HapticTable = ({ data, title }: { data: any[], title: string }) => {
  
  const triggerHaptic = (patternString: string) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      // Split the pattern (e.g., "- · ·" becomes ["-", "·", "·"])
      const parts = patternString.split(" ");
      const vibrationArray: number[] = [];

      parts.forEach((char, index) => {
        // 1. ADD THE VIBRATION DURATION
        if (char === "·") {
          vibrationArray.push(300); // Dot = 0.3s
        } else if (char === "-") {
          vibrationArray.push(700); // Dash = 0.7s
        }

        // 2. ADD THE SILENT GAP (PAUSE)
        // We only add a pause if it's NOT the last character in the pattern
        if (index < parts.length - 1) {
          vibrationArray.push(200); // Standard gap between signals = 0.2s
        }
      });

      navigator.vibrate(vibrationArray);
    } else {
      console.log("Vibration API not supported on this device/browser.");
    }
  };

  return (
    <div className="my-10 p-6 bg-slate-900/50 rounded-2xl border border-slate-700 backdrop-blur-md">
      <h3 className="text-2xl font-bold mb-6 text-cyan-400">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-4 px-4">Symbol/Letter</th>
              <th className="pb-4 px-4">Pattern</th>
              <th className="pb-4 px-4">Timing</th>
              <th className="pb-4 px-4">Experience</th>
              <th className="pb-4 px-4 text-center">Test</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <motion.tr 
                key={idx}
                whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.05)" }}
                className="border-b border-slate-800/50 group transition-colors"
              >
                <td className="py-4 px-4 font-mono text-xl text-white">{item.letter || item.symbol || item.l || item.s}</td>
                <td className="py-4 px-4 text-cyan-500 font-bold tracking-widest">{item.pattern || item.p}</td>
                <td className="py-4 px-4 text-slate-300">{item.timing || item.t}</td>
                <td className="py-4 px-4 italic text-slate-400">{item.tips || item.howItFeels || item.tip}</td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={() => triggerHaptic(item.pattern || item.p)}
                    className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 transition-all cursor-pointer"
                    title="Feel this pattern"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};