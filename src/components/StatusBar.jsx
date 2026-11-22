import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/SoundContext";
import { useGameState } from "@/lib/GameStateContext";
import ResetProgressButton from "@/components/ResetProgressButton";
import { COSMETICS } from "@/lib/cosmetics";

export default function StatusBar() {
  const { muted, setMuted, playBlip } = useSound();
  const { score, isUnlocked } = useGameState();
  const swordCosmetic = COSMETICS.find((c) => c.id === "sword");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b-4 border-white bg-[#080808]/95 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between font-mono text-[11px] md:text-xs text-white uppercase tracking-widest">
        <Link to="/" onMouseEnter={playBlip} className="font-heading text-xl md:text-2xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-[#FF3CAC]">LLUC</span><span className="text-[#FFEB3B]">GAUX</span>
        </Link>
        <div className="flex items-center gap-4">
          <div id="sword-slot" className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
            {isUnlocked("sword") && swordCosmetic && (
              <img src={swordCosmetic.image} alt="legendary sword" className="w-full h-full object-contain" />
            )}
          </div>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={score}
              initial={{ scale: 1.4, color: "#FFEB3B" }}
              animate={{ scale: 1, color: "#FFEB3B" }}
              transition={{ duration: 0.3 }}
              className="font-heading font-extrabold text-sm md:text-base"
            >
              {score} PTS
            </motion.span>
          </AnimatePresence>
          <Link to="/about" onMouseEnter={playBlip} className="hover:text-[#FF3CAC]">ABOUT</Link>
          <Link to="/contact" onMouseEnter={playBlip} className="hover:text-[#FF3CAC]">CONTACT</Link>
          <button onClick={() => setMuted(!muted)} aria-label="Toggle sound" className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <ResetProgressButton />
        </div>
      </div>
    </div>
  );
}