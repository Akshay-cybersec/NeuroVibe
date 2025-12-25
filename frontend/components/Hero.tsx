"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(180px circle at ${x}px ${y}px, black 0%, transparent 100%)`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("hero-section")?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      id="hero-section"
      className="relative pt-32 md:pt-40 pb-20 px-4 md:px-6 overflow-hidden min-h-[70vh] flex items-center bg-slate-950"
    >
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] opacity-40" 
        />
        
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
          }}
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent -z-10" />
      
      <div className="w-full max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            Next-Gen Accessibility
          </span>

          <h1 className="mt-6 md:mt-8 text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] text-white wrap-break-words">
            Feel the <br className="block md:hidden" /> 
            <span className="text-cyan-500">Conversation.</span>
          </h1>

          <p className="mt-6 md:mt-8 text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            NeuroVibe translates spoken language into real-time haptic patterns. 
            Designed for the <span className="text-slate-200">Deaf-Blind</span>, empowering universal connection through touch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};