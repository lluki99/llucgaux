import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Context-aware "Back" control. Returns to the collection the user most
// recently used to enter the project (Projects or Quick Glance), falling back
// to Projects for direct access. Shows a hover preview card styled like the
// existing NextProjectNav preview, representing the destination collection.
export default function BackNav({ origin }) {
  const [hovering, setHovering] = useState(false);
  const isQuickGlance = origin === "quick-glance";
  const to = isQuickGlance ? "/quick-glance" : "/";
  const label = isQuickGlance ? "Quick Glance" : "Projects";

  return (
    <div className="relative" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <Link
        to={to}
        data-hover
        className="inline-flex items-center gap-2 font-mono uppercase text-sm text-white/60 hover:text-[#FFEB3B] transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute left-0 top-full mt-3 w-56 border-4 border-white bg-[#111] shadow-hard overflow-hidden z-30 pointer-events-none"
          >
            <div className="relative aspect-video overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
              <div className="glitch-divider w-3/4" />
            </div>
            <div className="p-3 font-heading uppercase text-lg leading-tight border-t-4 border-white">
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}