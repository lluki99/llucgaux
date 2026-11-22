import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameState } from "@/lib/GameStateContext";
import { useSound } from "@/lib/SoundContext";
import { COSMETICS } from "@/lib/cosmetics";

const CODE = "motherlode";
// Base render size (px) of the flying sword; the transform's scale animates the
// visual size from ~the Motherlode sword down to the status-bar slot.
const BASE = 96;
const EASE = [0.22, 1, 0.36, 1];

export default function EasterEgg() {
  const { isUnlocked, unlockCosmetic } = useGameState();
  const { playVictory } = useSound();
  const [buffer, setBuffer] = useState([]);
  const [active, setActive] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [flight, setFlight] = useState(null);
  const swordRef = useRef(null);

  const sword = COSMETICS.find((c) => c.id === "sword");

  useEffect(() => {
    // Only single-character keys are tracked — modifier keys (Shift, Control,
    // etc.) are ignored so holding Shift to type capitals never corrupts the
    // buffer. Input is lowercased before checking, so the code is fully
    // case-insensitive (motherlode / MOTHERLODE / MoThErLoDe all match).
    const handler = (e) => {
      if (e.key.length !== 1) return;
      setBuffer((prev) => {
        const next = [...prev, e.key.toLowerCase()].slice(-CODE.length);
        if (next.join("") === CODE) {
          // No duplicate rewards: only trigger while the sword is still locked.
          if (!isUnlocked("sword")) setActive(true);
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isUnlocked]);

  const claimSword = () => {
    if (claiming || flight) return;
    const startEl = swordRef.current;
    const targetEl = document.getElementById("sword-slot");
    setClaiming(true);
    playVictory();

    // Fallback if the target slot can't be located (e.g. layout not mounted):
    // just unlock + close, so the reward is never lost.
    if (!startEl || !targetEl) {
      unlockCosmetic("sword");
      setTimeout(() => {
        setActive(false);
        setClaiming(false);
      }, 400);
      return;
    }

    const s = startEl.getBoundingClientRect();
    const t = targetEl.getBoundingClientRect();

    // Fade the full-screen panel out so the sword visibly flies across the real
    // page toward the status bar — destination computed from the actual slot.
    setActive(false);
    setFlight({
      from: { x: s.left + s.width / 2, y: s.top + s.height / 2 },
      to: { x: t.left + t.width / 2, y: t.top + t.height / 2 },
    });
  };

  const onLanded = () => {
    unlockCosmetic("sword");
    setClaiming(false);
    setFlight(null);
  };

  // framer-motion x/y translate the BASE×BASE element; with transform-origin
  // center, the visual center stays at (x + BASE/2, y + BASE/2) for any scale.
  // So subtracting BASE/2 places the center exactly at the target point.
  const fromX = flight ? flight.from.x - BASE / 2 : 0;
  const fromY = flight ? flight.from.y - BASE / 2 : 0;
  const toX = flight ? flight.to.x - BASE / 2 : 0;
  const toY = flight ? flight.to.y - BASE / 2 : 0;
  const midX = flight ? (flight.from.x + flight.to.x) / 2 - BASE / 2 : 0;
  const arcY = flight ? Math.min(flight.from.y, flight.to.y) - 140 - BASE / 2 : 0;

  return (
    <>
      <AnimatePresence>
        {active && sword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#080808] px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-mono uppercase text-base md:text-2xl text-[#FFEB3B] tracking-widest mb-10 max-w-[22ch] leading-relaxed"
            >
              it's dangerous to go alone! take this.
            </motion.p>

            <motion.button
              type="button"
              onClick={claimSword}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              data-hover
              className="relative outline-none"
            >
              <motion.img
                ref={swordRef}
                src={sword.image}
                alt="a legendary sword"
                draggable={false}
                className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_18px_rgba(255,235,59,0.6)]"
              />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-mono uppercase text-xs text-white/40 mt-8"
            >
              click the sword to claim it
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying sword overlay: travels from the Motherlade screen to the status
          bar slot, shrinking as it goes, then settles. Destination is measured
          live from #sword-slot so it works at any screen size. */}
      {flight && sword && (
        <motion.img
          src={sword.image}
          alt=""
          aria-hidden
          draggable={false}
          initial={{ x: fromX, y: fromY, scale: 1.6, rotate: 0, opacity: 1 }}
          animate={{
            x: [fromX, midX, toX],
            y: [fromY, arcY, toY],
            scale: [1.6, 1.3, 0.3],
            rotate: [0, -25, 0],
          }}
          transition={{ duration: 0.8, ease: EASE, times: [0, 0.5, 1] }}
          onAnimationComplete={onLanded}
          className="fixed top-0 left-0 z-[9999] pointer-events-none object-contain drop-shadow-[0_0_18px_rgba(255,235,59,0.7)]"
          style={{ width: BASE, height: BASE }}
        />
      )}
    </>
  );
}