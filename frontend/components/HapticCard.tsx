// components/HapticCard.tsx
"use client";
import { motion } from "framer-motion";

export const HapticTable = ({ data, title }: { data: any[], title: string }) => {
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
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <motion.tr 
                key={idx}
                whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.05)" }}
                className="border-b border-slate-800/50 group transition-colors"
              >
                <td className="py-4 px-4 font-mono text-xl text-white">{item.letter || item.symbol}</td>
                <td className="py-4 px-4 text-cyan-500 font-bold tracking-widest">{item.pattern}</td>
                <td className="py-4 px-4 text-slate-300">{item.timing}</td>
                <td className="py-4 px-4 italic text-slate-400">{item.tips || item.howItFeels}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};