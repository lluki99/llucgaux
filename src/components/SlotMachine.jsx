import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/lib/GameStateContext";
import { useSound } from "@/lib/SoundContext";
import { Sparkles } from "lucide-react";
import SlotMachineCelebration from "@/components/SlotMachineCelebration";

const SYMBOLS = ["🎮", "⭐", "🕹️", "💎", "👾", "🏆"];

function randomReel() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export default function SlotMachine() {
  const { score, spendPoints, unlockRandomCosmetic } = useGameState();
  const { playSpin, playVictory } = useSound();
  const [reels, setReels] = useState(["🎮", "⭐", "🕹️"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [celebrating, setCelebrating] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    if (!spendPoints(10)) return;
    setSpinning(true);
    setResult(null);
    playSpin();

    let ticks = 0;
    const interval = setInterval(() => {
      setReels([randomReel(), randomReel(), randomReel()]);
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        const won = Math.random() < 0.2;
        if (won) {
          const symbol = randomReel();
          setReels([symbol, symbol, symbol]);
          const unlocked = unlockRandomCosmetic();
          if (unlocked) {
            playVictory();
            setResult({ won: true, cosmetic: unlocked });
            setCelebrating(true);
            setTimeout(() => setCelebrating(false), 1300);
          } else {
            setResult({ won: true, cosmetic: null });
          }
        } else {
          let finalReels;
          do {
            finalReels = [randomReel(), randomReel(), randomReel()];
          } while (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]);
          setReels(finalReels);
          setResult({ won: false });
        }
        setSpinning(false);
      }
    }, 90);
  };

  return (
    <section id="slot-machine" className="max-w-[700px] mx-auto px-4 md:px-8 pt-20 pb-10">
      <motion.div
        animate={celebrating ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative border-4 border-[#FFEB3B] bg-[#111] p-6 md:p-8 shadow-hardYellow"
      >
        <SlotMachineCelebration cosmeticImage={result?.cosmetic?.image} active={celebrating} />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-[#FFEB3B]" size={20} />
          <h2 className="font-heading uppercase font-extrabold text-2xl md:text-3xl">Cosmetic Slot Machine</h2>
        </div>
        <p className="text-white/60 text-sm font-mono mb-6">
          Spend 10 PTS per spin for a chance to unlock a random cosmetic item. Earn points by opening projects
          in the archive below (+50 PTS each). Unlocked cosmetics can be used on the{" "}
          <Link to="/about" data-hover className="text-[#FFEB3B] underline hover:text-white">About page</Link>.
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          {reels.map((symbol, i) => (
            <div key={i} className="w-20 h-20 md:w-24 md:h-24 border-4 border-white bg-[#080808] flex items-center justify-center text-4xl md:text-5xl">
              <motion.span
                key={symbol + i}
                animate={spinning ? { rotateX: [0, 360] } : { rotateX: 0 }}
                transition={{ duration: spinning ? 0.3 : 0.15 }}
              >
                {symbol}
              </motion.span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            data-hover
            onClick={handleSpin}
            disabled={spinning || score < 10}
            className="border-4 border-[#FF3CAC] text-[#FF3CAC] font-heading uppercase text-xl px-8 py-3 shadow-hardMagenta hover:bg-[#FF3CAC] hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {spinning ? "Spinning..." : "Spin (-10 PTS)"}
          </button>
          {score < 10 && !spinning && (
            <p className="text-white/40 font-mono text-xs uppercase">Not enough points — open a project to earn 50 PTS.</p>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center font-mono uppercase text-sm"
            >
              {result.won ? (
                result.cosmetic ? (
                  <span className="text-[#FFEB3B]">Jackpot! Unlocked "{result.cosmetic.name}"</span>
                ) : (
                  <span className="text-[#FFEB3B]">Jackpot! You already own every cosmetic.</span>
                )
              ) : (
                <span className="text-white/50">No luck this time — try again!</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
