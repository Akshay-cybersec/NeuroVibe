"use client";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

const symbols = [
  { s: "Dot (·)", v: "Short vibration", d: "0.2–0.3 sec", f: "Quick tap" },
  { s: "Dash (-)", v: "Long vibration", d: "0.6–0.8 sec", f: "Longer press" },
  { s: "Pause", v: "No vibration", d: "0.5 sec", f: "Short silence between letters" },
  { s: "Word gap", v: "No vibration", d: "1–1.5 sec", f: "Longer silence between words" },
];

const alphabet = [
  { l: "A", p: "· -", t: "Short:0.3s, Long:0.7s", tip: "Tap short then long" },
  { l: "B", p: "- · · ·", t: "Long:0.7s, Short:0.3s", tip: "Long first, then three quick taps" },
  { l: "C", p: "- · - ·", t: "Long:0.7s, Short:0.3s", tip: "Alternate long-short-long-short" },
  { l: "D", p: "- · ·", t: "Long:0.7s, Short:0.3s", tip: "Long followed by two shorts" },
  { l: "E", p: "·", t: "Short:0.3s", tip: "Quick single tap" },
  { l: "F", p: "· · - ·", t: "Short:0.3s, Long:0.7s", tip: "Two shorts, long, short" },
  { l: "G", p: "- - ·", t: "Long:0.7s, Short:0.3s", tip: "Two long, one short" },
  { l: "H", p: "· · · ·", t: "Short:0.3s", tip: "Four quick taps" },
  { l: "I", p: "· ·", t: "Short:0.3s", tip: "Two quick taps" },
  { l: "J", p: "· - - -", t: "Short:0.3s, Long:0.7s", tip: "One short, three long" },
  { l: "K", p: "- · -", t: "Long:0.7s, Short:0.3s", tip: "Long-short-long" },
  { l: "L", p: "· - · ·", t: "Short:0.3s, Long:0.7s", tip: "Short-long-short-short" },
  { l: "M", p: "- -", t: "Long:0.7s", tip: "Two long taps" },
  { l: "N", p: "- ·", t: "Long:0.7s, Short:0.3s", tip: "Long then short" },
  { l: "O", p: "- - -", t: "Long:0.7s", tip: "Three long taps" },
  { l: "P", p: "· - - ·", t: "Short:0.3s, Long:0.7s", tip: "Short-long-long-short" },
  { l: "Q", p: "- - · -", t: "Long:0.7s, Short:0.3s", tip: "Long-long-short-long" },
  { l: "R", p: "· - ·", t: "Short:0.3s, Long:0.7s", tip: "Short-long-short" },
  { l: "S", p: "· · ·", t: "Short:0.3s", tip: "Three quick taps" },
  { l: "T", p: "-", t: "Long:0.7s", tip: "Single long tap" },
  { l: "U", p: "· · -", t: "Short:0.3s, Long:0.7s", tip: "Two short, one long" },
  { l: "V", p: "· · · -", t: "Short:0.3s, Long:0.7s", tip: "Three short, one long" },
  { l: "W", p: "· - -", t: "Short:0.3s, Long:0.7s", tip: "Short-long-long" },
  { l: "X", p: "- · · -", t: "Long:0.7s, Short:0.3s", tip: "Long-short-short-long" },
  { l: "Y", p: "- · - -", t: "Long:0.7s, Short:0.3s", tip: "Long-short-long-long" },
  { l: "Z", p: "- - · ·", t: "Long:0.7s, Short:0.3s", tip: "Two long, two short" },
];

export default function HapticFeedback() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-y-10 text-center mb-20   "
        >
          <h1 className="text-5xl font-black bg-linear-to-r from-cyan-400
         to-blue-500 bg-clip-text text-transparent mb-4">
            Haptic Language System
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our universal vibration standard allows users to "feel" speech through 
            standardized patterns. Click any card to simulate the haptic pulse.
          </p>
        </motion.div>

        {/* Symbols Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-cyan-500 rounded-full" />
            Basic Symbols
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {symbols.map((item, i) => (
              <div key={i} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <div className="text-cyan-400 font-mono text-xl mb-2">{item.s}</div>
                <div className="text-white font-semibold text-sm mb-1">{item.v}</div>
                <div className="text-slate-500 text-xs mb-3">{item.d}</div>
                <div className="text-slate-300 text-sm italic border-t border-slate-800 pt-3">
                  "{item.f}"
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alphabet Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-cyan-500 rounded-full" />
            A-Z Alphabet
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {alphabet.map((item) => (
              <motion.div
                key={item.l}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(15, 23, 42, 0.8)" }}
                whileTap={{ x: [-2, 2, -2, 2, 0], transition: { duration: 0.2 } }}
                className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-3xl font-black group-hover:text-cyan-400 transition-colors">
                    {item.l}
                  </span>
                  <span className="text-cyan-500 font-mono font-bold tracking-widest">
                    {item.p}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter mb-1">Timing</div>
                <div className="text-xs text-slate-300 mb-2 truncate">{item.t}</div>
                <div className="text-[11px] text-slate-400 italic leading-tight border-t border-slate-800 pt-2">
                  {item.tip}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}