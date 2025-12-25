"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, AlertCircle } from "lucide-react";
import neuroLogo from "../assets/neurologo.jpeg";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="fixed top-0 w-full z-50">
      {/* --- NOTIFICATION BANNER --- */}
      {showBanner && (
        <div className="bg-[#020617] border-b border-cyan-900/50 text-slate-300 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 mx-auto">
            <AlertCircle size={16} className="text-cyan-400 animate-pulse" />
            <p className="text-xs md:text-sm font-medium tracking-wide">
              <span className="text-cyan-400 font-bold">System Note:</span> Our backend is on a free tier; 
              requests may be delayed. Please allow extra time for data to load.
            </p>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="relative w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center h-20">
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center gap-3 group z-60 shrink-0">
          <div className="relative w-12 h-12 overflow-hidden rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
            <Image src={neuroLogo} alt="NeuroVibe Logo" fill className="object-cover" />
          </div>
          <div className="text-2xl font-bold tracking-tighter text-cyan-400 hidden xs:block">
            NEUROVIBE
          </div>
        </Link>

        {/* 2. CENTER LINKS */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex space-x-8 text-sm font-medium">
          <Link href="/" className="hover:text-cyan-400 transition-colors text-slate-300">Home</Link>
          <Link href="/hapticfeedback" className="hover:text-cyan-400 transition-colors text-slate-300">Haptic Alphabet</Link>
        </div>

        {/* 3. RIGHT SECTION */}
        <div className="flex items-center gap-3 shrink-0 min-w-50 justify-end">
          {/* Dashboard Logic: Redirect to login if Signed Out */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-full text-sm font-semibold transition-all text-white">
                Dashboard
              </button>
            </SignInButton>
            
            {/* Desktop Login Button only shown when signed out */}
            <SignInButton mode="modal">
              <button className="hidden md:block bg-slate-900/50 hover:bg-slate-800 px-5 py-2 rounded-full text-sm font-semibold transition-all text-white border border-slate-700">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          {/* Dashboard Logic: Normal Link if Signed In */}
          <SignedIn>
            <Link href="/viberoom">
              <button className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-full text-sm font-semibold transition-all text-white">
                Dashboard
              </button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white ml-2 z-60" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MOBILE SIDEBAR --- */}
        <div className={`
          fixed top-0 right-0 h-screen w-[75%] bg-slate-950 border-l border-slate-800 p-10 transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden flex flex-col shadow-2xl
        `}>
          <div className="mt-20 flex flex-col gap-6 text-xl font-semibold">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">Home</Link>
            <Link href="/hapticfeedback" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">Haptic Alphabet</Link>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-left text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">
                  Login / Dashboard
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/viberoom" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 border-b border-slate-900 pb-4">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};