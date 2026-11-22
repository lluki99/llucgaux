import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#FF3CAC", "#FFEB3B", "#784BA0", "#3CFF9C", "#2B86C5"];

export default function SlotMachineCelebration({ cosmeticImage, active }) {
  const copies = 8;
  const sparkles = 16;

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-20">
          {[...Array(copies)].map((_, i) => {
            const angle = (i / copies) * Math.PI * 2;
            const distance = 130 + (i % 3) * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            return (
              <motion.img
                key={`cosmetic-${i}`}
                src={cosmeticImage}
                alt=""
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.9, rotate: 0 }}
                animate={{ x, y, opacity: 0, scale: 0.4, rotate: i % 2 === 0 ? 220 : -220 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute w-12 h-12 object-contain"
              />
            );
          })}
          {[...Array(sparkles)].map((_, i) => {
            const angle = (i / sparkles) * Math.PI * 2 + 0.3;
            const distance = 80 + (i % 4) * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            return (
              <motion.span
                key={`sparkle-${i}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: (i % 3) * 0.05 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}