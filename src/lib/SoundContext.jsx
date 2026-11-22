import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

const SoundContext = createContext(null);

function beep(ctx, freq, duration, type = "square", gain = 0.05) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const playBlip = useCallback(() => {
    if (muted) return;
    beep(getCtx(), 620, 0.06, "square", 0.04);
  }, [muted, getCtx]);

  const playSelect = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    beep(ctx, 440, 0.08, "square", 0.05);
    setTimeout(() => beep(ctx, 880, 0.1, "square", 0.05), 60);
  }, [muted, getCtx]);

  const playCoin = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    beep(ctx, 988, 0.05, "square", 0.05);
    setTimeout(() => beep(ctx, 1318, 0.12, "square", 0.05), 50);
  }, [muted, getCtx]);

  const playSpin = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => beep(ctx, 300 + i * 40, 0.05, "square", 0.03), i * 70);
    }
  }, [muted, getCtx]);

  const playUnlock = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => beep(ctx, f, 0.15, "square", 0.05), i * 90);
    });
  }, [muted, getCtx]);

  const playVictory = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    [523, 659, 784, 1046, 1318].forEach((f, i) => {
      setTimeout(() => beep(ctx, f, 0.18, "square", 0.06), i * 100);
    });
    setTimeout(() => beep(ctx, 1568, 0.35, "sawtooth", 0.05), 500);
  }, [muted, getCtx]);

  const playScaleTick = useCallback(() => {
    if (muted) return;
    beep(getCtx(), 320, 0.04, "sine", 0.05);
  }, [muted, getCtx]);

  const playRotateTick = useCallback(() => {
    if (muted) return;
    beep(getCtx(), 260, 0.025, "square", 0.05);
  }, [muted, getCtx]);

  const playCancel = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    beep(ctx, 400, 0.08, "square", 0.05);
    setTimeout(() => beep(ctx, 220, 0.12, "square", 0.05), 70);
  }, [muted, getCtx]);

  // Global, consistent UI sound feedback: hover + click on any interactive element site-wide.
  // Elements (or ancestors) marked with [data-no-sound] opt out (e.g. Admin panel, cosmetic controls
  // that have their own dedicated sounds).
  useEffect(() => {
    const SELECTOR = 'a, button, [role="button"], [data-hover]';
    let lastHovered = null;
    const handleOver = (e) => {
      const el = e.target.closest(SELECTOR);
      if (el !== lastHovered) {
        lastHovered = el;
        if (el && !el.closest("[data-no-sound]")) playBlip();
      }
    };
    const handleClick = (e) => {
      const el = e.target.closest(SELECTOR);
      if (el && !el.closest("[data-no-sound]")) playSelect();
    };
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("click", handleClick);
    };
  }, [playBlip, playSelect]);

  return (
    <SoundContext.Provider
      value={{ muted, setMuted, playBlip, playSelect, playCoin, playSpin, playUnlock, playVictory, playScaleTick, playRotateTick, playCancel }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}