"use client";
import { useState } from "react"; // Added for sidebar state
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Icons for the toggle
import neuroLogo from "../assets/neurologo.jpeg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-3 group z-60">
        <div className="relative w-15 h-15 overflow-hidden rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
          <Image 
            src={neuroLogo} 
            alt="NeuroVibe Logo"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-2xl font-bold tracking-tighter text-cyan-400 hidden xs:block">
          NEUROVIBE
        </div>
      </Link>

      {/* Desktop Links (Hidden on mobile) */}
      <div className="space-x-8 hidden md:flex text-sm font-medium">
        <Link href="/" className="hover:text-cyan-400 transition-colors text-slate-300">Home</Link>
        <Link href="/hapticfeedback" className="hover:text-cyan-400 transition-colors text-slate-300">Haptic Alphabet</Link>
        <Link href="#privacy" className="hover:text-cyan-400 transition-colors text-slate-300">Privacy</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Launch Button (Always visible) */}
       <Link href="/viberoom">
  <button className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-full text-sm font-semibold transition-all text-white">
    Dashboard
  </button>
</Link>

        {/* Mobile Toggle Button (Visible only on mobile) */}
        <button 
          className="md:hidden text-white z-60" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 right-0 h-screen w-[70%] bg-slate-950 border-l border-slate-800 p-10 transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:hidden flex flex-col gap-8 shadow-2xl
      `}>
        <div className="mt-16 flex flex-col gap-6 text-xl font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">Home</Link>
          <Link href="/hapticfeedback" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">Haptic Alphabet</Link>
          <Link href="#privacy" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">Privacy</Link>
        </div>
        
        <div className="mt-auto text-xs text-slate-500 italic">
          NeuroVibe: Bridging the Empathy Gap
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};