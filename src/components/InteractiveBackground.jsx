import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function InteractiveBackground({ particleCount = 13, gradientOpacity = 0.12, variant = "fixed" }) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const frameRef = useRef(null);
  const latestRef = useRef({ x: 0.5, y: 0.5 });

  // Each particle spawns at a random spot on screen and drifts in from a random offset on mount.
  const [particles] = useState(() =>
    [...Array(particleCount)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      driftX: (Math.random() - 0.5) * 160,
      driftY: (Math.random() - 0.5) * 160,
      delay: Math.random() * 0.3,
      size: 6 + (i % 4) * 4,
      color: i % 3 === 0 ? "#FFEB3B" : i % 3 === 1 ? "#FF3CAC" : "#784BA0",
      floatDuration: 3 + (i % 3),
    }))
  );

  useEffect(() => {
    const move = (e) => {
      latestRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(() => {
          setPos(latestRef.current);
          frameRef.current = null;
        });
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const containerClass =
    variant === "fixed"
      ? "fixed inset-0 z-0 overflow-hidden pointer-events-none"
      : "absolute inset-0 overflow-hidden pointer-events-none";

  return (
    <div className={containerClass}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,60,172,${gradientOpacity}), rgba(120,75,160,${gradientOpacity * 0.65}) 40%, transparent 70%)`,
        }}
      />
      {particles.map((p, i) => {
        const depth = (i % 5) * 14;
        const px = (pos.x - 0.5) * depth;
        const py = (pos.y - 0.5) * depth;
        return (
          <div
            key={i}
            className="absolute transition-transform duration-150 ease-out"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              transform: `translate(${px}px, ${py}px)`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: p.driftX, y: p.driftY }}
              animate={{ opacity: 0.4, x: 0, y: 0 }}
              transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
            >
              <motion.div
                className="rounded-full"
                style={{ width: p.size, height: p.size, background: p.color }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: p.floatDuration, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}