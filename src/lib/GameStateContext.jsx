import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { COSMETICS } from "@/lib/cosmetics";

const GameStateContext = createContext(null);

const SCORE_KEY = "gf_score";
const UNLOCKED_KEY = "gf_unlocked";
const VISITED_KEY = "gf_visited";
const PLACED_KEY = "gf_placed_cosmetics";

function loadScore() {
  const raw = sessionStorage.getItem(SCORE_KEY);
  return raw ? Number(raw) : 0;
}

function loadUnlocked() {
  const raw = sessionStorage.getItem(UNLOCKED_KEY);
  if (raw) return JSON.parse(raw);
  return COSMETICS.filter((c) => c.defaultUnlocked).map((c) => c.id);
}

function loadVisited() {
  const raw = sessionStorage.getItem(VISITED_KEY);
  return raw ? JSON.parse(raw) : [];
}

function loadPlacedCosmetics() {
  const raw = sessionStorage.getItem(PLACED_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function GameStateProvider({ children }) {
  const [score, setScore] = useState(loadScore);
  const [unlocked, setUnlocked] = useState(loadUnlocked);
  const [visited, setVisited] = useState(loadVisited);
  const [placedCosmetics, setPlacedCosmetics] = useState(loadPlacedCosmetics);
  const [lastUnlocked, setLastUnlocked] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const visitedRef = useRef(new Set(loadVisited()));

  useEffect(() => {
    sessionStorage.setItem(SCORE_KEY, String(score));
  }, [score]);

  useEffect(() => {
    sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  useEffect(() => {
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  }, [visited]);

  useEffect(() => {
    sessionStorage.setItem(PLACED_KEY, JSON.stringify(placedCosmetics));
  }, [placedCosmetics]);

  const addScore = (n) => setScore((s) => s + n);

  const isVisited = (id) => visited.includes(id);

  const visitProject = (id) => {
    // Use a synchronous ref-based check so rapid/duplicate calls (e.g. effect
    // re-fires) can never both pass the "not visited yet" check before state updates.
    if (visitedRef.current.has(id)) return false;
    visitedRef.current.add(id);
    setVisited(Array.from(visitedRef.current));
    addScore(50);
    return true;
  };

  const spendPoints = (n) => {
    if (score < n) return false;
    setScore((s) => s - n);
    return true;
  };

  const unlockCosmetic = (id) => {
    if (!id || unlocked.includes(id)) return false;
    const cos = COSMETICS.find((c) => c.id === id);
    setUnlocked((u) => [...u, id]);
    if (cos) setLastUnlocked(cos);
    return true;
  };

  const unlockRandomCosmetic = () => {
    const locked = COSMETICS.filter((c) => !unlocked.includes(c.id));
    if (locked.length === 0) return null;
    const pick = locked[Math.floor(Math.random() * locked.length)];
    setUnlocked((u) => [...u, pick.id]);
    setLastUnlocked(pick);
    return pick;
  };

  const isUnlocked = (id) => unlocked.includes(id);

  const addPlacedCosmetic = (cosmeticId, x, y) => {
    setPlacedCosmetics((p) => [...p, { key: Date.now(), cosmeticId, x, y, rotation: 0, scale: 1 }]);
  };

  const updatePlacedCosmetic = (key, updates) => {
    setPlacedCosmetics((p) => p.map((s) => (s.key === key ? { ...s, ...updates } : s)));
  };

  const removePlacedCosmetic = (key) => setPlacedCosmetics((p) => p.filter((s) => s.key !== key));

  const resetProgress = () => {
    setScore(0);
    visitedRef.current = new Set();
    setVisited([]);
    setUnlocked(COSMETICS.filter((c) => c.defaultUnlocked).map((c) => c.id));
    setLastUnlocked(null);
    setPlacedCosmetics([]);
    setResetSignal((s) => s + 1);
  };

  return (
    <GameStateContext.Provider
      value={{
        score, addScore, spendPoints, unlocked, isUnlocked, unlockCosmetic, unlockRandomCosmetic, lastUnlocked, isVisited,
        visitProject, resetProgress, resetSignal, placedCosmetics, addPlacedCosmetic, updatePlacedCosmetic, removePlacedCosmetic,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}