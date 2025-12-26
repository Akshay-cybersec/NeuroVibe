"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import neuroLogo from "../assets/neurologo.jpeg";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "System",
      links: [
        { name: "Haptic Alphabet", href: "/hapticfeedback" },
        { name: "VibeRoom", href: "/viberoom" },
        { name: "Training Guide", href: "/training-awareness" },
      ],
    },

    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-10 px-6 overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
                <Image src={neuroLogo} alt="NeuroVibe Logo" fill className="object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">NEUROVIBE</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-8">
              Revolutionizing communication for the Deaf-Blind community through advanced neuro-haptic integration and real-time tactile language.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, textShadow: "0 0 8px rgb(6, 182, 212)" }}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="text-slate-400 text-sm hover:text-cyan-400 transition-colors flex items-center group"
                    >
                      {link.name}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs tracking-wide">
            © {currentYear} NEUROVIBE TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};