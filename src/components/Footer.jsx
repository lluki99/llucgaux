import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t-4 border-white bg-[#080808] mt-24">
      <div className="glitch-divider" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest text-white/70">
        <p>© {new Date().getFullYear()} <span className="text-[#FF3CAC]">LLUC</span><span className="text-[#FFEB3B]">GAUX</span></p>
        <div className="flex gap-6">
          <Link to="/about" className="hover:text-[#FFEB3B]">About</Link>
          <Link to="/contact" className="hover:text-[#FFEB3B]">Contact</Link>
        </div>
        <p className="text-white/40">Try the cheat code "motherlode".</p>
      </div>
    </footer>
  );
}