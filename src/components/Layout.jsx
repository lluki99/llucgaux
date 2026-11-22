import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SoundProvider } from "@/lib/SoundContext";
import { GameStateProvider } from "@/lib/GameStateContext";
import CustomCursor from "@/components/CustomCursor";
import StatusBar from "@/components/StatusBar";
import Footer from "@/components/Footer";
import EasterEgg from "@/components/EasterEgg";

export default function Layout() {
  const location = useLocation();
  return (
    <SoundProvider>
      <GameStateProvider>
        <div className="min-h-screen bg-[#080808] text-white font-body overflow-x-clip">
          <CustomCursor />
          <EasterEgg />
          <StatusBar />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pt-14"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </GameStateProvider>
    </SoundProvider>
  );
}