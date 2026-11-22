import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";

const MotionLink = motion(Link);

export default function Hero() {
  const handleStart = () => {
    const slotMachine = document.getElementById("slot-machine");
    if (!slotMachine) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slotMachine.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative h-[100vh] flex flex-col items-center justify-center overflow-hidden border-b-4 border-white">
      <InteractiveBackground particleCount={19} gradientOpacity={0.25} variant="absolute" />

      <span className="relative z-10 font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-[#FFEB3B] mb-4">
        Game Designer · Tech &amp; VFX Artist · Video Editor
      </span>
      <h1 className="relative z-10 font-heading uppercase font-extrabold text-center leading-[0.85] text-white tracking-tighter" style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}>
        Lluc Gauxachs<span className="text-[#FF3CAC]"> </span>Sanz
      </h1>
      <p className="relative z-10 max-w-xl text-center text-white/70 mt-6 px-4">A gamified archive of developed videogames and projects.

      </p>
      <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-10 sm:gap-16">
        <div className="flex flex-col items-stretch gap-3 w-fit">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 text-center whitespace-nowrap">
            Explore projects to get points!
          </p>
          <motion.button
            type="button"
            onClick={handleStart}
            aria-controls="slot-machine"
            data-hover
            animate={{ opacity: 1 }}
            whileHover={{
              opacity: [1, 0.3, 1],
              transition: { duration: 1, times: [0, 0.175, 1], repeat: Infinity, ease: "easeInOut" }
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-4 border-[#FFEB3B] text-[#FFEB3B] font-heading uppercase text-xl px-8 py-3 shadow-hardYellow hover:bg-[#FFEB3B] hover:text-[#080808] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFEB3B] transition-colors text-center whitespace-nowrap">
            Press Start
          </motion.button>
        </div>
        <div className="flex flex-col items-stretch gap-3 w-fit">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 text-center whitespace-nowrap">
            In a rush? Explore a compact view of my work.
          </p>
          <MotionLink
            to="/quick-glance"
            data-hover
            animate={{ opacity: 1 }}
            whileHover={{
              opacity: [1, 0.3, 1],
              transition: { duration: 1, times: [0, 0.175, 1], repeat: Infinity, ease: "easeInOut" }
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-4 border-[#FF3CAC] text-[#FF3CAC] font-heading uppercase text-xl px-8 py-3 shadow-hardMagenta hover:bg-[#FF3CAC] hover:text-[#080808] transition-colors text-center whitespace-nowrap">
            Quick Glance
          </MotionLink>
        </div>
      </div>
    </section>);

}
